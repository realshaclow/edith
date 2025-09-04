import { Study } from '../../../types';

// Sample execution tracking
export interface StudySample {
  id: string;
  name: string; // e.g., "S01", "SAMPLE_01"
  description?: string;
  material?: string;
  dimensions?: string;
  weight?: number;
  status: SampleStatus;
  measurements: SampleMeasurement[];
  completedSteps: string[];
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  operator?: string;
}

export type SampleStatus = 
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'SKIPPED';

export interface SampleMeasurement {
  stepId: string;
  measurementId: string;
  value?: number | string;
  timestamp: Date;
  operator: string;
  notes?: string;
}

// Test conditions from protocol
export interface TestCondition {
  name: string;
  value: string;
  unit: string;
  tolerance?: string;
  required: boolean;
  description?: string;
  actualValue?: string;
  isSet: boolean;
}

// Session-based execution
export interface ExecutionSession {
  id: string;
  name: string;
  samplesAssigned: string[]; // Sample IDs
  currentSampleIndex: number;
  status: SessionStatus;
  startedAt?: Date;
  completedAt?: Date;
  operator: string;
  environment: EnvironmentConditions;
  notes?: string;
}

export type SessionStatus = 
  | 'PLANNED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'PAUSED'
  | 'CANCELLED';

export interface EnvironmentConditions {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  lighting?: string;
  notes?: string;
  recordedAt?: Date;
}

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
  estimatedDuration?: string;
  actualDuration?: number; // minutes
}

export interface ExecutionMeasurement {
  id: string;
  name: string;
  description?: string;
  unit: string;
  type: string; // MEASUREMENT, OBSERVATION, CALCULATION
  dataType: string; // NUMBER, TEXT, BOOLEAN
  expectedValue?: number | string;
  actualValue?: number | string;
  tolerance?: number;
  isRequired: boolean;
  isCompleted: boolean;
  notes?: string;
  validationRules?: any;
}

export interface StudyExecution {
  id: string;
  studyId: string;
  studyName: string;
  protocolId: string;
  protocolName: string;
  category: string;
  
  // Execution flow
  status: ExecutionStatus;
  currentSessionIndex: number;
  currentStepIndex: number;
  currentSampleIndex: number;
  
  // Time tracking
  startedAt: Date;
  completedAt?: Date;
  estimatedDuration?: string;
  
  // Study configuration
  samples: StudySample[];
  sessions: ExecutionSession[];
  steps: ExecutionStep[];
  stepMeasurements: StepMeasurementConfig[];
  testConditions: TestCondition[];
  
  // Personnel and equipment
  operator: {
    id: string;
    name: string;
    position: string;
  };
  equipment?: {
    id: string;
    name: string;
    model: string;
    serialNumber: string;
    calibrationDate?: string;
  };
  
  // Environment and conditions
  environment: EnvironmentConditions;
  
  // Results and summary
  results: {
    overallStatus: 'PASSED' | 'FAILED' | 'PENDING' | 'PARTIAL';
    summary: string;
    attachments: string[];
    passedSamples: number;
    failedSamples: number;
    completionPercentage: number;
  };
  
  // Settings from study creation
  settings: {
    allowMultipleSessions: boolean;
    maxSamplesPerSession: number;
    sessionTimeout: number;
    autoProgressSteps: boolean;
  };
}

export type ExecutionStatus = 
  | 'NOT_STARTED'
  | 'IN_PROGRESS' 
  | 'PAUSED'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED';

// Component props
export interface ExecutionStepProps {
  step: ExecutionStep;
  stepIndex: number;
  totalSteps: number;
  currentSample?: StudySample;
  onStepComplete: (stepId: string, measurements: ExecutionMeasurement[], notes?: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export interface SampleExecutionProps {
  sample: StudySample;
  sampleIndex: number;
  totalSamples: number;
  currentStep: ExecutionStep;
  onSampleMeasurement: (sampleId: string, stepId: string, measurementId: string, value: number | string, notes?: string) => void;
  onSampleComplete: (sampleId: string) => void;
  onSampleSkip: (sampleId: string, reason: string) => void;
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
  
  // Session management
  startSession: (sessionIndex: number) => Promise<void>;
  completeSession: (sessionIndex: number) => Promise<void>;
  
  // Step management
  goToStep: (stepIndex: number) => void;
  completeCurrentStep: (measurements: ExecutionMeasurement[], notes?: string) => Promise<void>;
  
  // Sample management
  goToSample: (sampleIndex: number) => void;
  completeSample: (sampleId: string) => void;
  skipSample: (sampleId: string, reason: string) => void;
  
  // Data updates
  updateMeasurement: (sampleId: string, stepId: string, measurementId: string, value: number | string, notes?: string) => void;
  updateTestCondition: (conditionName: string, value: string) => void;
  updateEnvironment: (environment: Partial<EnvironmentConditions>) => void;
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
