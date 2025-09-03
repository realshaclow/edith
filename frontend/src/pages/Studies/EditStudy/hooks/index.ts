import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  EditStudyState, 
  EditStudyActions, 
  EditStudyFormData, 
  EditStudyMode,
  EditStudyProgress,
  EditStudyConfig 
} from '../types';
import { 
  createInitialFormData, 
  createInitialValidation, 
  validateField, 
  validateForm, 
  isFormValid,
  convertStudyToFormData,
  convertFormDataToStudy,
  generateStudySteps,
  debounce 
} from '../utils';
import { Study, StudyStatus } from '../../../../types';
import { Protocol } from '../../../../hooks/useProtocols';
import { usePredefinedProtocols } from '../../../../hooks/usePredefinedProtocols';
import api from '../../../../services/api';

interface UseEditStudyProps {
  studyId?: string;
  mode?: EditStudyMode;
  initialData?: Partial<EditStudyFormData>;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const useEditStudy = ({
  studyId,
  mode = 'create',
  initialData,
  autoSave = true,
  autoSaveInterval = 30000, // 30 seconds
}: UseEditStudyProps = {}) => {
  const navigate = useNavigate();
  const autoSaveRef = useRef<NodeJS.Timeout>();
  const [state, setState] = useState<EditStudyState>({
    formData: { ...createInitialFormData(), ...initialData },
    validation: createInitialValidation(),
    progress: {
      currentStep: 0,
      totalSteps: generateStudySteps().length,
      completedSteps: 0,
      isValid: false,
      canProceed: false,
    },
    config: {
      showAdvancedOptions: false,
      enableStepValidation: true,
      autoSave,
      autoSaveInterval,
      showPreview: false,
      allowPartialSave: true,
    },
    isLoading: false,
    isSaving: false,
    isDirty: false,
    lastSaved: null,
    error: null,
    originalStudy: null,
  });

  // Auto-save functionality
  const debouncedAutoSave = useCallback(
    debounce(async (formData: EditStudyFormData) => {
      if (state.config.autoSave && state.isDirty && mode === 'edit' && studyId) {
        try {
          await saveDraft();
        } catch (error) {
          console.warn('Auto-save failed:', error);
        }
      }
    }, autoSaveInterval),
    [state.config.autoSave, state.isDirty, mode, studyId, autoSaveInterval]
  );

  // Update validation when form data changes
  useEffect(() => {
    const newValidation = validateForm(state.formData);
    const completedSteps = Object.values(newValidation).filter(Boolean).length;
    const isValid = isFormValid(newValidation);

    setState(prev => ({
      ...prev,
      validation: newValidation,
      progress: {
        ...prev.progress,
        completedSteps,
        isValid,
        canProceed: isValid || prev.config.allowPartialSave,
      },
    }));

    // Trigger auto-save
    if (state.isDirty) {
      debouncedAutoSave(state.formData);
    }
  }, [state.formData, state.isDirty, debouncedAutoSave]);

  // Load study data when in edit mode
  useEffect(() => {
    if (mode === 'edit' && studyId) {
      loadStudy();
    }
  }, [mode, studyId]);

  // Cleanup auto-save timer
  useEffect(() => {
    return () => {
      if (autoSaveRef.current) {
        clearTimeout(autoSaveRef.current);
      }
    };
  }, []);

  const updateField = useCallback((field: keyof EditStudyFormData, value: any) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [field]: value,
      },
      isDirty: true,
      error: null,
    }));
  }, []);

  const updateMultipleFields = useCallback((fields: Partial<EditStudyFormData>) => {
    setState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        ...fields,
      },
      isDirty: true,
      error: null,
    }));
  }, []);

  const validateSingleField = useCallback((field: keyof EditStudyFormData): boolean => {
    return validateField(field, state.formData[field], state.formData);
  }, [state.formData]);

  const validateCompleteForm = useCallback((): boolean => {
    const validation = validateForm(state.formData);
    return isFormValid(validation);
  }, [state.formData]);

  const resetForm = useCallback(() => {
    setState(prev => ({
      ...prev,
      formData: { ...createInitialFormData(), ...initialData },
      validation: createInitialValidation(),
      isDirty: false,
      error: null,
      progress: {
        ...prev.progress,
        currentStep: 0,
        completedSteps: 0,
        isValid: false,
        canProceed: false,
      },
    }));
  }, [initialData]);

  const loadStudy = useCallback(async () => {
    if (!studyId) return;

    console.log('Loading study with ID:', studyId);
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.get(`/studies/${studyId}`);
      console.log('Study API response:', response.data);
      if (response.data.success) {
        const study: Study = response.data.data;
        const formData = convertStudyToFormData(study);
        console.log('Converted form data:', formData);
        
        // Load protocol if study has protocolId
        if (study.protocolId) {
          console.log('Loading protocol with ID:', study.protocolId);
          try {
            const protocolResponse = await api.get(`/predefined-protocols/${study.protocolId}`);
            console.log('Protocol API response:', protocolResponse.data);
            if (protocolResponse.data.success && protocolResponse.data.data) {
              const protocol = protocolResponse.data.data;
              formData.protocol = protocol;
              console.log('Protocol loaded:', protocol.title);
            }
          } catch (protocolError) {
            console.warn('Failed to load protocol:', protocolError);
          }
        }
        
        setState(prev => ({
          ...prev,
          formData,
          originalStudy: study,
          isDirty: false,
          isLoading: false,
        }));
      } else {
        throw new Error(response.data.error || 'Failed to load study');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load study',
        isLoading: false,
      }));
    }
  }, [studyId]);

  const saveStudy = useCallback(async (): Promise<boolean> => {
    if (!validateCompleteForm()) {
      setState(prev => ({
        ...prev,
        error: 'Proszę wypełnić wszystkie wymagane pola',
      }));
      return false;
    }

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      const studyData = convertFormDataToStudy(state.formData, studyId);
      
      let response;
      if (mode === 'edit' && studyId) {
        response = await api.put(`/studies/${studyId}`, studyData);
      } else {
        response = await api.post('/studies', studyData);
      }

      if (response.data.success) {
        setState(prev => ({
          ...prev,
          isDirty: false,
          isSaving: false,
          lastSaved: new Date(),
          originalStudy: response.data.data,
        }));
        return true;
      } else {
        throw new Error(response.data.error || 'Failed to save study');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to save study',
        isSaving: false,
      }));
      return false;
    }
  }, [state.formData, studyId, mode, validateCompleteForm]);

  const saveDraft = useCallback(async (): Promise<boolean> => {
    if (!state.config.allowPartialSave || !studyId) return false;

    setState(prev => ({ ...prev, isSaving: true }));

    try {
      const studyData = {
        ...convertFormDataToStudy(state.formData, studyId),
        status: StudyStatus.DRAFT,
      };
      
      const response = await api.put(`/studies/${studyId}`, studyData);

      if (response.data.success) {
        setState(prev => ({
          ...prev,
          isDirty: false,
          isSaving: false,
          lastSaved: new Date(),
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Draft save failed:', error);
      setState(prev => ({ ...prev, isSaving: false }));
      return false;
    }
  }, [state.formData, state.config.allowPartialSave, studyId]);

  const nextStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        currentStep: Math.min(prev.progress.currentStep + 1, prev.progress.totalSteps - 1),
      },
    }));
  }, []);

  const previousStep = useCallback(() => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        currentStep: Math.max(prev.progress.currentStep - 1, 0),
      },
    }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        currentStep: Math.max(0, Math.min(step, prev.progress.totalSteps - 1)),
      },
    }));
  }, []);

  const addTag = useCallback((tag: string) => {
    if (tag.trim() && !state.formData.tags.includes(tag.trim())) {
      updateField('tags', [...state.formData.tags, tag.trim()]);
    }
  }, [state.formData.tags, updateField]);

  const removeTag = useCallback((tag: string) => {
    updateField('tags', state.formData.tags.filter(t => t !== tag));
  }, [state.formData.tags, updateField]);

  const addCollaborator = useCallback((collaborator: string) => {
    if (collaborator.trim() && !state.formData.collaborators.includes(collaborator.trim())) {
      updateField('collaborators', [...state.formData.collaborators, collaborator.trim()]);
    }
  }, [state.formData.collaborators, updateField]);

  const removeCollaborator = useCallback((collaborator: string) => {
    updateField('collaborators', state.formData.collaborators.filter(c => c !== collaborator));
  }, [state.formData.collaborators, updateField]);

  const actions: EditStudyActions = {
    updateField,
    updateMultipleFields,
    validateField: validateSingleField,
    validateForm: validateCompleteForm,
    resetForm,
    loadStudy,
    saveStudy,
    saveDraft,
    nextStep,
    previousStep,
    goToStep,
    addTag,
    removeTag,
    addCollaborator,
    removeCollaborator,
  };

  return {
    ...state,
    actions,
  };
};
