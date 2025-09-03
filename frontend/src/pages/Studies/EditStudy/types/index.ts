import { Study, StudyStatus } from '../../../../types';
import { Protocol } from '../../../../hooks/useProtocols';

export interface EditStudyFormData {
  title: string;
  description: string;
  protocol: Protocol | null;
  status: StudyStatus;
  startDate: Date | null;
  endDate: Date | null;
  researcher: string;
  department: string;
  notes: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
  isPublic: boolean;
  collaborators: string[];
}

export interface EditStudyValidation {
  title: boolean;
  description: boolean;
  protocol: boolean;
  researcher: boolean;
  department: boolean;
  startDate: boolean;
  endDate: boolean;
  dateRange: boolean;
}

export interface EditStudyStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  optional: boolean;
  component: React.ComponentType<any>;
}

export interface EditStudyProgress {
  currentStep: number;
  totalSteps: number;
  completedSteps: number;
  isValid: boolean;
  canProceed: boolean;
}

export interface EditStudyConfig {
  showAdvancedOptions: boolean;
  enableStepValidation: boolean;
  autoSave: boolean;
  autoSaveInterval: number;
  showPreview: boolean;
  allowPartialSave: boolean;
}

export interface EditStudyActions {
  updateField: (field: keyof EditStudyFormData, value: any) => void;
  updateMultipleFields: (fields: Partial<EditStudyFormData>) => void;
  validateField: (field: keyof EditStudyFormData) => boolean;
  validateForm: () => boolean;
  resetForm: () => void;
  loadStudy: (study: Study) => void;
  saveStudy: () => Promise<boolean>;
  saveDraft: () => Promise<boolean>;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
  addCollaborator: (collaborator: string) => void;
  removeCollaborator: (collaborator: string) => void;
}

export interface EditStudyState {
  formData: EditStudyFormData;
  validation: EditStudyValidation;
  progress: EditStudyProgress;
  config: EditStudyConfig;
  isLoading: boolean;
  isSaving: boolean;
  isDirty: boolean;
  lastSaved: Date | null;
  error: string | null;
  originalStudy: Study | null;
}

export interface EditStudyContextType extends EditStudyState {
  actions: EditStudyActions;
}

export type EditStudyMode = 'create' | 'edit' | 'duplicate' | 'template';

export interface EditStudyProps {
  studyId?: string;
  mode?: EditStudyMode;
  initialData?: Partial<EditStudyFormData>;
  onSave?: (study: Study) => void;
  onCancel?: () => void;
  onDelete?: (studyId: string) => void;
}
