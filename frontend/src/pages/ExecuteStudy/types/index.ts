// Types for ExecuteStudy module
export interface ExecutionContext {
  studyId: string;
  studyName: string;
  protocolId: string;
  protocol: ProtocolForExecution;
  samples: StudySample[];
  currentSampleIndex: number;
  currentStepIndex: number;
  executionMode: 'sequential' | 'parallel';
  operator: string;
  startTime?: Date;
  endTime?: Date;
}

export interface ProtocolForExecution {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty?: string;
  estimatedDuration?: string;
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
  steps: ProtocolStepForExecution[];
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
  calculations: Array<{
    id: string;
    name: string;
    description: string;
    formula: string;
    variables: Array<{
      symbol: string;
      name: string;
      unit: string;
      description?: string;
    }>;
    resultUnit: string;
  }>;
}

export interface ProtocolStepForExecution {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructions: string[];
  tips: string[];
  safety: string[];
  parameters?: StepParameter[];
  measurements?: StepMeasurement[];
  conditions?: StepCondition[];
}

export interface StepParameter {
  id: string;
  name: string;
  type: 'number' | 'text' | 'boolean' | 'select';
  unit?: string;
  value?: any;
  required: boolean;
  description?: string;
  constraints?: {
    min?: number;
    max?: number;
    options?: string[];
  };
}

export interface StepMeasurement {
  id: string;
  name: string;
  type: 'manual' | 'automatic' | 'calculated';
  unit: string;
  value?: number;
  description?: string;
  required: boolean;
  precision?: number;
  equipment?: string;
}

export interface StepCondition {
  id: string;
  name: string;
  value: string;
  unit: string;
  tolerance: string;
  verified: boolean;
  verificationTime?: Date;
  notes?: string;
}

export interface StudySample {
  id: string;
  name: string;
  type: string;
  description?: string;
  preparation: string[];
  conditions: string[];
  measurements: SampleMeasurement[];
  notes: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  operator?: string;
}

export interface SampleMeasurement {
  id: string;
  stepId: string;
  measurementId: string;
  name: string;
  value?: number;
  unit: string;
  timestamp?: Date;
  equipment?: string;
  notes?: string;
  validated: boolean;
}

export interface ExecutionSession {
  id: string;
  studyId: string;
  sampleId: string;
  operator: string;
  startTime: Date;
  endTime?: Date;
  currentStepIndex: number;
  stepResults: StepResult[];
  environmentalConditions: EnvironmentalConditions;
  notes: string;
  status: 'active' | 'paused' | 'completed' | 'aborted';
}

export interface StepResult {
  stepId: string;
  stepTitle: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped' | 'failed';
  startTime?: Date;
  endTime?: Date;
  duration?: number;
  parameters: { [key: string]: any };
  measurements: { [key: string]: number };
  conditions: { [key: string]: boolean };
  notes: string;
  operator?: string;
  issues?: ExecutionIssue[];
}

export interface ExecutionIssue {
  id: string;
  type: 'warning' | 'error' | 'note';
  message: string;
  timestamp: Date;
  stepId?: string;
  resolved: boolean;
  resolution?: string;
}

export interface EnvironmentalConditions {
  temperature: {
    value: number;
    unit: string;
    timestamp: Date;
    withinTolerance: boolean;
  };
  humidity: {
    value: number;
    unit: string;
    timestamp: Date;
    withinTolerance: boolean;
  };
  pressure: {
    value: number;
    unit: string;
    timestamp: Date;
    withinTolerance: boolean;
  };
  atmosphere: string;
  notes?: string;
}

export interface ExecutionProgress {
  totalSteps: number;
  completedSteps: number;
  currentStep: number;
  totalSamples: number;
  completedSamples: number;
  currentSample: number;
  estimatedTimeRemaining: string;
  actualDuration: string;
  efficiency: number; // percentage
}

export type ExecutionView = 
  | 'overview'
  | 'protocol-review'
  | 'sample-preparation'
  | 'execution'
  | 'results'
  | 'report';

export interface UseExecuteStudyReturn {
  context: ExecutionContext;
  session: ExecutionSession | null;
  progress: ExecutionProgress;
  currentView: ExecutionView;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  startExecution: (studyId: string, operator: string) => Promise<boolean>;
  pauseExecution: () => void;
  resumeExecution: () => void;
  stopExecution: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepIndex: number) => void;
  nextSample: () => void;
  previousSample: () => void;
  goToSample: (sampleIndex: number) => void;
  updateStepResult: (stepId: string, result: Partial<StepResult>) => void;
  updateMeasurement: (measurementId: string, value: number) => void;
  updateParameter: (parameterId: string, value: any) => void;
  updateCondition: (conditionId: string, verified: boolean, notes?: string) => void;
  completeStep: () => void;
  addIssue: (issue: Omit<ExecutionIssue, 'id' | 'timestamp'>) => void;
  resolveIssue: (issueId: string, resolution: string) => void;
  saveSession: () => Promise<boolean>;
  generateReport: () => Promise<boolean>;
  setView: (view: ExecutionView) => void;
}
