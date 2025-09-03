// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  avatar?: string;
  role: UserRole;
  department?: string;
  position?: string;
  phone?: string;
  preferences: UserPreferences;
  isActive: boolean;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: Permission[];
  level: number; // 1 = admin, 2 = manager, 3 = user, 4 = guest
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string; // create, read, update, delete
  conditions?: Record<string, any>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: 'pl' | 'en';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: 'compact' | 'comfortable' | 'spacious';
    widgets: string[];
  };
  timezone: string;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  username?: string;
  department?: string;
  position?: string;
  phone?: string;
  acceptTerms: boolean;
  acceptMarketing?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// Password types
export interface PasswordResetRequest {
  email: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChange {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Session types
export interface Session {
  id: string;
  userId: string;
  deviceId?: string;
  deviceName?: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    region: string;
  };
  isActive: boolean;
  lastActivity: string;
  createdAt: string;
  expiresAt: string;
}

// Two-factor authentication
export interface TwoFactorSetup {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerification {
  code: string;
  backupCode?: string;
}

// Account verification
export interface EmailVerification {
  token: string;
}

export interface ResendVerification {
  email: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (data: RegisterData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<RefreshTokenResponse>;
  forgotPassword: (data: PasswordResetRequest) => Promise<void>;
  resetPassword: (data: PasswordReset) => Promise<void>;
  changePassword: (data: PasswordChange) => Promise<void>;
  verifyEmail: (data: EmailVerification) => Promise<void>;
  resendVerification: (data: ResendVerification) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<User>;
  uploadAvatar: (file: File) => Promise<string>;
  getSessions: () => Promise<Session[]>;
  terminateSession: (sessionId: string) => Promise<void>;
  setupTwoFactor: () => Promise<TwoFactorSetup>;
  verifyTwoFactor: (data: TwoFactorVerification) => Promise<void>;
  disableTwoFactor: (password: string) => Promise<void>;
}

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface FormErrors {
  [key: string]: string | undefined;
}

// Auth state types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessions: Session[];
  twoFactorEnabled: boolean;
}

// Auth actions
export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; accessToken: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_SESSIONS'; payload: Session[] }
  | { type: 'SET_TWO_FACTOR'; payload: boolean }
  | { type: 'CLEAR_ERROR' };

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

// OAuth types
export interface OAuthProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface OAuthResponse {
  provider: string;
  code: string;
  state?: string;
}

// Security types
export interface SecurityLog {
  id: string;
  userId: string;
  event: SecurityEvent;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    region: string;
  };
  metadata?: Record<string, any>;
  createdAt: string;
}

export type SecurityEvent =
  | 'login_success'
  | 'login_failed'
  | 'logout'
  | 'password_change'
  | 'password_reset'
  | 'email_verification'
  | 'two_factor_enabled'
  | 'two_factor_disabled'
  | 'session_terminated'
  | 'profile_updated'
  | 'suspicious_activity';

// Account settings types
export interface AccountSettings {
  security: {
    twoFactorEnabled: boolean;
    passwordLastChanged: string;
    sessionTimeout: number; // minutes
    allowMultipleSessions: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private' | 'team';
    activityTracking: boolean;
    dataCollection: boolean;
  };
  notifications: {
    email: {
      security: boolean;
      updates: boolean;
      marketing: boolean;
    };
    push: {
      enabled: boolean;
      security: boolean;
      updates: boolean;
    };
    sms: {
      enabled: boolean;
      security: boolean;
    };
  };
}
