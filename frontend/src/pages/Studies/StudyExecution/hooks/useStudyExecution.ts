import { useState, useCallback, useEffect } from 'react';
import { 
  ExecutionSession, 
  ExecutionStep, 
  ExecutionSample, 
  StepTimer, 
  ExecutionEvent,
  ExecutionSettings,
  NavigationState
} from '../types';

export interface UseStudyExecutionOptions {
  studyId: string;
  steps: ExecutionStep[];
  samples: ExecutionSample[];
  settings: ExecutionSettings;
  onSessionUpdate?: (session: ExecutionSession) => void;
  onStepComplete?: (stepId: string, sampleId: string, data: any) => void;
  onSessionComplete?: (session: ExecutionSession) => void;
  onError?: (error: string, context?: any) => void;
}

export const useStudyExecution = (options: UseStudyExecutionOptions) => {
  const {
    studyId,
    steps,
    samples: initialSamples,
    settings,
    onSessionUpdate,
    onStepComplete,
    onSessionComplete,
    onError
  } = options;

  const [session, setSession] = useState<ExecutionSession>(() => ({
    id: `session-${Date.now()}`,
    studyId,
    sessionNumber: 1,
    status: 'preparing',
    currentStepIndex: 0,
    stepTimers: steps.map(step => ({
      stepId: step.id,
      startTime: undefined,
      endTime: undefined,
      pausedTime: 0,
      totalTime: 0,
      targetDuration: step.duration ? step.duration * 60 : undefined,
      isRunning: false,
      isPaused: false
    })),
    samples: initialSamples,
    operator: '',
    notes: '',
    metadata: {
      version: '1.0.0',
      protocolVersion: '1.0.0'
    }
  }));

  const [events, setEvents] = useState<ExecutionEvent[]>([]);
  const [currentSample, setCurrentSample] = useState<ExecutionSample | null>(
    initialSamples.length > 0 ? initialSamples[0] : null
  );

  // Notification state
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
    timestamp: Date;
    dismissed?: boolean;
  }>>([]);

  const addEvent = useCallback((event: Omit<ExecutionEvent, 'id' | 'timestamp'>) => {
    const newEvent: ExecutionEvent = {
      ...event,
      id: `event-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };
    setEvents(prev => [...prev, newEvent]);
  }, []);

  const addNotification = useCallback((
    type: 'info' | 'warning' | 'error' | 'success',
    message: string
  ) => {
    const notification = {
      id: `notif-${Date.now()}`,
      type,
      message,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);

    // Auto-dismiss info and success notifications
    if (type === 'info' || type === 'success') {
      setTimeout(() => {
        setNotifications(prev => 
          prev.map(n => n.id === notification.id ? { ...n, dismissed: true } : n)
        );
      }, 5000);
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, dismissed: true } : n)
    );
  }, []);

  const startSession = useCallback((operator: string) => {
    setSession(prev => ({
      ...prev,
      status: 'in_progress',
      startTime: new Date(),
      operator
    }));
    
    addEvent({
      type: 'step_started',
      stepId: steps[0]?.id,
      message: `Rozpoczęto sesję badania. Operator: ${operator}`,
      operator
    });

    addNotification('success', 'Sesja badania została rozpoczęta');
  }, [steps, addEvent, addNotification]);

  const pauseSession = useCallback(() => {
    setSession(prev => ({
      ...prev,
      status: 'paused'
    }));
    
    addEvent({
      type: 'step_paused',
      stepId: steps[session.currentStepIndex]?.id,
      message: 'Sesja została wstrzymana',
      operator: session.operator
    });

    addNotification('info', 'Sesja została wstrzymana');
  }, [session.currentStepIndex, session.operator, steps, addEvent, addNotification]);

  const resumeSession = useCallback(() => {
    setSession(prev => ({
      ...prev,
      status: 'in_progress'
    }));
    
    addEvent({
      type: 'step_started',
      stepId: steps[session.currentStepIndex]?.id,
      message: 'Sesja została wznowiona',
      operator: session.operator
    });

    addNotification('success', 'Sesja została wznowiona');
  }, [session.currentStepIndex, session.operator, steps, addEvent, addNotification]);

  const completeSession = useCallback(() => {
    setSession(prev => ({
      ...prev,
      status: 'completed',
      endTime: new Date()
    }));
    
    addEvent({
      type: 'step_completed',
      message: 'Sesja badania została zakończona',
      operator: session.operator
    });

    addNotification('success', 'Sesja badania została pomyślnie zakończona');

    if (onSessionComplete) {
      onSessionComplete(session);
    }
  }, [session, onSessionComplete, addEvent, addNotification]);

  const cancelSession = useCallback((reason?: string) => {
    setSession(prev => ({
      ...prev,
      status: 'cancelled',
      endTime: new Date(),
      notes: prev.notes + (reason ? `\nAnulowano: ${reason}` : '\nAnulowano')
    }));
    
    addEvent({
      type: 'error',
      message: `Sesja została anulowana${reason ? `: ${reason}` : ''}`,
      operator: session.operator
    });

    addNotification('error', 'Sesja została anulowana');
  }, [session.operator, addEvent, addNotification]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex < 0 || stepIndex >= steps.length) {
      onError?.('Nieprawidłowy indeks kroku');
      return;
    }

    const currentStep = steps[session.currentStepIndex];
    const newStep = steps[stepIndex];

    // Zakończ aktualny timer
    if (currentStep) {
      setSession(prev => ({
        ...prev,
        stepTimers: prev.stepTimers.map(timer => 
          timer.stepId === currentStep.id 
            ? { ...timer, isRunning: false, endTime: new Date() }
            : timer
        )
      }));
    }

    setSession(prev => ({
      ...prev,
      currentStepIndex: stepIndex
    }));

    addEvent({
      type: 'step_started',
      stepId: newStep.id,
      message: `Przejście do kroku: ${newStep.title}`,
      operator: session.operator
    });
  }, [steps, session.currentStepIndex, session.operator, onError, addEvent]);

  const nextStep = useCallback(() => {
    const nextIndex = session.currentStepIndex + 1;
    if (nextIndex < steps.length) {
      goToStep(nextIndex);
    } else {
      completeSession();
    }
  }, [session.currentStepIndex, steps.length, goToStep, completeSession]);

  const previousStep = useCallback(() => {
    const prevIndex = session.currentStepIndex - 1;
    if (prevIndex >= 0) {
      goToStep(prevIndex);
    }
  }, [session.currentStepIndex, goToStep]);

  const startStepTimer = useCallback((stepId: string) => {
    setSession(prev => ({
      ...prev,
      stepTimers: prev.stepTimers.map(timer => 
        timer.stepId === stepId 
          ? { ...timer, isRunning: true, startTime: new Date(), isPaused: false }
          : timer
      )
    }));
  }, []);

  const pauseStepTimer = useCallback((stepId: string) => {
    setSession(prev => ({
      ...prev,
      stepTimers: prev.stepTimers.map(timer => 
        timer.stepId === stepId 
          ? { ...timer, isPaused: true }
          : timer
      )
    }));
  }, []);

  const completeStep = useCallback((stepId: string, sampleId: string, data: any) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) {
      onError?.('Nie znaleziono kroku');
      return;
    }

    // Zaktualizuj dane próbki
    setSession(prev => ({
      ...prev,
      samples: prev.samples.map(sample => 
        sample.id === sampleId 
          ? {
              ...sample,
              stepResults: [
                ...sample.stepResults,
                {
                  stepId,
                  status: 'completed',
                  startTime: new Date(),
                  endTime: new Date(),
                  data,
                  notes: '',
                  operator: session.operator
                }
              ]
            }
          : sample
      ),
      stepTimers: prev.stepTimers.map(timer => 
        timer.stepId === stepId 
          ? { ...timer, isRunning: false, endTime: new Date() }
          : timer
      )
    }));

    addEvent({
      type: 'step_completed',
      stepId,
      sampleId,
      message: `Zakończono krok: ${step.title}`,
      data,
      operator: session.operator
    });

    if (onStepComplete) {
      onStepComplete(stepId, sampleId, data);
    }

    // Auto-advance if enabled
    if (settings.autoAdvance && !step.requiresApproval) {
      setTimeout(() => nextStep(), 1000);
    }
  }, [steps, session.operator, settings.autoAdvance, onError, onStepComplete, nextStep, addEvent]);

  const collectData = useCallback((stepId: string, sampleId: string, dataPointId: string, value: any) => {
    setSession(prev => ({
      ...prev,
      samples: prev.samples.map(sample => 
        sample.id === sampleId 
          ? {
              ...sample,
              data: {
                ...sample.data,
                [`${stepId}-${dataPointId}`]: value
              }
            }
          : sample
      )
    }));

    addEvent({
      type: 'data_collected',
      stepId,
      sampleId,
      message: `Zebrano dane: ${dataPointId}`,
      data: { dataPointId, value },
      operator: session.operator
    });
  }, [session.operator, addEvent]);

  const addNote = useCallback((note: string, stepId?: string, sampleId?: string) => {
    if (sampleId) {
      setSession(prev => ({
        ...prev,
        samples: prev.samples.map(sample => 
          sample.id === sampleId 
            ? { ...sample, notes: sample.notes + (sample.notes ? '\n' : '') + note }
            : sample
        )
      }));
    } else {
      setSession(prev => ({
        ...prev,
        notes: prev.notes + (prev.notes ? '\n' : '') + note
      }));
    }

    addEvent({
      type: 'note_added',
      stepId,
      sampleId,
      message: `Dodano notatkę: ${note}`,
      operator: session.operator
    });
  }, [session.operator, addEvent]);

  const getNavigationState = useCallback((): NavigationState => {
    const currentStep = steps[session.currentStepIndex];
    const isFirstStep = session.currentStepIndex === 0;
    const isLastStep = session.currentStepIndex === steps.length - 1;
    const canAdvance = currentSample?.status === 'completed' || !settings.requireApproval;

    return {
      canGoBack: !isFirstStep && session.status !== 'completed',
      canGoNext: !isLastStep && canAdvance && session.status === 'in_progress',
      canComplete: isLastStep && canAdvance && session.status === 'in_progress',
      nextStepId: !isLastStep ? steps[session.currentStepIndex + 1]?.id : undefined,
      previousStepId: !isFirstStep ? steps[session.currentStepIndex - 1]?.id : undefined
    };
  }, [steps, session.currentStepIndex, session.status, currentSample?.status, settings.requireApproval]);

  // Auto-save functionality
  useEffect(() => {
    if (settings.autoSave && onSessionUpdate) {
      const interval = setInterval(() => {
        if (session.status === 'in_progress') {
          onSessionUpdate(session);
        }
      }, 30000); // Auto-save every 30 seconds

      return () => clearInterval(interval);
    }
    return undefined;
  }, [settings.autoSave, session, onSessionUpdate]);

  const getCurrentStep = useCallback(() => {
    return steps[session.currentStepIndex];
  }, [steps, session.currentStepIndex]);

  const getStepTimer = useCallback((stepId: string) => {
    return session.stepTimers.find(timer => timer.stepId === stepId);
  }, [session.stepTimers]);

  return {
    // State
    session,
    events,
    notifications: notifications.filter(n => !n.dismissed),
    currentSample,
    
    // Current step info
    currentStep: getCurrentStep(),
    navigationState: getNavigationState(),
    
    // Actions
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    
    // Navigation
    goToStep,
    nextStep,
    previousStep,
    
    // Step management
    startStepTimer,
    pauseStepTimer,
    completeStep,
    
    // Data collection
    collectData,
    addNote,
    
    // Sample management
    setCurrentSample,
    
    // Utilities
    getStepTimer,
    dismissNotification,
    
    // Progress calculation
    progress: session.currentStepIndex / steps.length * 100,
    completedSteps: session.currentStepIndex,
    totalSteps: steps.length
  };
};
