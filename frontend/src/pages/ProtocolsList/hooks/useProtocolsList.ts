import { useState, useEffect, useCallback } from 'react';
import { predefinedProtocolsApi, protocolsApi } from '../../../services/api';
import { Protocol, ProtocolFilters, ProtocolSortOptions } from '../types';
import toast from 'react-hot-toast';

export const useProtocolsList = () => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProtocolFilters>({});
  const [sortOptions, setSortOptions] = useState<ProtocolSortOptions>({
    field: 'title',
    direction: 'asc'
  });

  const fetchProtocols = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await protocolsApi.getAll();
      if (response.success && response.data) {
        setProtocols(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch protocols');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch protocols';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching protocols:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getProtocolById = useCallback(async (id: string): Promise<Protocol | null> => {
    try {
      const response = await protocolsApi.getById(id);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (err) {
      console.error('Error fetching protocol by ID:', err);
      toast.error('Failed to fetch protocol details');
      return null;
    }
  }, []);

  const deleteProtocol = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await protocolsApi.delete(id);
      if (response.success) {
        setProtocols(prev => prev.filter(p => p.id !== id));
        toast.success('Protocol deleted successfully');
        return true;
      } else {
        throw new Error(response.error || 'Failed to delete protocol');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete protocol';
      toast.error(errorMessage);
      return false;
    }
  }, []);

  // Filter and sort protocols
  const filteredAndSortedProtocols = useCallback(() => {
    let result = [...protocols];

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(protocol => 
        protocol.title.toLowerCase().includes(searchLower) ||
        protocol.description.toLowerCase().includes(searchLower) ||
        protocol.category.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      result = result.filter(protocol => protocol.category === filters.category);
    }

    if (filters.difficulty) {
      result = result.filter(protocol => protocol.difficulty === filters.difficulty);
    }

    if (filters.type) {
      result = result.filter(protocol => protocol.type === filters.type);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue: any = a[sortOptions.field];
      let bValue: any = b[sortOptions.field];

      // Handle date fields
      if (sortOptions.field === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }

      return sortOptions.direction === 'desc' ? -comparison : comparison;
    });

    return result;
  }, [protocols, filters, sortOptions]);

  // Get unique categories for filter options
  const getCategories = useCallback(() => {
    const categories = new Set(protocols.map(p => p.category));
    return Array.from(categories).sort();
  }, [protocols]);

  // Get unique difficulties for filter options
  const getDifficulties = useCallback(() => {
    const difficulties = new Set(
      protocols
        .map(p => p.difficulty)
        .filter((d): d is string => d !== undefined && d.trim() !== '')
    );
    return Array.from(difficulties).sort();
  }, [protocols]);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  return {
    protocols: filteredAndSortedProtocols(),
    allProtocols: protocols,
    loading,
    error,
    filters,
    sortOptions,
    categories: getCategories(),
    difficulties: getDifficulties(),
    setFilters,
    setSortOptions,
    fetchProtocols,
    getProtocolById,
    deleteProtocol,
    refetch: fetchProtocols
  };
};
