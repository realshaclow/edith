export interface ExecutionStep {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  duration?: number; // w minutach
  temperature?: number; // w stopniach Celsjusza
  pressure?: number; // w barach
  safetyNotes?: string[];
  requiredEquipment?: string[];
  parameters?: ExecutionParameter[];
  dataPoints?: ExecutionDataPoint[];
  isOptional?: boolean;
  autoAdvance?: boolean;
  requiresApproval?: boolean;
  warningConditions?: WarningCondition[];
}

export interface ExecutionParameter {
  id: string;
  name: string;
  value: string | number;
  unit?: string;
  type: 'temperature' | 'pressure' | 'time' | 'distance' | 'weight' | 'volume' | 'other';
  description?: string;
}

export interface ExecutionDataPoint {
  id: string;
  name: string;
  type: 'measurement' | 'observation' | 'calculation' | 'image' | 'file';
  unit?: string;
  required: boolean;
  description?: string;
  validationRules?: ValidationRule[];
  defaultValue?: any;
}

export interface ValidationRule {
  type: 'min' | 'max' | 'range' | 'pattern' | 'required' | 'custom';
  value?: any;
  message: string;
}

export interface WarningCondition {
  id: string;
  condition: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  action?: 'pause' | 'stop' | 'notify';
}

export interface ExecutionSession {
  id: string;
  studyId: string;
  sessionNumber: number;
  status: 'preparing' | 'in_progress' | 'paused' | 'completed' | 'cancelled' | 'error';
  startTime?: Date;
  endTime?: Date;
  pausedTime?: number; // czas pauzy w sekundach
  currentStepIndex: number;
  stepTimers: StepTimer[];
  samples: ExecutionSample[];
  operator: string;
  notes: string;
  environment?: EnvironmentData;
  metadata: SessionMetadata;
}

export interface StepTimer {
  stepId: string;
  startTime?: Date;
  endTime?: Date;
  pausedTime: number;
  totalTime: number; // w sekundach
  targetDuration?: number; // w sekundach
  isRunning: boolean;
  isPaused: boolean;
}

export interface ExecutionSample {
  id: string;
  sampleNumber: number;
  sampleName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  data: Record<string, any>;
  measurements: Record<string, any>;
  observations: Record<string, any>;
  images: string[];
  files: string[];
  stepResults: StepResult[];
  startTime?: Date;
  endTime?: Date;
  notes: string;
  qualityChecks: QualityCheck[];
}

export interface StepResult {
  stepId: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  startTime?: Date;
  endTime?: Date;
  data: Record<string, any>;
  notes: string;
  operator: string;
  approvedBy?: string;
  approvalTime?: Date;
}

export interface QualityCheck {
  id: string;
  type: string;
  result: 'pass' | 'fail' | 'warning';
  message: string;
  checkedBy: string;
  checkedAt: Date;
}

export interface EnvironmentData {
  temperature: number;
  humidity: number;
  pressure: number;
  timestamp: Date;
  location?: string;
  equipment?: string[];
}

export interface SessionMetadata {
  version: string;
  protocolVersion?: string;
  equipmentCalibration?: Record<string, Date>;
  operatorCertification?: string;
  labConditions?: string;
}

export interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime?: Date;
  pausedTime: number;
  totalTime: number;
  targetTime?: number;
}

export interface ExecutionSettings {
  autoSave: boolean;
  autoAdvance: boolean;
  requireApproval: boolean;
  allowPause: boolean;
  showTimer: boolean;
  showProgress: boolean;
  enableNotifications: boolean;
  soundNotifications: boolean;
  autoBackup: boolean;
  strictMode: boolean;
}

export interface ExecutionEvent {
  id: string;
  type: 'step_started' | 'step_completed' | 'step_paused' | 'data_collected' | 'error' | 'warning' | 'note_added';
  timestamp: Date;
  stepId?: string;
  sampleId?: string;
  message: string;
  data?: any;
  operator: string;
}

export interface ProtocolInstructions {
  stepId: string;
  title: string;
  overview: string;
  detailedInstructions: string[];
  safetyGuidelines: string[];
  equipment: string[];
  materials: string[];
  duration: number;
  temperature?: number;
  pressure?: number;
  specialConditions?: string[];
  troubleshooting?: TroubleshootingItem[];
  qualityControls?: string[];
  criticalPoints?: string[];
}

export interface TroubleshootingItem {
  problem: string;
  cause: string;
  solution: string;
  prevention: string;
}

export interface NavigationState {
  canGoBack: boolean;
  canGoNext: boolean;
  canComplete: boolean;
  nextStepId?: string;
  previousStepId?: string;
}
