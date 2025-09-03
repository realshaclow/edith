import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

/**
 * Validation middleware to handle validation results
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return res.status(400).json({
      success: false,
      error: firstError.msg,
      field: 'param' in firstError ? firstError.param : undefined,
      errors: errors.array()
    });
  }
  
  next();
};

/**
 * Registration validation rules
 */
export const validateRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Podaj prawidłowy adres email'),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Hasło musi mieć co najmniej 8 znaków')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Hasło musi zawierać: małą literę, wielką literę, cyfrę i znak specjalny'),
  
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Imię musi mieć od 2 do 50 znaków')
    .matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/)
    .withMessage('Imię może zawierać tylko litery, spacje i myślniki'),
  
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nazwisko musi mieć od 2 do 50 znaków')
    .matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/)
    .withMessage('Nazwisko może zawierać tylko litery, spacje i myślniki'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Nazwa użytkownika musi mieć od 3 do 30 znaków')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Nazwa użytkownika może zawierać tylko litery, cyfry, _, . i -'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tytuł nie może przekraczać 100 znaków'),
  
  body('affiliation')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Afiliacja nie może przekraczać 200 znaków'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Departament nie może przekraczać 100 znaków'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Stanowisko nie może przekraczać 100 znaków'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]{7,15}$/)
    .withMessage('Podaj prawidłowy numer telefonu'),
  
  handleValidationErrors
];

/**
 * Login validation rules
 */
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Podaj prawidłowy adres email'),
  
  body('password')
    .notEmpty()
    .withMessage('Hasło jest wymagane'),
  
  body('rememberMe')
    .optional()
    .isBoolean()
    .withMessage('RememberMe musi być wartością boolean'),
  
  handleValidationErrors
];

/**
 * Change password validation rules
 */
export const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Obecne hasło jest wymagane'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Nowe hasło musi mieć co najmniej 8 znaków')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Nowe hasło musi zawierać: małą literę, wielką literę, cyfrę i znak specjalny'),
  
  handleValidationErrors
];

/**
 * Forgot password validation rules
 */
export const validateForgotPassword = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Podaj prawidłowy adres email'),
  
  handleValidationErrors
];

/**
 * Reset password validation rules
 */
export const validateResetPassword = [
  body('token')
    .notEmpty()
    .withMessage('Token resetowania jest wymagany'),
  
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Nowe hasło musi mieć co najmniej 8 znaków')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Nowe hasło musi zawierać: małą literę, wielką literę, cyfrę i znak specjalny'),
  
  handleValidationErrors
];

/**
 * Update profile validation rules
 */
export const validateUpdateProfile = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Imię musi mieć od 2 do 50 znaków')
    .matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/)
    .withMessage('Imię może zawierać tylko litery, spacje i myślniki'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Nazwisko musi mieć od 2 do 50 znaków')
    .matches(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]+$/)
    .withMessage('Nazwisko może zawierać tylko litery, spacje i myślniki'),
  
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Nazwa użytkownika musi mieć od 3 do 30 znaków')
    .matches(/^[a-zA-Z0-9_.-]+$/)
    .withMessage('Nazwa użytkownika może zawierać tylko litery, cyfry, _, . i -'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Tytuł nie może przekraczać 100 znaków'),
  
  body('affiliation')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Afiliacja nie może przekraczać 200 znaków'),
  
  body('department')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Departament nie może przekraczać 100 znaków'),
  
  body('position')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Stanowisko nie może przekraczać 100 znaków'),
  
  body('phone')
    .optional()
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]{7,15}$/)
    .withMessage('Podaj prawidłowy numer telefonu'),
  
  body('language')
    .optional()
    .isIn(['pl', 'en'])
    .withMessage('Język musi być pl lub en'),
  
  body('timezone')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Strefa czasowa nie może przekraczać 50 znaków'),
  
  handleValidationErrors
];

/**
 * Refresh token validation rules
 */
export const validateRefreshToken = [
  body('refreshToken')
    .notEmpty()
    .withMessage('Refresh token jest wymagany'),
  
  handleValidationErrors
];

/**
 * Email validation helper
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Phone validation helper
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Username validation helper
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_.-]{3,30}$/;
  return usernameRegex.test(username);
};

/**
 * Name validation helper (for firstName, lastName)
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s-]{2,50}$/;
  return nameRegex.test(name);
};
