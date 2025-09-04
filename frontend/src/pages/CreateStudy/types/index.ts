// Typy dla systemu CreateStudy z konfiguracją pomiarów per krok

export interface StudyFormData {
  // Podstawowe informacje
  name: string;
  description: string;
  protocolId: string;
  protocolName: string;
  category: string;
  
  // Ustawienia badania
  settings: StudySettings;
  
  // Konfiguracja kroków z pomiarami
  stepMeasurements: StepMeasurementConfig[];
  
  // Operator
  operatorInfo: OperatorInfo;
  
  // Lista wyposażenia
  equipmentList: EquipmentItem[];
}

export interface StudySettings {
  // Ustawienia próbek
  numberOfSamples: number;
  samplePrefix: string;
  sampleNaming: 'automatic' | 'manual';
  numerationType?: 'auto' | 'manual';  // Dodane dla kompatybilności
  
  // Warunki testowe (z protokołu, można edytować)
  testConditions: Record<string, TestConditionValue>;
  
  // Konfiguracja sesji
  sessionSettings: {
    allowMultipleSessions: boolean;
    maxSamplesPerSession: number;
    sessionTimeout: number; // minuty
    autoStartNextSession: boolean;
  };
  
  // Operator i sprzęt
  operatorRequired: boolean;
  operatorName?: string;
  operatorEmail?: string;
  operatorId?: string;
  requiredEquipment: string[];
}

export interface TestConditionValue {
  name: string;
  value: string;
  unit: string;
  tolerance: string;
  required: boolean;
  description?: string;
}

// ==================== OPERATOR I WYPOSAŻENIE ====================

export interface OperatorInfo {
  name: string;
  position: string;
  operatorId: string;
  notes: string;
}

export interface EquipmentItem {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  calibrationDate: string;
  notes: string;
}

export interface ProtocolEquipmentRequirement {
  name: string;
  specifications?: string;
  accuracy?: string;
  notes?: string;
}

// ==================== POMIARY PER KROK ====================

export interface StepMeasurementConfig {
  stepId: string;           // ID kroku z protokołu
  stepTitle: string;        // Nazwa kroku
  stepDescription: string;  // Opis kroku
  measurements: MeasurementDefinition[];  // Lista pomiarów dla tego kroku
  isRequired: boolean;      // Czy krok jest wymagany
  estimatedDuration: string; // Szacowany czas (z protokołu)
}

export interface MeasurementDefinition {
  id: string;                    // Unikalny ID pomiaru
  name: string;                  // Nazwa (np. "Siła maksymalna")
  description?: string;          // Opis pomiaru
  type: DataPointType;           // Typ pomiaru
  dataType: DataType;            // Typ danych
  unit?: string;                 // Jednostka (MPa, °C, mm)
  isRequired: boolean;           // Czy wymagany
  validationRules?: ValidationRules;  // Reguły walidacji
  defaultValue?: any;            // Wartość domyślna
  formula?: string;              // Formuła (dla CALCULATION)
  dependsOn?: string[];          // Zależności (ID innych pomiarów)
  category?: MeasurementCategory; // Kategoria pomiaru
}

export interface ValidationRules {
  min?: number;                  // Minimalna wartość
  max?: number;                  // Maksymalna wartość
  pattern?: string;              // Regex dla TEXT
  options?: string[];            // Opcje dla SELECTION
  precision?: number;            // Dokładność dla NUMBER
}

// ==================== ENUMS (z Backend) ====================

export enum DataPointType {
  MEASUREMENT = 'MEASUREMENT',    // Pomiary bezpośrednie (siła, temperatura)
  OBSERVATION = 'OBSERVATION',    // Obserwacje (uwagi, zdjęcia)  
  CALCULATION = 'CALCULATION',    // Obliczenia (naprężenie, moduł)
  CONDITION = 'CONDITION'         // Warunki (temperatura otoczenia)
}

export enum DataType {
  NUMBER = 'NUMBER',       // Wartości numeryczne
  TEXT = 'TEXT',          // Tekst, uwagi
  BOOLEAN = 'BOOLEAN',    // Tak/Nie, checkboxy
  DATE = 'DATE'           // Data/czas
}

export enum MeasurementCategory {
  MECHANICAL = 'MECHANICAL',
  THERMAL = 'THERMAL',
  ELECTRICAL = 'ELECTRICAL',
  CHEMICAL = 'CHEMICAL',
  DIMENSIONAL = 'DIMENSIONAL',
  OPTICAL = 'OPTICAL',
  ENVIRONMENTAL = 'ENVIRONMENTAL'
}

// ==================== PROTOKOŁY ====================

export interface ProtocolData {
  id: string;
  title: string;
  name?: string;  // Alias dla title
  description: string;
  category: string;
  standard?: string;
  difficulty: string;
  estimatedDuration: string;
  
  overview: {
    purpose: string;
    scope: string;
    principles: string;
    standards: string[];
  };
  
  equipment: ProtocolEquipment[];
  materials: string[];
  safetyGuidelines: string[];
  
  // Wymagania operatora
  operatorRequirements?: string[];
  
  // Wymagane wyposażenie (bardziej szczegółowe)
  equipmentRequired?: ProtocolEquipmentRequirement[];
  
  // Warunki testowe z protokołu
  testConditions: ProtocolTestCondition[];
  
  // Kroki protokołu
  steps: ProtocolStep[];
  
  // Obliczenia standardowe z protokołu
  calculations?: ProtocolCalculation[];
  
  // Sugerowane pomiary per krok (predefined)
  suggestedMeasurements?: Record<string, MeasurementDefinition[]>;
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

export interface ProtocolTestCondition {
  id: string;
  name: string;
  value: string;
  unit: string;
  tolerance: string;
  category: string;
  required: boolean;
  description?: string;
}

export interface ProtocolEquipment {
  name: string;
  specification: string;
}

export interface ProtocolCalculation {
  parameter: string;
  formula: string;
  units: string;
  description: string;
}

// ==================== KOMPONENTY ====================

export interface CreateStudyStepProps {
  studyData: StudyFormData;
  protocolData?: ProtocolData;
  errors?: Record<string, string[]>;
  onUpdateStudyData: (data: Partial<StudyFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isValid: boolean;
}

export type CreateStudyStep = 
  | 'protocol-selection'
  | 'basic-info'
  | 'sample-configuration'
  | 'test-conditions'
  | 'session-configuration'
  | 'step-measurements'      // NOWY KROK - konfiguracja pomiarów
  | 'operator-equipment'
  | 'review';

// ==================== API RESPONSES ====================

export interface CreateStudyRequest {
  name: string;
  description: string;
  protocolId: string;
  protocolName: string;
  category: string;
  settings: StudySettings;
  stepMeasurements: StepMeasurementConfig[];  // Nowe pole
}

export interface StudySession {
  id: string;
  studyId: string;
  sessionName: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  operatorId?: string;
  totalSamples: number;
  completedSamples: number;
  currentStepId?: string;
  stepMeasurements: StepMeasurementConfig[];  // Pomiary skopiowane ze studium
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
}
