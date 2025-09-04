import { Study } from '../../../types';

// Basic execution types
export interface ExecutionStep {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  measurements: ExecutionMeasurement[];
  isCompleted: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface ExecutionMeasurement {
  id: string;
  name: string;
  unit: string;
  expectedValue?: number | string;
  actualValue?: number | string;
  tolerance?: number;
  isRequired: boolean;
  isCompleted: boolean;
  notes?: string;
}

export interface StudyExecution {
  id: string;
  studyId: string;
  studyName: string;
  protocolId: string;
  protocolName: string;
  category: string;
  startedAt: Date;
  completedAt?: Date;
  status: ExecutionStatus;
  currentStepIndex: number;
  steps: ExecutionStep[];
  operator: {
    id: string;
    name: string;
    position: string;
  };
  equipment?: {
    name: string;
    model: string;
    serialNumber: string;
  };
  environment: {
    temperature?: number;
    humidity?: number;
    pressure?: number;
    notes?: string;
  };
  results: {
    overallStatus: 'PASSED' | 'FAILED' | 'PENDING';
    summary: string;
    attachments: string[];
  };
}

export type ExecutionStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS' 
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

export interface ExecutionStepProps {
  step: ExecutionStep;
  stepIndex: number;
  totalSteps: number;
  onStepComplete: (stepId: string, measurements: ExecutionMeasurement[], notes?: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export interface StudyExecutionContextType {
  execution: StudyExecution | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loadStudyForExecution: (studyId: string) => Promise<void>;
  startExecution: () => Promise<void>;
  pauseExecution: () => Promise<void>;
  resumeExecution: () => Promise<void>;
  completeExecution: () => Promise<void>;
  cancelExecution: () => Promise<void>;
  
  // Step management
  goToStep: (stepIndex: number) => void;
  completeCurrentStep: (measurements: ExecutionMeasurement[], notes?: string) => Promise<void>;
  
  // Data updates
  updateMeasurement: (stepId: string, measurementId: string, value: number | string, notes?: string) => void;
  updateEnvironment: (environment: Partial<StudyExecution['environment']>) => void;
  addNote: (stepId: string, note: string) => void;
  
  // Results
  saveResults: () => Promise<void>;
  exportResults: () => Promise<void>;
}

// Extended study type with execution data
export interface StudyWithExecutionData extends Study {
  stepMeasurements?: StepMeasurementConfig[];
  operatorInfo?: OperatorInfo;
  equipmentList?: EquipmentItem[];
}

export interface StepMeasurementConfig {
  stepId: string;
  stepTitle: string;
  stepDescription: string;
  measurements: MeasurementDefinition[];
  isRequired: boolean;
  estimatedDuration?: string;
}

export interface MeasurementDefinition {
  id: string;
  name: string;
  description?: string;
  type: string;
  dataType: string;
  unit?: string;
  isRequired: boolean;
  validationRules?: any;
  defaultValue?: any;
}

export interface OperatorInfo {
  name: string;
  position: string;
  operatorId: string;
  notes: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  calibrationDate: string;
  notes: string;
}
