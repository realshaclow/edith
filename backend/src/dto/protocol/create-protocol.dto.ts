/**
 * Protocol Creation DTO
 * Obiekt transferu danych dla tworzenia protokołów
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

export interface CreateProtocolDto {
  // Podstawowe informacje
  title: string;
  description?: string;
  category: ProtocolCategory;
  type?: ProtocolType;
  version?: string;
  difficulty: ProtocolDifficulty;
  estimatedDuration?: string;
  
  // Strukturalne sekcje
  overview: OverviewDto;
  equipment: EquipmentDto[];
  materials: string[];
  safetyGuidelines: string[];
  references?: string[];
  notes?: string[];
  
  // Kroki procesu
  steps: ProtocolStepDto[];
  
  // Warunki testowe
  testConditions: TestConditionDto[];
  
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
  isPredefined?: boolean;
}

// Validation schema interfaces
export interface CreateProtocolValidation {
  title: {
    required: true;
    minLength: 5;
    maxLength: 200;
  };
  description: {
    maxLength: 1000;
  };
  category: {
    required: true;
    enum: ProtocolCategory[];
  };
  difficulty: {
    required: true;
    enum: ProtocolDifficulty[];
  };
  overview: {
    required: true;
    properties: {
      purpose: { required: true; minLength: 10; maxLength: 500; };
      scope: { required: true; minLength: 10; maxLength: 500; };
      principles: { required: true; minLength: 10; maxLength: 500; };
      standards: { required: true; minItems: 1; };
    };
  };
  equipment: {
    required: true;
    minItems: 1;
    items: {
      name: { required: true; minLength: 2; };
      specification: { required: true; minLength: 5; };
    };
  };
  materials: {
    required: true;
    minItems: 1;
    items: { minLength: 2; };
  };
  safetyGuidelines: {
    required: true;
    minItems: 1;
    items: { minLength: 5; };
  };
  steps: {
    required: true;
    minItems: 1;
    items: {
      title: { required: true; minLength: 3; };
      instructions: { required: true; minItems: 1; };
    };
  };
}
