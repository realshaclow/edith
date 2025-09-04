import { useState, useCallback } from 'react';
import { StudyFormData, CreateStudyStep, ProtocolData, StepMeasurementConfig, MeasurementDefinition } from '../types';
import { CreateStudyForm } from '../../../types';
import { protocolsApi, studiesApi, predefinedProtocolsApi } from '../../../services/api';

const initialStudyData: StudyFormData = {
  name: '',
  description: '',
  protocolId: '',
  protocolName: '',
  category: '',
  settings: {
    numberOfSamples: 3,
    samplePrefix: 'S',
    sampleNaming: 'automatic',
    testConditions: {},
    sessionSettings: {
      allowMultipleSessions: false,
      maxSamplesPerSession: 10,
      sessionTimeout: 120,
      autoStartNextSession: false,
    },
    operatorRequired: false, // Operator nie jest domyślnie wymagany
    operatorName: '',
    operatorEmail: '',
    requiredEquipment: [],
  },
  stepMeasurements: [],
  operatorInfo: {
    name: '',
    position: '',
    operatorId: '',
    notes: '',
  },
  equipmentList: [],
};

const steps: CreateStudyStep[] = [
  'protocol-selection',
  'basic-info',
  'sample-configuration',
  'test-conditions',
  'session-configuration',
  'step-measurements',  // KLUCZOWY KROK
  'operator-equipment',
  'review',
];

