// Auth Types for EDITH Research Platform
import { UserRole, PermissionType } from '@prisma/client';

export { UserRole, PermissionType } from '@prisma/client';
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  title?: string;
  affiliation?: string;
  department?: string;
  position?: string;
  phone?: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: UserProfile;
    tokens: TokenPair;
  };
  error?: string;
  message?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  affiliation?: string;
  department?: string;
  position?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  language: string;
  timezone: string;
  preferences?: any;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  sessionId: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  title?: string;
  affiliation?: string;
  department?: string;
  position?: string;
  phone?: string;
  language?: string;
  timezone?: string;
  preferences?: any;
}

export interface AuthSession {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  location?: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt: Date;
  isActive: boolean;
}

// Security Configuration
export interface SecurityConfig {
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    accessTokenExpiry: string;
    refreshTokenExpiry: string;
    issuer: string;
    audience: string;
  };
  password: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number; // minutes
  };
  session: {
    maxActiveSessions: number;
    sessionTimeout: number; // minutes
    extendOnActivity: boolean;
  };
  rateLimiting: {
    loginAttempts: {
      windowMs: number;
      maxAttempts: number;
    };
    registration: {
      windowMs: number;
      maxAttempts: number;
    };
    passwordReset: {
      windowMs: number;
      maxAttempts: number;
    };
  };
}

// Request Extensions
declare global {
  namespace Express {
    // Rozszerzenie pustego interfejsu User z Passport na nasz UserProfile
    interface User extends UserProfile {}
    
    interface Request {
      session?: AuthSession;
      permissions?: PermissionType[];
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: UserProfile;
  session: AuthSession;
  permissions: PermissionType[];
}

// Error Types
export class AuthError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number = 401, code: string = 'AUTH_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'AuthError';
  }
}

export class ValidationError extends Error {
  public statusCode: number;
  public code: string;
  public field?: string;

  constructor(message: string, field?: string, statusCode: number = 400, code: string = 'VALIDATION_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.field = field;
    this.name = 'ValidationError';
  }
}
