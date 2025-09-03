export interface Protocol {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'PREDEFINED' | 'USER';
  version?: string;
  difficulty?: string;
  estimatedDuration?: string;
  overview?: {
    purpose?: string;
    scope?: string;
    principles?: string;
    standards?: string[];
  };
  equipment?: Array<{
    name: string;
    specification: string;
  }>;
  materials?: string[];
  safetyGuidelines?: string[];
  references?: string[];
  notes?: any;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  isPublic: boolean;
  isActive: boolean;
  steps?: ProtocolStep[];
  testConditions?: TestCondition[];
  calculations?: Calculation[];
  typicalValues?: TypicalValue[];
  commonIssues?: CommonIssue[];
}

export interface ProtocolStep {
  id: string;
  stepNumber: number;
  title: string;
  description?: string;
  duration?: string;
  instructions?: string[];
  tips?: string[];
  safety?: string[];
  isRequired: boolean;
  dataPoints?: DataPoint[];
}

export interface DataPoint {
  id: string;
  name: string;
  description?: string;
  parameterType: string;
  dataType: string;
  unit?: string;
  isRequired: boolean;
  isCalculated: boolean;
  orderIndex: number;
}

export interface TestCondition {
  id: string;
  name: string;
  value: string;
  unit?: string;
  tolerance?: string;
  category: string;
  required: boolean;
  description?: string;
}

export interface Calculation {
  id: string;
  name: string;
  description?: string;
  formula: string;
  variables: any;
  unit?: string;
  category: string;
  isRequired: boolean;
}

export interface TypicalValue {
  id: string;
  parameter: string;
  material: string;
  value: string;
  unit?: string;
  minRange?: string;
  maxRange?: string;
  conditions?: string;
  category: string;
  source?: string;
  isReference: boolean;
}

export interface CommonIssue {
  id: string;
  issue: string;
  cause: string;
  solution: string;
  severity: string;
  frequency?: string;
}

export interface ProtocolFilters {
  category?: string;
  difficulty?: string;
  type?: 'PREDEFINED' | 'USER';
  search?: string;
}

export interface ProtocolSortOptions {
  field: 'title' | 'category' | 'difficulty' | 'createdAt' | 'estimatedDuration';
  direction: 'asc' | 'desc';
}

export type ProtocolViewMode = 'grid' | 'list' | 'table';
