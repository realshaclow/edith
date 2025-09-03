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
  name: string;
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
