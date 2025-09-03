import { useState, useCallback, useEffect } from 'react';
import { ResearchProtocol, ProtocolFormData } from '../types/protocol';
import { validateProtocol } from '../utils/validation';
import { generateProtocolId } from '../utils/helpers';
import { protocolsApi } from '../../../services/api';

interface UseProtocolEditorReturn {
  protocol: ProtocolFormData;
  setProtocol: (protocol: ProtocolFormData) => void;
  updateProtocol: (updates: Partial<ProtocolFormData>) => void;
  resetProtocol: () => void;
  saveProtocol: () => Promise<boolean>;
  saveAsProtocol: (newTitle: string) => Promise<boolean>;
  loadProtocol: (id: string) => Promise<boolean>;
  exportProtocol: () => void;
  importProtocol: (file: File) => Promise<boolean>;
  isLoading: boolean;
  isDirty: boolean;
  errors: Record<string, string>;
  isValid: boolean;
}

const createEmptyProtocol = (): ProtocolFormData => ({
  id: '',
  title: '',
  description: '',
  category: 'physical',
  estimatedDuration: '',
  difficulty: 'basic',
  overview: {
    purpose: '',
    scope: '',
    principles: '',
    standards: []
  },
  equipment: [],
  materials: [],
  safetyGuidelines: [],
  testConditions: [],
  steps: [],
  calculations: [],
  acceptanceCriteria: [],
  commonIssues: [],
  typicalValues: [],
  references: [],
  isDirty: false,
  isValid: true, // Inicjalnie ważny, żeby nie pokazywać błędów na starcie
  errors: {} // Brak błędów na starcie
});

