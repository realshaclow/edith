import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { studiesApi } from '../../../services/api';
import {
  StudyFormData,
  ProtocolForStudy,
  CreateStudyFormErrors,
  CreateStudyStep,
  UseCreateStudyReturn
} from '../types';

const createEmptyStudyData = (): StudyFormData => ({
  name: '',
  description: '',
  protocolId: '',
  protocolName: '',
  category: '',
  parametrizationMode: 'global',
  selectedProtocol: null,
  parameters: [],
  stepParameters: {},
  settings: {
    sampleSettings: {
      sampleSize: 1,
      sampleType: '',
      preparation: [],
      conditions: []
    },
    environmentalSettings: {
      temperature: '20±2°C',
      humidity: '50±5%RH',
      pressure: 'atmosferyczne',
      atmosphere: 'powietrze laboratoryjne'
    },
    qualitySettings: {
      repeatability: 3,
      accuracy: '±1%',
      precision: '±0.5%',
      calibration: []
    }
  },
  objectives: [],
  expectedOutcomes: [],
  timeline: {
    estimatedDuration: '',
    phases: [],
    milestones: []
  },
  resources: {
    personnel: [],
    equipment: [],
    materials: [],
    budget: {
      totalBudget: 0,
      currency: 'PLN',
      breakdown: {
        personnel: 0,
        equipment: 0,
        materials: 0,
        overhead: 0,
        contingency: 0
      }
    }
  }
});

const STEPS: CreateStudyStep[] = [
  'basic-info',
  'protocol-selection',
  'parameters',
  'settings',
  'timeline',
  'resources',
  'review'
];

