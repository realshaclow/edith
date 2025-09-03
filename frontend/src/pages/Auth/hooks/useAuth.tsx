import React, { useState, useEffect, useCallback, createContext, useContext, useReducer } from 'react';
import {
  User,
  AuthContextType,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenResponse,
  PasswordResetRequest,
  PasswordReset,
  PasswordChange,
  EmailVerification,
  ResendVerification,
  Session,
  TwoFactorSetup,
  TwoFactorVerification,
  AuthState,
  AuthAction,
  ApiResponse,
  SecurityLog
} from '../types';

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null
      };
    
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload
      };
    
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
        sessions: [],
        twoFactorEnabled: false
      };
    
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    
    case 'SET_TWO_FACTOR':
      return { ...state, twoFactorEnabled: action.payload };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  sessions: [],
  twoFactorEnabled: false
};

// Mock API calls (replace with real API)
const mockApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (credentials.email === 'admin@edith.com' && credentials.password === 'admin123') {
      const user: User = {
        id: '1',
        email: credentials.email,
        firstName: 'Administrator',
        lastName: 'System',
        username: 'admin',
        avatar: undefined,
        role: {
          id: '1',
          name: 'Administrator',
          permissions: [],
          level: 1
        },
        department: 'IT',
        position: 'System Administrator',
        phone: '+48 123 456 789',
        preferences: {
          theme: 'light',
          language: 'pl',
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          dashboard: {
            layout: 'comfortable',
            widgets: []
          },
          timezone: 'Europe/Warsaw'
        },
        isActive: true,
        isEmailVerified: true,
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: new Date().toISOString()
      };

      return {
        user,
        accessToken: 'mock_access_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now(),
        expiresIn: 3600,
        tokenType: 'Bearer'
      };
    }
    
    throw new Error('Nieprawidłowe dane logowania');
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (data.email === 'existing@example.com') {
      throw new Error('Użytkownik z tym adresem email już istnieje');
    }

    const user: User = {
      id: Date.now().toString(),
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      username: data.username,
      role: {
        id: '3',
        name: 'User',
        permissions: [],
        level: 3
      },
      department: data.department,
      position: data.position,
      phone: data.phone,
      preferences: {
        theme: 'light',
        language: 'pl',
        notifications: {
          email: true,
          push: true,
          sms: false
        },
        dashboard: {
          layout: 'comfortable',
          widgets: []
        },
        timezone: 'Europe/Warsaw'
      },
      isActive: true,
      isEmailVerified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      user,
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresIn: 3600,
      tokenType: 'Bearer'
    };
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      accessToken: 'mock_access_token_' + Date.now(),
      expiresIn: 3600
    };
  },

  forgotPassword: async (data: PasswordResetRequest): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', data.email);
  },

  resetPassword: async (data: PasswordReset): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset for token:', data.token);
  },

  changePassword: async (data: PasswordChange): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (data.currentPassword !== 'current123') {
      throw new Error('Nieprawidłowe obecne hasło');
    }
  },

  verifyEmail: async (data: EmailVerification): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Email verified with token:', data.token);
  },

  resendVerification: async (data: ResendVerification): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Verification email resent to:', data.email);
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { ...initialState.user!, ...data } as User;
  },

  uploadAvatar: async (file: File): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return `https://api.example.com/avatars/${Date.now()}.jpg`;
  },

  getSessions: async (): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: '1',
        userId: '1',
        deviceName: 'Windows PC',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        location: {
          country: 'Poland',
          city: 'Warsaw',
          region: 'Mazowieckie'
        },
        isActive: true,
        lastActivity: new Date().toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString()
      }
    ];
  },

  terminateSession: async (sessionId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log('Session terminated:', sessionId);
  },

  setupTwoFactor: async (): Promise<TwoFactorSetup> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      secret: 'MOCK_SECRET_KEY_123456',
      qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      backupCodes: [
        '123456',
        '234567',
        '345678',
        '456789',
        '567890'
      ]
    };
  },

  verifyTwoFactor: async (data: TwoFactorVerification): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (data.code !== '123456' && data.backupCode !== '123456') {
      throw new Error('Nieprawidłowy kod');
    }
  },

  disableTwoFactor: async (password: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    if (password !== 'admin123') {
      throw new Error('Nieprawidłowe hasło');
    }
  }
};

