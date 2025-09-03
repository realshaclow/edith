export type ParametrizationMode = 'global' | 'per-step';

export interface StudyFormData {
  name: string;
  description: string;
  protocolId: string;
  protocolName?: string;
  category?: string;
  parametrizationMode: ParametrizationMode;
  selectedProtocol: ProtocolForStudy | null;
  parameters: StudyParameter[];
  stepParameters: { [stepId: string]: StudyParameter[] }; // Parametry per krok
  settings: StudySettings;
  objectives: string[];
  expectedOutcomes: string[];
  timeline: StudyTimeline;
  resources: StudyResources;
}

export interface StudyParameter {
  id: string;
  name: string;
  type: 'number' | 'text' | 'boolean' | 'date' | 'select' | 'multiselect';
  value: any;
  unit?: string;
  required: boolean;
  description?: string;
  constraints?: {
    min?: number;
    max?: number;
    options?: string[];
    regex?: string;
  };
}

export interface StudySettings {
  sampleSettings: {
    sampleSize: number;
    sampleType: string;
    preparation: string[];
    conditions: string[];
  };
  environmentalSettings: {
    temperature: string;
    humidity: string;
    pressure: string;
    atmosphere: string;
  };
  qualitySettings: {
    repeatability: number;
    accuracy: string;
    precision: string;
    calibration: string[];
  };
}

export interface StudyTimeline {
  estimatedDuration: string;
  phases: StudyPhase[];
  milestones: StudyMilestone[];
}

export interface StudyPhase {
  id: string;
  name: string;
  description: string;
  duration: string;
  dependencies: string[];
  tasks: StudyTask[];
}

export interface StudyTask {
  id: string;
  name: string;
  description: string;
  duration: string;
  assignee?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
}

export interface StudyMilestone {
  id: string;
  name: string;
  description: string;
  date: string;
  type: 'start' | 'checkpoint' | 'deliverable' | 'end';
}

export interface StudyResources {
  personnel: PersonnelResource[];
  equipment: EquipmentResource[];
  materials: MaterialResource[];
  budget: BudgetResource;
}

export interface PersonnelResource {
  id: string;
  name: string;
  role: string;
  responsibility?: string;
  allocation: number; // procent czasu
  skills?: string[];
  availability?: string;
  cost?: number;
}

export interface EquipmentResource {
  id: string;
  name: string;
  type?: string;
  specification?: string;
  specifications?: string[];
  quantity?: number;
  availability?: string;
  calibrationStatus?: 'valid' | 'due' | 'overdue';
  cost?: number;
}

export interface MaterialResource {
  id: string;
  name: string;
  type?: string;
  description?: string;
  quantity: string; // może być tekstem jak "10 kg"
  unit?: string;
  supplier?: string;
  specifications?: string[];
  cost?: number;
}

export interface BudgetResource {
  totalBudget: number;
  currency: string;
  breakdown: {
    personnel: number;
    equipment: number;
    materials: number;
    overhead: number;
    contingency: number;
  };
}

export interface ProtocolForStudy {
  id: string;
  title: string;
  description?: string;
  category: string;
  type?: 'PREDEFINED' | 'USER';
  difficulty?: string;
  estimatedDuration?: string;
  steps?: ProtocolStep[];
  equipment?: any[];
  materials?: string[];
  safetyGuidelines?: string[];
}

export interface ProtocolStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructions: string[];
  tips?: string[];
  safety?: string[];
}

export interface CreateStudyFormErrors {
  name?: string;
  description?: string;
  protocol?: string;
  parameters?: { [key: string]: string };
  settings?: { [key: string]: string };
  timeline?: string;
  resources?: { [key: string]: string };
}

export type CreateStudyStep = 
  | 'basic-info'
  | 'protocol-selection'
  | 'parameters'
  | 'settings'
  | 'timeline'
  | 'resources'
  | 'review';

export interface UseCreateStudyReturn {
  studyData: StudyFormData;
  selectedProtocol: ProtocolForStudy | null;
  errors: CreateStudyFormErrors;
  isLoading: boolean;
  currentStep: CreateStudyStep;
  isStepValid: (step: CreateStudyStep) => boolean;
  updateStudyData: (data: Partial<StudyFormData>) => void;
  setSelectedProtocol: (protocol: ProtocolForStudy | null) => void;
  validateStep: (step: CreateStudyStep) => boolean;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: CreateStudyStep) => void;
  submitStudy: () => Promise<boolean>;
  resetForm: () => void;
}
