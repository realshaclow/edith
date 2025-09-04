export interface StudyExecutionData {
  id: string;
  studyId: string;
  studyName: string;
  protocolId?: string;
  protocolName: string;
  category: string;
  operatorId: string;
  operatorName: string;
  operatorPosition: string;
  status: ExecutionStatus;
  progress: number;
  currentStep: number;
  totalSteps: number;
  startedAt?: Date;
  completedAt?: Date;
  pausedAt?: Date;
  estimatedDuration?: string;
  actualDuration?: string;
  environment: EnvironmentConditions;
  testConditions?: TestConditions;
  overallStatus: ResultStatus;
  summary?: string;
  recommendations?: string;
  attachments?: string[];
  passedSamples: number;
  failedSamples: number;
  completionPercentage: number;
  notes?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  samples: StudyExecutionSampleData[];
  measurements: StudyMeasurementData[];
  exports: StudyExportData[];
}

export interface StudyExecutionSampleData {
  id: string;
  executionId: string;
  sampleNumber: number;
  name: string;
  description?: string;
  material?: string;
  status: SampleStatus;
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  estimatedTime?: string;
  actualTime?: string;
  operatorId?: string;
  operatorName?: string;
  quality?: 'pass' | 'fail' | 'warning';
  anomalies?: string[];
  properties?: Record<string, any>;
  conditions?: Record<string, any>;
  notes?: string;
  tags?: string[];
  location?: string;
  batchNumber?: string;
  lotNumber?: string;
  measurements: StudyMeasurementData[];
}

export interface StudyMeasurementData {
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

export interface StudyExportData {
  id: string;
  executionId: string;
  studyId: string;
  format: ExportFormat;
  type: ExportType;
  filename: string;
  filepath?: string;
  size?: number;
  includeCharts: boolean;
  includeSamples: boolean;
  includeRawData: boolean;
  template?: string;
  status: ExportStatus;
  progress: number;
  requestedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  requestedById: string;
  requestedBy: string;
  downloadCount: number;
  lastDownloadAt?: Date;
  metadata?: Record<string, any>;
  errors?: string[];
}

export interface EnvironmentConditions {
  temperature?: number;
  humidity?: number;
  pressure?: number;
  notes?: string;
  measurementTime?: Date;
  location?: string;
  equipment?: string;
}

export interface TestConditions {
  [key: string]: any;
  speed?: number;
  force?: number;
  duration?: number;
  cycles?: number;
  frequency?: number;
}

// Enums odpowiadające Prisma schema
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

export enum ResultStatus {
  PENDING = 'PENDING',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  PARTIAL = 'PARTIAL'
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

export enum ExportStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  EXPIRED = 'EXPIRED'
}

// Request/Response interfaces
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

export interface UpdateExecutionStatusRequest {
  status: ExecutionStatus;
  progress?: number;
  currentStep?: number;
  notes?: string;
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
  expiresAt?: Date;
  metadata?: Record<string, any>;
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

export interface StudyExecutionResponse {
  data: StudyExecutionData[];
  total: number;
  page: number;
  totalPages: number;
}
