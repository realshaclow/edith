import { useState, useCallback, useEffect } from 'react';
import { 
  StudyExecution as NewStudyExecution, 
  StudyExecutionSample,
  ExecutionStatus,
  SampleStatus
} from '../../../types';
import { StudyExecution as OldStudyExecution, StudySample } from '../types/professional';
import { useStudyExecution } from './useStudyExecution';

// Adapter hook który zapewnia kompatybilność ze starym API
export const useProfessionalStudyExecution = (studyId?: string) => {
  const {
    execution,
    isLoading,
    error,
    startTime,
    isPaused,
    getElapsedTime,
    getSampleProgress: originalGetSampleProgress,
    getOverallProgress,
    loadExecution,
    createExecution,
    startExecution: originalStartExecution,
    pauseExecution: originalPauseExecution,
    resumeExecution: originalResumeExecution,
    completeExecution: originalCompleteExecution,
    startSample: originalStartSample,
    completeSample: originalCompleteSample,
    skipSample: originalSkipSample,
    addMeasurement,
    createExport,
    clearError
  } = useStudyExecution(studyId);

  // State dla kompatybilności z starym interfejsem
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Transformacja nowego typu na stary dla kompatybilności
  const transformedExecution = execution ? {
    ...execution,
    currentSessionIndex: 0,
    currentStepIndex: execution.currentStep || 0,
    currentSampleIndex,
    sessions: [], // Mock sessions
    steps: Array.from({ length: 10 }, (_, index) => ({
      id: `step-${index}`,
      title: `Krok ${index + 1}`,
      description: `Krok ${index + 1}`,
      instructions: [],
      measurements: [],
      isCompleted: false,
      estimatedDuration: '30min'
    })), // Mock steps
    stepMeasurements: [],
    testConditions: [],
    operator: {
      id: execution.operatorId,
      name: 'Operator',
      position: 'Technician'
    },
    samples: execution.samples.map(sample => ({
      id: sample.id,
      name: sample.name,
      description: sample.description,
      material: sample.material,
      dimensions: '',
      weight: 0,
      status: sample.status as any,
      measurements: [], // Mock measurements
      completedSteps: [], // Mock completed steps
      notes: sample.notes,
      startedAt: sample.startedAt,
      completedAt: sample.completedAt,
      operator: execution.operatorId
    })),
    results: {
      overallStatus: 'PENDING' as const,
      summary: execution.summary || '',
      attachments: [],
      passedSamples: 0,
      failedSamples: 0,
      completionPercentage: execution.progress || 0
    },
    settings: {
      allowMultipleSessions: false,
      maxSamplesPerSession: 10,
      sessionTimeout: 300,
      autoProgressSteps: true
    }
  } as OldStudyExecution : null;

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load execution when studyId changes
  useEffect(() => {
    if (studyId) {
      loadExecution(studyId);
    }
  }, [studyId, loadExecution]);

  // Helper functions dla kompatybilności
  const formatElapsedTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const isExecutionActive = useCallback(() => {
    return execution?.status === ExecutionStatus.IN_PROGRESS && !isPaused;
  }, [execution?.status, isPaused]);

  // Sample navigation
  const goToSample = useCallback((sampleIndex: number) => {
    if (execution && sampleIndex >= 0 && sampleIndex < execution.samples.length) {
      setCurrentSampleIndex(sampleIndex);
      setCurrentStepIndex(0); // Reset to first step when changing sample
    }
  }, [execution]);

  // Step navigation (simplified - assuming we have steps)
  const goToStep = useCallback((stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  }, []);

  const goToStepForCurrentSample = useCallback((stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  }, []);

  const goToNextStepForCurrentSample = useCallback(() => {
    // This would need to be implemented based on protocol steps
    setCurrentStepIndex(prev => prev + 1);
  }, []);

  const goToPreviousStepForCurrentSample = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  // Session management (simplified)
  const startSession = useCallback(async (sessionIndex: number) => {
    // For now, just start the execution
    return originalStartExecution();
  }, [originalStartExecution]);

  const completeSession = useCallback(async (sessionIndex: number) => {
    // For now, just complete the execution
    return originalCompleteExecution();
  }, [originalCompleteExecution]);

  // Measurement updates (simplified)
  const updateMeasurement = useCallback(async (
    sampleId: string,
    stepId: string,
    measurementId: string,
    value: any,
    notes?: string
  ) => {
    return addMeasurement({
      sampleId,
      stepId,
      measurementId,
      value: typeof value === 'number' ? value : undefined,
      textValue: typeof value === 'string' ? value : undefined,
      operator: 'current-user', // This should come from auth context
      notes
    });
  }, [addMeasurement]);

  // Environment and test conditions (stub implementations)
  const updateTestCondition = useCallback(async (name: string, value: string) => {
    // This would need backend support for updating test conditions
    console.log('updateTestCondition:', name, value);
  }, []);

  const updateEnvironment = useCallback(async (environment: any) => {
    // This would need backend support for updating environment
    console.log('updateEnvironment:', environment);
  }, []);

  // Notes management
  const addNote = useCallback(async (note: string) => {
    // This could be implemented as a special measurement or separate endpoint
    console.log('addNote:', note);
  }, []);

  // Step completion
  const completeCurrentStep = useCallback(async () => {
    // This would mark current step as completed
    console.log('completeCurrentStep for step:', currentStepIndex);
  }, [currentStepIndex]);

  const completeStepForSample = useCallback(async (sampleId: string, stepId: string) => {
    // Mark step as completed for specific sample
    console.log('completeStepForSample:', sampleId, stepId);
  }, []);

  const uncompleteStepForSample = useCallback(async (sampleId: string, stepId: string) => {
    // Mark step as not completed for specific sample
    console.log('uncompleteStepForSample:', sampleId, stepId);
  }, []);

  // Sample step tracking
  const getSampleCurrentStep = useCallback((sample: StudySample) => {
    // Return current step index for sample (simplified)
    return currentStepIndex;
  }, [currentStepIndex]);

  const getSampleProgress = useCallback((sample: StudySample) => {
    // Return progress for old type sample (mock)
    return sample.status === 'COMPLETED' ? 100 : sample.status === 'IN_PROGRESS' ? 50 : 0;
  }, []);

  // Correction handling
  const addCorrectionNote = useCallback(async (note: string) => {
    console.log('addCorrectionNote:', note);
  }, []);

  const goToStepForCorrection = useCallback((stepIndex: number) => {
    setCurrentStepIndex(stepIndex);
  }, []);

  // Wrapper functions to maintain compatibility
  const startExecution = useCallback(() => {
    return originalStartExecution();
  }, [originalStartExecution]);

  const pauseExecution = useCallback((notes?: string) => {
    return originalPauseExecution(notes);
  }, [originalPauseExecution]);

  const resumeExecution = useCallback(() => {
    return originalResumeExecution();
  }, [originalResumeExecution]);

  const completeExecution = useCallback((summary?: string, recommendations?: string) => {
    return originalCompleteExecution(summary, recommendations);
  }, [originalCompleteExecution]);

  const completeSample = useCallback((sampleId: string, quality: 'pass' | 'fail' | 'warning', notes?: string) => {
    return originalCompleteSample(sampleId, quality, notes);
  }, [originalCompleteSample]);

  const skipSample = useCallback((sampleId: string, reason: string) => {
    return originalSkipSample(sampleId, reason);
  }, [originalSkipSample]);

  // Edit measurement in step (simplified)
  const editMeasurementInStep = useCallback(async (
    stepId: string,
    measurementId: string,
    value: any
  ) => {
    // This would need to update existing measurement
    console.log('editMeasurementInStep:', stepId, measurementId, value);
  }, []);

  return {
    // State
    execution: transformedExecution,
    isLoading,
    error,
    
    // Timer
    startTime,
    currentTime,
    isPaused,
    getElapsedTime,
    formatElapsedTime: (seconds?: number) => formatElapsedTime(seconds || getElapsedTime()),
    isExecutionActive,
    
    // Navigation
    currentSampleIndex,
    currentStepIndex,
    goToSample,
    goToStep,
    goToStepForCurrentSample,
    goToNextStepForCurrentSample,
    goToPreviousStepForCurrentSample,
    
    // Execution control
    startExecution,
    pauseExecution,
    resumeExecution,
    completeExecution,
    
    // Session management
    startSession,
    completeSession,
    
    // Sample management
    completeSample,
    skipSample,
    getSampleCurrentStep,
    getSampleProgress,
    
    // Step management
    completeCurrentStep,
    completeStepForSample,
    uncompleteStepForSample,
    
    // Measurements
    updateMeasurement,
    editMeasurementInStep,
    
    // Environment
    updateTestCondition,
    updateEnvironment,
    
    // Notes
    addNote,
    addCorrectionNote,
    
    // Corrections
    goToStepForCorrection,
    
    // Utilities
    clearError
  };
};