// Storage utilities
const TOKEN_KEY = 'edith_access_token';
const REFRESH_TOKEN_KEY = 'edith_refresh_token';
const USER_KEY = 'edith_user';

const storage = {
  getToken: (): string | null => localStorage.getItem(TOKEN_KEY),
  setToken: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
  removeToken: (): void => localStorage.removeItem(TOKEN_KEY),
  
  getRefreshToken: (): string | null => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token: string): void => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  removeRefreshToken: (): void => localStorage.removeItem(REFRESH_TOKEN_KEY),
  
  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },
  setUser: (user: User): void => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  removeUser: (): void => localStorage.removeItem(USER_KEY),
  
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export const useAuth = (): AuthContextType => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = storage.getToken();
        const user = storage.getUser();
        
        if (token && user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: { user, accessToken: token } });
        } else {
          dispatch({ type: 'AUTH_ERROR', payload: 'Nie jesteś zalogowany' });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        dispatch({ type: 'AUTH_ERROR', payload: 'Błąd inicjalizacji autoryzacji' });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await mockApi.login(credentials);
      
      // Store tokens and user data
      storage.setToken(response.accessToken);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user, accessToken: response.accessToken } });
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Błąd logowania';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await mockApi.register(data);
      
      // Store tokens and user data
      storage.setToken(response.accessToken);
      storage.setRefreshToken(response.refreshToken);
      storage.setUser(response.user);
      
      dispatch({ type: 'AUTH_SUCCESS', payload: { user: response.user, accessToken: response.accessToken } });
      
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Błąd rejestracji';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      // Clear storage
      storage.clear();
      
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<RefreshTokenResponse> => {
    try {
      const response = await mockApi.refreshToken();
      storage.setToken(response.accessToken);
      return response;
    } catch (error) {
      // If refresh fails, logout user
      logout();
      throw error;
    }
  }, [logout]);

  const forgotPassword = useCallback(async (data: PasswordResetRequest): Promise<void> => {
    return mockApi.forgotPassword(data);
  }, []);

  const resetPassword = useCallback(async (data: PasswordReset): Promise<void> => {
    return mockApi.resetPassword(data);
  }, []);

  const changePassword = useCallback(async (data: PasswordChange): Promise<void> => {
    return mockApi.changePassword(data);
  }, []);

  const verifyEmail = useCallback(async (data: EmailVerification): Promise<void> => {
    return mockApi.verifyEmail(data);
  }, []);

  const resendVerification = useCallback(async (data: ResendVerification): Promise<void> => {
    return mockApi.resendVerification(data);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<User> => {
    try {
      const updatedUser = await mockApi.updateProfile(data);
      storage.setUser(updatedUser);
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    return mockApi.uploadAvatar(file);
  }, []);

  const getSessions = useCallback(async (): Promise<Session[]> => {
    try {
      const sessions = await mockApi.getSessions();
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
      return sessions;
    } catch (error) {
      throw error;
    }
  }, []);

  const terminateSession = useCallback(async (sessionId: string): Promise<void> => {
    await mockApi.terminateSession(sessionId);
    // Update sessions list
    getSessions();
  }, [getSessions]);

  const setupTwoFactor = useCallback(async (): Promise<TwoFactorSetup> => {
    return mockApi.setupTwoFactor();
  }, []);

  const verifyTwoFactor = useCallback(async (data: TwoFactorVerification): Promise<void> => {
    await mockApi.verifyTwoFactor(data);
    dispatch({ type: 'SET_TWO_FACTOR', payload: true });
  }, []);

  const disableTwoFactor = useCallback(async (password: string): Promise<void> => {
    await mockApi.disableTwoFactor(password);
    dispatch({ type: 'SET_TWO_FACTOR', payload: false });
  }, []);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    refreshToken,
    forgotPassword,
    resetPassword,
    changePassword,
    verifyEmail,
    resendVerification,
    updateProfile,
    uploadAvatar,
    getSessions,
    terminateSession,
    setupTwoFactor,
    verifyTwoFactor,
    disableTwoFactor
  };
};

// Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
