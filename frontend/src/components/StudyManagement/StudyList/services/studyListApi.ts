import axios from 'axios';
import { StudyListItem, StudyListResponse, StudyFilters, StudySortConfig, StudyPagination } from '../types';

// API Client
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Build query parameters
const buildQueryParams = (
  filters: StudyFilters,
  sortConfig: StudySortConfig,
  pagination: Pick<StudyPagination, 'page' | 'pageSize'>
): URLSearchParams => {
  const params = new URLSearchParams();
  
  // Pagination
  params.append('page', pagination.page.toString());
  params.append('pageSize', pagination.pageSize.toString());
  
  // Sorting
  params.append('sortBy', sortConfig.field);
  params.append('sortOrder', sortConfig.direction);
  
  // Filters
  if (filters.search) {
    params.append('search', filters.search);
  }
  
  if (filters.status.length > 0) {
    params.append('status', filters.status.join(','));
  }
  
  if (filters.priority.length > 0) {
    params.append('priority', filters.priority.join(','));
  }
  
  if (filters.protocol.length > 0) {
    params.append('protocol', filters.protocol.join(','));
  }
  
  if (filters.category.length > 0) {
    params.append('category', filters.category.join(','));
  }
  
  if (filters.tags.length > 0) {
    params.append('tags', filters.tags.join(','));
  }
  
  if (filters.createdBy.length > 0) {
    params.append('createdBy', filters.createdBy.join(','));
  }
  
  if (filters.dateRange.start) {
    params.append('startDate', filters.dateRange.start.toISOString());
  }
  
  if (filters.dateRange.end) {
    params.append('endDate', filters.dateRange.end.toISOString());
  }
  
  return params;
};

// Study List API Service
export class StudyListApiService {
  
  /**
   * Get paginated list of studies with filters and sorting
   */
  async getStudies(
    filters: StudyFilters,
    sortConfig: StudySortConfig,
    pagination: Pick<StudyPagination, 'page' | 'pageSize'>
  ): Promise<StudyListResponse> {
    try {
      const params = buildQueryParams(filters, sortConfig, pagination);
      const response = await apiClient.get(`/studies?${params.toString()}`);
      
      return {
        studies: response.data.data || [],
        pagination: response.data.pagination || {
          page: 1,
          pageSize: 20,
          total: 0,
          totalPages: 0
        },
        stats: response.data.stats || {
          total: 0,
          byStatus: {},
          byPriority: {},
          recent: 0,
          active: 0,
          completed: 0
        }
      };
    } catch (error: any) {
      console.error('🚨 StudyListApiService.getStudies error:', error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to fetch studies'
      );
    }
  }
  
  /**
   * Get study statistics
   */
  async getStudyStats(): Promise<any> {
    try {
      const response = await apiClient.get('/studies/stats');
      return response.data.data;
    } catch (error: any) {
      console.error('🚨 StudyListApiService.getStudyStats error:', error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to fetch study statistics'
      );
    }
  }
  
  /**
   * Delete a study
   */
  async deleteStudy(studyId: string): Promise<void> {
    try {
      await apiClient.delete(`/studies/${studyId}`);
    } catch (error: any) {
      console.error('🚨 StudyListApiService.deleteStudy error:', error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to delete study'
      );
    }
  }
  
  /**
   * Bulk delete studies
   */
  async bulkDeleteStudies(studyIds: string[]): Promise<void> {
    try {
      await apiClient.delete('/studies/bulk/delete', {
        data: { studyIds }
      });
    } catch (error: any) {
      console.error('🚨 StudyListApiService.bulkDeleteStudies error:', error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to delete studies'
      );
    }
  }
  
  /**
   * Export study data
   */
  async exportStudy(studyId: string): Promise<Blob> {
    try {
      const response = await apiClient.get(`/studies/${studyId}/export`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      console.error('🚨 StudyListApiService.exportStudy error:', error);
      throw new Error(
        error.response?.data?.error || 
        error.message || 
        'Failed to export study'
      );
    }
  }
}

// Export singleton instance
export const studyListApiService = new StudyListApiService();
