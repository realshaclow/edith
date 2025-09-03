import { FormErrors, ValidationError } from '../types';

// Email validation
export const validateEmail = (email: string): string | undefined => {
  if (!email) {
    return 'Adres email jest wymagany';
  }
  
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Nieprawidłowy format adresu email';
  }
  
  if (email.length > 254) {
    return 'Adres email jest zbyt długi';
  }
  
  return undefined;
};

// Password validation
export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Hasło jest wymagane';
  }
  
  if (password.length < 8) {
    return 'Hasło musi mieć co najmniej 8 znaków';
  }
  
  if (password.length > 128) {
    return 'Hasło jest zbyt długie';
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Hasło musi zawierać co najmniej jedną małą literę';
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Hasło musi zawierać co najmniej jedną wielką literę';
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Hasło musi zawierać co najmniej jedną cyfrę';
  }
  
  if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
    return 'Hasło musi zawierać co najmniej jeden znak specjalny';
  }
  
  return undefined;
};

// Password confirmation validation
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): string | undefined => {
  if (!confirmPassword) {
    return 'Potwierdzenie hasła jest wymagane';
  }
  
  if (password !== confirmPassword) {
    return 'Hasła nie są identyczne';
  }
  
  return undefined;
};

// Name validation
export const validateName = (name: string, fieldName: string): string | undefined => {
  if (!name) {
    return `${fieldName} jest wymagane`;
  }
  
  if (name.trim().length < 2) {
    return `${fieldName} musi mieć co najmniej 2 znaki`;
  }
  
  if (name.length > 50) {
    return `${fieldName} jest zbyt długie`;
  }
  
  if (!/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-']+$/.test(name)) {
    return `${fieldName} może zawierać tylko litery, spacje, myślniki i apostrofy`;
  }
  
  return undefined;
};

// Phone validation
export const validatePhone = (phone: string): string | undefined => {
  if (!phone) {
    return undefined; // Phone is usually optional
  }
  
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length < 9) {
    return 'Numer telefonu jest zbyt krótki';
  }
  
  if (cleanPhone.length > 15) {
    return 'Numer telefonu jest zbyt długi';
  }
  
  // Polish phone number pattern (simplified)
  if (!/^(\+48)?[0-9]{9}$/.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Nieprawidłowy format numeru telefonu';
  }
  
  return undefined;
};

// Username validation
export const validateUsername = (username: string): string | undefined => {
  if (!username) {
    return undefined; // Username is usually optional
  }
  
  if (username.length < 3) {
    return 'Nazwa użytkownika musi mieć co najmniej 3 znaki';
  }
  
  if (username.length > 30) {
    return 'Nazwa użytkownika jest zbyt długa';
  }
  
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    return 'Nazwa użytkownika może zawierać tylko litery, cyfry, podkreślenia, kropki i myślniki';
  }
  
  if (/^[._-]/.test(username) || /[._-]$/.test(username)) {
    return 'Nazwa użytkownika nie może zaczynać się ani kończyć znakami specjalnymi';
  }
  
  return undefined;
};

// Generic field validation
export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || value.trim().length === 0) {
    return `${fieldName} jest wymagane`;
  }
  return undefined;
};

// Terms acceptance validation
export const validateTermsAcceptance = (accepted: boolean): string | undefined => {
  if (!accepted) {
    return 'Musisz zaakceptować regulamin';
  }
  return undefined;
};

// Password strength calculation
export interface PasswordStrengthResult {
  score: number; // 0-5
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
  suggestions: string[];
}

export const calculatePasswordStrength = (password: string): PasswordStrengthResult => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const score = Object.values(checks).filter(Boolean).length;
  
  let label = '';
  let color: 'error' | 'warning' | 'info' | 'success' = 'error';
  const suggestions: string[] = [];
  
  // Generate suggestions
  if (!checks.length) suggestions.push('Użyj co najmniej 8 znaków');
  if (!checks.uppercase) suggestions.push('Dodaj wielką literę');
  if (!checks.lowercase) suggestions.push('Dodaj małą literę');
  if (!checks.number) suggestions.push('Dodaj cyfrę');
  if (!checks.special) suggestions.push('Dodaj znak specjalny');
  
  // Determine strength level
  switch (score) {
    case 0:
    case 1:
      label = 'Bardzo słabe';
      color = 'error';
      break;
    case 2:
      label = 'Słabe';
      color = 'error';
      break;
    case 3:
      label = 'Średnie';
      color = 'warning';
      break;
    case 4:
      label = 'Silne';
      color = 'info';
      break;
    case 5:
      label = 'Bardzo silne';
      color = 'success';
      break;
  }

  return { score, label, color, checks, suggestions };
};

// Form validation helper
export const validateForm = <T extends Record<string, any>>(
  data: T,
  validationRules: Record<keyof T, (value: any) => string | undefined>
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};
  
  for (const [field, validator] of Object.entries(validationRules)) {
    const error = validator(data[field]);
    if (error) {
      errors[field] = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Sanitize input
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
};

// Format phone number
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 9) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('48')) {
    return `+48 ${cleaned.slice(2).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`;
  }
  
  return phone;
};

// Check if email domain is allowed
export const isEmailDomainAllowed = (email: string, allowedDomains?: string[]): boolean => {
  if (!allowedDomains || allowedDomains.length === 0) {
    return true;
  }
  
  const domain = email.split('@')[1]?.toLowerCase();
  return allowedDomains.some(allowed => domain === allowed.toLowerCase());
};

// Validate API response errors
export const parseApiErrors = (errors: ValidationError[]): FormErrors => {
  const formErrors: FormErrors = {};
  
  errors.forEach(error => {
    formErrors[error.field] = error.message;
  });
  
  return formErrors;
};

// Check password against common passwords
const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123',
  'password123', 'admin', 'letmein', 'welcome', 'monkey'
];

export const isCommonPassword = (password: string): boolean => {
  return commonPasswords.includes(password.toLowerCase());
};

// Debounce function for form validation
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
