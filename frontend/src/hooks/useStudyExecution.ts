import { useState, useCallback, useEffect } from 'react';
import { studyExecutionApi } from '../services/api';
import {
  StudyExecution,
  CreateStudyExecutionRequest,
  AddMeasurementRequest,
  CreateExportRequest,
  StudyExecutionFilters,
  PaginationOptions,
  ExecutionStatus,
  SampleStatus
} from '../types';

export interface UseStudyExecutionReturn {
  execution: StudyExecution | null;
  loading: boolean;
  error: string | null;
  
  // Lifecycle methods
  startExecution: () => Promise<boolean>;
  pauseExecution: (notes?: string) => Promise<boolean>;
  resumeExecution: () => Promise<boolean>;
  completeExecution: (summary?: string, recommendations?: string) => Promise<boolean>;
  
  // Sample methods
  startSample: (sampleId: string) => Promise<boolean>;
  completeSample: (sampleId: string, quality: 'pass' | 'fail' | 'warning', notes?: string) => Promise<boolean>;
  skipSample: (sampleId: string, reason: string) => Promise<boolean>;
  
  // Measurement methods
  addMeasurement: (measurement: AddMeasurementRequest) => Promise<boolean>;
  
  // Export methods
  createExport: (exportRequest: Omit<CreateExportRequest, 'executionId' | 'requestedById'>) => Promise<boolean>;
  getExports: () => Promise<any[]>;
  
  // Utility methods
  refresh: () => Promise<void>;
  updateProgress: () => Promise<void>;
  saveToEdith: () => Promise<boolean>;
}

