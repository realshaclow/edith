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
    console.error('Protocols API Error:', error);
    
    if (error.response?.status === 401) {
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

// Protocol Types
export interface ProtocolDto {
  id: string;
  title: string;
  description?: string;
  category: string;
  version: string;
  standard?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimatedDuration: string;
  tags: string[];
  equipment: any[];
  materials: any[];
  safetyRequirements: any[];
  steps: any[];
  qualityControls: any[];
  calculations: any[];
  reportTemplate: any;
  references: any[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastModifiedBy?: string;
  validationStatus: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  approvedBy?: string;
  approvedAt?: string;
  applicableStandards: string[];
  methodology?: string;
  scope?: string;
  limitations?: string[];
  precisionData?: any;
  accuracyData?: any;
  usageCount: number;
  averageRating?: number;
  lastUsed?: string;
}

export interface CreateProtocolDto {
  title: string;
  description?: string;
  category: string;
  version: string;
  standard?: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimatedDuration: string;
  tags?: string[];
  equipment: any[];
  materials: any[];
  safetyRequirements?: any[];
  steps: any[];
  qualityControls?: any[];
  calculations?: any[];
  reportTemplate?: any;
  references?: any[];
  applicableStandards?: string[];
  methodology?: string;
  scope?: string;
  limitations?: string[];
  precisionData?: any;
  accuracyData?: any;
}

export interface UpdateProtocolDto {
  title?: string;
  description?: string;
  category?: string;
  version?: string;
  standard?: string;
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimatedDuration?: string;
  tags?: string[];
  equipment?: any[];
  materials?: any[];
  safetyRequirements?: any[];
  steps?: any[];
  qualityControls?: any[];
  calculations?: any[];
  reportTemplate?: any;
  references?: any[];
  isActive?: boolean;
  validationStatus?: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED';
  applicableStandards?: string[];
  methodology?: string;
  scope?: string;
  limitations?: string[];
  precisionData?: any;
  accuracyData?: any;
}

export interface ProtocolQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: string;
  standard?: string;
  tags?: string[];
  isActive?: boolean;
  validationStatus?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Protocol Statistics
export interface ProtocolStatsDto {
  totalProtocols: number;
  activeProtocols: number;
  approvedProtocols: number;
  draftProtocols: number;
  categories: { [key: string]: number };
  difficulties: { [key: string]: number };
  mostUsedProtocols: Array<{ id: string; title: string; usageCount: number }>;
  recentlyCreated: Array<{ id: string; title: string; createdAt: string }>;
  processingTime: number;
}

// Template and Import Types
export interface ProtocolTemplateDto {
  id: string;
  name: string;
  description?: string;
  category: string;
  structure: any;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ImportProtocolDto {
  source: 'file' | 'standard' | 'template';
  data: any;
  mapping?: { [key: string]: string };
  validation?: boolean;
}

// Protocols API
export const protocolsApi = {
  // Protocol CRUD Operations
  getAll: async (params?: ProtocolQueryParams): Promise<PaginatedResponse<ProtocolDto>> => {
    console.log('protocolsApi.getAll - Starting request with params:', params);
    const response = await api.get<PaginatedResponse<ProtocolDto>>('/protocols', { params });
    console.log('protocolsApi.getAll - Response:', response.data);
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<ProtocolDto>> => {
    console.log('protocolsApi.getById - Starting request for ID:', id);
    const response = await api.get<ApiResponse<ProtocolDto>>(`/protocols/${id}`);
    console.log('protocolsApi.getById - Response:', response.data);
    return response.data;
  },

  create: async (data: CreateProtocolDto): Promise<ApiResponse<ProtocolDto>> => {
    console.log('protocolsApi.create - Starting request with data:', data);
    const response = await api.post<ApiResponse<ProtocolDto>>('/protocols', data);
    console.log('protocolsApi.create - Response:', response.data);
    return response.data;
  },

  update: async (id: string, data: UpdateProtocolDto): Promise<ApiResponse<ProtocolDto>> => {
    console.log('protocolsApi.update - Starting request for ID:', id, 'with data:', data);
    const response = await api.put<ApiResponse<ProtocolDto>>(`/protocols/${id}`, data);
    console.log('protocolsApi.update - Response:', response.data);
    return response.data;
  },

  delete: async (id: string): Promise<ApiResponse> => {
    console.log('protocolsApi.delete - Starting request for ID:', id);
    const response = await api.delete<ApiResponse>(`/protocols/${id}`);
    console.log('protocolsApi.delete - Response:', response.data);
    return response.data;
  },

  // Protocol Validation and Approval
  validate: async (id: string): Promise<ApiResponse<{ isValid: boolean; issues: any[] }>> => {
    console.log('protocolsApi.validate - Starting request for ID:', id);
    const response = await api.post<ApiResponse<{ isValid: boolean; issues: any[] }>>(`/protocols/${id}/validate`);
    console.log('protocolsApi.validate - Response:', response.data);
    return response.data;
  },

  updateStatus: async (id: string, status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED', comment?: string): Promise<ApiResponse<ProtocolDto>> => {
    console.log('protocolsApi.updateStatus - Starting request for ID:', id, 'status:', status);
    const response = await api.patch<ApiResponse<ProtocolDto>>(`/protocols/${id}/status`, { status, comment });
    console.log('protocolsApi.updateStatus - Response:', response.data);
    return response.data;
  },

  // Protocol Duplication and Versioning
  duplicate: async (id: string, newTitle: string, newVersion: string): Promise<ApiResponse<ProtocolDto>> => {
    console.log('protocolsApi.duplicate - Starting request for ID:', id);
    const response = await api.post<ApiResponse<ProtocolDto>>(`/protocols/${id}/duplicate`, { newTitle, newVersion });
    console.log('protocolsApi.duplicate - Response:', response.data);
    return response.data;
  },

  getVersions: async (id: string): Promise<ApiResponse<ProtocolDto[]>> => {
    console.log('protocolsApi.getVersions - Starting request for ID:', id);
    const response = await api.get<ApiResponse<ProtocolDto[]>>(`/protocols/${id}/versions`);
    console.log('protocolsApi.getVersions - Response:', response.data);
    return response.data;
  },

  // Protocol Statistics
  getStats: async (): Promise<ApiResponse<ProtocolStatsDto>> => {
    console.log('protocolsApi.getStats - Starting request');
    const response = await api.get<ApiResponse<ProtocolStatsDto>>('/protocols/stats');
    console.log('protocolsApi.getStats - Response:', response.data);
    return response.data;
  },

  // Categories and Tags
  getCategories: async (): Promise<ApiResponse<string[]>> => {
    console.log('protocolsApi.getCategories - Starting request');
    const response = await api.get<ApiResponse<string[]>>('/protocols/categories');
    console.log('protocolsApi.getCategories - Response:', response.data);
    return response.data;
  },

  getTags: async (): Promise<ApiResponse<string[]>> => {
    console.log('protocolsApi.getTags - Starting request');
    const response = await api.get<ApiResponse<string[]>>('/protocols/tags');
    console.log('protocolsApi.getTags - Response:', response.data);
    return response.data;
  },

  // Templates
  getTemplates: async (): Promise<ApiResponse<ProtocolTemplateDto[]>> => {
    console.log('protocolsApi.getTemplates - Starting request');
    const response = await api.get<ApiResponse<ProtocolTemplateDto[]>>('/protocols/templates');
    console.log('protocolsApi.getTemplates - Response:', response.data);
    return response.data;
  },

  createFromTemplate: async (templateId: string, data: Partial<CreateProtocolDto>): Promise<ApiResponse<ProtocolDto>> => {
    console.log('protocolsApi.createFromTemplate - Starting request for template:', templateId);
    const response = await api.post<ApiResponse<ProtocolDto>>(`/protocols/templates/${templateId}/create`, data);
    console.log('protocolsApi.createFromTemplate - Response:', response.data);
    return response.data;
  },

  // Import/Export
  import: async (data: ImportProtocolDto): Promise<ApiResponse<ProtocolDto>> => {
    console.log('protocolsApi.import - Starting request with data:', data);
    const response = await api.post<ApiResponse<ProtocolDto>>('/protocols/import', data);
    console.log('protocolsApi.import - Response:', response.data);
    return response.data;
  },

  export: async (id: string, format: 'json' | 'pdf' | 'docx' = 'json'): Promise<any> => {
    console.log('protocolsApi.export - Starting request for protocol:', id, 'format:', format);
    const response = await api.get(`/protocols/${id}/export`, { 
      params: { format },
      responseType: format === 'json' ? 'json' : 'blob'
    });
    console.log('protocolsApi.export - Response received');
    return response.data;
  },

  // Bulk Operations
  bulkDelete: async (protocolIds: string[]): Promise<ApiResponse> => {
    console.log('protocolsApi.bulkDelete - Starting request for IDs:', protocolIds);
    const response = await api.delete<ApiResponse>('/protocols/bulk/delete', { data: { protocolIds } });
    console.log('protocolsApi.bulkDelete - Response:', response.data);
    return response.data;
  },

  bulkUpdateStatus: async (protocolIds: string[], status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'): Promise<ApiResponse> => {
    console.log('protocolsApi.bulkUpdateStatus - Starting request for IDs:', protocolIds, 'status:', status);
    const response = await api.patch<ApiResponse>('/protocols/bulk/status', { protocolIds, status });
    console.log('protocolsApi.bulkUpdateStatus - Response:', response.data);
    return response.data;
  },

  // Search and Recommendations
  search: async (query: string, filters?: ProtocolQueryParams): Promise<ApiResponse<ProtocolDto[]>> => {
    console.log('protocolsApi.search - Starting request with query:', query, 'filters:', filters);
    const response = await api.get<ApiResponse<ProtocolDto[]>>('/protocols/search', { 
      params: { q: query, ...filters } 
    });
    console.log('protocolsApi.search - Response:', response.data);
    return response.data;
  },

  getRecommendations: async (baseProtocolId?: string, category?: string): Promise<ApiResponse<ProtocolDto[]>> => {
    console.log('protocolsApi.getRecommendations - Starting request for base:', baseProtocolId, 'category:', category);
    const response = await api.get<ApiResponse<ProtocolDto[]>>('/protocols/recommendations', { 
      params: { baseProtocolId, category } 
    });
    console.log('protocolsApi.getRecommendations - Response:', response.data);
    return response.data;
  }
};

export default api;
