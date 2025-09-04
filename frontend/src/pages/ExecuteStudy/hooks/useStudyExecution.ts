import { useState, useCallback, useEffect } from 'react';
import { 
  StudyExecution, 
  StudyExecutionSample,
  StudyMeasurement,
  ExecutionStatus,
  SampleStatus,
  ExportFormat,
  ExportType,
  EnvironmentConditions,
  TestConditions,
  ApiResponse
} from '../../../types';
import { studyExecutionApi } from '../../../services/api';
import { studiesApi } from '../../../services/studiesApi';

export const useStudyExecution = (executionId?: string) => {
  const [execution, setExecution] = useState<StudyExecution | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Timer states
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Timer effect
  useEffect(() => {
    if (!execution || execution.status !== ExecutionStatus.IN_PROGRESS || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [execution?.status, isPaused]);

  // Load execution by study ID, create if doesn't exist
  const loadExecution = useCallback(async (studyId: string) => {
    if (!studyId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First try to get existing executions for this study
      const executionsResponse = await studyExecutionApi.getAll({ studyId });
      
      if (executionsResponse.success && executionsResponse.data && executionsResponse.data.length > 0) {
        // Use existing execution
        const existingExecution = executionsResponse.data[0];
        setExecution(existingExecution);
        
        // Set timer states based on execution
        if (existingExecution.startedAt) {
          setStartTime(new Date(existingExecution.startedAt));
        }
        if (existingExecution.status === ExecutionStatus.PAUSED) {
          setIsPaused(true);
        }
      } else {
        // No execution exists, need to create one
        // First get the study details
        const studyResponse = await studiesApi.getById(studyId);
        if (studyResponse.success && studyResponse.data) {
          const study = studyResponse.data;
          
          // Create new execution based on study
          const executionData = {
            studyId: study.id,
            studyName: study.title || 'Unnamed Study',
            protocolId: study.protocolId,
            protocolName: study.protocolName || 'Default Protocol',
            category: 'General', // Default category since StudyDto doesn't have category
            operatorId: 'current-user-id', // TODO: Get from auth context
            environment: {
              temperature: 25,
              humidity: 50,
              pressure: 1013,
              notes: 'Standard laboratory conditions'
            },
            samples: [
              {
                name: 'Sample 1',
                description: 'Default sample for execution',
                material: 'Test Material',
                notes: 'Created automatically'
              }
            ],
            estimatedDuration: '60min',
            notes: `Execution created for study: ${study.title}`,
            tags: ['auto-created']
          };
          
          const createResponse = await studyExecutionApi.create(executionData);
          if (createResponse.success && createResponse.data) {
            setExecution(createResponse.data);
          } else {
            throw new Error(createResponse.error || 'Failed to create execution');
          }
        } else {
          throw new Error('Study not found');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load execution');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load execution by execution ID (original function)
  const loadExecutionById = useCallback(async (id: string) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await studyExecutionApi.getById(id);
      if (response.success && response.data) {
        setExecution(response.data);
        
        // Set timer states based on execution
        if (response.data.startedAt) {
          setStartTime(new Date(response.data.startedAt));
        }
        if (response.data.status === ExecutionStatus.PAUSED) {
          setIsPaused(true);
        }
      } else {
        setError(response.error || 'Failed to load execution');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load execution');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create execution
  const createExecution = useCallback(async (data: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await studyExecutionApi.create(data);
      if (response.success && response.data) {
        setExecution(response.data);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create execution');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create execution';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start execution
  const startExecution = useCallback(async () => {
    if (!execution?.id) return;
    
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.start(execution.id);
      if (response.success && response.data) {
        setExecution(response.data);
        setStartTime(new Date());
        setIsPaused(false);
        setPausedTime(0);
      } else {
        throw new Error(response.error || 'Failed to start execution');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start execution');
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id]);

  // Pause execution
  const pauseExecution = useCallback(async (notes?: string) => {
    if (!execution?.id) return;
    
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.pause(execution.id, notes);
      if (response.success && response.data) {
        setExecution(response.data);
        setIsPaused(true);
      } else {
        throw new Error(response.error || 'Failed to pause execution');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause execution');
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id]);

  // Resume execution
  const resumeExecution = useCallback(async () => {
    if (!execution?.id) return;
    
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.resume(execution.id);
      if (response.success && response.data) {
        setExecution(response.data);
        setIsPaused(false);
      } else {
        throw new Error(response.error || 'Failed to resume execution');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume execution');
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id]);

  // Complete execution
  const completeExecution = useCallback(async (summary?: string, recommendations?: string) => {
    if (!execution?.id) return;
    
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.complete(execution.id, summary, recommendations);
      if (response.success && response.data) {
        setExecution(response.data);
      } else {
        throw new Error(response.error || 'Failed to complete execution');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete execution');
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id]);

  // Start sample
  const startSample = useCallback(async (sampleId: string, operatorId: string) => {
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.startSample(sampleId, operatorId);
      if (response.success) {
        // Reload execution to get updated sample status
        if (execution?.id) {
          await loadExecution(execution.id);
        }
      } else {
        throw new Error(response.error || 'Failed to start sample');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start sample');
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id, loadExecution]);

  // Complete sample
  const completeSample = useCallback(async (sampleId: string, quality: 'pass' | 'fail' | 'warning', notes?: string) => {
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.completeSample(sampleId, quality, notes);
      if (response.success) {
        // Reload execution to get updated sample status
        if (execution?.id) {
          await loadExecution(execution.id);
        }
      } else {
        throw new Error(response.error || 'Failed to complete sample');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete sample');
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id, loadExecution]);

  // Skip sample
  const skipSample = useCallback(async (sampleId: string, reason: string) => {
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.skipSample(sampleId, reason);
      if (response.success) {
        // Reload execution to get updated sample status
        if (execution?.id) {
          await loadExecution(execution.id);
        }
      } else {
        throw new Error(response.error || 'Failed to skip sample');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip sample');
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id, loadExecution]);

  // Add measurement
  const addMeasurement = useCallback(async (measurementData: {
    sampleId: string;
    stepId: string;
    measurementId: string;
    value?: number;
    textValue?: string;
    unit?: string;
    operator: string;
    equipment?: string;
    method?: string;
    conditions?: Record<string, any>;
    notes?: string;
    rawData?: Record<string, any>;
  }) => {
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.addMeasurement(measurementData);
      if (response.success) {
        // Reload execution to get updated measurements
        if (execution?.id) {
          await loadExecution(execution.id);
        }
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to add measurement');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add measurement');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id, loadExecution]);

  // Create export
  const createExport = useCallback(async (exportData: {
    format: ExportFormat;
    type: ExportType;
    includeCharts?: boolean;
    includeSamples?: boolean;
    includeRawData?: boolean;
    template?: string;
    requestedById: string;
  }) => {
    if (!execution?.id) return;
    
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.createExport(execution.id, exportData);
      if (response.success) {
        // Reload execution to get updated exports
        await loadExecution(execution.id);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create export');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create export');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id, loadExecution]);

  // Save to EDITH system
  const saveToEdithSystem = useCallback(async () => {
    if (!execution?.id) return;
    
    setIsLoading(true);
    try {
      const response = await studyExecutionApi.saveToEdith(execution.id);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to save to EDITH system');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save to EDITH system');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [execution?.id]);

  // Calculate elapsed time
  const getElapsedTime = useCallback(() => {
    if (!startTime) return 0;
    
    const now = isPaused && execution?.pausedAt 
      ? new Date(execution.pausedAt) 
      : currentTime;
    
    return Math.floor((now.getTime() - startTime.getTime() - pausedTime) / 1000);
  }, [startTime, currentTime, pausedTime, isPaused, execution?.pausedAt]);

  // Get sample progress
  const getSampleProgress = useCallback((sample: StudyExecutionSample) => {
    if (!execution) return 0;
    
    // Calculate based on measurements vs expected measurements
    const sampleMeasurements = execution.measurements.filter(m => m.sampleId === sample.id);
    // This would need to be based on protocol requirements
    // For now, return simple status-based progress
    switch (sample.status) {
      case SampleStatus.PENDING:
        return 0;
      case SampleStatus.IN_PROGRESS:
        return 50;
      case SampleStatus.COMPLETED:
        return 100;
      case SampleStatus.FAILED:
      case SampleStatus.SKIPPED:
        return 100;
      default:
        return 0;
    }
  }, [execution]);

  // Get overall progress
  const getOverallProgress = useCallback(() => {
    if (!execution || execution.samples.length === 0) return 0;
    
    const totalProgress = execution.samples.reduce((sum, sample) => {
      return sum + getSampleProgress(sample);
    }, 0);
    
    return Math.round(totalProgress / execution.samples.length);
  }, [execution, getSampleProgress]);

  // Load execution on mount if ID provided
  useEffect(() => {
    if (executionId) {
      loadExecution(executionId);
    }
  }, [executionId, loadExecution]);

  return {
    // State
    execution,
    isLoading,
    error,
    
    // Timer
    startTime,
    isPaused,
    getElapsedTime,
    
    // Progress
    getSampleProgress,
    getOverallProgress,
    
    // Actions
    loadExecution,
    loadExecutionById,
    createExecution,
    startExecution,
    pauseExecution,
    resumeExecution,
    completeExecution,
    
    // Sample actions
    startSample,
    completeSample,
    skipSample,
    
    // Measurement actions
    addMeasurement,
    
    // Export actions
    createExport,
    saveToEdithSystem,
    
    // Utilities
    clearError: () => setError(null)
  };
};
