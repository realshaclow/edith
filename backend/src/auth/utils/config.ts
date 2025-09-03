import { SecurityConfig } from '../types';

export const securityConfig: SecurityConfig = {
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'edith-access-secret-dev-only',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'edith-refresh-secret-dev-only',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    issuer: process.env.JWT_ISSUER || 'edith-research-platform',
    audience: process.env.JWT_AUDIENCE || 'edith-users'
  },
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15 // minutes
  },
  session: {
    maxActiveSessions: 5,
    sessionTimeout: 60 * 24, // 24 hours in minutes
    extendOnActivity: true
  },
  rateLimiting: {
    loginAttempts: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxAttempts: 5
    },
    registration: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxAttempts: 3
    },
    passwordReset: {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxAttempts: 3
    }
  }
};

// Permission mappings for roles
export const rolePermissions: Record<string, string[]> = {
  SUPER_ADMIN: [
    'SYSTEM_ADMIN',
    'USER_MANAGEMENT',
    'PROTOCOL_CREATE', 'PROTOCOL_READ', 'PROTOCOL_UPDATE', 'PROTOCOL_DELETE',
    'STUDY_CREATE', 'STUDY_READ', 'STUDY_UPDATE', 'STUDY_DELETE', 'STUDY_EXECUTE',
    'DATA_READ', 'DATA_WRITE', 'DATA_DELETE',
    'REPORT_VIEW', 'REPORT_EXPORT',
    'AUDIT_VIEW'
  ],
  ADMIN: [
    'USER_MANAGEMENT',
    'PROTOCOL_CREATE', 'PROTOCOL_READ', 'PROTOCOL_UPDATE', 'PROTOCOL_DELETE',
    'STUDY_CREATE', 'STUDY_READ', 'STUDY_UPDATE', 'STUDY_DELETE', 'STUDY_EXECUTE',
    'DATA_READ', 'DATA_WRITE', 'DATA_DELETE',
    'REPORT_VIEW', 'REPORT_EXPORT',
    'AUDIT_VIEW'
  ],
  MANAGER: [
    'PROTOCOL_CREATE', 'PROTOCOL_READ', 'PROTOCOL_UPDATE',
    'STUDY_CREATE', 'STUDY_READ', 'STUDY_UPDATE', 'STUDY_EXECUTE',
    'DATA_READ', 'DATA_WRITE',
    'REPORT_VIEW', 'REPORT_EXPORT'
  ],
  RESEARCHER: [
    'PROTOCOL_READ',
    'STUDY_CREATE', 'STUDY_READ', 'STUDY_UPDATE', 'STUDY_EXECUTE',
    'DATA_READ', 'DATA_WRITE',
    'REPORT_VIEW', 'REPORT_EXPORT'
  ],
  OPERATOR: [
    'PROTOCOL_READ',
    'STUDY_READ', 'STUDY_EXECUTE',
    'DATA_READ', 'DATA_WRITE',
    'REPORT_VIEW'
  ],
  USER: [
    'PROTOCOL_READ',
    'STUDY_READ',
    'DATA_READ',
    'REPORT_VIEW'
  ],
  GUEST: [
    'PROTOCOL_READ',
    'STUDY_READ',
    'DATA_READ'
  ]
};

// JWT Configuration
export const jwtConfig = {
  access: {
    secret: securityConfig.jwt.accessTokenSecret,
    options: {
      expiresIn: securityConfig.jwt.accessTokenExpiry,
      issuer: securityConfig.jwt.issuer,
      audience: securityConfig.jwt.audience
    }
  },
  refresh: {
    secret: securityConfig.jwt.refreshTokenSecret,
    options: {
      expiresIn: securityConfig.jwt.refreshTokenExpiry,
      issuer: securityConfig.jwt.issuer,
      audience: securityConfig.jwt.audience
    }
  }
};

// Bcrypt Configuration
export const bcryptConfig = {
  saltRounds: 12
};

// Cookie Configuration
export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

// Environment validation
export const validateAuthEnvironment = (): void => {
  const requiredEnvVars = [
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('⚠️  Missing auth environment variables:', missingVars);
    console.warn('⚠️  Using development defaults - NOT SECURE FOR PRODUCTION!');
  }

  if (process.env.NODE_ENV === 'production') {
    if (process.env.JWT_ACCESS_SECRET === 'edith-access-secret-dev-only' ||
        process.env.JWT_REFRESH_SECRET === 'edith-refresh-secret-dev-only') {
      throw new Error('🚨 Production environment detected with development JWT secrets! Please set proper JWT_ACCESS_SECRET and JWT_REFRESH_SECRET environment variables.');
    }
  }
};