export const useProtocolEditor = (initialProtocol?: ResearchProtocol): UseProtocolEditorReturn => {
  const [protocol, setProtocolState] = useState<ProtocolFormData>(() => 
    initialProtocol || createEmptyProtocol()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Real-time walidacja
  const validateField = useCallback((field: string, value: any) => {
    const newErrors = { ...errors };
    
    // Usuń błąd dla tego pola jeśli wartość jest prawidłowa
    switch (field) {
      case 'title':
        if (value?.trim()) {
          delete newErrors.title;
        } else {
          newErrors.title = 'Tytuł protokołu jest wymagany';
        }
        break;
      case 'description':
        if (value?.trim()) {
          delete newErrors.description;
        } else {
          newErrors.description = 'Opis protokołu jest wymagany';
        }
        break;
      case 'category':
        if (value) {
          delete newErrors.category;
        } else {
          newErrors.category = 'Kategoria protokołu jest wymagana';
        }
        break;
      case 'estimatedDuration':
        if (value?.trim()) {
          delete newErrors.estimatedDuration;
        } else {
          newErrors.estimatedDuration = 'Szacowany czas trwania jest wymagany';
        }
        break;
      case 'difficulty':
        if (value) {
          delete newErrors.difficulty;
        } else {
          newErrors.difficulty = 'Poziom trudności jest wymagany';
        }
        break;
      case 'overviewPurpose':
        if (value?.trim()) {
          delete newErrors.overviewPurpose;
        } else {
          newErrors.overviewPurpose = 'Cel badania jest wymagany';
        }
        break;
      case 'overviewScope':
        if (value?.trim()) {
          delete newErrors.overviewScope;
        } else {
          newErrors.overviewScope = 'Zakres zastosowania jest wymagany';
        }
        break;
      case 'overviewPrinciples':
        if (value?.trim()) {
          delete newErrors.overviewPrinciples;
        } else {
          newErrors.overviewPrinciples = 'Zasady badania są wymagane';
        }
        break;
    }
    
    setErrors(newErrors);
  }, [errors]);

  const setProtocol = useCallback((newProtocol: ProtocolFormData) => {
    setProtocolState({
      ...newProtocol,
      isDirty: true
    });
    // Wyczyść błędy przy ustawianiu nowego protokołu
    setErrors({});
  }, []);

  const updateProtocol = useCallback((updates: Partial<ProtocolFormData>) => {
    setProtocolState(prev => ({
      ...prev,
      ...updates,
      isDirty: true
    }));
    
    // Waliduj zaktualizowane pola
    Object.keys(updates).forEach(key => {
      validateField(key, updates[key as keyof ProtocolFormData]);
    });
  }, [validateField]);

  const resetProtocol = useCallback(() => {
    setProtocolState(createEmptyProtocol());
    setErrors({});
  }, []);

  const saveProtocol = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Saving protocol:', { 
        id: protocol.id, 
        title: protocol.title,
        hasId: !!protocol.id,
        fullProtocol: protocol 
      });

      // Waliduj protokół przed zapisem
      const { isValid, errors: validationErrors } = validateProtocol(protocol);
      setErrors(validationErrors);

      // Jeśli nie jest ważny, nie zapisuj
      if (!isValid) {
        console.log('Protocol validation failed:', validationErrors);
        return false;
      }

      // Przygotuj dane do zapisu
      const protocolToSave = {
        ...protocol,
        id: protocol.id || generateProtocolId(protocol.title || 'untitled')
      };

      let response;
      
      // Sprawdź czy protokół istnieje w bazie danych jako protokół użytkownika
      // Jeśli ma ID i nie zaczyna się od prefiksów predefiniowanych, 
      // to prawdopodobnie to protokół użytkownika w bazie
      const isPredefinedId = protocol.id?.startsWith('iso-') || 
                            protocol.id?.startsWith('astm-') ||
                            protocol.id?.startsWith('ul-');
      
      // Jeśli protokół ma ID i nie jest predefiniowany (po ID), próbuj aktualizować
      if (protocol.id && !isPredefinedId) {
        try {
          // Próbuj aktualizować istniejący protokół użytkownika
          response = await protocolsApi.update(protocol.id, protocolToSave);
        } catch (error: any) {
          // Jeśli dostaniemy 403 lub 404, to znaczy że nie możemy aktualizować
          // (może to być predefiniowany protokół w bazie lub nie mamy uprawnień)
          if (error?.response?.status === 403 || error?.response?.status === 404) {
            console.log('Cannot update protocol, creating new copy instead');
            // Stwórz nową kopię zamiast aktualizować
            const { isDirty, isValid: formValid, errors: formErrors, ...protocolData } = protocolToSave;
            response = await protocolsApi.create({
              ...protocolData,
              title: `${protocol.title} (Kopia)`
            });
          } else {
            throw error; // Inny błąd - przekaż dalej
          }
        }
      } else {
        // Utwórz nowy protokół (dla predefiniowanych lub nowych)
        const { isDirty, isValid: formValid, errors: formErrors, ...protocolData } = protocolToSave;
        response = await protocolsApi.create({
          ...protocolData,
          title: isPredefinedId ? `${protocol.title} (Kopia)` : protocol.title
        });
      }

      if (response.success) {
        setProtocolState(prev => ({
          ...prev,
          ...response.data,
          isDirty: false
        }));

        // Wyczyść błędy po udanym zapisie
        setErrors({});
        return true;
      } else {
        console.error('API Error:', response);
        return false;
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania protokołu:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [protocol]);

  const saveAsProtocol = useCallback(async (newTitle: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Waliduj protokół przed zapisem
      const { isValid, errors: validationErrors } = validateProtocol(protocol);
      setErrors(validationErrors);

      // Jeśli nie jest ważny, nie zapisuj
      if (!isValid) {
        return false;
      }

      // Utwórz nowy protokół z nowym tytułem i ID
      const protocolToSave = {
        ...protocol,
        title: newTitle,
        id: generateProtocolId(newTitle),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Zawsze utwórz nowy protokół (bez ID w bazie)
      const { id, ...protocolWithoutId } = protocolToSave;
      const response = await protocolsApi.create(protocolWithoutId);

      if (response.success) {
        setProtocolState(prev => ({
          ...prev,
          ...response.data,
          isDirty: false
        }));

        // Wyczyść błędy po udanym zapisie
        setErrors({});
        return true;
      } else {
        console.error('API Error:', response);
        return false;
      }
    } catch (error) {
      console.error('Błąd podczas zapisywania protokołu:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [protocol]);

  const exportProtocol = useCallback(() => {
    const dataToExport = {
      ...protocol,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${protocol.title || 'protokol'}.edith`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [protocol]);

  const importProtocol = useCallback(async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // Sprawdź czy to poprawny format protokołu
      if (!importedData.title || !importedData.category) {
        throw new Error('Nieprawidłowy format pliku');
      }
      
      // Ustaw zaimportowane dane
      setProtocolState({
        ...importedData,
        id: '', // Wyczyść ID żeby stworzyć nowy protokół
        isDirty: true
      });
      
      // Wyczyść błędy
      setErrors({});
      
      return true;
    } catch (error) {
      console.error('Błąd podczas importu protokołu:', error);
      return false;
    }
  }, []);

  const loadProtocol = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log('Loading protocol with ID:', id);
      const response = await protocolsApi.getById(id);
      console.log('Protocol loaded:', response);
      
      if (response.success && response.data) {
        console.log('Setting protocol state:', response.data);
        setProtocolState({
          ...response.data,
          isDirty: false
        });
        
        // Wyczyść błędy po udanym wczytaniu
        setErrors({});
        return true;
      } else {
        console.error('API Error:', response);
        return false;
      }
    } catch (error) {
      console.error('Błąd podczas wczytywania protokołu:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    protocol,
    setProtocol,
    updateProtocol,
    resetProtocol,
    saveProtocol,
    saveAsProtocol,
    loadProtocol,
    exportProtocol,
    importProtocol,
    isLoading,
    isDirty: protocol.isDirty || false,
    errors,
    isValid: Object.keys(errors).length === 0
  };
};
