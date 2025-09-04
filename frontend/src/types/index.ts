import React from 'react';

// Enums
export enum StudyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED'
}

// Types for protocol-based research studies
export interface StudySession {
  id: string;
  studyId: string;
  studyTemplateId?: string;
  sampleId?: string;
  operator?: string;
  equipment?: string;
  startTime: Date;
  endTime?: Date;
  data: Record<string, number>;
  conditions?: Record<string, any>;
  notes?: string;
  status?: string;
  progress?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudyResult {
  id: string;
  studyId: string;
  sessionId: string;
  parameters: Record<string, number>;
  calculatedValues?: Record<string, number>;
  quality?: 'pass' | 'fail' | 'warning';
  notes?: string;
  createdAt: Date;
}

// Advanced study template types for complex study creation
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
  validationRules?: {
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

export interface StudySettings {
  sampleSettings: {
    minSamples: number;
    maxSamples: number;
    defaultSamples: number;
    sampleNaming: 'automatic' | 'manual';
    samplePrefix?: string;
  };
  sessionSettings: {
    maxSessions: number;
    allowUnlimitedSessions: boolean;
    sessionTimeoutMinutes?: number;
    autoSaveInterval: number; // minutes
    requireSessionNotes: boolean;
    allowParallelSessions: boolean;
  };
  scheduleSettings: {
    startDate?: Date;
    endDate?: Date;
    estimatedDurationHours?: number;
    reminderSettings: {
      enabled: boolean;
      daysBefore: number[];
      emailNotifications: boolean;
    };
  };
  qualitySettings: {
    enableQualityControl: boolean;
    outlierDetectionMethod: 'iqr' | 'zscore' | 'none';
    controlLimits: '2sigma' | '3sigma';
    minimumReplicates: number;
    requireCalibration: boolean;
  };
  repetitionSettings: {
    allowRepetitions: boolean;
    maxRepetitions: number;
    repetitionNaming: 'automatic' | 'manual';
  };
  validationSettings: {
    requireAllSteps: boolean;
    allowSkippingOptional: boolean;
    requireApproval: boolean;
    reviewerEmails?: string[];
  };
  exportSettings: {
    autoExport: boolean;
    exportFormat: 'xlsx' | 'csv' | 'json';
    includeCalculations: boolean;
    includeCharts: boolean;
    exportAfterEachSession: boolean;
  };
  securitySettings: {
    restrictedAccess: boolean;
    allowedUsers?: string[];
    requireAuthentication: boolean;
    dataEncryption: boolean;
  };
}

export interface StudyTemplate {
  id?: string;
  name: string;
  description?: string;
  protocolId?: string | null; // Opcjonalne dla predefiniowanych protokołów
  protocolName?: string;
  category?: string;
  dataCollectionPlan: DataCollectionStep[];
  parameters: StudyParameter[];
  settings: StudySettings;
  status: 'draft' | 'active' | 'completed' | 'paused';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface Study {
  id: string;
  name: string;
  title?: string; // Backward compatibility
  description?: string;
  protocolId?: string | null; // Opcjonalne dla predefiniowanych protokołów
  protocolName?: string; // Cache field
  category?: string;
  status: StudyStatus;
  settings?: Record<string, any>;
  parameters?: Record<string, any>;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isTemplate?: boolean;
  sessions?: StudySession[];
  results?: StudyResult[];
  _count?: {
    sessions?: number;
    results?: number;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}

// Form data types
export interface CreateStudyForm {
  name: string; // Przywracamy 'name'
  description?: string;
  protocolId: string;
  category?: string;
  settings?: Record<string, any>;
  parameters?: Record<string, any>;
}

export interface UpdateStudyForm {
  name?: string;
  description?: string;
  status?: StudyStatus;
  category?: string;
  settings?: Record<string, any>;
  parameters?: Record<string, any>;
}

// Component props types
export interface StudyCardProps {
  study: Study;
  onEdit?: (study: Study) => void;
  onDelete?: (studyId: string) => void;
  onStatusChange?: (studyId: string, status: StudyStatus) => void;
}

// Navigation types
export interface NavigationItem {
  label: string;
  path: string;
  icon?: React.ComponentType;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

// Pagination
export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  title?: string;
  department?: string;
  position?: string;
}

export interface SampleData {
  id: string;
  name?: string;
  studyTemplateId?: string;
  sampleNumber: number;
  sampleName: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  data: Record<string, any>;
  measurements: Record<string, any>;
  startTime?: string;
  endTime?: string;
  notes: string;
}

// Study Execution Types - dopasowane do backendu
export enum ExecutionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED'
}

export enum SampleStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  SKIPPED = 'SKIPPED'
}

export enum ExportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
  JSON = 'JSON'
}

export enum ExportType {
  COMPLETE_REPORT = 'COMPLETE_REPORT',
  SAMPLE_RESULTS = 'SAMPLE_RESULTS',
  MEASUREMENTS_ONLY = 'MEASUREMENTS_ONLY',
  SUMMARY_ONLY = 'SUMMARY_ONLY',
  TEMPLATE = 'TEMPLATE'
}

export interface EnvironmentConditions {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  airflow?: number;
  lighting?: number;
  vibration?: number;
}

export interface TestConditions {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  force?: number;
  speed?: number;
  duration?: number;
  cycles?: number;
  frequency?: number;
}

export interface StudyExecutionSample {
  id: string;
  executionId: string;
  name: string;
  description?: string;
  material?: string;
  properties?: Record<string, any>;
  status: SampleStatus;
  startedAt?: Date;
  completedAt?: Date;
  estimatedTime?: string;
  actualTime?: string;
  notes?: string;
  batchNumber?: string;
  lotNumber?: string;
  quality?: 'pass' | 'fail' | 'warning';
}

export interface StudyMeasurement {
  id: string;
  executionId: string;
  sampleId: string;
  stepId: string;
  measurementId: string;
  value?: number;
  textValue?: string;
  unit?: string;
  isValid: boolean;
  quality?: 'good' | 'acceptable' | 'poor';
  confidence?: number;
  uncertainty?: number;
  operator: string;
  equipment?: string;
  method?: string;
  timestamp: Date;
  duration?: string;
  conditions?: Record<string, any>;
  notes?: string;
  flags?: string[];
  rawData?: Record<string, any>;
  calculatedData?: Record<string, any>;
  attachments?: string[];
}

export interface StudyExecution {
  id: string;
  studyId: string;
  studyName: string;
  protocolId?: string;
  protocolName: string;
  category: string;
  operatorId: string;
  operator?: User;
  status: ExecutionStatus;
  progress: number;
  currentStep?: number;
  environment: EnvironmentConditions;
  testConditions?: TestConditions;
  samples: StudyExecutionSample[];
  measurements: StudyMeasurement[];
  exports: StudyExport[];
  startedAt?: Date;
  pausedAt?: Date;
  completedAt?: Date;
  estimatedDuration?: string;
  actualDuration?: string;
  summary?: string;
  recommendations?: string;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyExport {
  id: string;
  executionId: string;
  format: ExportFormat;
  type: ExportType;
  status: string;
  filePath?: string;
  fileSize?: number;
  includeCharts: boolean;
  includeSamples: boolean;
  includeRawData: boolean;
  template?: string;
  requestedById: string;
  requestedAt: Date;
  completedAt?: Date;
  downloadUrl?: string;
  expiresAt?: Date;
}

// Request interfaces
export interface CreateStudyExecutionRequest {
  studyId: string;
  studyName: string;
  protocolId?: string;
  protocolName: string;
  category: string;
  operatorId: string;
  environment: EnvironmentConditions;
  testConditions?: TestConditions;
  samples: CreateSampleRequest[];
  estimatedDuration?: string;
  notes?: string;
  tags?: string[];
}

export interface CreateSampleRequest {
  name: string;
  description?: string;
  material?: string;
  properties?: Record<string, any>;
  estimatedTime?: string;
  notes?: string;
  batchNumber?: string;
  lotNumber?: string;
}

export interface AddMeasurementRequest {
  sampleId: string;
  stepId: string;
  measurementId: string;
  value?: number;
  textValue?: string;
  unit?: string;
  operator: string;
  equipment?: string;
  method?: string;
  conditions?: Record<string, any>;
  notes?: string;
  rawData?: Record<string, any>;
}

export interface CreateExportRequest {
  executionId: string;
  format: ExportFormat;
  type: ExportType;
  includeCharts?: boolean;
  includeSamples?: boolean;
  includeRawData?: boolean;
  template?: string;
  requestedById: string;
}

export interface StudyExecutionFilters {
  status?: ExecutionStatus[];
  operatorId?: string;
  studyId?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  search?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationInfo;
}
