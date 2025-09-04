/**
 * Protocol Update DTO
 * Obiekt transferu danych dla aktualizacji protokołów
 */

import {
  ProtocolCategory,
  ProtocolDifficulty,
  EquipmentDto,
  OverviewDto,
  TestConditionDto,
  CalculationDto,
  AcceptanceCriterionDto,
  TypicalValueDto,
  CommonIssueDto,
  ProtocolStepDto
} from './base.dto';

export interface UpdateProtocolDto {
  // Podstawowe informacje (wszystkie opcjonalne dla aktualizacji)
  title?: string;
  description?: string;
  category?: ProtocolCategory;
  version?: string;
  difficulty?: ProtocolDifficulty;
  estimatedDuration?: string;
  
  // Strukturalne sekcje
  overview?: OverviewDto;
  equipment?: EquipmentDto[];
  materials?: string[];
  safetyGuidelines?: string[];
  references?: string[];
  notes?: string[];
  
  // Kroki procesu
  steps?: ProtocolStepDto[];
  
  // Warunki testowe
  testConditions?: TestConditionDto[];
  
  // Obliczenia
  calculations?: CalculationDto[];
  
  // Kryteria akceptacji
  acceptanceCriteria?: AcceptanceCriterionDto[];
  
  // Typowe wartości
  typicalValues?: TypicalValueDto[];
  
  // Częste problemy
  commonIssues?: CommonIssueDto[];
  
  // Metadane
  isPublic?: boolean;
  isActive?: boolean;
}

// Partial update dla specyficznych sekcji
export interface UpdateProtocolSectionDto {
  section: 'overview' | 'equipment' | 'materials' | 'safety' | 'steps' | 'testConditions' | 'calculations' | 'acceptanceCriteria' | 'typicalValues' | 'commonIssues';
  data: any;
}

// Batch update dla wielu protokołów
export interface BatchUpdateProtocolDto {
  protocolIds: string[];
  updates: {
    category?: ProtocolCategory;
    isPublic?: boolean;
    isActive?: boolean;
  };
}
