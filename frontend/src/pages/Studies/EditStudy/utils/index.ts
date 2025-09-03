import { EditStudyFormData, EditStudyValidation, EditStudyStep } from '../types';
import { Study, StudyStatus } from '../../../../types';
import { Protocol } from '../../../../hooks/useProtocols';

export const createInitialFormData = (): EditStudyFormData => ({
  title: '',
  description: '',
  protocol: null,
  status: StudyStatus.DRAFT,
  startDate: null,
  endDate: null,
  researcher: '',
  department: '',
  notes: '',
  tags: [],
  priority: 'medium',
  isPublic: false,
  collaborators: [],
});

export const createInitialValidation = (): EditStudyValidation => ({
  title: false,
  description: false,
  protocol: false,
  researcher: false,
  department: false,
  startDate: false,
  endDate: false,
  dateRange: false,
});

export const validateField = (
  field: keyof EditStudyFormData,
  value: any,
  formData: EditStudyFormData
): boolean => {
  switch (field) {
    case 'title':
      return typeof value === 'string' && value.trim().length >= 3;
    
    case 'description':
      return typeof value === 'string' && value.trim().length >= 10;
    
    case 'protocol':
      return value !== null && typeof value === 'object';
    
    case 'researcher':
      return typeof value === 'string' && value.trim().length >= 2;
    
    case 'department':
      return typeof value === 'string' && value.trim().length >= 2;
    
    case 'startDate':
      if (!value) return true; // Optional field
      return value instanceof Date && !isNaN(value.getTime());
    
    case 'endDate':
      if (!value) return true; // Optional field
      if (!(value instanceof Date) || isNaN(value.getTime())) return false;
      // If startDate exists, endDate must be after startDate
      if (formData.startDate) {
        return value > formData.startDate;
      }
      return true;
    
    default:
      return true;
  }
};

export const validateDateRange = (startDate: Date | null, endDate: Date | null): boolean => {
  if (!startDate || !endDate) return true;
  return endDate > startDate;
};

export const validateForm = (formData: EditStudyFormData): EditStudyValidation => {
  const validation: EditStudyValidation = {
    title: validateField('title', formData.title, formData),
    description: validateField('description', formData.description, formData),
    protocol: validateField('protocol', formData.protocol, formData),
    researcher: validateField('researcher', formData.researcher, formData),
    department: validateField('department', formData.department, formData),
    startDate: validateField('startDate', formData.startDate, formData),
    endDate: validateField('endDate', formData.endDate, formData),
    dateRange: validateDateRange(formData.startDate, formData.endDate),
  };

  return validation;
};

export const isFormValid = (validation: EditStudyValidation): boolean => {
  const required = ['title', 'description', 'protocol', 'researcher', 'department'];
  return required.every(field => validation[field as keyof EditStudyValidation]) && 
         validation.dateRange;
};

export const getCompletionPercentage = (validation: EditStudyValidation): number => {
  const fields = Object.keys(validation);
  const validFields = fields.filter(field => validation[field as keyof EditStudyValidation]);
  return Math.round((validFields.length / fields.length) * 100);
};

export const convertStudyToFormData = (study: Study): EditStudyFormData => ({
  title: study.name || study.title || '',
  description: study.description || '',
  protocol: null, // Will be loaded separately
  status: study.status,
  startDate: study.startDate ? new Date(study.startDate) : null,
  endDate: study.endDate ? new Date(study.endDate) : null,
  researcher: study.createdBy || '',
  department: '',
  notes: '',
  tags: [],
  priority: 'medium',
  isPublic: false,
  collaborators: [],
});

export const convertFormDataToStudy = (
  formData: EditStudyFormData,
  studyId?: string
): Partial<Study> => ({
  ...(studyId && { id: studyId }),
  name: formData.title,
  title: formData.title,
  description: formData.description,
  protocolId: formData.protocol?.id || null,
  protocolName: formData.protocol?.title || undefined,
  status: formData.status,
  startDate: formData.startDate?.toISOString() || undefined,
  endDate: formData.endDate?.toISOString() || undefined,
  createdBy: formData.researcher,
});

export const getStatusColor = (status: StudyStatus): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case StudyStatus.DRAFT:
      return 'info';
    case StudyStatus.ACTIVE:
      return 'primary';
    case StudyStatus.COMPLETED:
      return 'success';
    case StudyStatus.PAUSED:
      return 'warning';
    default:
      return 'secondary';
  }
};

export const getStatusLabel = (status: StudyStatus): string => {
  switch (status) {
    case StudyStatus.DRAFT:
      return 'Szkic';
    case StudyStatus.ACTIVE:
      return 'Aktywny';
    case StudyStatus.COMPLETED:
      return 'Zakończony';
    case StudyStatus.PAUSED:
      return 'Wstrzymany';
    default:
      return 'Nieznany';
  }
};

export const getPriorityColor = (priority: 'low' | 'medium' | 'high' | 'critical'): 'success' | 'info' | 'warning' | 'error' => {
  switch (priority) {
    case 'low':
      return 'success';
    case 'medium':
      return 'info';
    case 'high':
      return 'warning';
    case 'critical':
      return 'error';
    default:
      return 'info';
  }
};

export const getPriorityLabel = (priority: 'low' | 'medium' | 'high' | 'critical'): string => {
  switch (priority) {
    case 'low':
      return 'Niski';
    case 'medium':
      return 'Średni';
    case 'high':
      return 'Wysoki';
    case 'critical':
      return 'Krytyczny';
    default:
      return 'Średni';
  }
};

export const formatDuration = (startDate: Date | null, endDate: Date | null): string => {
  if (!startDate || !endDate) return 'Nie określono';
  
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 dzień';
  if (diffDays < 7) return `${diffDays} dni`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} tygodni`;
  if (diffDays < 365) return `${Math.ceil(diffDays / 30)} miesięcy`;
  
  return `${Math.ceil(diffDays / 365)} lat`;
};

export const generateStudySteps = (): EditStudyStep[] => [
  {
    id: 'basic-info',
    title: 'Podstawowe informacje',
    description: 'Nazwa, opis i kategoria badania',
    completed: false,
    optional: false,
    component: null as any, // Will be set later
  },
  {
    id: 'protocol-selection',
    title: 'Wybór protokołu',
    description: 'Wybierz protokół badawczy',
    completed: false,
    optional: false,
    component: null as any,
  },
  {
    id: 'timeline',
    title: 'Harmonogram',
    description: 'Daty rozpoczęcia i zakończenia',
    completed: false,
    optional: true,
    component: null as any,
  },
  {
    id: 'team',
    title: 'Zespół',
    description: 'Badacz i współpracownicy',
    completed: false,
    optional: false,
    component: null as any,
  },
  {
    id: 'settings',
    title: 'Ustawienia',
    description: 'Priorytet, tagi i inne opcje',
    completed: false,
    optional: true,
    component: null as any,
  },
  {
    id: 'review',
    title: 'Przegląd',
    description: 'Sprawdź wszystkie dane przed zapisem',
    completed: false,
    optional: false,
    component: null as any,
  },
];

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

export const sanitizeFileName = (name: string): string => {
  return name
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

export const exportFormDataAsJSON = (formData: EditStudyFormData): string => {
  return JSON.stringify(formData, null, 2);
};

export const importFormDataFromJSON = (jsonString: string): EditStudyFormData | null => {
  try {
    const data = JSON.parse(jsonString);
    return {
      ...createInitialFormData(),
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
    };
  } catch {
    return null;
  }
};
