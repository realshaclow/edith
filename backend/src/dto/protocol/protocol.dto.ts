import { 
  EquipmentDto, 
  OverviewDto, 
  TestConditionDto, 
  CalculationDto, 
  AcceptanceCriterionDto, 
  ProtocolStepDto, 
  CommonIssueDto, 
  TypicalValueDto 
} from './protocol-components.dto';

// Główne DTO dla protokołu
export interface CreateProtocolDto {
  title: string;
  description?: string;
  category: 'PHYSICAL' | 'CHEMICAL' | 'THERMAL' | 'MECHANICAL' | 'FIRE' | 'WEATHERING' | 'RHEOLOGICAL';
  difficulty: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
  estimatedDuration?: string;
  overview: OverviewDto;
  equipment: EquipmentDto[];
  materials: string[];
  safetyGuidelines: string[];
  references?: string[];
  notes?: string[];
  steps: ProtocolStepDto[];
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
  category?: 'PHYSICAL' | 'CHEMICAL' | 'THERMAL' | 'MECHANICAL' | 'FIRE' | 'WEATHERING' | 'RHEOLOGICAL';
  difficulty?: 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
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

// Response DTOs
export interface ProtocolResponseDto {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'PREDEFINED' | 'USER';
  difficulty: string;
  estimatedDuration?: string;
  overview: OverviewDto;
  equipment: EquipmentDto[];
  materials: string[];
  safetyGuidelines: string[];
  references: string[];
  notes: string[];
  steps: ProtocolStepDto[];
  testConditions: TestConditionDto[];
  calculations: CalculationDto[];
  acceptanceCriteria: AcceptanceCriterionDto[];
  typicalValues: TypicalValueDto[];
  commonIssues: CommonIssueDto[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  isPublic: boolean;
  isActive: boolean;
  isPredefined: boolean;
  version: string;
}

// List protocols response
export interface ProtocolListItemDto {
  id: string;
  title: string;
  description?: string;
  category: string;
  type: 'PREDEFINED' | 'USER';
  difficulty: string;
  estimatedDuration?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  isPublic: boolean;
  isPredefined: boolean;
  stepsCount: number;
  calculationsCount: number;
}

// Filter/Query DTOs
export interface ProtocolQueryDto {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  type?: 'PREDEFINED' | 'USER' | 'ALL';
  search?: string;
  createdBy?: string;
  isPublic?: boolean;
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'category' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

export interface ProtocolStatsDto {
  total: number;
  byCategory: Record<string, number>;
  byDifficulty: Record<string, number>;
  byType: Record<string, number>;
  predefinedCount: number;
  userCount: number;
  publicCount: number;
}
