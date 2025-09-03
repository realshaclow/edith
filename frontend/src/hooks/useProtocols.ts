import { useState, useEffect, useCallback } from 'react';
import { protocolsApi } from '../services/api';
import { ApiResponse } from '../types';

// Protocol types matching backend
export interface Protocol {
  id: string;
  title: string;
  description?: string;
  category: 'mechanical' | 'chemical' | 'physical' | 'thermal' | 'electrical';
  estimatedDuration?: string;
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
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface CreateProtocolRequest {
  title: string;
  description?: string;
  category: Protocol['category'];
  estimatedDuration?: string;
  difficulty: Protocol['difficulty'];
  overview: Protocol['overview'];
  equipment: Protocol['equipment'];
  materials: Protocol['materials'];
  safetyGuidelines: Protocol['safetyGuidelines'];
  testConditions: Protocol['testConditions'];
  steps: Protocol['steps'];
  calculations: Protocol['calculations'];
  acceptanceCriteria: Protocol['acceptanceCriteria'];
  commonIssues: Protocol['commonIssues'];
  typicalValues: Protocol['typicalValues'];
  references: Protocol['references'];
}

export interface UseProtocolsReturn {
  protocols: Protocol[];
  protocol: Protocol | null;
  isLoading: boolean;
  error: string | null;
  fetchProtocols: () => Promise<void>;
  fetchProtocol: (id: string) => Promise<void>;
  createProtocol: (protocol: CreateProtocolRequest) => Promise<Protocol | null>;
  updateProtocol: (id: string, updates: Partial<CreateProtocolRequest>) => Promise<Protocol | null>;
  deleteProtocol: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const useProtocols = (): UseProtocolsReturn => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchProtocols = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Protocol[]> = await protocolsApi.getAll();
      if (response.success && response.data) {
        setProtocols(response.data);
      } else {
        setError(response.error || 'Błąd podczas pobierania protokołów');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProtocol = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Protocol> = await protocolsApi.getById(id);
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

  const createProtocol = useCallback(async (protocolData: CreateProtocolRequest): Promise<Protocol | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Protocol> = await protocolsApi.create(protocolData);
      if (response.success && response.data) {
        setProtocols(prev => [...prev, response.data!]);
        return response.data;
      } else {
        setError(response.error || 'Błąd podczas tworzenia protokołu');
        return null;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProtocol = useCallback(async (id: string, updates: Partial<CreateProtocolRequest>): Promise<Protocol | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse<Protocol> = await protocolsApi.update(id, updates);
      if (response.success && response.data) {
        setProtocols(prev => prev.map(p => p.id === id ? response.data! : p));
        if (protocol?.id === id) {
          setProtocol(response.data);
        }
        return response.data;
      } else {
        setError(response.error || 'Błąd podczas aktualizacji protokołu');
        return null;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [protocol]);

  const deleteProtocol = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response: ApiResponse = await protocolsApi.delete(id);
      if (response.success) {
        setProtocols(prev => prev.filter(p => p.id !== id));
        if (protocol?.id === id) {
          setProtocol(null);
        }
        return true;
      } else {
        setError(response.error || 'Błąd podczas usuwania protokołu');
        return false;
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [protocol]);

  return {
    protocols,
    protocol,
    isLoading,
    error,
    fetchProtocols,
    fetchProtocol,
    createProtocol,
    updateProtocol,
    deleteProtocol,
    clearError
  };
};