export const useStudyExecution = (executionId: string | null): UseStudyExecutionReturn => {
  const [execution, setExecution] = useState<StudyExecution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch execution data
  const fetchExecution = useCallback(async () => {
    if (!executionId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await studyExecutionApi.getById(executionId);
      if (response.success && response.data) {
        setExecution(response.data);
      } else {
        setError(response.error || 'Failed to fetch execution');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [executionId]);

  // Load execution on mount or when ID changes
  useEffect(() => {
    fetchExecution();
  }, [fetchExecution]);

  // Lifecycle methods
  const startExecution = useCallback(async (): Promise<boolean> => {
    if (!executionId) return false;
    
    try {
      setLoading(true);
      const response = await studyExecutionApi.start(executionId);
      if (response.success && response.data) {
        setExecution(response.data);
        return true;
      } else {
        setError(response.error || 'Failed to start execution');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start execution');
      return false;
    } finally {
      setLoading(false);
    }
  }, [executionId]);

  const pauseExecution = useCallback(async (notes?: string): Promise<boolean> => {
    if (!executionId) return false;
    
    try {
      setLoading(true);
      const response = await studyExecutionApi.pause(executionId, notes);
      if (response.success && response.data) {
        setExecution(response.data);
        return true;
      } else {
        setError(response.error || 'Failed to pause execution');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause execution');
      return false;
    } finally {
      setLoading(false);
    }
  }, [executionId]);

  const resumeExecution = useCallback(async (): Promise<boolean> => {
    if (!executionId) return false;
    
    try {
      setLoading(true);
      const response = await studyExecutionApi.resume(executionId);
      if (response.success && response.data) {
        setExecution(response.data);
        return true;
      } else {
        setError(response.error || 'Failed to resume execution');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume execution');
      return false;
    } finally {
      setLoading(false);
    }
  }, [executionId]);

  const completeExecution = useCallback(async (
    summary?: string,
    recommendations?: string
  ): Promise<boolean> => {
    if (!executionId) return false;
    
    try {
      setLoading(true);
      const response = await studyExecutionApi.complete(executionId, summary, recommendations);
      if (response.success && response.data) {
        setExecution(response.data);
        return true;
      } else {
        setError(response.error || 'Failed to complete execution');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete execution');
      return false;
    } finally {
      setLoading(false);
    }
  }, [executionId]);

  // Sample methods
  const startSample = useCallback(async (sampleId: string): Promise<boolean> => {
    if (!execution) return false;
    
    try {
      const response = await studyExecutionApi.startSample(sampleId, execution.operatorId);
      if (response.success) {
        await fetchExecution(); // Refresh data
        return true;
      } else {
        setError(response.error || 'Failed to start sample');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start sample');
      return false;
    }
  }, [execution, fetchExecution]);

  const completeSample = useCallback(async (
    sampleId: string,
    quality: 'pass' | 'fail' | 'warning',
    notes?: string
  ): Promise<boolean> => {
    try {
      const response = await studyExecutionApi.completeSample(sampleId, quality, notes);
      if (response.success) {
        await fetchExecution(); // Refresh data
        return true;
      } else {
        setError(response.error || 'Failed to complete sample');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete sample');
      return false;
    }
  }, [fetchExecution]);

  const skipSample = useCallback(async (sampleId: string, reason: string): Promise<boolean> => {
    try {
      const response = await studyExecutionApi.skipSample(sampleId, reason);
      if (response.success) {
        await fetchExecution(); // Refresh data
        return true;
      } else {
        setError(response.error || 'Failed to skip sample');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to skip sample');
      return false;
    }
  }, [fetchExecution]);

  // Measurement methods
  const addMeasurement = useCallback(async (measurement: AddMeasurementRequest): Promise<boolean> => {
    try {
      const response = await studyExecutionApi.addMeasurement(measurement);
      if (response.success) {
        await fetchExecution(); // Refresh data
        return true;
      } else {
        setError(response.error || 'Failed to add measurement');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add measurement');
      return false;
    }
  }, [fetchExecution]);

  // Export methods
  const createExport = useCallback(async (
    exportRequest: Omit<CreateExportRequest, 'executionId' | 'requestedById'>
  ): Promise<boolean> => {
    if (!executionId || !execution) return false;
    
    try {
      const response = await studyExecutionApi.createExport(executionId, {
        ...exportRequest,
        requestedById: execution.operatorId
      });
      if (response.success) {
        await fetchExecution(); // Refresh data
        return true;
      } else {
        setError(response.error || 'Failed to create export');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create export');
      return false;
    }
  }, [executionId, execution, fetchExecution]);

  const getExports = useCallback(async (): Promise<any[]> => {
    if (!executionId) return [];
    
    try {
      const response = await studyExecutionApi.getExports(executionId);
      if (response.success) {
        return response.data || [];
      } else {
        setError(response.error || 'Failed to fetch exports');
        return [];
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exports');
      return [];
    }
  }, [executionId]);

  // Utility methods
  const refresh = useCallback(async (): Promise<void> => {
    await fetchExecution();
  }, [fetchExecution]);

  const updateProgress = useCallback(async (): Promise<void> => {
    if (!executionId) return;
    
    try {
      const response = await studyExecutionApi.updateProgress(executionId);
      if (response.success && response.data) {
        setExecution(response.data);
      }
    } catch (err) {
      // Silent fail for progress updates
      console.warn('Failed to update progress:', err);
    }
  }, [executionId]);

  const saveToEdith = useCallback(async (): Promise<boolean> => {
    if (!executionId) return false;
    
    try {
      const response = await studyExecutionApi.saveToEdith(executionId);
      if (response.success) {
        return true;
      } else {
        setError(response.error || 'Failed to save to EDITH system');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save to EDITH system');
      return false;
    }
  }, [executionId]);

  return {
    execution,
    loading,
    error,
    
    // Lifecycle methods
    startExecution,
    pauseExecution,
    resumeExecution,
    completeExecution,
    
    // Sample methods
    startSample,
    completeSample,
    skipSample,
    
    // Measurement methods
    addMeasurement,
    
    // Export methods
    createExport,
    getExports,
    
    // Utility methods
    refresh,
    updateProgress,
    saveToEdith,
  };
};
