import { useState, useCallback } from 'react';
import { predefinedProtocolsApi } from '../services/api';
import { ApiResponse } from '../types';

export interface PredefinedProtocol {
  id: string;
  title: string;
  description: string;
  category: 'mechanical' | 'chemical' | 'physical' | 'thermal' | 'electrical';
  standard: string;
  estimatedDuration: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  overview: {
    purpose: string;
    scope: string;
    principles: string;
    standards: string[];
  };
  equipment: Array<{
    name: string;
    specification: string;
  }>;
  materials: string[];
  safetyGuidelines: string[];
  testConditions: Array<{
    id: string;
    name: string;
    value: string;
    unit: string;
    tolerance: string;
    category: 'environmental' | 'mechanical' | 'chemical' | 'temporal' | 'dimensional';
    required: boolean;
    description?: string;
  }>;
  steps: Array<{
    id: string;
    title: string;
    description: string;
    duration: string;
    instructions: string[];
    tips: string[];
    safety: string[];
  }>;
  calculations: Array<{
    id: string;
    name: string;
    description: string;
    formula: string;
    variables: Array<{
      symbol: string;
      name: string;
      unit: string;
    }>;
    unit: string;
    category: 'mechanical' | 'statistical' | 'dimensional' | 'chemical' | 'custom';
    isRequired: boolean;
    example?: string;
    notes?: string;
  }>;
  acceptanceCriteria: Array<{
    id: string;
    parameter: string;
    condition: string;
    value: string;
    unit: string;
    severity: 'critical' | 'major' | 'minor';
    description?: string;
  }>;
  commonIssues: Array<{
    id: string;
    issue: string;
    causes: string[];
    solutions: string[];
    prevention?: string;
  }>;
  typicalValues: Array<{
    material: string;
    property: string;
    value: string;
    unit: string;
    conditions: string;
    source?: string;
  }>;
  references: Array<{
    title: string;
    source: string;
    url?: string;
  }>;
}

export interface UsePredefinedProtocolsReturn {
  protocols: PredefinedProtocol[];
  protocol: PredefinedProtocol | null;
  isLoading: boolean;
  error: string | null;
  fetchPredefinedProtocols: () => Promise<void>;
  fetchPredefinedProtocol: (id: string) => Promise<void>;
  fetchProtocolsByCategory: (category: string) => Promise<void>;
  clearError: () => void;
}

export const usePredefinedProtocols = (): UsePredefinedProtocolsReturn => {
  const [protocols, setProtocols] = useState<PredefinedProtocol[]>([]);
  const [protocol, setProtocol] = useState<PredefinedProtocol | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchPredefinedProtocols = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await predefinedProtocolsApi.getAll();
      if (response.success && response.data) {
        setProtocols(response.data);
      } else {
        setError(response.error || 'Błąd podczas pobierania predefinowanych protokołów');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPredefinedProtocol = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await predefinedProtocolsApi.getById(id);
      if (response.success && response.data) {
        setProtocol(response.data);
      } else {
        setError(response.error || 'Błąd podczas pobierania protokołu');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProtocolsByCategory = useCallback(async (category: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await predefinedProtocolsApi.getByCategory(category);
      if (response.success && response.data) {
        setProtocols(response.data);
      } else {
        setError(response.error || 'Błąd podczas pobierania protokołów według kategorii');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    protocols,
    protocol,
    isLoading,
    error,
    fetchPredefinedProtocols,
    fetchPredefinedProtocol,
    fetchProtocolsByCategory,
    clearError
  };
};
