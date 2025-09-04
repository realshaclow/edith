/**
 * Research Protocols Index
 * Centralny punkt dostępu do wszystkich protokołów badawczych
 */

import { iso1133Protocol } from './iso-1133-melt-flow-rate';
import { iso289Protocol } from './iso-289-mooney-viscosity';
import { astmD412Protocol } from './astm-d412-tensile-strength';
import { astmC772Protocol } from './astm-c772-plasticizer-migration';
import { iso1183Protocol } from './iso-1183-density';
import { iso11357Protocol } from './iso-11357-dsc';
import { iso3451Protocol } from './iso-3451-ash-content';
import { ul94Protocol } from './ul-94-flammability';
import { astmD2863Protocol } from './astm-d2863-loi';
import { astmE28Protocol } from './astm-e28-18-softening-point';
import { iso4892Protocol } from './iso-4892-2-weathering';
import { astmD638Protocol } from './astm-d638-tensile-properties';
import { astmD790Protocol } from './astm-d790-flexural-properties';
import { astmD256Protocol } from './astm-d256-izod-impact';
import { astmD648Protocol } from './astm-d648-deflection-temperature';

export interface ResearchProtocol {
  id: string;
  title: string;
  description: string;
  category: string;
  estimatedDuration: string;
  difficulty: string;
  overview: {
    purpose: string;
    scope: string;
    principles: string;
    standards: string[];
  };
  equipment: any[];
  materials: string[];
  safetyGuidelines: string[];
  testConditions: any;
  steps: ProtocolStep[];
  calculations?: any[];
  acceptanceCriteria?: string[];
  commonIssues?: CommonIssue[];
  typicalValues?: TypicalValue[];
  references?: string[];
  notes?: string[];
  // Dla starych protokołów
  version?: string;
  acceptance_criteria?: any;
}

export interface ProtocolStep {
  id: string;
  title: string;
  duration: string;
  instructions: string[];
  safety: string[];
  tips: string[];
}

export interface CommonIssue {
  issue: string;
  cause: string;
  solution: string;
  // Dla starych protokołów
  problem?: string;
  causes?: string[];
  solutions?: string[];
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
  category: 'MECHANICAL' | 'THERMAL' | 'CHEMICAL' | 'PHYSICAL' | 'FIRE' | 'WEATHERING' | 'RHEOLOGICAL';
  source: string;
  notes?: string;
  isReference: boolean;
}

// Eksport wszystkich protokołów
export const ResearchProtocols: Record<string, any> = {
  'iso-1133': iso1133Protocol,
  'iso-289': iso289Protocol,
  'astm-d412': astmD412Protocol,
  'astm-c772': astmC772Protocol,
  'iso-1183': iso1183Protocol,
  'iso-11357': iso11357Protocol,
  'iso-3451': iso3451Protocol,
  'ul-94': ul94Protocol,
  'astm-d2863': astmD2863Protocol,
  'astm-e28-18': astmE28Protocol,
  'iso-4892-2': iso4892Protocol,
  'astm-d638': astmD638Protocol,
  'astm-d790': astmD790Protocol,
  'astm-d256': astmD256Protocol,
  'astm-d648': astmD648Protocol,
};

// Funkcje pomocnicze
export const getProtocolById = (id: string): ResearchProtocol | undefined => {
  return ResearchProtocols[id];
};

export const getProtocolsByCategory = (category: string): ResearchProtocol[] => {
  return Object.values(ResearchProtocols).filter(protocol => protocol.category === category);
};

export const getAllProtocols = (): ResearchProtocol[] => {
  return Object.values(ResearchProtocols);
};

export const getProtocolCategories = (): string[] => {
  const categories = new Set(Object.values(ResearchProtocols).map(p => p.category));
  return Array.from(categories);
};

// Eksport domyślny
export default ResearchProtocols;
