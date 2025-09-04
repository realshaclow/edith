import { useState, useCallback } from 'react';
import { protocolsApi, ProtocolDto, CreateProtocolDto, UpdateProtocolDto, ProtocolQueryParams, ProtocolTemplateDto } from '../services/protocolsApi';

export interface UseProtocolsReturn {
  protocols: ProtocolDto[];
  protocol: ProtocolDto | null;
  templates: ProtocolTemplateDto[];
  loading: boolean;
  isLoading: boolean; // Alias for loading for backward compatibility
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;

  // Protocol operations
  fetchProtocols: (params?: ProtocolQueryParams) => Promise<void>;
  fetchProtocol: (id: string) => Promise<void>;
  createProtocol: (data: CreateProtocolDto) => Promise<ProtocolDto | null>;
  updateProtocol: (id: string, data: UpdateProtocolDto) => Promise<ProtocolDto | null>;
  deleteProtocol: (id: string) => Promise<boolean>;
  clearProtocol: () => void;

  // Template operations
  fetchTemplates: () => Promise<void>;
  createFromTemplate: (templateId: string, data: Partial<CreateProtocolDto>) => Promise<ProtocolDto | null>;

  // Version operations
  getVersions: (protocolId: string) => Promise<ProtocolDto[]>;
  duplicateProtocol: (id: string, newTitle: string, newVersion: string) => Promise<ProtocolDto | null>;

