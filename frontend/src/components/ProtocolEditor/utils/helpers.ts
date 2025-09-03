/**
 * Funkcje pomocnicze dla edytora protokołów
 */

/**
 * Generuje ID protokołu na podstawie tytułu
 */
export const generateProtocolId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Usuń znaki specjalne
    .replace(/\s+/g, '-') // Zamień spacje na myślniki
    .replace(/-+/g, '-') // Usuń podwójne myślniki
    .trim()
    .substring(0, 50); // Ogranicz długość
};

/**
 * Tworzy pusty krok protokołu
 */
export const createEmptyStep = (index: number) => ({
  id: `step-${index + 1}`,
  title: '',
  description: '',
  duration: '',
  instructions: [''],
  tips: [],
  safety: []
});

/**
 * Tworzy pusty element wyposażenia
 */
export const createEmptyEquipment = () => ({
  name: '',
  specification: ''
});

/**
 * Tworzy pusty problem
 */
export const createEmptyIssue = () => ({
  problem: '',
  causes: [''],
  solutions: ['']
});

/**
 * Formatuje czas trwania do czytelnej formy
 */
export const formatDuration = (duration: string): string => {
  const minutes = parseInt(duration);
  if (isNaN(minutes)) return duration;
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  
  return `${hours} h ${remainingMinutes} min`;
};

/**
 * Waliduje format ID protokołu
 */
export const isValidProtocolId = (id: string): boolean => {
  return /^[a-z0-9-]+$/.test(id) && id.length >= 3 && id.length <= 50;
};

/**
 * Sprawdza czy string jest prawidłowym URL-em
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Debounce funkcja - opóźnia wykonanie funkcji
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Kopiuje tekst do schowka
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Błąd kopiowania do schowka:', error);
    return false;
  }
};

/**
 * Pobiera kolor dla kategorii protokołu
 */
export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    physical: '#2196F3',
    chemical: '#4CAF50',
    thermal: '#FF9800',
    mechanical: '#9C27B0',
    fire: '#F44336',
    weathering: '#795548',
    rheological: '#607D8B'
  };
  
  return colors[category] || '#666666';
};

/**
 * Pobiera kolor dla poziomu trudności
 */
export const getDifficultyColor = (difficulty: string): string => {
  const colors: Record<string, string> = {
    basic: '#4CAF50',
    intermediate: '#FF9800',
    advanced: '#F44336'
  };
  
  return colors[difficulty] || '#666666';
};

/**
 * Sortuje kroki protokołu według ID
 */
export const sortStepsByOrder = (steps: any[]): any[] => {
  return [...steps].sort((a, b) => {
    const aNum = parseInt(a.id.replace(/\D/g, ''));
    const bNum = parseInt(b.id.replace(/\D/g, ''));
    return aNum - bNum;
  });
};

/**
 * Eksportuje protokół do JSON
 */
export const exportProtocolToJson = (protocol: any): string => {
  const exportData = {
    ...protocol,
    exportedAt: new Date().toISOString(),
    version: '1.0'
  };
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * Importuje protokół z JSON
 */
export const importProtocolFromJson = (jsonString: string): any => {
  try {
    const data = JSON.parse(jsonString);
    // Usuń metadane eksportu
    delete data.exportedAt;
    delete data.version;
    return data;
  } catch (error) {
    throw new Error('Nieprawidłowy format JSON');
  }
};
