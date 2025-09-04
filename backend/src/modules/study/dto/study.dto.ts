import { 
  StudyStatus, 
  StudyPriority, 
  StudySettings, 
  StudyTeamMember,
  DataCollectionStep,
  StudyParameter,
  SessionStatus,
  SessionConditions,
  SessionData
} from '../types/study.types';

// Study Response DTOs
export interface StudyResponseDto {
  id: string;
  title: string;
  description?: string;
  protocolId: string;
  protocolName?: string;
  status: StudyStatus;
  priority: StudyPriority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  expectedEndDate?: string;
  createdBy: string;
  modifiedBy?: string;
  settings: StudySettings;
  dataCollectionSteps: DataCollectionStep[];
  studyParameters: StudyParameter[];
  teamMembers: StudyTeamMember[];
  sessionsCount: number;
  completedSessionsCount: number;
  samplesCount: number;
  estimatedDuration?: string;
  actualDuration?: string;
  notes?: string;
  version: number;
  isTemplate: boolean;
  templateId?: string;
}

export interface StudyListResponseDto {
  id: string;
  title: string;
  description?: string;
  protocolName?: string;
  status: StudyStatus;
  priority: StudyPriority;
  tags: string[];
  createdAt: string;
  startDate?: string;
  endDate?: string;
  createdBy: string;
  sessionsCount: number;
  completedSessionsCount: number;
  samplesCount: number;
  teamMembersCount: number;
  estimatedDuration?: string;
}

export interface StudyStatsDto {
  totalStudies: number;
  activeStudies: number;
  completedStudies: number;
  draftStudies: number;
  averageCompletionTime: number;
  totalSessions: number;
  completedSessions: number;
  totalSamples: number;
  processingTime: number;
}

// Study Create/Update DTOs
export interface CreateStudyDto {
  title: string;
  description?: string;
  protocolId: string;
  priority?: StudyPriority;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  expectedEndDate?: string;
  settings: StudySettings;
  dataCollectionSteps: DataCollectionStep[];
  studyParameters?: StudyParameter[];
  notes?: string;
  isTemplate?: boolean;
  templateId?: string;
}

export interface UpdateStudyDto {
  title?: string;
  description?: string;
  priority?: StudyPriority;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  expectedEndDate?: string;
  settings?: Partial<StudySettings>;
  dataCollectionSteps?: DataCollectionStep[];
  studyParameters?: StudyParameter[];
  notes?: string;
  status?: StudyStatus;
}

export interface DuplicateStudyDto {
  title: string;
  description?: string;
  includeSettings: boolean;
  includeDataSteps: boolean;
  includeParameters: boolean;
  includeTeam: boolean;
  resetStatus: boolean;
}

// Study Session DTOs
export interface StudySessionResponseDto {
  id: string;
  studyId: string;
  sessionName: string;
  status: SessionStatus;
  startTime?: string;
  endTime?: string;
  duration?: string;
  operatorId: string;
  operatorName?: string;
  sampleId?: string;
  sampleName?: string;
  conditions: SessionConditions;
  data: SessionData[];
  calculations: Record<string, any>;
  qualityCheck: Record<string, any>;
  notes?: string;
  completedSteps: number;
  totalSteps: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudySessionDto {
  sessionName: string;
  sampleId?: string;
  sampleName?: string;
  conditions?: SessionConditions;
  notes?: string;
  operatorId: string;
}

export interface UpdateStudySessionDto {
  sessionName?: string;
  status?: SessionStatus;
  sampleId?: string;
  sampleName?: string;
  conditions?: SessionConditions;
  data?: SessionData[];
  calculations?: Record<string, any>;
  qualityCheck?: Record<string, any>;
  notes?: string;
  endTime?: string;
}

// Study Result DTOs
export interface StudyResultResponseDto {
  id: string;
  studyId: string;
  sessionId: string;
  sampleId?: string;
  parameters: Record<string, any>;
  measurements: Record<string, any>;
  calculatedValues: Record<string, any>;
  statisticalData: Record<string, any>;
  qualityData: Record<string, any>;
  validationStatus: 'pending' | 'approved' | 'rejected';
  validatedBy?: string;
  validatedAt?: string;
  validationNotes?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudyResultDto {
  sessionId: string;
  sampleId?: string;
  parameters: Record<string, any>;
  measurements: Record<string, any>;
  calculatedValues?: Record<string, any>;
  statisticalData?: Record<string, any>;
  qualityData?: Record<string, any>;
}

export interface UpdateStudyResultDto {
  parameters?: Record<string, any>;
  measurements?: Record<string, any>;
  calculatedValues?: Record<string, any>;
  statisticalData?: Record<string, any>;
  qualityData?: Record<string, any>;
  validationStatus?: 'pending' | 'approved' | 'rejected';
  validationNotes?: string;
}

// Study Team Management DTOs
export interface AddTeamMemberDto {
  userId: string;
  role: string;
  permissions?: string[];
}

export interface UpdateTeamMemberDto {
  role?: string;
  permissions?: string[];
}

// Study Analysis DTOs
export interface StudyAnalysisDto {
  studyId: string;
  summary: {
    totalSessions: number;
    completedSessions: number;
    successRate: number;
    averageDuration: string;
    totalSamples: number;
  };
  results: {
    parameters: Record<string, any>;
    statistics: Record<string, any>;
    qualityMetrics: Record<string, any>;
    trends: Record<string, any>;
  };
  performance: {
    efficiency: number;
    accuracy: number;
    consistency: number;
    completionRate: number;
  };
  recommendations: string[];
  generatedAt: string;
}

// Study Export DTOs
export interface ExportStudyDto {
  format: 'xlsx' | 'csv' | 'json' | 'pdf';
  includeSettings: boolean;
  includeSessions: boolean;
  includeResults: boolean;
  includeAnalysis: boolean;
  includeCharts: boolean;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
}

export interface StudyTemplateDto {
  id: string;
  name: string;
  description?: string;
  protocolId: string;
  settings: StudySettings;
  dataCollectionSteps: DataCollectionStep[];
  studyParameters: StudyParameter[];
  isPublic: boolean;
  usageCount: number;
  createdBy: string;
  createdAt: string;
  tags: string[];
}

export interface CreateStudyTemplateDto {
  name: string;
  description?: string;
  studyId: string;
  isPublic?: boolean;
  tags?: string[];
}
