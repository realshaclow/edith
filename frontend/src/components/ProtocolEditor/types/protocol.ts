export interface Equipment {
  name: string;
  specification: string;
}

export interface TestCondition {
  id: string;
  name: string;
  value: string;
  unit: string;
  tolerance: string;
  category: 'environmental' | 'mechanical' | 'chemical' | 'temporal' | 'dimensional';
  required: boolean;
  description?: string;
}

export interface ProtocolStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  instructions: string[];
  tips: string[];
  safety: string[];
}

export interface Overview {
  purpose: string;
  scope: string;
  principles: string;
  standards: string[];
}

export interface Calculation {
  id: string;
  name: string;
  description: string;
  formula: string;
  variables: Variable[];
  unit: string;
  category: 'mechanical' | 'statistical' | 'dimensional' | 'chemical' | 'custom';
  isRequired: boolean;
  example?: string;
  notes?: string;
}

export interface Variable {
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

export interface AcceptanceCriterion {
  id: string;
  name: string;
  description: string;
  parameter: string;
  operator: 'greater_than' | 'less_than' | 'equal' | 'greater_equal' | 'less_equal' | 'between' | 'not_equal';
  value: string;
  maxValue?: string;
  unit: string;
  category: 'performance' | 'quality' | 'safety' | 'dimensional' | 'statistical';
  severity: 'critical' | 'major' | 'minor';
  isRequired: boolean;
  notes?: string;
}

export interface CommonIssue {
  problem: string;
  causes: string[];
  solutions: string[];
}

export interface TypicalValue {
  id: string;
  parameter: string;
  material: string;
  value: string;
  unit: string;
  range: {
    min: string;
    max: string;
  };
  conditions: string;
  category: 'mechanical' | 'thermal' | 'electrical' | 'chemical' | 'dimensional' | 'optical';
  source: string;
  notes?: string;
  isReference: boolean;
}

export type TypicalValues = TypicalValue[];

export interface ResearchProtocol {
  id: string;
  title: string;
  description: string;
  category: 'physical' | 'chemical' | 'thermal' | 'mechanical' | 'fire' | 'weathering' | 'rheological';
  estimatedDuration: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  
  overview: Overview;
  equipment: Equipment[];
  materials: string[];
  safetyGuidelines: string[];
  testConditions: TestCondition[];
  steps: ProtocolStep[];
  calculations: Calculation[];
  acceptanceCriteria: AcceptanceCriterion[];
  commonIssues: CommonIssue[];
  typicalValues: TypicalValues;
  references: string[];
}

export interface ProtocolFormData extends Partial<ResearchProtocol> {
  // Pola pomocnicze dla formularza
  isDirty?: boolean;
  isValid?: boolean;
  errors?: Record<string, string>;
}

export type ProtocolCategory = ResearchProtocol['category'];
export type ProtocolDifficulty = ResearchProtocol['difficulty'];

// Enum dla kategorii protokołów
export const PROTOCOL_CATEGORIES: { value: ProtocolCategory; label: string; color: string }[] = [
  { value: 'physical', label: 'Właściwości Fizyczne', color: '#2196F3' },
  { value: 'chemical', label: 'Właściwości Chemiczne', color: '#4CAF50' },
  { value: 'thermal', label: 'Właściwości Termiczne', color: '#FF9800' },
  { value: 'mechanical', label: 'Właściwości Mechaniczne', color: '#9C27B0' },
  { value: 'fire', label: 'Odporność Ogniowa', color: '#F44336' },
  { value: 'weathering', label: 'Starzenie i Odporność', color: '#795548' },
  { value: 'rheological', label: 'Właściwości Reologiczne', color: '#607D8B' }
];

// Enum dla poziomów trudności
export const PROTOCOL_DIFFICULTIES: { value: ProtocolDifficulty; label: string; color: string }[] = [
  { value: 'basic', label: 'Podstawowy', color: '#4CAF50' },
  { value: 'intermediate', label: 'Średniozaawansowany', color: '#FF9800' },
  { value: 'advanced', label: 'Zaawansowany', color: '#F44336' }
];
