/**
 * Base DTOs for Protocol Management
 * Podstawowe obiekty transferu danych dla zarządzania protokołami
 */

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
  category: 'ENVIRONMENTAL' | 'MECHANICAL' | 'CHEMICAL' | 'TEMPORAL' | 'DIMENSIONAL' | 'ELECTRICAL' | 'OPTICAL';
  required: boolean;
  description?: string;
}

export interface CalculationDto {
  id?: string;
  name: string;
  description?: string;
  formula: string;
  variables: VariableDto[];
  unit?: string;
  category: 'MECHANICAL' | 'STATISTICAL' | 'DIMENSIONAL' | 'CHEMICAL' | 'THERMAL' | 'CUSTOM';
  isRequired: boolean;
  example?: string;
  notes?: string;
}

export interface AcceptanceCriterionDto {
  id?: string;
  name: string;
  description?: string;
  parameter: string;
  operator: 'GREATER_THAN' | 'LESS_THAN' | 'EQUAL' | 'GREATER_EQUAL' | 'LESS_EQUAL' | 'BETWEEN' | 'NOT_EQUAL';
  value: string;
  maxValue?: string; // dla operatora BETWEEN
  unit?: string;
  category: 'PERFORMANCE' | 'QUALITY' | 'SAFETY' | 'DIMENSIONAL' | 'STATISTICAL';
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
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
  category: 'MECHANICAL' | 'THERMAL' | 'ELECTRICAL' | 'CHEMICAL' | 'DIMENSIONAL' | 'OPTICAL' | 'PHYSICAL';
  source?: string;
  isReference: boolean;
  notes?: string;
}

export interface CommonIssueDto {
  id?: string;
  problem: string;
  causes: string[];
  solutions: string[];
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  frequency?: string;
}

export interface ProtocolStepDto {
  id?: string;
  stepNumber?: number;
  title: string;
  description?: string;
  duration?: string;
  instructions: string[];
  tips: string[];
  safety: string[];
  isRequired?: boolean;
}

export type ProtocolCategory = 'PHYSICAL' | 'CHEMICAL' | 'THERMAL' | 'MECHANICAL' | 'FIRE' | 'WEATHERING' | 'RHEOLOGICAL';
export type ProtocolDifficulty = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export type ProtocolType = 'USER' | 'PREDEFINED';
