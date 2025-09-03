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
  AuthAction
} from '../types';

import { realAuthApi } from '../../../services/authApi';

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
      return {
        ...state,
        user: action.payload
      };
    
    case 'SET_SESSIONS':
      return {
        ...state,
        sessions: action.payload
      };
    
    case 'SET_TWO_FACTOR':
      return {
        ...state,
        twoFactorEnabled: action.payload
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessions: [],
  twoFactorEnabled: false
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use auth context
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          // Verify token is still valid and get current user data
          const user = await realAuthApi.getCurrentUser();
          dispatch({ 
            type: 'AUTH_SUCCESS', 
            payload: { user, accessToken: token } 
          });
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await realAuthApi.login(credentials);
      
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          user: response.user, 
          accessToken: response.accessToken 
        } 
      });
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Błąd logowania';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResponse> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await realAuthApi.register(data);
      
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      dispatch({ 
        type: 'AUTH_SUCCESS', 
        payload: { 
          user: response.user, 
          accessToken: response.accessToken 
        } 
      });
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Błąd rejestracji';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await realAuthApi.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Always clear local state
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const refreshToken = useCallback(async (): Promise<RefreshTokenResponse> => {
    try {
      const response = await realAuthApi.refreshToken();
      
      // Store new token
      localStorage.setItem('accessToken', response.accessToken);
      
      return response;
    } catch (error: any) {
      // Refresh failed - logout user
      dispatch({ type: 'LOGOUT' });
      throw error;
    }
  }, []);

  const forgotPassword = useCallback(async (data: PasswordResetRequest): Promise<void> => {
    await realAuthApi.forgotPassword(data);
  }, []);

  const resetPassword = useCallback(async (data: PasswordReset): Promise<void> => {
    await realAuthApi.resetPassword(data);
  }, []);

  const changePassword = useCallback(async (data: PasswordChange): Promise<void> => {
    await realAuthApi.changePassword(data);
  }, []);

  const verifyEmail = useCallback(async (data: EmailVerification): Promise<void> => {
    await realAuthApi.verifyEmail(data);
  }, []);

  const resendVerification = useCallback(async (data: ResendVerification): Promise<void> => {
    await realAuthApi.resendVerification(data);
  }, []);

  const updateProfile = useCallback(async (data: Partial<User>): Promise<User> => {
    try {
      const updatedUser = await realAuthApi.updateProfile(data);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }, []);

  const uploadAvatar = useCallback(async (file: File): Promise<string> => {
    const result = await realAuthApi.uploadAvatar(file);
    return result.avatarUrl;
  }, []);

  const getSessions = useCallback(async (): Promise<Session[]> => {
    try {
      const sessions = await realAuthApi.getSessions();
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
      return sessions;
    } catch (error) {
      throw error;
    }
  }, []);

  const terminateSession = useCallback(async (sessionId: string): Promise<void> => {
    await realAuthApi.terminateSession(sessionId);
    // Refresh sessions after termination
    await getSessions();
  }, [getSessions]);

  const setupTwoFactor = useCallback(async (): Promise<TwoFactorSetup> => {
    const setup = await realAuthApi.setupTwoFactor();
    return setup;
  }, []);

  const verifyTwoFactor = useCallback(async (data: TwoFactorVerification): Promise<void> => {
    await realAuthApi.verifyTwoFactor(data.code);
    dispatch({ type: 'SET_TWO_FACTOR', payload: true });
  }, []);

  const disableTwoFactor = useCallback(async (password: string): Promise<void> => {
    await realAuthApi.disableTwoFactor(password);
    dispatch({ type: 'SET_TWO_FACTOR', payload: false });
  }, []);

  const contextValue: AuthContextType = {
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

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Export useAuth as alias for useAuthContext for backward compatibility  
export const useAuth = useAuthContext;
