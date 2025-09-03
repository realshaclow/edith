import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { studiesApi, protocolsApi } from '../../../services/api';
import {
  ExecutionContext,
  ExecutionSession,
  ExecutionProgress,
  ExecutionView,
  UseExecuteStudyReturn,
  StudySample,
  StepResult,
  ExecutionIssue,
  EnvironmentalConditions,
  ProtocolForExecution
} from '../types';

const createInitialContext = (): ExecutionContext => ({
  studyId: '',
  studyName: '',
  protocolId: '',
  protocol: {} as ProtocolForExecution,
  samples: [],
  currentSampleIndex: 0,
  currentStepIndex: 0,
  executionMode: 'sequential',
  operator: ''
});

const createInitialProgress = (): ExecutionProgress => ({
  totalSteps: 0,
  completedSteps: 0,
  currentStep: 0,
  totalSamples: 0,
  completedSamples: 0,
  currentSample: 0,
  estimatedTimeRemaining: '0:00',
  actualDuration: '0:00',
  efficiency: 0
});

const createInitialEnvironmentalConditions = (): EnvironmentalConditions => ({
  temperature: {
    value: 20,
    unit: '°C',
    timestamp: new Date(),
    withinTolerance: true
  },
  humidity: {
    value: 50,
    unit: '%RH',
    timestamp: new Date(),
    withinTolerance: true
  },
  pressure: {
    value: 1013,
    unit: 'hPa',
    timestamp: new Date(),
    withinTolerance: true
  },
  atmosphere: 'laboratory air'
});