  // Validation and status
  validateProtocol: (id: string) => Promise<any>;
  updateStatus: (id: string, status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED', comment?: string) => Promise<ProtocolDto | null>;

  // Search and recommendations
  searchProtocols: (query: string, filters?: ProtocolQueryParams) => Promise<void>;
  getRecommendations: (baseProtocolId?: string, category?: string) => Promise<ProtocolDto[]>;

  // Bulk operations
  bulkDeleteProtocols: (protocolIds: string[]) => Promise<boolean>;
  bulkUpdateStatus: (protocolIds: string[], status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED') => Promise<boolean>;

  // Import/Export
  exportProtocol: (protocolId: string, format?: 'json' | 'pdf' | 'docx') => Promise<any>;
  importProtocol: (data: any) => Promise<ProtocolDto | null>;

  // Categories and stats
  getCategories: () => Promise<string[]>;
  getTags: () => Promise<string[]>;
  getStats: () => Promise<any>;

  // Clear error
  clearError: () => void;
}

export const useProtocols = (): UseProtocolsReturn => {
  const [protocols, setProtocols] = useState<ProtocolDto[]>([]);
  const [protocol, setProtocol] = useState<ProtocolDto | null>(null);
  const [templates, setTemplates] = useState<ProtocolTemplateDto[]>([]);
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Protocol operations
  const fetchProtocols = useCallback(async (params?: ProtocolQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.getAll(params);
      
      if (response.success && response.data) {
        setProtocols(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      } else {
        throw new Error(response.error || 'Failed to fetch protocols');
      }
    } catch (error) {
      handleError(error, 'fetch protocols');
      setProtocols([]);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const fetchProtocol = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.getById(id);
      
      if (response.success && response.data) {
        setProtocol(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch protocol');
      }
    } catch (error) {
      handleError(error, 'fetch protocol');
      setProtocol(null);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createProtocol = useCallback(async (data: CreateProtocolDto): Promise<ProtocolDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.create(data);
      
      if (response.success && response.data) {
        // Add to protocols list if we have one
        setProtocols(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create protocol');
      }
    } catch (error) {
      handleError(error, 'create protocol');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateProtocol = useCallback(async (id: string, data: UpdateProtocolDto): Promise<ProtocolDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.update(id, data);
      
      if (response.success && response.data) {
        // Update in protocols list
        setProtocols(prev => prev.map(protocol => 
          protocol.id === id ? response.data! : protocol
        ));
        
        // Update current protocol if it's the same one
        if (protocol?.id === id) {
          setProtocol(response.data);
        }
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update protocol');
      }
    } catch (error) {
      handleError(error, 'update protocol');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, protocol?.id]);

  const deleteProtocol = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.delete(id);
      
      if (response.success) {
        // Remove from protocols list
        setProtocols(prev => prev.filter(protocol => protocol.id !== id));
        
        // Clear current protocol if it's the same one
        if (protocol?.id === id) {
          setProtocol(null);
        }
        
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete protocol');
      }
    } catch (error) {
      handleError(error, 'delete protocol');
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError, protocol?.id]);

  const clearProtocol = useCallback(() => {
    setProtocol(null);
  }, []);

  // Template operations
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.getTemplates();
      
      if (response.success && response.data) {
        setTemplates(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch templates');
      }
    } catch (error) {
      handleError(error, 'fetch templates');
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const createFromTemplate = useCallback(async (templateId: string, data: Partial<CreateProtocolDto>): Promise<ProtocolDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.createFromTemplate(templateId, data);
      
      if (response.success && response.data) {
        setProtocols(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to create protocol from template');
      }
    } catch (error) {
      handleError(error, 'create protocol from template');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Version operations
  const getVersions = useCallback(async (protocolId: string): Promise<ProtocolDto[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.getVersions(protocolId);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch versions');
      }
    } catch (error) {
      handleError(error, 'fetch versions');
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const duplicateProtocol = useCallback(async (id: string, newTitle: string, newVersion: string): Promise<ProtocolDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.duplicate(id, newTitle, newVersion);
      
      if (response.success && response.data) {
        setProtocols(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to duplicate protocol');
      }
    } catch (error) {
      handleError(error, 'duplicate protocol');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Validation and status
  const validateProtocol = useCallback(async (id: string): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.validate(id);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to validate protocol');
      }
    } catch (error) {
      handleError(error, 'validate protocol');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const updateStatus = useCallback(async (id: string, status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED', comment?: string): Promise<ProtocolDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.updateStatus(id, status, comment);
      
      if (response.success && response.data) {
        // Update in protocols list
        setProtocols(prev => prev.map(protocol => 
          protocol.id === id ? response.data! : protocol
        ));
        
        // Update current protocol if it's the same one
        if (protocol?.id === id) {
          setProtocol(response.data);
        }
        
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to update status');
      }
    } catch (error) {
      handleError(error, 'update status');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError, protocol?.id]);

  // Search and recommendations
  const searchProtocols = useCallback(async (query: string, filters?: ProtocolQueryParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.search(query, filters);
      
      if (response.success && response.data) {
        setProtocols(response.data);
      } else {
        throw new Error(response.error || 'Failed to search protocols');
      }
    } catch (error) {
      handleError(error, 'search protocols');
      setProtocols([]);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getRecommendations = useCallback(async (baseProtocolId?: string, category?: string): Promise<ProtocolDto[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.getRecommendations(baseProtocolId, category);
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to get recommendations');
      }
    } catch (error) {
      handleError(error, 'get recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Bulk operations
  const bulkDeleteProtocols = useCallback(async (protocolIds: string[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.bulkDelete(protocolIds);
      
      if (response.success) {
        // Remove from protocols list
        setProtocols(prev => prev.filter(protocol => !protocolIds.includes(protocol.id)));
        
        // Clear current protocol if it's one of the deleted ones
        if (protocol && protocolIds.includes(protocol.id)) {
          setProtocol(null);
        }
        
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete protocols');
      }
    } catch (error) {
      handleError(error, 'bulk delete protocols');
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError, protocol]);

  const bulkUpdateStatus = useCallback(async (protocolIds: string[], status: 'DRAFT' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ARCHIVED'): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.bulkUpdateStatus(protocolIds, status);
      
      if (response.success) {
        // For simplicity, refetch all protocols to get updated statuses
        // In a real app, you'd probably want to update them locally
        return true;
      } else {
        throw new Error(response.error || 'Failed to update protocol statuses');
      }
    } catch (error) {
      handleError(error, 'bulk update status');
      return false;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Import/Export
  const exportProtocol = useCallback(async (protocolId: string, format: 'json' | 'pdf' | 'docx' = 'json'): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await protocolsApi.export(protocolId, format);
      return data;
    } catch (error) {
      handleError(error, 'export protocol');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const importProtocol = useCallback(async (data: any): Promise<ProtocolDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.import(data);
      
      if (response.success && response.data) {
        setProtocols(prev => [response.data!, ...prev]);
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to import protocol');
      }
    } catch (error) {
      handleError(error, 'import protocol');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Categories and stats
  const getCategories = useCallback(async (): Promise<string[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.getCategories();
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch categories');
      }
    } catch (error) {
      handleError(error, 'fetch categories');
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getTags = useCallback(async (): Promise<string[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.getTags();
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch tags');
      }
    } catch (error) {
      handleError(error, 'fetch tags');
      return [];
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  const getStats = useCallback(async (): Promise<any> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.getStats();
      
      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch stats');
      }
    } catch (error) {
      handleError(error, 'fetch stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  return {
    protocols,
    protocol,
    templates,
    loading,
    isLoading: loading, // Alias for backward compatibility
    error,
    pagination,
    fetchProtocols,
    fetchProtocol,
    createProtocol,
    updateProtocol,
    deleteProtocol,
    clearProtocol,
    fetchTemplates,
    createFromTemplate,
    getVersions,
    duplicateProtocol,
    validateProtocol,
    updateStatus,
    searchProtocols,
    getRecommendations,
    bulkDeleteProtocols,
    bulkUpdateStatus,
    exportProtocol,
    importProtocol,
    getCategories,
    getTags,
    getStats,
    clearError,
  };
};

export default useProtocols;
