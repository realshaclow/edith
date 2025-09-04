import { 
  ProtocolCategory, 
  ProtocolDifficulty, 
  ProtocolType,
  ConditionCategory,
  CalculationCategory,
  ValueCategory,
  AcceptanceCategory,
  AcceptanceSeverity,
  AcceptanceOperator,
  IssueSeverity
} from '../types/protocol.types';

// Base interfaces for protocol components
export interface EquipmentDto {
  name: string;
  specification: string;
}

export interface OverviewDto {
  purpose: string;
  scope: string;
  principles: string;
  standards: string[];
}

export interface VariableDto {
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

export interface TestConditionDto {
  id?: string;
  name: string;
  value: string;
  unit?: string;
  tolerance?: string;
  category: ConditionCategory;
  required: boolean;
  description?: string;
}

export interface ProtocolStepDto {
  id?: string;
  stepNumber: number;
  title: string;
  description?: string;
  duration?: string;
  instructions: string[];
  tips: string[];
  safety: string[];
  isRequired: boolean;
}

export interface CalculationDto {
  id?: string;
  name: string;
  description?: string;
  formula: string;
  variables: VariableDto[];
  unit?: string;
  category: CalculationCategory;
  isRequired: boolean;
  example?: string;
  notes?: string;
}

export interface AcceptanceCriterionDto {
  id?: string;
  name: string;
  description?: string;
  parameter: string;
  operator: AcceptanceOperator;
  value: string;
  maxValue?: string;
  unit?: string;
  category: AcceptanceCategory;
  severity: AcceptanceSeverity;
  isRequired: boolean;
  notes?: string;
}

export interface TypicalValueDto {
  id?: string;
  parameter: string;
  material: string;
  value: string;
  unit?: string;
  minRange?: string;
  maxRange?: string;
  conditions?: string;
  category: ValueCategory;
  source?: string;
  isReference: boolean;
  notes?: string;
}

export interface CommonIssueDto {
  id?: string;
  issue: string;
  cause: string;
  solution: string;
  severity: IssueSeverity;
  frequency?: string;
}

// Main Protocol DTOs
export interface CreateProtocolDto {
  title: string;
  description?: string;
  category: ProtocolCategory;
  difficulty: ProtocolDifficulty;
  estimatedDuration?: string;
  overview?: OverviewDto;
  equipment?: EquipmentDto[];
  materials?: string[];
  safetyGuidelines?: string[];
  references?: string[];
  notes?: string[];
  steps?: ProtocolStepDto[];
  testConditions?: TestConditionDto[];
  calculations?: CalculationDto[];
  acceptanceCriteria?: AcceptanceCriterionDto[];
  typicalValues?: TypicalValueDto[];
  commonIssues?: CommonIssueDto[];
  isPublic?: boolean;
}

export interface UpdateProtocolDto {
  title?: string;
  description?: string;
  category?: ProtocolCategory;
  difficulty?: ProtocolDifficulty;
  estimatedDuration?: string;
  overview?: OverviewDto;
  equipment?: EquipmentDto[];
  materials?: string[];
  safetyGuidelines?: string[];
  references?: string[];
  notes?: string[];
  steps?: ProtocolStepDto[];
  testConditions?: TestConditionDto[];
  calculations?: CalculationDto[];
  acceptanceCriteria?: AcceptanceCriterionDto[];
  typicalValues?: TypicalValueDto[];
  commonIssues?: CommonIssueDto[];
  isPublic?: boolean;
  isActive?: boolean;
}

export interface ProtocolResponseDto {
  id: string;
  title: string;
  description?: string;
  category: ProtocolCategory;
  type: ProtocolType;
  version: string;
  difficulty: ProtocolDifficulty;
  estimatedDuration?: string;
  overview?: OverviewDto;
  equipment?: EquipmentDto[];
  materials?: string[];
  safetyGuidelines?: string[];
  references?: string[];
  notes?: string[];
  steps?: ProtocolStepDto[];
  testConditions?: TestConditionDto[];
  calculations?: CalculationDto[];
  acceptanceCriteria?: AcceptanceCriterionDto[];
  typicalValues?: TypicalValueDto[];
  commonIssues?: CommonIssueDto[];
  isPublic: boolean;
  isActive: boolean;
  isPredefined: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

export interface ProtocolListItemDto {
  id: string;
  title: string;
  description?: string;
  category: ProtocolCategory;
  type: ProtocolType;
  difficulty: ProtocolDifficulty;
  estimatedDuration?: string;
  isPublic: boolean;
  isPredefined: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  _count?: {
    steps: number;
    testConditions: number;
    calculations: number;
  };
}

export interface ProtocolQueryDto {
  page?: number;
  limit?: number;
  category?: ProtocolCategory;
  difficulty?: ProtocolDifficulty;
  type?: ProtocolType;
  search?: string;
  isPublic?: boolean;
  createdBy?: string;
  sortBy?: 'title' | 'category' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ProtocolStatsDto {
  total: number;
  byCategory: Record<ProtocolCategory, number>;
  byDifficulty: Record<ProtocolDifficulty, number>;
  byType: Record<ProtocolType, number>;
  predefined: number;
  userCreated: number;
  public: number;
  private: number;
}
