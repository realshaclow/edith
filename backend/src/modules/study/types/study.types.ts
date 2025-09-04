// Study System Types - zgodne z frontendem i bazą danych

export enum StudyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

export enum StudyPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum StudyTeamRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  ANALYST = 'ANALYST',
  OPERATOR = 'OPERATOR',
  OBSERVER = 'OBSERVER',
  MEMBER = 'MEMBER'
}

export enum SessionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED'
}

export enum SampleStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REJECTED = 'REJECTED'
}

// Study Settings zgodnie z frontendem
export interface StudySampleSettings {
  minSamples: number;
  maxSamples: number;
  defaultSamples: number;
  sampleNaming: 'automatic' | 'manual';
  samplePrefix?: string;
}

export interface StudySessionSettings {
  maxSessions: number;
  allowUnlimitedSessions: boolean;
  sessionTimeoutMinutes?: number;
  autoSaveInterval: number; // minutes
  requireSessionNotes: boolean;
  allowParallelSessions: boolean;
}

export interface StudyScheduleSettings {
  startDate?: Date;
  endDate?: Date;
  estimatedDurationHours?: number;
  reminderSettings: {
    enabled: boolean;
    daysBefore: number[];
    emailNotifications: boolean;
  };
}

export interface StudyQualitySettings {
  enableQualityControl: boolean;
  outlierDetectionMethod: 'iqr' | 'zscore' | 'none';
  controlLimits: '2sigma' | '3sigma';
  minimumReplicates: number;
  requireCalibration: boolean;
}

export interface StudyRepetitionSettings {
  allowRepetitions: boolean;
  maxRepetitions: number;
  repetitionNaming: 'automatic' | 'manual';
}

export interface StudyValidationSettings {
  requireAllSteps: boolean;
  allowSkippingOptional: boolean;
  requireApproval: boolean;
  reviewerEmails?: string[];
}

export interface StudyExportSettings {
  autoExport: boolean;
  exportFormat: 'xlsx' | 'csv' | 'json';
  includeCalculations: boolean;
  includeCharts: boolean;
  exportAfterEachSession: boolean;
}

export interface StudySecuritySettings {
  restrictedAccess: boolean;
  allowedUsers?: string[];
  requireAuthentication: boolean;
  dataEncryption: boolean;
}

export interface StudySettings {
  sampleSettings: StudySampleSettings;
  sessionSettings: StudySessionSettings;
  scheduleSettings: StudyScheduleSettings;
  qualitySettings: StudyQualitySettings;
  repetitionSettings: StudyRepetitionSettings;
  validationSettings: StudyValidationSettings;
  exportSettings: StudyExportSettings;
  securitySettings: StudySecuritySettings;
}

// Data Collection Types zgodne z frontendem
export interface DataPoint {
  id: string;
  name: string;
  description: string;
  parameterType: 'measurement' | 'observation' | 'calculation' | 'condition';
  dataType: 'number' | 'text' | 'boolean' | 'date';
  unit?: string;
  isRequired: boolean;
  isCalculated: boolean;
  calculationFormula?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    required?: boolean;
  };
}

export interface DataCollectionStep {
  id: string;
  stepNumber?: number;
  name: string;
  stepName?: string; // alias for name
  description: string;
  estimatedDuration: string;
  isRequired: boolean;
  dataPoints: DataPoint[];
  instructions?: string[];
  safety?: string[];
}

export interface StudyParameter {
  id: string;
  name: string;
  value: string;
  unit?: string;
  description?: string;
}

// Session Execution Types
export interface SessionConditions {
  temperature?: string;
  humidity?: string;
  pressure?: string;
  atmosphere?: string;
  [key: string]: string | undefined;
}

export interface SessionData {
  stepIndex: number;
  stepName: string;
  measurements: Record<string, any>;
  observations: Record<string, any>;
  calculations: Record<string, any>;
  timestamp: string;
  operator: string;
  notes?: string;
}

export interface SessionProgress {
  currentStepIndex: number;
  totalSteps: number;
  completedSteps: number;
  startTime: string;
  estimatedEndTime?: string;
  actualDuration?: string;
  samplesCompleted: number;
  totalSamples: number;
}

// Team Management Types
export interface StudyTeamMember {
  id: string;
  userId: string;
  role: StudyTeamRole;
  permissions: string[];
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
  user?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}
