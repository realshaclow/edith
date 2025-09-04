import { z } from 'zod';
import { 
  ProtocolCategory, 
  ProtocolDifficulty,
  ConditionCategory,
  CalculationCategory,
  ValueCategory,
  AcceptanceCategory,
  AcceptanceSeverity,
  AcceptanceOperator,
  IssueSeverity
} from '../types/protocol.types';

// Base schemas
const equipmentSchema = z.object({
  name: z.string().min(1, 'Nazwa sprzętu jest wymagana'),
  specification: z.string().min(1, 'Specyfikacja jest wymagana')
});

const overviewSchema = z.object({
  purpose: z.string().min(10, 'Cel musi mieć minimum 10 znaków'),
  scope: z.string().min(10, 'Zakres musi mieć minimum 10 znaków'),
  principles: z.string().min(10, 'Zasady muszą mieć minimum 10 znaków'),
  standards: z.array(z.string()).min(1, 'Minimum jeden standard jest wymagany')
});

const variableSchema = z.object({
  symbol: z.string().min(1, 'Symbol jest wymagany'),
  name: z.string().min(1, 'Nazwa zmiennej jest wymagana'),
  unit: z.string().min(1, 'Jednostka jest wymagana'),
  description: z.string().min(1, 'Opis jest wymagany')
});

const testConditionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nazwa warunki jest wymagana'),
  value: z.string().min(1, 'Wartość jest wymagana'),
  unit: z.string().optional(),
  tolerance: z.string().optional(),
  category: z.nativeEnum(ConditionCategory),
  required: z.boolean().default(true),
  description: z.string().optional()
});

const protocolStepSchema = z.object({
  id: z.string().optional(),
  stepNumber: z.number().min(1, 'Numer kroku musi być > 0'),
  title: z.string().min(1, 'Tytuł kroku jest wymagany'),
  description: z.string().optional(),
  duration: z.string().optional(),
  instructions: z.array(z.string()).min(1, 'Minimum jedna instrukcja jest wymagana'),
  tips: z.array(z.string()).default([]),
  safety: z.array(z.string()).default([]),
  isRequired: z.boolean().default(true)
});

const calculationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nazwa kalkulacji jest wymagana'),
  description: z.string().optional(),
  formula: z.string().min(1, 'Formuła jest wymagana'),
  variables: z.array(variableSchema),
  unit: z.string().optional(),
  category: z.nativeEnum(CalculationCategory),
  isRequired: z.boolean().default(false),
  example: z.string().optional(),
  notes: z.string().optional()
});

const acceptanceCriterionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nazwa kryterium jest wymagana'),
  description: z.string().optional(),
  parameter: z.string().min(1, 'Parametr jest wymagany'),
  operator: z.nativeEnum(AcceptanceOperator),
  value: z.string().min(1, 'Wartość jest wymagana'),
  maxValue: z.string().optional(),
  unit: z.string().optional(),
  category: z.nativeEnum(AcceptanceCategory),
  severity: z.nativeEnum(AcceptanceSeverity),
  isRequired: z.boolean().default(true),
  notes: z.string().optional()
});

const typicalValueSchema = z.object({
  id: z.string().optional(),
  parameter: z.string().min(1, 'Parametr jest wymagany'),
  material: z.string().min(1, 'Materiał jest wymagany'),
  value: z.string().min(1, 'Wartość jest wymagana'),
  unit: z.string().optional(),
  minRange: z.string().optional(),
  maxRange: z.string().optional(),
  conditions: z.string().optional(),
  category: z.nativeEnum(ValueCategory),
  source: z.string().optional(),
  isReference: z.boolean().default(false),
  notes: z.string().optional()
});

const commonIssueSchema = z.object({
  id: z.string().optional(),
  issue: z.string().min(1, 'Problem jest wymagany'),
  cause: z.string().min(1, 'Przyczyna jest wymagana'),
  solution: z.string().min(1, 'Rozwiązanie jest wymagane'),
  severity: z.nativeEnum(IssueSeverity),
  frequency: z.string().optional()
});

// Main protocol schemas
export const createProtocolSchema = z.object({
  title: z.string()
    .min(3, 'Tytuł musi mieć minimum 3 znaki')
    .max(200, 'Tytuł może mieć maksymalnie 200 znaków'),
  description: z.string()
    .min(10, 'Opis musi mieć minimum 10 znaków')
    .max(1000, 'Opis może mieć maksymalnie 1000 znaków')
    .optional(),
  category: z.nativeEnum(ProtocolCategory),
  difficulty: z.nativeEnum(ProtocolDifficulty),
  estimatedDuration: z.string().optional(),
  overview: overviewSchema.optional(),
  equipment: z.array(equipmentSchema).default([]),
  materials: z.array(z.string()).default([]),
  safetyGuidelines: z.array(z.string()).default([]),
  references: z.array(z.string()).default([]),
  notes: z.array(z.string()).default([]),
  steps: z.array(protocolStepSchema).default([]),
  testConditions: z.array(testConditionSchema).default([]),
  calculations: z.array(calculationSchema).default([]),
  acceptanceCriteria: z.array(acceptanceCriterionSchema).default([]),
  typicalValues: z.array(typicalValueSchema).default([]),
  commonIssues: z.array(commonIssueSchema).default([]),
  isPublic: z.boolean().default(false)
}).refine(data => {
  // Walidacja: protokół musi mieć przynajmniej jeden krok
  return data.steps.length > 0;
}, {
  message: 'Protokół musi mieć przynajmniej jeden krok',
  path: ['steps']
});

export const updateProtocolSchema = z.object({
  title: z.string()
    .min(3, 'Tytuł musi mieć minimum 3 znaki')
    .max(200, 'Tytuł może mieć maksymalnie 200 znaków')
    .optional(),
  description: z.string()
    .min(10, 'Opis musi mieć minimum 10 znaków')
    .max(1000, 'Opis może mieć maksymalnie 1000 znaków')
    .optional(),
  category: z.nativeEnum(ProtocolCategory).optional(),
  difficulty: z.nativeEnum(ProtocolDifficulty).optional(),
  estimatedDuration: z.string().optional(),
  overview: overviewSchema.optional(),
  equipment: z.array(equipmentSchema).optional(),
  materials: z.array(z.string()).optional(),
  safetyGuidelines: z.array(z.string()).optional(),
  references: z.array(z.string()).optional(),
  notes: z.array(z.string()).optional(),
  steps: z.array(protocolStepSchema).optional(),
  testConditions: z.array(testConditionSchema).optional(),
  calculations: z.array(calculationSchema).optional(),
  acceptanceCriteria: z.array(acceptanceCriterionSchema).optional(),
  typicalValues: z.array(typicalValueSchema).optional(),
  commonIssues: z.array(commonIssueSchema).optional(),
  isPublic: z.boolean().optional(),
  isActive: z.boolean().optional()
});

export const protocolQuerySchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  category: z.nativeEnum(ProtocolCategory).optional(),
  difficulty: z.nativeEnum(ProtocolDifficulty).optional(),
  search: z.string().min(1).optional(),
  isPublic: z.boolean().optional(),
  createdBy: z.string().optional(),
  sortBy: z.enum(['title', 'category', 'createdAt', 'updatedAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
});

// Export individual schemas for reuse
export {
  equipmentSchema,
  overviewSchema,
  variableSchema,
  testConditionSchema,
  protocolStepSchema,
  calculationSchema,
  acceptanceCriterionSchema,
  typicalValueSchema,
  commonIssueSchema
};
