import { Request } from 'express';
import { PrismaClient } from '@prisma/client';

// Rozszerz Express Request o Prisma
export interface RequestWithPrisma extends Request {
  prisma: PrismaClient;
}

// ===== ENUMS (ponownie zdefiniowane z Prismy) =====

export enum ProtocolType {
  PREDEFINED = 'PREDEFINED',
  USER = 'USER'
}

export enum DataPointType {
  MEASUREMENT = 'MEASUREMENT',
  OBSERVATION = 'OBSERVATION',
  CALCULATION = 'CALCULATION',
  CONDITION = 'CONDITION'
}

export enum DataType {
  NUMBER = 'NUMBER',
  TEXT = 'TEXT',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  FILE = 'FILE',
  SELECTION = 'SELECTION'
}

export enum ConditionCategory {
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  MECHANICAL = 'MECHANICAL',
  CHEMICAL = 'CHEMICAL',
  TEMPORAL = 'TEMPORAL',
  DIMENSIONAL = 'DIMENSIONAL',
  ELECTRICAL = 'ELECTRICAL',
  OPTICAL = 'OPTICAL'
}

export enum CalculationCategory {
  MECHANICAL = 'MECHANICAL',
  STATISTICAL = 'STATISTICAL',
  DIMENSIONAL = 'DIMENSIONAL',
  CHEMICAL = 'CHEMICAL',
  THERMAL = 'THERMAL',
  CUSTOM = 'CUSTOM'
}

export enum ValueCategory {
  MECHANICAL = 'MECHANICAL',
  THERMAL = 'THERMAL',
  ELECTRICAL = 'ELECTRICAL',
  CHEMICAL = 'CHEMICAL',
  DIMENSIONAL = 'DIMENSIONAL',
  OPTICAL = 'OPTICAL',
  PHYSICAL = 'PHYSICAL'
}

export enum IssueSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum StudyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
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

// ===== PROTOKOŁY BADAWCZE =====

export interface ProtocolOverview {
  purpose: string;
  scope: string;
  principles: string;
  standards: string[];
}

export interface ProtocolEquipment {
  name: string;
  specification: string;
}

export interface ProtocolStep {
  id: string;
  title: string;
  description?: string;
  duration?: string;
  instructions: string[];
  tips: string[];
  safety: string[];
}

export interface ProtocolDataPoint {
  name: string;
  description?: string;
  parameterType: DataPointType;
  dataType: DataType;
  unit?: string;
  isRequired: boolean;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  options?: any;
  isCalculated?: boolean;
  formula?: string;
}

export interface ProtocolTestCondition {
  name: string;
  value: string;
  unit?: string;
  tolerance?: string;
  category: ConditionCategory;
  required: boolean;
  description?: string;
}

export interface ProtocolCalculation {
  parameter: string;
  formula: string;
  units: string;
  description: string;
}

export interface ProtocolTypicalValue {
  parameter: string;
  material: string;
  value: string;
  unit?: string;
  minRange?: string;
  maxRange?: string;
  conditions?: string;
  category: ValueCategory;
  source?: string;
  isReference?: boolean;
  notes?: string;
}

export interface ProtocolCommonIssue {
  issue: string;
  cause: string;
  solution: string;
  severity?: IssueSeverity;
  frequency?: string;
}

// Interfejs dla protokołów z folderu data
export interface ResearchProtocolData {
  id: string;
  title: string;
  description?: string;
  category: string;
  difficulty?: string;
  estimatedDuration?: string;
  version?: string;
  
  overview?: ProtocolOverview;
  equipment?: ProtocolEquipment[];
  materials?: string[];
  safetyGuidelines?: string[];
  testConditions?: any;
  
  steps: ProtocolStep[];
  calculations?: ProtocolCalculation[];
  acceptanceCriteria?: string[];
  commonIssues?: ProtocolCommonIssue[];
  typicalValues?: ProtocolTypicalValue[];
  references?: string[];
  notes?: string[];
}

// ===== BADANIA I SESJE =====

export interface StudySettings {
  numberOfSamples?: number;
  testConditions?: Record<string, any>;
  dataCollection?: {
    automatic?: boolean;
    manualEntry?: boolean;
    fileUpload?: boolean;
  };
  qualityControl?: {
    duplicateChecks?: boolean;
    rangeValidation?: boolean;
    outlierDetection?: boolean;
  };
}

export interface StudyParameter {
  name: string;
  type: 'input' | 'calculated' | 'condition';
  unit?: string;
  defaultValue?: any;
  validationRules?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
}

// ===== DTO INTERFACES =====

export interface CreateProtocolDto {
  title: string;
  description?: string;
  category: string;
  difficulty?: string;
  estimatedDuration?: string;
  overview?: ProtocolOverview;
  equipment?: ProtocolEquipment[];
  materials?: string[];
  safetyGuidelines?: string[];
  testConditions?: any;
  steps: ProtocolStep[];
  calculations?: ProtocolCalculation[];
  typicalValues?: ProtocolTypicalValue[];
  commonIssues?: ProtocolCommonIssue[];
  references?: string[];
  notes?: string[];
}

export interface UpdateProtocolDto extends Partial<CreateProtocolDto> {}

export interface CreateStudyDto {
  name: string;
  description?: string;
  protocolId: string;
  protocolName?: string;
  category?: string;
  settings?: StudySettings;
  parameters?: StudyParameter[];
}

export interface UpdateStudyDto extends Partial<CreateStudyDto> {
  status?: StudyStatus;
}

export interface CreateStudySessionDto {
  studyId: string;
  sessionName: string;
  description?: string;
  operatorId: string;
  totalSamples: number;
  notes?: string;
}

export interface CreateStudySessionFromFrontendDto {
  studyId: string;
  sampleId?: string;
  operator?: string;
  equipment?: string;
  data: Record<string, number>;
  conditions?: Record<string, any>;
  notes?: string;
}

export interface UpdateStudySessionDto extends Partial<CreateStudySessionDto> {
  status?: SessionStatus;
  currentStepId?: string;
  completedSteps?: number;
  completedSamples?: number;
  startedAt?: Date;
  completedAt?: Date;
}

export interface CreateStudySampleDto {
  sessionId: string;
  sampleNumber: number;
  sampleName: string;
  description?: string;
  properties?: any;
  notes?: string;
}

export interface UpdateStudySampleDto extends Partial<CreateStudySampleDto> {
  status?: SampleStatus;
  startTime?: Date;
  endTime?: Date;
}

export interface CreateStudyResultDto {
  sessionId: string;
  sampleId?: string;
  stepId: string;
  dataPointId: string;
  value: string;
  unit?: string;
  measuredBy: string;
  isCalculated?: boolean;
  uncertainty?: number;
  validationNotes?: string;
}

export interface UpdateStudyResultDto extends Partial<CreateStudyResultDto> {
  isValid?: boolean;
}

// ===== API RESPONSE TYPES =====

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any[];
}
