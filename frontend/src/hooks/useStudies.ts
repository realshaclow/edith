import { useState, useCallback } from 'react';
import { studiesApi } from '../services/api';
import { ApiResponse, Study, StudyStatus, StudySession, StudyResult } from '../types';

// Dla pozostałych endpoint'ów które nie są w studiesApi, importujemy api
import api from '../services/api';

export interface CreateStudyRequest {
  name: string;
  description?: string;
  protocolId: string;
  category?: string;
  settings?: Record<string, any>;
  parameters?: Record<string, any>;
}

export interface UpdateStudyRequest {
  name?: string;
  description?: string;
  status?: StudyStatus;
  category?: string;
  settings?: Record<string, any>;
  parameters?: Record<string, any>;
}

export interface CreateStudySessionRequest {
  studyId: string;
  sampleId?: string;
  operator?: string;
  equipment?: string;
  data: Record<string, number>;
  conditions?: Record<string, any>;
  notes?: string;
}

export interface UpdateStudySessionRequest {
  sampleId?: string;
  operator?: string;
  equipment?: string;
  data?: Record<string, number>;
  conditions?: Record<string, any>;
  notes?: string;
  endTime?: Date;
}

export interface UseStudiesReturn {
  studies: Study[];
  study: Study | null;
  sessions: StudySession[];
  session: StudySession | null;
  results: StudyResult[];
  isLoading: boolean;
  error: string | null;
  fetchStudies: () => Promise<void>;
  fetchStudy: (id: string) => Promise<void>;
  createStudy: (study: CreateStudyRequest) => Promise<Study | null>;
  updateStudy: (id: string, updates: UpdateStudyRequest) => Promise<Study | null>;
  updateStudyStatus: (id: string, status: StudyStatus) => Promise<Study | null>;
  deleteStudy: (id: string) => Promise<boolean>;
  fetchStudySessions: (studyId: string) => Promise<void>;
  fetchStudySession: (sessionId: string) => Promise<void>;
  createStudySession: (session: CreateStudySessionRequest) => Promise<StudySession | null>;
  updateStudySession: (sessionId: string, updates: UpdateStudySessionRequest) => Promise<StudySession | null>;
  deleteStudySession: (sessionId: string) => Promise<boolean>;
  fetchStudyResults: (studyId: string) => Promise<void>;
  clearError: () => void;
}

export const useStudies = (): UseStudiesReturn => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [study, setStudy] = useState<Study | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [session, setSession] = useState<StudySession | null>(null);
  const [results, setResults] = useState<StudyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Studies API calls
  const fetchStudies = useCallback(async () => {
    console.log('fetchStudies - Starting...');
    setIsLoading(true);
    setError(null);
    try {
      console.log('fetchStudies - Calling API...');
      const response = await studiesApi.getAll();
      console.log('fetchStudies - API response:', response);
      if (response.success && response.data) {
        setStudies(response.data);
        console.log('fetchStudies - Studies set:', response.data);
      } else {
        setError(response.error || 'Błąd podczas pobierania badań');
        console.error('fetchStudies - API error:', response.error);
      }
    } catch (err) {
      console.error('fetchStudies - Network error:', err);
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsLoading(false);
      console.log('fetchStudies - Finished');
    }
  }, []);

  const fetchStudy = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await studiesApi.getById(id);
      if (response.success && response.data) {
        setStudy(response.data);
      } else {
        setError(response.error || 'Błąd podczas pobierania badania');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStudy = useCallback(async (studyData: CreateStudyRequest): Promise<Study | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await studiesApi.create(studyData);
      if (response.success && response.data) {
        setStudies(prev => [...prev, response.data!]);
        return response.data;
      } else {
        setError(response.error || 'Błąd podczas tworzenia badania');
        return null;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStudy = useCallback(async (id: string, updates: UpdateStudyRequest): Promise<Study | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Study> = await api.put(`/studies/${id}`, updates);
      if (response.success && response.data) {
        setStudies(prev => prev.map(s => s.id === id ? response.data! : s));
        if (study?.id === id) {
          setStudy(response.data);
        }
        return response.data;
      } else {
        setError(response.error || 'Błąd podczas aktualizacji badania');
        return null;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [study]);

  const updateStudyStatus = useCallback(async (id: string, status: StudyStatus): Promise<Study | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Study> = await api.patch(`/studies/${id}/status`, { status });
      if (response.success && response.data) {
        setStudies(prev => prev.map(s => s.id === id ? response.data! : s));
        if (study?.id === id) {
          setStudy(response.data);
        }
        return response.data;
      } else {
        setError(response.error || 'Błąd podczas zmiany statusu badania');
        return null;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [study]);

  const deleteStudy = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse = await api.delete(`/studies/${id}`);
      if (response.success) {
        setStudies(prev => prev.filter(s => s.id !== id));
        if (study?.id === id) {
          setStudy(null);
        }
        return true;
      } else {
        setError(response.error || 'Błąd podczas usuwania badania');
        return false;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [study]);

  // Study Sessions API calls
  const fetchStudySessions = useCallback(async (studyId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<StudySession[]> = await api.get(`/studies/${studyId}/sessions`);
      if (response.success && response.data) {
        setSessions(response.data);
      } else {
        setError(response.error || 'Błąd podczas pobierania sesji badania');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchStudySession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<StudySession> = await api.get(`/studies/sessions/${sessionId}`);
      if (response.success && response.data) {
        setSession(response.data);
      } else {
        setError(response.error || 'Błąd podczas pobierania sesji');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createStudySession = useCallback(async (sessionData: CreateStudySessionRequest): Promise<StudySession | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<StudySession> = await api.post('/studies/sessions', sessionData);
      if (response.success && response.data) {
        setSessions(prev => [...prev, response.data!]);
        return response.data;
      } else {
        setError(response.error || 'Błąd podczas tworzenia sesji badania');
        return null;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateStudySession = useCallback(async (sessionId: string, updates: UpdateStudySessionRequest): Promise<StudySession | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<StudySession> = await api.put(`/studies/sessions/${sessionId}`, updates);
      if (response.success && response.data) {
        setSessions(prev => prev.map(s => s.id === sessionId ? response.data! : s));
        if (session?.id === sessionId) {
          setSession(response.data);
        }
        return response.data;
      } else {
        setError(response.error || 'Błąd podczas aktualizacji sesji');
        return null;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const deleteStudySession = useCallback(async (sessionId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse = await api.delete(`/studies/sessions/${sessionId}`);
      if (response.success) {
        setSessions(prev => prev.filter(s => s.id !== sessionId));
        if (session?.id === sessionId) {
          setSession(null);
        }
        return true;
      } else {
        setError(response.error || 'Błąd podczas usuwania sesji');
        return false;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  const fetchStudyResults = useCallback(async (studyId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<StudyResult[]> = await api.get(`/studies/${studyId}/results`);
      if (response.success && response.data) {
        setResults(response.data);
      } else {
        setError(response.error || 'Błąd podczas pobierania wyników badania');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    studies,
    study,
    sessions,
    session,
    results,
    isLoading,
    error,
    fetchStudies,
    fetchStudy,
    createStudy,
    updateStudy,
    updateStudyStatus,
    deleteStudy,
    fetchStudySessions,
    fetchStudySession,
    createStudySession,
    updateStudySession,
    deleteStudySession,
    fetchStudyResults,
    clearError
  };
};
