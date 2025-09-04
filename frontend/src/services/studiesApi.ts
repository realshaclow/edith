import axios, { AxiosResponse } from 'axios';

// Konfiguracja axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptory dla obsługi błędów
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response?.status === 401) {
      // Redirect to login if needed
      console.warn('Unauthorized access - redirecting to login');
    }
    
    return Promise.reject(error);
  }
);

// Response types
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}

interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Study Types
export interface StudyDto {
  id: string;
  title: string;
  description?: string;
  protocolId?: string;
  protocolName?: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags: string[];
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  expectedEndDate?: string;
  createdBy: string;
  modifiedBy?: string;
  settings: any;
  dataCollectionSteps: any[];
  studyParameters: any[];
  teamMembers: any[];
  sessionsCount: number;
  completedSessionsCount: number;
  samplesCount: number;
  estimatedDuration?: string;
  actualDuration?: string;
  notes?: string;
  version: number;
  isTemplate: boolean;
  templateId?: string;
}

export interface CreateStudyDto {
  title: string;
  description?: string;
  protocolId: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags?: string[];
  startDate?: string;
  endDate?: string;
  expectedEndDate?: string;
  settings: any;
  dataCollectionSteps: any[];
  studyParameters?: any[];
  notes?: string;
  isTemplate?: boolean;
  templateId?: string;
}

export interface UpdateStudyDto {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tags?: string[];
  startDate?: string;
  endDate?: string;
  expectedEndDate?: string;
  settings?: any;
  dataCollectionSteps?: any[];
  studyParameters?: any[];
  notes?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'ARCHIVED' | 'DELETED';
}

export interface StudyQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  protocolId?: string;
  startDateFrom?: string;
  startDateTo?: string;
  createdBy?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Study Session Types
export interface StudySessionDto {
  id: string;
  studyId: string;
  sessionName: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PAUSED';
  startTime?: string;
  endTime?: string;
  duration?: string;
  operatorId?: string;
  operatorName?: string;
  sampleId?: string;
  sampleName?: string;
  conditions: any;
  data: any[];
  calculations: any;
  qualityCheck: any;
  notes?: string;
  completedSteps: number;
  totalSteps: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudySessionDto {
  sessionName: string;
  operatorId?: string;
  sampleId?: string;
  sampleName?: string;
  conditions?: any;
  notes?: string;
}

export interface UpdateStudySessionDto {
  sessionName?: string;
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PAUSED';
  sampleId?: string;
  sampleName?: string;
  conditions?: any;
  data?: any[];
  calculations?: any;
  qualityCheck?: any;
  notes?: string;
  endTime?: string;
}

// Study Statistics
export interface StudyStatsDto {
  totalStudies: number;
  activeStudies: number;
  completedStudies: number;
  draftStudies: number;
  averageCompletionTime: number;
  totalSessions: number;
  completedSessions: number;
  totalSamples: number;
  processingTime: number;
}

// Studies API
export const studiesApi = {
  // Study CRUD Operations
  getAll: async (params?: StudyQueryParams): Promise<PaginatedResponse<StudyDto>> => {
    console.log('studiesApi.getAll - Starting request with params:', params);
    const response = await api.get<PaginatedResponse<StudyDto>>('/studies', { params });
    console.log('studiesApi.getAll - Response:', response.data);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<StudyDto>> => {
    console.log('studiesApi.getById - Starting request for ID:', id);
    const response = await api.get<ApiResponse<StudyDto>>(`/studies/${id}`);
    console.log('studiesApi.getById - Response:', response.data);
    return response.data;
  },

  create: async (data: CreateStudyDto): Promise<ApiResponse<StudyDto>> => {
    console.log('studiesApi.create - Starting request with data:', data);
    const response = await api.post<ApiResponse<StudyDto>>('/studies', data);
    console.log('studiesApi.create - Response:', response.data);
    return response.data;
  },

  update: async (id: string, data: UpdateStudyDto): Promise<ApiResponse<StudyDto>> => {
    console.log('studiesApi.update - Starting request for ID:', id, 'with data:', data);
    const response = await api.put<ApiResponse<StudyDto>>(`/studies/${id}`, data);
    console.log('studiesApi.update - Response:', response.data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    console.log('studiesApi.delete - Starting request for ID:', id);
    const response = await api.delete<ApiResponse>(`/studies/${id}`);
    console.log('studiesApi.delete - Response:', response.data);
    return response.data;
  },

  // Study Session Operations
  createSession: async (studyId: string, data: CreateStudySessionDto): Promise<ApiResponse<StudySessionDto>> => {
    console.log('studiesApi.createSession - Starting request for study:', studyId, 'with data:', data);
    const response = await api.post<ApiResponse<StudySessionDto>>(`/studies/${studyId}/sessions`, data);
    console.log('studiesApi.createSession - Response:', response.data);
    return response.data;
  },

  getSessions: async (studyId: string, params?: { page?: number; limit?: number; status?: string; operatorId?: string; sortBy?: string; sortOrder?: 'asc' | 'desc' }): Promise<PaginatedResponse<StudySessionDto>> => {
    console.log('studiesApi.getSessions - Starting request for study:', studyId, 'with params:', params);
    const response = await api.get<PaginatedResponse<StudySessionDto>>(`/studies/${studyId}/sessions`, { params });
    console.log('studiesApi.getSessions - Response:', response.data);
    return response.data;
  },

  getSession: async (sessionId: string): Promise<ApiResponse<StudySessionDto>> => {
    console.log('studiesApi.getSession - Starting request for session:', sessionId);
    const response = await api.get<ApiResponse<StudySessionDto>>(`/studies/sessions/${sessionId}`);
    console.log('studiesApi.getSession - Response:', response.data);
    return response.data;
  },

  updateSession: async (sessionId: string, data: UpdateStudySessionDto): Promise<ApiResponse<StudySessionDto>> => {
    console.log('studiesApi.updateSession - Starting request for session:', sessionId, 'with data:', data);
    const response = await api.put<ApiResponse<StudySessionDto>>(`/studies/sessions/${sessionId}`, data);
    console.log('studiesApi.updateSession - Response:', response.data);
    return response.data;
  },

  deleteSession: async (sessionId: string): Promise<ApiResponse> => {
    console.log('studiesApi.deleteSession - Starting request for session:', sessionId);
    const response = await api.delete<ApiResponse>(`/studies/sessions/${sessionId}`);
    console.log('studiesApi.deleteSession - Response:', response.data);
    return response.data;
  },

  // Statistics
  getStats: async (): Promise<ApiResponse<StudyStatsDto>> => {
    console.log('studiesApi.getStats - Starting request');
    const response = await api.get<ApiResponse<StudyStatsDto>>('/studies/stats');
    console.log('studiesApi.getStats - Response:', response.data);
    return response.data;
  },

  // Bulk Operations
  bulkDelete: async (studyIds: string[]): Promise<ApiResponse> => {
    console.log('studiesApi.bulkDelete - Starting request for IDs:', studyIds);
    const response = await api.delete<ApiResponse>('/studies/bulk/delete', { data: { studyIds } });
    console.log('studiesApi.bulkDelete - Response:', response.data);
    return response.data;
  },

  // Export
  exportData: async (studyId: string, format: 'json' | 'csv' = 'json'): Promise<any> => {
    console.log('studiesApi.exportData - Starting request for study:', studyId, 'format:', format);
    const response = await api.get(`/studies/${studyId}/export`, { 
      params: { format },
      responseType: format === 'csv' ? 'blob' : 'json'
    });
    console.log('studiesApi.exportData - Response received');
    return response.data;
  }
};

export default api;