export const useExecuteStudy = (): UseExecuteStudyReturn => {
  const navigate = useNavigate();
  
  const [context, setContext] = useState<ExecutionContext>(createInitialContext);
  const [session, setSession] = useState<ExecutionSession | null>(null);
  const [progress, setProgress] = useState<ExecutionProgress>(createInitialProgress);
  const [currentView, setCurrentView] = useState<ExecutionView>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate progress based on current state
  const calculateProgress = useCallback(() => {
    if (!context.protocol.steps || context.samples.length === 0) return;

    const totalSteps = context.protocol.steps.length;
    const totalSamples = context.samples.length;
    const completedSamples = context.samples.filter(s => s.status === 'completed').length;
    const currentSample = context.currentSampleIndex;
    const currentStep = context.currentStepIndex;
    const completedSteps = session?.stepResults.filter(r => r.status === 'completed').length || 0;

    // Calculate estimated time remaining
    const avgStepDuration = 5; // minutes - should be calculated from protocol
    const remainingSteps = (totalSamples - completedSamples) * totalSteps - completedSteps;
    const estimatedMinutes = remainingSteps * avgStepDuration;
    const estimatedTimeRemaining = `${Math.floor(estimatedMinutes / 60)}:${(estimatedMinutes % 60).toString().padStart(2, '0')}`;

    // Calculate actual duration
    const startTime = session?.startTime || new Date();
    const actualDurationMs = Date.now() - startTime.getTime();
    const actualMinutes = Math.floor(actualDurationMs / 60000);
    const actualDuration = `${Math.floor(actualMinutes / 60)}:${(actualMinutes % 60).toString().padStart(2, '0')}`;

    // Calculate efficiency
    const expectedDuration = totalSteps * totalSamples * avgStepDuration;
    const efficiency = expectedDuration > 0 ? Math.min(100, (expectedDuration / (actualMinutes || 1)) * 100) : 0;

    setProgress({
      totalSteps,
      completedSteps,
      currentStep,
      totalSamples,
      completedSamples,
      currentSample,
      estimatedTimeRemaining,
      actualDuration,
      efficiency
    });
  }, [context, session]);

  // Update progress when context or session changes
  useEffect(() => {
    calculateProgress();
  }, [calculateProgress]);

  const startExecution = useCallback(async (studyId: string, operator: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch study details
      const studyResponse = await studiesApi.getById(studyId);
      if (!studyResponse.success || !studyResponse.data) {
        throw new Error('Nie udało się pobrać danych badania');
      }

      const study = studyResponse.data;

      // Fetch protocol details
      let protocolResponse;
      
      if (!study.protocolId) {
        console.log('Study has no protocolId, trying to find by protocolName:', study.protocolName);
        // Dla predefiniowanych protokołów - spróbuj znaleźć po nazwie lub użyj wspólnego endpointu
        // Najpierw spróbujmy pobrać wszystkie predefiniowane protokoły i znaleźć po nazwie
        const predefinedResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/predefined-protocols`);
        const predefinedData = await predefinedResponse.json();
        
        if (predefinedData.success && predefinedData.data) {
          // Znajdź protokół po nazwie
          const matchingProtocol = predefinedData.data.find((p: any) => 
            p.title === study.protocolName || p.id === study.protocolName
          );
          
          if (matchingProtocol) {
            console.log('Found matching predefined protocol:', matchingProtocol.id);
            // Pobierz pełne szczegóły protokołu
            const detailResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/predefined-protocols/${matchingProtocol.id}`);
            protocolResponse = await detailResponse.json();
          } else {
            throw new Error(`Nie znaleziono protokołu o nazwie: ${study.protocolName}`);
          }
        } else {
          throw new Error('Nie udało się pobrać listy predefiniowanych protokołów');
        }
      } else {
        protocolResponse = await protocolsApi.getById(study.protocolId);
      }
      if (!protocolResponse.success || !protocolResponse.data) {
        throw new Error('Nie udało się pobrać danych protokołu');
      }

      const protocol = protocolResponse.data as ProtocolForExecution;

      // Create sample data based on study settings
      const samples: StudySample[] = Array.from({ length: study.settings?.sampleSettings?.sampleSize || 1 }, (_, index) => ({
        id: `sample-${index + 1}`,
        name: `Próbka ${index + 1}`,
        type: study.settings?.sampleSettings?.sampleType || 'Standardowa',
        description: `Próbka nr ${index + 1} dla badania: ${study.name}`,
        preparation: study.settings?.sampleSettings?.preparation || [],
        conditions: study.settings?.sampleSettings?.conditions || [],
        measurements: [],
        notes: '',
        status: 'pending'
      }));

      // Create execution context
      const newContext: ExecutionContext = {
        studyId,
        studyName: study.name,
        protocolId: study.protocolId || protocol.id,
        protocol,
        samples,
        currentSampleIndex: 0,
        currentStepIndex: 0,
        executionMode: 'sequential',
        operator,
        startTime: new Date()
      };

      // Create initial session
      const newSession: ExecutionSession = {
        id: `session-${Date.now()}`,
        studyId,
        sampleId: samples[0]?.id || '',
        operator,
        startTime: new Date(),
        currentStepIndex: 0,
        stepResults: protocol.steps.map(step => ({
          stepId: step.id,
          stepTitle: step.title,
          status: 'pending',
          parameters: {},
          measurements: {},
          conditions: {},
          notes: ''
        })),
        environmentalConditions: createInitialEnvironmentalConditions(),
        notes: '',
        status: 'active'
      };

      setContext(newContext);
      setSession(newSession);
      setCurrentView('protocol-review');
      
      toast.success('Wykonywanie badania zostało rozpoczęte');
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Błąd podczas uruchamiania badania';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const pauseExecution = useCallback(() => {
    if (session) {
      setSession(prev => prev ? { ...prev, status: 'paused' } : null);
      toast('Wykonywanie badania zostało wstrzymane', { icon: 'ℹ️' });
    }
  }, [session]);

  const resumeExecution = useCallback(() => {
    if (session) {
      setSession(prev => prev ? { ...prev, status: 'active' } : null);
      toast.success('Wykonywanie badania zostało wznowione');
    }
  }, [session]);

  const stopExecution = useCallback(() => {
    if (session) {
      setSession(prev => prev ? { 
        ...prev, 
        status: 'aborted',
        endTime: new Date()
      } : null);
      toast('Wykonywanie badania zostało przerwane', { icon: '⚠️' });
    }
  }, [session]);

  const nextStep = useCallback(() => {
    if (!context.protocol.steps) return;

    const totalSteps = context.protocol.steps.length;
    if (context.currentStepIndex < totalSteps - 1) {
      setContext(prev => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex + 1
      }));
      
      if (session) {
        setSession(prev => prev ? {
          ...prev,
          currentStepIndex: prev.currentStepIndex + 1
        } : null);
      }
    }
  }, [context.protocol.steps, session]);

  const previousStep = useCallback(() => {
    if (context.currentStepIndex > 0) {
      setContext(prev => ({
        ...prev,
        currentStepIndex: prev.currentStepIndex - 1
      }));
      
      if (session) {
        setSession(prev => prev ? {
          ...prev,
          currentStepIndex: prev.currentStepIndex - 1
        } : null);
      }
    }
  }, [context.currentStepIndex, session]);

  const goToStep = useCallback((stepIndex: number) => {
    if (!context.protocol.steps) return;
    
    const totalSteps = context.protocol.steps.length;
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setContext(prev => ({
        ...prev,
        currentStepIndex: stepIndex
      }));
      
      if (session) {
        setSession(prev => prev ? {
          ...prev,
          currentStepIndex: stepIndex
        } : null);
      }
    }
  }, [context.protocol.steps, session]);

  const nextSample = useCallback(() => {
    const totalSamples = context.samples.length;
    if (context.currentSampleIndex < totalSamples - 1) {
      setContext(prev => ({
        ...prev,
        currentSampleIndex: prev.currentSampleIndex + 1,
        currentStepIndex: 0 // Reset to first step for new sample
      }));
      
      // Create new session for next sample
      if (session) {
        const nextSample = context.samples[context.currentSampleIndex + 1];
        setSession(prev => prev ? {
          ...prev,
          sampleId: nextSample.id,
          currentStepIndex: 0,
          stepResults: context.protocol.steps.map(step => ({
            stepId: step.id,
            stepTitle: step.title,
            status: 'pending',
            parameters: {},
            measurements: {},
            conditions: {},
            notes: ''
          }))
        } : null);
      }
    }
  }, [context.samples, context.currentSampleIndex, context.protocol.steps, session]);

  const previousSample = useCallback(() => {
    if (context.currentSampleIndex > 0) {
      setContext(prev => ({
        ...prev,
        currentSampleIndex: prev.currentSampleIndex - 1,
        currentStepIndex: 0
      }));
    }
  }, [context.currentSampleIndex]);

  const goToSample = useCallback((sampleIndex: number) => {
    const totalSamples = context.samples.length;
    if (sampleIndex >= 0 && sampleIndex < totalSamples) {
      setContext(prev => ({
        ...prev,
        currentSampleIndex: sampleIndex,
        currentStepIndex: 0
      }));
    }
  }, [context.samples]);

  const updateStepResult = useCallback((stepId: string, result: Partial<StepResult>) => {
    if (!session) return;

    setSession(prev => {
      if (!prev) return null;
      
      const stepResults = prev.stepResults.map(sr =>
        sr.stepId === stepId ? { ...sr, ...result } : sr
      );
      
      return { ...prev, stepResults };
    });
  }, [session]);

  const updateMeasurement = useCallback((measurementId: string, value: number) => {
    // Update measurement in current step
    const currentStepId = context.protocol.steps[context.currentStepIndex]?.id;
    if (!currentStepId) return;

    updateStepResult(currentStepId, {
      measurements: {
        ...session?.stepResults.find(r => r.stepId === currentStepId)?.measurements,
        [measurementId]: value
      }
    });
  }, [context.protocol.steps, context.currentStepIndex, session, updateStepResult]);

  const updateCondition = useCallback((conditionId: string, verified: boolean, notes?: string) => {
    const currentStepId = context.protocol.steps[context.currentStepIndex]?.id;
    if (!currentStepId) return;

    updateStepResult(currentStepId, {
      conditions: {
        ...session?.stepResults.find(r => r.stepId === currentStepId)?.conditions,
        [conditionId]: verified
      },
      notes: notes || session?.stepResults.find(r => r.stepId === currentStepId)?.notes || ''
    });
  }, [context.protocol.steps, context.currentStepIndex, session, updateStepResult]);

  const updateParameter = useCallback((parameterId: string, value: any) => {
    const currentStepId = context.protocol.steps[context.currentStepIndex]?.id;
    if (!currentStepId) return;

    updateStepResult(currentStepId, {
      parameters: {
        ...session?.stepResults.find(r => r.stepId === currentStepId)?.parameters,
        [parameterId]: value
      }
    });
  }, [context.protocol.steps, context.currentStepIndex, session, updateStepResult]);

  const completeStep = useCallback(() => {
    const currentStepId = context.protocol.steps[context.currentStepIndex]?.id;
    if (!currentStepId) return;

    // Mark current step as completed
    updateStepResult(currentStepId, {
      status: 'completed',
      endTime: new Date()
    });

    // Move to next step
    nextStep();
  }, [context.protocol.steps, context.currentStepIndex, updateStepResult, nextStep]);

  const addIssue = useCallback((issue: Omit<ExecutionIssue, 'id' | 'timestamp'>) => {
    const newIssue: ExecutionIssue = {
      ...issue,
      id: `issue-${Date.now()}`,
      timestamp: new Date()
    };

    const currentStepId = context.protocol.steps[context.currentStepIndex]?.id;
    if (!currentStepId) return;

    updateStepResult(currentStepId, {
      issues: [
        ...(session?.stepResults.find(r => r.stepId === currentStepId)?.issues || []),
        newIssue
      ]
    });

    toast(`Dodano problem: ${issue.message}`, { icon: '⚠️' });
  }, [context.protocol.steps, context.currentStepIndex, session, updateStepResult]);

  const resolveIssue = useCallback((issueId: string, resolution: string) => {
    const currentStepId = context.protocol.steps[context.currentStepIndex]?.id;
    if (!currentStepId) return;

    const currentStepResult = session?.stepResults.find(r => r.stepId === currentStepId);
    if (!currentStepResult?.issues) return;

    const updatedIssues = currentStepResult.issues.map(issue =>
      issue.id === issueId ? { ...issue, resolved: true, resolution } : issue
    );

    updateStepResult(currentStepId, { issues: updatedIssues });
    toast.success('Problem został rozwiązany');
  }, [context.protocol.steps, context.currentStepIndex, session, updateStepResult]);

  const saveSession = useCallback(async (): Promise<boolean> => {
    if (!session) return false;

    setIsLoading(true);
    try {
      // Here you would typically save to backend
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Sesja została zapisana');
      return true;
    } catch (err) {
      toast.error('Błąd podczas zapisywania sesji');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const generateReport = useCallback(async (): Promise<boolean> => {
    if (!session) return false;

    setIsLoading(true);
    try {
      // Here you would generate and download a report
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Raport został wygenerowany');
      return true;
    } catch (err) {
      toast.error('Błąd podczas generowania raportu');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const setView = useCallback((view: ExecutionView) => {
    setCurrentView(view);
  }, []);

  return {
    context,
    session,
    progress,
    currentView,
    isLoading,
    error,
    
    startExecution,
    pauseExecution,
    resumeExecution,
    stopExecution,
    nextStep,
    previousStep,
    goToStep,
    nextSample,
    previousSample,
    goToSample,
    updateStepResult,
    updateMeasurement,
    updateParameter,
    updateCondition,
    completeStep,
    addIssue,
    resolveIssue,
    saveSession,
    generateReport,
    setView
  };
};