export const useCreateStudy = () => {
  const [currentStep, setCurrentStep] = useState<CreateStudyStep>('protocol-selection');
  const [studyData, setStudyData] = useState<StudyFormData>(initialStudyData);
  const [protocolData, setProtocolData] = useState<ProtocolData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  // ==================== AKTUALIZACJA DANYCH ====================

  const updateStudyData = useCallback((updates: Partial<StudyFormData>) => {
    setStudyData(prev => ({
      ...prev,
      ...updates,
      settings: updates.settings ? { ...prev.settings, ...updates.settings } : prev.settings,
      stepMeasurements: updates.stepMeasurements || prev.stepMeasurements,
    }));
    setErrors({});
  }, []);

  // ==================== PROTOKOŁY ====================

  const setProtocol = useCallback(async (protocol: ProtocolData) => {
    console.log('🚀 setProtocol called with:', protocol);
    setIsLoading(true);
    try {
      // Jeśli protokół nie ma pełnych danych (steps, testConditions), pobierz je z API
      let fullProtocol = protocol;
      if (!protocol.steps || protocol.steps.length === 0 || !protocol.testConditions) {
        console.log('📡 Fetching full protocol details for:', protocol.id);
        const result = await predefinedProtocolsApi.getById(protocol.id);
        if (result.success) {
          fullProtocol = result.data;
          console.log('✅ Full protocol loaded:', fullProtocol);
        }
      }
      
      setProtocolData(fullProtocol);
      
      // Automatycznie ustaw dane z protokołu
      const testConditions: Record<string, any> = {};
      fullProtocol.testConditions?.forEach(condition => {
        testConditions[condition.id] = {
          name: condition.name,
          value: condition.value,
          unit: condition.unit,
          tolerance: condition.tolerance,
          required: condition.required,
          description: condition.description,
        };
      });

      // Inicjalizuj stepMeasurements na podstawie kroków protokołu
      const stepMeasurements: StepMeasurementConfig[] = fullProtocol.steps?.map(step => ({
        stepId: step.id,
        stepTitle: step.title,
        stepDescription: step.description,
        measurements: [], // Puste na początku - użytkownik może dodawać opcjonalnie
        isRequired: false, // Pomiary nie są wymagane w każdym kroku
        estimatedDuration: step.duration,
      })) || [];

      const updateData = {
        protocolId: fullProtocol.id,
        protocolName: fullProtocol.title,
        category: fullProtocol.category,
        settings: {
          ...studyData.settings,
          testConditions,
          requiredEquipment: fullProtocol.equipment?.map(eq => eq.name) || [],
        },
        stepMeasurements,
      };

      console.log('📝 Updating study data with:', updateData);
      updateStudyData(updateData);
    } catch (error) {
      console.error('Error setting protocol:', error);
      setErrors({ protocol: ['Błąd podczas ustawiania protokołu'] });
    } finally {
      setIsLoading(false);
    }
  }, [studyData.settings, updateStudyData]);

  // ==================== POMIARY PER KROK ====================

  const addMeasurementToStep = useCallback((stepId: string, measurement: MeasurementDefinition) => {
    const updatedStepMeasurements = studyData.stepMeasurements.map(step => {
      if (step.stepId === stepId) {
        return {
          ...step,
          measurements: [...step.measurements, measurement],
        };
      }
      return step;
    });
    
    updateStudyData({ stepMeasurements: updatedStepMeasurements });
  }, [studyData.stepMeasurements, updateStudyData]);

  const removeMeasurementFromStep = useCallback((stepId: string, measurementId: string) => {
    const updatedStepMeasurements = studyData.stepMeasurements.map(step => {
      if (step.stepId === stepId) {
        return {
          ...step,
          measurements: step.measurements.filter(m => m.id !== measurementId),
        };
      }
      return step;
    });
    
    updateStudyData({ stepMeasurements: updatedStepMeasurements });
  }, [studyData.stepMeasurements, updateStudyData]);

  const updateMeasurementInStep = useCallback((stepId: string, measurementId: string, updates: Partial<MeasurementDefinition>) => {
    const updatedStepMeasurements = studyData.stepMeasurements.map(step => {
      if (step.stepId === stepId) {
        return {
          ...step,
          measurements: step.measurements.map(m => 
            m.id === measurementId ? { ...m, ...updates } : m
          ),
        };
      }
      return step;
    });
    
    updateStudyData({ stepMeasurements: updatedStepMeasurements });
  }, [studyData.stepMeasurements, updateStudyData]);

  // Dodaj sugerowane pomiary z protokołu (jeśli są)
  const addSuggestedMeasurements = useCallback((stepId: string) => {
    if (!protocolData?.suggestedMeasurements?.[stepId]) return;
    
    const suggestedMeasurements = protocolData.suggestedMeasurements[stepId];
    const currentStep = studyData.stepMeasurements.find(s => s.stepId === stepId);
    
    if (currentStep) {
      // Dodaj tylko te pomiary, które jeszcze nie istnieją
      const existingMeasurementNames = currentStep.measurements.map(m => m.name);
      const newMeasurements = suggestedMeasurements.filter(
        m => !existingMeasurementNames.includes(m.name)
      );
      
      const updatedStepMeasurements = studyData.stepMeasurements.map(step => {
        if (step.stepId === stepId) {
          return {
            ...step,
            measurements: [...step.measurements, ...newMeasurements],
          };
        }
        return step;
      });
      
      updateStudyData({ stepMeasurements: updatedStepMeasurements });
    }
  }, [protocolData, studyData.stepMeasurements, updateStudyData]);

  // ==================== NAWIGACJA ====================

  const currentStepIndex = steps.indexOf(currentStep);
  
  const goToNextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1]);
    }
  }, [currentStepIndex]);

  const goToPreviousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1]);
    }
  }, [currentStepIndex]);

  const goToStep = useCallback((step: CreateStudyStep) => {
    setCurrentStep(step);
  }, []);

  // ==================== WALIDACJA ====================

  const validateCurrentStep = useCallback((): boolean => {
    const newErrors: Record<string, string[]> = {};

    console.log('🔍 Validating current step:', currentStep);
    console.log('📋 Current studyData:', studyData);

    switch (currentStep) {
      case 'protocol-selection':
        console.log('🧪 Protocol ID:', studyData.protocolId);
        if (!studyData.protocolId) {
          newErrors.protocol = ['Wybierz protokół badawczy'];
        }
        break;

      case 'basic-info':
        if (!studyData.name.trim()) {
          newErrors.name = ['Nazwa studium jest wymagana'];
        }
        if (studyData.name.length < 3) {
          newErrors.name = [...(newErrors.name || []), 'Nazwa musi mieć co najmniej 3 znaki'];
        }
        break;

      case 'sample-configuration':
        if (studyData.settings.numberOfSamples < 1) {
          newErrors.numberOfSamples = ['Liczba próbek musi być większa od 0'];
        }
        if (studyData.settings.numberOfSamples > 1000) {
          newErrors.numberOfSamples = ['Maksymalna liczba próbek to 1000'];
        }
        if (!studyData.settings.samplePrefix.trim()) {
          newErrors.samplePrefix = ['Prefiks próbek jest wymagany'];
        }
        break;

      case 'session-configuration':
        if (studyData.settings.sessionSettings.maxSamplesPerSession < 1) {
          newErrors.maxSamplesPerSession = ['Liczba próbek na sesję musi być większa od 0'];
        }
        if (studyData.settings.sessionSettings.sessionTimeout < 5) {
          newErrors.sessionTimeout = ['Timeout sesji musi być co najmniej 5 minut'];
        }
        break;

      case 'step-measurements':
        console.log('🔍 Validating step-measurements');
        console.log('📊 stepMeasurements:', studyData.stepMeasurements);
        
        // Pomiary nie są wymagane - sprawdź tylko czy te które zostały dodane mają poprawne nazwy
        studyData.stepMeasurements?.forEach(step => {
          step.measurements?.forEach(measurement => {
            if (!measurement.name?.trim()) {
              newErrors.measurementNames = [...(newErrors.measurementNames || []), 
                `Pomiar w kroku "${step.stepTitle}" nie ma nazwy`];
            }
          });
        });
        break;

      case 'operator-equipment':
        console.log('🔍 Validating operator-equipment');
        console.log('📊 operatorRequired:', studyData.settings.operatorRequired);
        console.log('📊 operatorInfo:', studyData.operatorInfo);
        
        if (studyData.settings.operatorRequired) {
          if (!studyData.operatorInfo?.operatorId?.trim()) {
            newErrors.operatorName = ['ID użytkownika jest wymagane'];
          }
        }
        break;
    }

    console.log('❌ Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('✅ Is valid:', isValid);
    return isValid;
  }, [currentStep, studyData]);

  // ==================== TWORZENIE STUDIUM ====================

  const createStudy = useCallback(async (): Promise<{ success: boolean; data?: any; error?: string }> => {
    if (!validateCurrentStep()) {
      return { success: false, error: 'Błędy walidacji' };
    }

    setIsLoading(true);
    try {
      const requestData: CreateStudyForm = {
        name: studyData.name, // Przywracamy 'name'
        description: studyData.description,
        protocolId: studyData.protocolId,
        category: studyData.category,
        settings: {
          ...studyData.settings,
          // Dodaj stepMeasurements do settings jako część konfiguracji
          stepMeasurements: studyData.stepMeasurements,
        },
        parameters: {}, // Dodaj pusty parameters jeśli wymagany
      };

      const response = await studiesApi.create(requestData);

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Nieznany błąd' };
      }
    } catch (error) {
      console.error('Error creating study:', error);
      return { success: false, error: 'Błąd połączenia z serwerem' };
    } finally {
      setIsLoading(false);
    }
  }, [studyData, validateCurrentStep]);

  // ==================== UTILITIES ====================

  const resetForm = useCallback(() => {
    setStudyData(initialStudyData);
    setProtocolData(null);
    setCurrentStep('protocol-selection');
    setErrors({});
  }, []);

  // Oblicz całkowitą liczbę pomiarów
  const totalMeasurements = studyData.stepMeasurements.reduce(
    (total, step) => total + step.measurements.length, 
    0
  );

  // Sprawdź czy studium jest gotowe do utworzenia
  const isStudyReady = studyData.protocolId && 
                      studyData.name && 
                      studyData.stepMeasurements.some(step => step.measurements.length > 0);

  return {
    // Stan
    currentStep,
    studyData,
    protocolData,
    isLoading,
    errors,
    
    // Nawigacja
    currentStepIndex,
    totalSteps: steps.length,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    
    // Akcje podstawowe
    updateStudyData,
    setProtocol,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    validateCurrentStep,
    createStudy,
    resetForm,
    
    // Akcje dla pomiarów
    addMeasurementToStep,
    removeMeasurementFromStep,
    updateMeasurementInStep,
    addSuggestedMeasurements,
    
    // Statystyki
    totalMeasurements,
    isStudyReady,
    
    // Stałe
    steps,
  };
};
