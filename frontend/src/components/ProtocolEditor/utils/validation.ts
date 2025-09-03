import { ProtocolFormData } from '../types/protocol';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateProtocol = (protocol: ProtocolFormData): ValidationResult => {
  const errors: Record<string, string> = {};

  // Walidacja wymaganych pól
  if (!protocol.title?.trim()) {
    errors.title = 'Tytuł protokołu jest wymagany';
  }

  if (!protocol.description?.trim()) {
    errors.description = 'Opis protokołu jest wymagany';
  }

  if (!protocol.id?.trim()) {
    errors.id = 'ID protokołu jest wymagane';
  }

  if (!protocol.category) {
    errors.category = 'Kategoria protokołu jest wymagana';
  }

  if (!protocol.estimatedDuration?.trim()) {
    errors.estimatedDuration = 'Szacowany czas trwania jest wymagany';
  }

  if (!protocol.difficulty) {
    errors.difficulty = 'Poziom trudności jest wymagany';
  }

  // Walidacja overview
  if (!protocol.overview?.purpose?.trim()) {
    errors.overviewPurpose = 'Cel badania jest wymagany';
  }

  if (!protocol.overview?.scope?.trim()) {
    errors.overviewScope = 'Zakres zastosowania jest wymagany';
  }

  if (!protocol.overview?.principles?.trim()) {
    errors.overviewPrinciples = 'Zasady badania są wymagane';
  }

  // Walidacja wyposażenia
  if (!protocol.equipment || protocol.equipment.length === 0) {
    errors.equipment = 'Wymagane jest dodanie co najmniej jednego elementu wyposażenia';
  } else {
    protocol.equipment.forEach((item, index) => {
      if (!item.name?.trim()) {
        errors[`equipment-${index}-name`] = 'Nazwa wyposażenia jest wymagana';
      }
      if (!item.specification?.trim()) {
        errors[`equipment-${index}-specification`] = 'Specyfikacja wyposażenia jest wymagana';
      }
    });
  }

  // Walidacja materiałów
  if (!protocol.materials || protocol.materials.length === 0) {
    errors.materials = 'Wymagane jest dodanie co najmniej jednego materiału';
  }

  // Walidacja kroków
  if (!protocol.steps || protocol.steps.length === 0) {
    errors.steps = 'Wymagany jest co najmniej jeden krok procedury';
  } else {
    protocol.steps.forEach((step, index) => {
      if (!step.title?.trim()) {
        errors[`step-${index}-title`] = 'Tytuł kroku jest wymagany';
      }
      if (!step.description?.trim()) {
        errors[`step-${index}-description`] = 'Opis kroku jest wymagany';
      }
      if (!step.duration?.trim()) {
        errors[`step-${index}-duration`] = 'Czas trwania kroku jest wymagany';
      }
      if (!step.instructions || step.instructions.length === 0) {
        errors[`step-${index}-instructions`] = 'Instrukcje są wymagane';
      }
    });
  }

  // Walidacja referencji
  if (!protocol.references || protocol.references.length === 0) {
    errors.references = 'Wymagana jest co najmniej jedna referencja/norma';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateStep = (step: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!step.title?.trim()) {
    errors.push('Tytuł kroku jest wymagany');
  }

  if (!step.description?.trim()) {
    errors.push('Opis kroku jest wymagany');
  }

  if (!step.duration?.trim()) {
    errors.push('Czas trwania jest wymagany');
  }

  if (!step.instructions || step.instructions.length === 0) {
    errors.push('Co najmniej jedna instrukcja jest wymagana');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEquipment = (equipment: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!equipment.name?.trim()) {
    errors.push('Nazwa wyposażenia jest wymagana');
  }

  if (!equipment.specification?.trim()) {
    errors.push('Specyfikacja jest wymagana');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