export const useCreateStudy = (initialProtocolId?: string): UseCreateStudyReturn => {
  const navigate = useNavigate();
  const [studyData, setStudyData] = useState<StudyFormData>(() => {
    const data = createEmptyStudyData();
    if (initialProtocolId) {
      data.protocolId = initialProtocolId;
    }
    return data;
  });
  
  const [selectedProtocol, setSelectedProtocolState] = useState<ProtocolForStudy | null>(null);
  const [errors, setErrors] = useState<CreateStudyFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = STEPS[currentStepIndex];

  const updateStudyData = useCallback((data: Partial<StudyFormData>) => {
    setStudyData(prev => ({ ...prev, ...data }));
    // Wyczyść błędy dla zaktualizowanych pól
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(data).forEach(key => {
        delete newErrors[key as keyof CreateStudyFormErrors];
      });
      return newErrors;
    });
  }, []);

  const setSelectedProtocol = useCallback((protocol: ProtocolForStudy | null) => {
    setSelectedProtocolState(protocol);
    if (protocol) {
      updateStudyData({
        protocolId: protocol.id,
        protocolName: protocol.title,
        category: protocol.category,
        selectedProtocol: protocol
      });
    } else {
      updateStudyData({
        protocolId: '',
        protocolName: '',
        category: '',
        selectedProtocol: null
      });
    }
  }, [updateStudyData]);

  const validateBasicInfo = useCallback((): boolean => {
    const newErrors: CreateStudyFormErrors = {};
    
    if (!studyData.name.trim()) {
      newErrors.name = 'Nazwa badania jest wymagana';
    } else if (studyData.name.length < 3) {
      newErrors.name = 'Nazwa badania musi mieć co najmniej 3 znaki';
    }
    
    if (!studyData.description.trim()) {
      newErrors.description = 'Opis badania jest wymagany';
    } else if (studyData.description.length < 10) {
      newErrors.description = 'Opis badania musi mieć co najmniej 10 znaków';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [studyData.name, studyData.description]);

  const validateProtocolSelection = useCallback((): boolean => {
    const newErrors: CreateStudyFormErrors = {};
    
    if (!studyData.protocolId) {
      newErrors.protocol = 'Wybór protokołu jest wymagany';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [studyData.protocolId]);

  const validateParameters = useCallback((): boolean => {
    const newErrors: CreateStudyFormErrors = {};
    const parameterErrors: { [key: string]: string } = {};
    
    if (studyData.parametrizationMode === 'global') {
      // Walidacja globalnych parametrów
      studyData.parameters.forEach(param => {
        if (param.required && !param.value) {
          parameterErrors[param.id] = `${param.name} jest wymagany`;
        }
        
        if (param.type === 'number' && param.value) {
          const numValue = Number(param.value);
          if (isNaN(numValue)) {
            parameterErrors[param.id] = 'Wartość musi być liczbą';
          } else if (param.constraints?.min !== undefined && numValue < param.constraints.min) {
            parameterErrors[param.id] = `Wartość nie może być mniejsza niż ${param.constraints.min}`;
          } else if (param.constraints?.max !== undefined && numValue > param.constraints.max) {
            parameterErrors[param.id] = `Wartość nie może być większa niż ${param.constraints.max}`;
          }
        }
      });
    } else {
      // Walidacja parametrów per krok
      Object.entries(studyData.stepParameters).forEach(([stepId, stepParams]) => {
        stepParams.forEach(param => {
          if (param.required && !param.value) {
            parameterErrors[`${stepId}-${param.id}`] = `${param.name} w kroku ${stepId} jest wymagany`;
          }
          
          if (param.type === 'number' && param.value) {
            const numValue = Number(param.value);
            if (isNaN(numValue)) {
              parameterErrors[`${stepId}-${param.id}`] = 'Wartość musi być liczbą';
            } else if (param.constraints?.min !== undefined && numValue < param.constraints.min) {
              parameterErrors[`${stepId}-${param.id}`] = `Wartość nie może być mniejsza niż ${param.constraints.min}`;
            } else if (param.constraints?.max !== undefined && numValue > param.constraints.max) {
              parameterErrors[`${stepId}-${param.id}`] = `Wartość nie może być większa niż ${param.constraints.max}`;
            }
          }
        });
      });
    }

    if (Object.keys(parameterErrors).length > 0) {
      newErrors.parameters = parameterErrors;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [studyData.parameters, studyData.stepParameters, studyData.parametrizationMode]);

  const validateSettings = useCallback((): boolean => {
    const newErrors: CreateStudyFormErrors = {};
    const settingsErrors: { [key: string]: string } = {};
    
    if (studyData.settings.sampleSettings.sampleSize < 1) {
      settingsErrors.sampleSize = 'Rozmiar próby musi być co najmniej 1';
    }
    
    if (!studyData.settings.sampleSettings.sampleType.trim()) {
      settingsErrors.sampleType = 'Typ próby jest wymagany';
    }

    if (Object.keys(settingsErrors).length > 0) {
      newErrors.settings = settingsErrors;
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [studyData.settings]);

  const validateTimeline = useCallback((): boolean => {
    const newErrors: CreateStudyFormErrors = {};
    
    if (!studyData.timeline.estimatedDuration.trim()) {
      newErrors.timeline = 'Szacowany czas trwania jest wymagany';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  }, [studyData.timeline.estimatedDuration]);

  const validateResources = useCallback((): boolean => {
    // Zasoby są opcjonalne na tym etapie
    return true;
  }, []);

  const validateStep = useCallback((step: CreateStudyStep): boolean => {
    switch (step) {
      case 'basic-info':
        return validateBasicInfo();
      case 'protocol-selection':
        return validateProtocolSelection();
      case 'parameters':
        return validateParameters();
      case 'settings':
        return validateSettings();
      case 'timeline':
        return validateTimeline();
      case 'resources':
        return validateResources();
      case 'review':
        return true; // Review nie wymaga walidacji
      default:
        return false;
    }
  }, [validateBasicInfo, validateProtocolSelection, validateParameters, validateSettings, validateTimeline, validateResources]);

  const isStepValid = useCallback((step: CreateStudyStep): boolean => {
    // Sprawdź czy krok może być uznany za ważny bez pokazywania błędów
    switch (step) {
      case 'basic-info':
        return !!(studyData.name.trim() && studyData.description.trim() && studyData.name.length >= 3 && studyData.description.length >= 5);
      case 'protocol-selection':
        return !!studyData.protocolId;
      case 'parameters':
        // Walidacja w zależności od trybu parametryzacji
        if (studyData.parametrizationMode === 'global') {
          return studyData.parameters.length === 0 || studyData.parameters.every(param => !param.required || param.value);
        } else {
          // Dla trybu per-step sprawdź czy wszystkie wymagane parametry każdego kroku są wypełnione
          return Object.values(studyData.stepParameters).every(stepParams => 
            stepParams.every(param => !param.required || param.value)
          );
        }
      case 'settings':
        return studyData.settings.sampleSettings.sampleSize >= 1 && studyData.settings.sampleSettings.sampleType.trim() !== '';
      case 'timeline':
        return !!studyData.timeline.estimatedDuration.trim();
      case 'resources':
        // Zasoby są opcjonalne - krok jest zawsze ważny
        return true;
      case 'review':
        // Review jest ważny tylko jeśli wszystkie wymagane kroki są ukończone
        return !!(studyData.name.trim() && studyData.protocolId && studyData.timeline.estimatedDuration.trim() && 
                 studyData.settings.sampleSettings.sampleSize >= 1 && studyData.settings.sampleSettings.sampleType.trim());
      default:
        return false;
    }
  }, [studyData]);

  const nextStep = useCallback(() => {
    if (validateStep(currentStep) && currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStep, currentStepIndex, validateStep]);

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((step: CreateStudyStep) => {
    const stepIndex = STEPS.indexOf(step);
    if (stepIndex !== -1) {
      setCurrentStepIndex(stepIndex);
    }
  }, []);

  const submitStudy = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Waliduj wszystkie kroki przed wysłaniem
      const allStepsValid = STEPS.every(step => validateStep(step));
      if (!allStepsValid) {
        toast.error('Sprawdź wszystkie wymagane pola');
        return false;
      }

      const response = await studiesApi.create({
        name: studyData.name,
        description: studyData.description,
        protocolId: studyData.protocolId,
        status: 'draft',
        // Dodaj inne wymagane pola zgodnie z API
      } as any);

      if (response.success) {
        toast.success('Badanie zostało utworzone pomyślnie!');
        navigate('/studies');
        return true;
      } else {
        toast.error(response.error || 'Błąd podczas tworzenia badania');
        return false;
      }
    } catch (error) {
      console.error('Error creating study:', error);
      toast.error('Błąd podczas tworzenia badania');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [studyData, validateStep, navigate]);

  const resetForm = useCallback(() => {
    setStudyData(createEmptyStudyData());
    setSelectedProtocolState(null);
    setErrors({});
    setCurrentStepIndex(0);
  }, []);

  return {
    studyData,
    selectedProtocol,
    errors,
    isLoading,
    currentStep,
    isStepValid,
    updateStudyData,
    setSelectedProtocol,
    validateStep,
    nextStep,
    previousStep,
    goToStep,
    submitStudy,
    resetForm
  };
};
