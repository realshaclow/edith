/**
 * Protocol Response DTOs
 * Obiekty transferu danych dla odpowiedzi API protokołów
 */

import {
  ProtocolCategory,
  ProtocolDifficulty,
  ProtocolType,
  EquipmentDto,
  OverviewDto,
  TestConditionDto,
  CalculationDto,
  AcceptanceCriterionDto,
  TypicalValueDto,
  CommonIssueDto,
  ProtocolStepDto
} from './base.dto';

export interface ProtocolResponseDto {
  id: string;
  title: string;
  description?: string;
  category: ProtocolCategory;
  type: ProtocolType;
  version: string;
  difficulty: ProtocolDifficulty;
  estimatedDuration?: string;
  
  // Strukturalne sekcje
  overview: OverviewDto;
  equipment: EquipmentDto[];
  materials: string[];
  safetyGuidelines: string[];
  references: string[];
  notes?: string[];
  
  // Kroki procesu
  steps: ProtocolStepWithIdDto[];
  
  // Warunki testowe
  testConditions: TestConditionWithIdDto[];
  
  // Obliczenia
  calculations: CalculationWithIdDto[];
  
  // Kryteria akceptacji
  acceptanceCriteria: AcceptanceCriterionWithIdDto[];
  
  // Typowe wartości
  typicalValues: TypicalValueWithIdDto[];
  
  // Częste problemy
  commonIssues: CommonIssueWithIdDto[];
  
  // Metadane
  isPublic: boolean;
  isActive: boolean;
  isPredefined: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}

// DTOs z ID dla istniejących rekordów
export interface ProtocolStepWithIdDto extends ProtocolStepDto {
  id: string;
  stepNumber: number;
}

export interface TestConditionWithIdDto extends TestConditionDto {
  id: string;
}

export interface CalculationWithIdDto extends CalculationDto {
  id: string;
}

export interface AcceptanceCriterionWithIdDto extends AcceptanceCriterionDto {
  id: string;
}

export interface TypicalValueWithIdDto extends TypicalValueDto {
  id: string;
}

export interface CommonIssueWithIdDto extends CommonIssueDto {
  id: string;
}

// Lightweight protocol for lists
export interface ProtocolListItemDto {
  id: string;
  title: string;
  description?: string;
  category: ProtocolCategory;
  type: ProtocolType;
  difficulty: ProtocolDifficulty;
  estimatedDuration?: string;
  isPublic: boolean;
  isActive: boolean;
  isPredefined: boolean;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  _count: {
    steps: number;
    testConditions: number;
    calculations: number;
  };
}

// Summary statistics
export interface ProtocolStatsDto {
  total: number;
  byCategory: Record<ProtocolCategory, number>;
  byDifficulty: Record<ProtocolDifficulty, number>;
  byType: Record<ProtocolType, number>;
  public: number;
  private: number;
  active: number;
  inactive: number;
}

// Search/Filter criteria
export interface ProtocolFilterDto {
  category?: ProtocolCategory[];
  difficulty?: ProtocolDifficulty[];
  type?: ProtocolType[];
  isPublic?: boolean;
  isActive?: boolean;
  isPredefined?: boolean;
  createdBy?: string[];
  search?: string; // search in title, description
  dateFrom?: string;
  dateTo?: string;
}

export interface ProtocolPaginationDto {
  page: number;
  limit: number;
  sortBy?: 'title' | 'category' | 'difficulty' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedProtocolResponseDto {
  data: ProtocolListItemDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  filters?: ProtocolFilterDto;
  stats?: ProtocolStatsDto;
}
