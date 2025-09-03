import bcrypt from 'bcryptjs';
import { bcryptConfig } from './config';

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(bcryptConfig.saltRounds);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error('Failed to hash password');
  }
};

/**
 * Verify password against hash
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    return false;
  }
};

/**
 * Generate a random salt (for additional security layers if needed)
 */
export const generateSalt = async (): Promise<string> => {
  return await bcrypt.genSalt(bcryptConfig.saltRounds);
};

/**
 * Validate password strength
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  score: number; // 0-100
}

export const validatePasswordStrength = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < 8) {
    errors.push('Hasło musi mieć co najmniej 8 znaków');
  } else if (password.length >= 8) {
    score += 20;
  }
  
  if (password.length >= 12) {
    score += 10;
  }

  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Hasło musi zawierać co najmniej jedną wielką literę');
  } else {
    score += 15;
  }

  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Hasło musi zawierać co najmniej jedną małą literę');
  } else {
    score += 15;
  }

  // Number check
  if (!/\d/.test(password)) {
    errors.push('Hasło musi zawierać co najmniej jedną cyfrę');
  } else {
    score += 15;
  }

  // Special character check
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Hasło musi zawierać co najmniej jeden znak specjalny');
  } else {
    score += 15;
  }

  // Bonus points for variety
  const uniqueChars = new Set(password).size;
  if (uniqueChars > password.length * 0.7) {
    score += 10;
  }

  // Check for common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
    /welcome/i
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Hasło zawiera typowy wzorzec - wybierz bardziej unikalną kombinację');
      score -= 20;
      break;
    }
  }

  // Sequential characters check
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Hasło nie może zawierać więcej niż 2 takie same znaki pod rząd');
    score -= 10;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    isValid: errors.length === 0,
    errors,
    score
  };
};

/**
 * Generate a secure random password
 */
export const generateSecurePassword = (length: number = 12): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};
