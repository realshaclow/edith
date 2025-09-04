import { useState, useCallback } from 'react';
import { studiesApi, StudyDto, CreateStudyDto, UpdateStudyDto, StudyQueryParams, StudySessionDto, CreateStudySessionDto, UpdateStudySessionDto, StudyStatsDto } from '../services/studiesApi';

export interface UseStudiesReturn {
  studies: StudyDto[];
  study: StudyDto | null;
  sessions: StudySessionDto[];
  session: StudySessionDto | null;
  stats: StudyStatsDto | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading for backward compatibility
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;

  // Study operations
  fetchStudies: (params?: StudyQueryParams) => Promise<void>;
  fetchStudy: (id: string) => Promise<void>;
  createStudy: (data: CreateStudyDto) => Promise<StudyDto | null>;
  updateStudy: (id: string, data: UpdateStudyDto) => Promise<StudyDto | null>;
  deleteStudy: (id: string) => Promise<boolean>;
  clearStudy: () => void;

  // Session operations
  fetchSessions: (studyId: string, params?: { page?: number; limit?: number; status?: string; operatorId?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => Promise<void>;
  fetchSession: (sessionId: string) => Promise<void>;
  createSession: (studyId: string, data: CreateStudySessionDto) => Promise<StudySessionDto | null>;
  updateSession: (sessionId: string, data: UpdateStudySessionDto) => Promise<StudySessionDto | null>;
  deleteSession: (sessionId: string) => Promise<boolean>;
  clearSession: () => void;

  // Statistics
  fetchStats: () => Promise<void>;

  // Bulk operations
  bulkDeleteStudies: (studyIds: string[]) => Promise<boolean>;

  // Export
  exportStudyData: (studyId: string, format?: 'json' | 'csv') => Promise<any>;

  // Backward compatibility methods
  updateStudyStatus: (id: string, status: string) => Promise<StudyDto | null>;
}

export const useStudies = (): UseStudiesReturn => {
  const [studies, setStudies] = useState<StudyDto[]>([]);
  const [study, setStudy] = useState<StudyDto | null>(null);
  const [sessions, setSessions] = useState<StudySessionDto[]>([]);
  const [session, setSession] = useState<StudySessionDto | null>(null);
  const [stats, setStats] = useState<StudyStatsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  // Helper function to handle errors
  const handleError = useCallback((error: any, operation: string) => {
    console.error(`Error in ${operation}:`, error);
    const message = error?.response?.data?.error || error?.message || `Failed to ${operation}`;
    setError(message);
  }, []);

  // Study operations
  const fetchStudies = useCallback(async (params?: StudyQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.getAll(params);
      
      if (response.success && response.data) {
        setStudies(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error(response.error || 'Failed to fetch studies');
      }
    } catch (error) {
      handleError(error, 'fetch studies');
      setStudies([]);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchStudy = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.getById(id);
      
      if (response.success && response.data) {
        setStudy(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch study');
      }
    } catch (error) {
      handleError(error, 'fetch study');
      setStudy(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createStudy = useCallback(async (data: CreateStudyDto): Promise<StudyDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.create(data);
      
      if (response.success && response.data) {
        // Add to studies list if we have one
        setStudies(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create study');
      }
    } catch (error) {
      handleError(error, 'create study');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateStudy = useCallback(async (id: string, data: UpdateStudyDto): Promise<StudyDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.update(id, data);
      
      if (response.success && response.data) {
        // Update in studies list
        setStudies(prev => prev.map(study => 
          study.id === id ? response.data! : study
        ));
        
        // Update current study if it's the same one
        if (study?.id === id) {
          setStudy(response.data);
        }
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update study');
      }
    } catch (error) {
      handleError(error, 'update study');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, study?.id]);

  const deleteStudy = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.delete(id);
      
      if (response.success) {
        // Remove from studies list
        setStudies(prev => prev.filter(study => study.id !== id));
        
        // Clear current study if it's the same one
        if (study?.id === id) {
          setStudy(null);
        }
        
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete study');
      }
    } catch (error) {
      handleError(error, 'delete study');
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError, study?.id]);

  const clearStudy = useCallback(() => {
    setStudy(null);
  }, []);

  // Session operations
  const fetchSessions = useCallback(async (studyId: string, params?: { page?: number; limit?: number; status?: string; operatorId?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.getSessions(studyId, params);
      
      if (response.success && response.data) {
        setSessions(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error(response.error || 'Failed to fetch sessions');
      }
    } catch (error) {
      handleError(error, 'fetch sessions');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchSession = useCallback(async (sessionId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.getSession(sessionId);
      
      if (response.success && response.data) {
        setSession(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch session');
      }
    } catch (error) {
      handleError(error, 'fetch session');
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createSession = useCallback(async (studyId: string, data: CreateStudySessionDto): Promise<StudySessionDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.createSession(studyId, data);
      
      if (response.success && response.data) {
        // Add to sessions list if we have one
        setSessions(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create session');
      }
    } catch (error) {
      handleError(error, 'create session');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateSession = useCallback(async (sessionId: string, data: UpdateStudySessionDto): Promise<StudySessionDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.updateSession(sessionId, data);
      
      if (response.success && response.data) {
        // Update in sessions list
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? response.data! : session
        ));
        
        // Update current session if it's the same one
        if (session?.id === sessionId) {
          setSession(response.data);
        }
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update session');
      }
    } catch (error) {
      handleError(error, 'update session');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, session?.id]);

  const deleteSession = useCallback(async (sessionId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.deleteSession(sessionId);
      
      if (response.success) {
        // Remove from sessions list
        setSessions(prev => prev.filter(session => session.id !== sessionId));
        
        // Clear current session if it's the same one
        if (session?.id === sessionId) {
          setSession(null);
        }
        
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete session');
      }
    } catch (error) {
      handleError(error, 'delete session');
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError, session?.id]);

  const clearSession = useCallback(() => {
    setSession(null);
  }, []);

  // Statistics
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.getStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch stats');
      }
    } catch (error) {
      handleError(error, 'fetch stats');
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Bulk operations
  const bulkDeleteStudies = useCallback(async (studyIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studiesApi.bulkDelete(studyIds);
      
      if (response.success) {
        // Remove from studies list
        setStudies(prev => prev.filter(study => !studyIds.includes(study.id)));
        
        // Clear current study if it's one of the deleted ones
        if (study && studyIds.includes(study.id)) {
          setStudy(null);
        }
        
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete studies');
      }
    } catch (error) {
      handleError(error, 'bulk delete studies');
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError, study]);

  // Export
  const exportStudyData = useCallback(async (studyId: string, format: 'json' | 'csv' = 'json'): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await studiesApi.exportData(studyId, format);
      return data;
    } catch (error) {
      handleError(error, 'export study data');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Backward compatibility method for updateStudyStatus
  const updateStudyStatus = useCallback(async (id: string, status: string): Promise<StudyDto | null> => {
    const statusMapping: Record<string, any> = {
      'DRAFT': 'DRAFT',
      'ACTIVE': 'ACTIVE', 
      'COMPLETED': 'COMPLETED',
      'PAUSED': 'PAUSED',
      'ARCHIVED': 'ARCHIVED'
    };
    
    const mappedStatus = statusMapping[status] || status;
    return updateStudy(id, { status: mappedStatus });
  }, [updateStudy]);

  return {
    studies,
    study,
    sessions,
    session,
    stats,
    loading,
    isLoading: loading, // Alias for backward compatibility
    error,
    pagination,
    fetchStudies,
    fetchStudy,
    createStudy,
    updateStudy,
    deleteStudy,
    clearStudy,
    fetchSessions,
    fetchSession,
    createSession,
    updateSession,
    deleteSession,
    clearSession,
    fetchStats,
    bulkDeleteStudies,
    exportStudyData,
    updateStudyStatus, // Backward compatibility
  };
};

export default useStudies;
