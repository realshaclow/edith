import axios, { AxiosResponse } from 'axios';
import {
  ApiResponse,
  Study,
  StudyStatus,
  CreateStudyForm,
  UpdateStudyForm,
  StudyExecution,
  CreateStudyExecutionRequest,
  AddMeasurementRequest,
  CreateExportRequest,
  StudyExecutionFilters,
  PaginationOptions
} from '../types';

// Konfiguracja axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

console.log('API BASE URL:', api.defaults.baseURL);

// Interceptory dla obsługi błędów
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    console.error('API Error:', error);
    
    // Możesz dodać tutaj globalne obsługiwanie błędów
    if (error.response?.status === 401) {
      // Redirect to login if needed
    }
    
    return Promise.reject(error);
  }
);

// Studies API
export const studiesApi = {
  // Pobierz wszystkie badania
  getAll: async (): Promise<ApiResponse<Study[]>> => {
    console.log('studiesApi.getAll - Starting request...');
    const response = await api.get<ApiResponse<Study[]>>('/studies');
    console.log('studiesApi.getAll - Response:', response);
    return response.data;
  },

  // Pobierz badanie po ID
  getById: async (id: string): Promise<ApiResponse<Study>> => {
    const response = await api.get<ApiResponse<Study>>(`/studies/${id}`);
    return response.data;
  },

  // Utwórz nowe badanie
  create: async (data: CreateStudyForm): Promise<ApiResponse<Study>> => {
    const response = await api.post<ApiResponse<Study>>('/studies', data);
    return response.data;
  },

  // Aktualizuj badanie
  update: async (id: string, data: UpdateStudyForm): Promise<ApiResponse<Study>> => {
    const response = await api.put<ApiResponse<Study>>(`/studies/${id}`, data);
    return response.data;
  },

  // Zmień status badania
  updateStatus: async (id: string, status: StudyStatus): Promise<ApiResponse<Study>> => {
    const response = await api.patch<ApiResponse<Study>>(`/studies/${id}/status`, { status });
    return response.data;
  },

  // Usuń badanie
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/studies/${id}`);
    return response.data;
  },
};

// Predefined Protocols API
export const predefinedProtocolsApi = {
  // Pobierz wszystkie predefiniowane protokoły
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/protocols/public');
    return response.data;
  },

  // Pobierz protokół po ID
  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`/protocols/${id}`);
    return response.data;
  },

  // Pobierz protokoły według kategorii
  getByCategory: async (category: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`/protocols/category/${category}`);
    return response.data;
  },
};

// Protocols API
export const protocolsApi = {
  // Pobierz wszystkie protokoły
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/protocols');
    return response.data;
  },

  // Pobierz protokół po ID
  getById: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`/protocols/${id}`);
    return response.data;
  },

  // Utwórz nowy protokół
  create: async (data: any): Promise<ApiResponse<any>> => {
    console.log('🚀 protocolsApi.create - Starting request...');
    console.log('📦 Protocol Data:', JSON.stringify(data, null, 2));
    console.log('🌐 Request URL:', `${api.defaults.baseURL}/protocols`);
    
    try {
      const response = await api.post<ApiResponse<any>>('/protocols', data);
      console.log('✅ protocolsApi.create - Success response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ protocolsApi.create - Error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  },

  // Aktualizuj protokół
  update: async (id: string, data: any): Promise<ApiResponse<any>> => {
    console.log('🚀 protocolsApi.update - Starting request...');
    console.log('📋 Protocol ID:', id);
    console.log('📦 Protocol Data:', JSON.stringify(data, null, 2));
    console.log('🌐 Request URL:', `${api.defaults.baseURL}/protocols/${id}`);
    
    try {
      const response = await api.put<ApiResponse<any>>(`/protocols/${id}`, data);
      console.log('✅ protocolsApi.update - Success response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ protocolsApi.update - Error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  },

  // Usuń protokół
  delete: async (id: string): Promise<ApiResponse> => {
    console.log('🗑️ protocolsApi.delete - Starting request...');
    console.log('📋 Protocol ID:', id);
    console.log('🌐 Request URL:', `${api.defaults.baseURL}/protocols/${id}`);
    
    try {
      const response = await api.delete<ApiResponse>(`/protocols/${id}`);
      console.log('✅ protocolsApi.delete - Success response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ protocolsApi.delete - Error:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>('/public/operators');
    return response.data;
  },
};

// Health check
export const healthApi = {
  check: async (): Promise<{ status: string; timestamp: string; service: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

// Study Execution API
export const studyExecutionApi = {
  // Główne operacje CRUD
  create: async (data: CreateStudyExecutionRequest): Promise<ApiResponse<StudyExecution>> => {
    const response = await api.post<ApiResponse<StudyExecution>>('/study-executions', data);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<StudyExecution>> => {
    const response = await api.get<ApiResponse<StudyExecution>>(`/study-executions/${id}`);
    return response.data;
  },

  getAll: async (
    filters?: StudyExecutionFilters,
    pagination?: PaginationOptions
  ): Promise<ApiResponse<StudyExecution[]>> => {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.status) params.append('status', filters.status.join(','));
      if (filters.operatorId) params.append('operatorId', filters.operatorId);
      if (filters.studyId) params.append('studyId', filters.studyId);
      if (filters.category) params.append('category', filters.category);
      if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
      if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString());
      if (filters.tags) params.append('tags', filters.tags.join(','));
      if (filters.search) params.append('search', filters.search);
    }
    
    if (pagination) {
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      if (pagination.sortBy) params.append('sortBy', pagination.sortBy);
      if (pagination.sortOrder) params.append('sortOrder', pagination.sortOrder);
    }

    const response = await api.get<ApiResponse<StudyExecution[]>>(
      `/study-executions?${params.toString()}`
    );
    return response.data;
  },

  // Zarządzanie cyklem życia
  start: async (id: string): Promise<ApiResponse<StudyExecution>> => {
    const response = await api.post<ApiResponse<StudyExecution>>(`/study-executions/${id}/start`);
    return response.data;
  },

  pause: async (id: string, notes?: string): Promise<ApiResponse<StudyExecution>> => {
    const response = await api.post<ApiResponse<StudyExecution>>(
      `/study-executions/${id}/pause`,
      { notes }
    );
    return response.data;
  },

  resume: async (id: string): Promise<ApiResponse<StudyExecution>> => {
    const response = await api.post<ApiResponse<StudyExecution>>(`/study-executions/${id}/resume`);
    return response.data;
  },

  complete: async (
    id: string,
    summary?: string,
    recommendations?: string
  ): Promise<ApiResponse<StudyExecution>> => {
    const response = await api.post<ApiResponse<StudyExecution>>(
      `/study-executions/${id}/complete`,
      { summary, recommendations }
    );
    return response.data;
  },

  // Zarządzanie próbkami
  startSample: async (sampleId: string, operatorId: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(
      `/study-executions/samples/${sampleId}/start`,
      { operatorId }
    );
    return response.data;
  },

  completeSample: async (
    sampleId: string,
    quality: 'pass' | 'fail' | 'warning',
    notes?: string
  ): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(
      `/study-executions/samples/${sampleId}/complete`,
      { quality, notes }
    );
    return response.data;
  },

  skipSample: async (sampleId: string, reason: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(
      `/study-executions/samples/${sampleId}/skip`,
      { reason }
    );
    return response.data;
  },

  // Pomiary
  addMeasurement: async (data: AddMeasurementRequest): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>('/study-executions/measurements', data);
    return response.data;
  },

  // Aktualizacja postępu
  updateProgress: async (id: string): Promise<ApiResponse<StudyExecution>> => {
    const response = await api.put<ApiResponse<StudyExecution>>(`/study-executions/${id}/progress`);
    return response.data;
  },

  // Eksporty
  createExport: async (
    id: string,
    exportRequest: Omit<CreateExportRequest, 'executionId'>
  ): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(
      `/study-executions/${id}/exports`,
      { ...exportRequest, executionId: id }
    );
    return response.data;
  },

  getExports: async (id: string): Promise<ApiResponse<any[]>> => {
    const response = await api.get<ApiResponse<any[]>>(`/study-executions/${id}/exports`);
    return response.data;
  },

  // Zapis w systemie EDITH
  saveToEdith: async (id: string): Promise<ApiResponse<any>> => {
    const response = await api.post<ApiResponse<any>>(`/study-executions/${id}/save`);
    return response.data;
  },
};

// Export default API instance
export default api;
