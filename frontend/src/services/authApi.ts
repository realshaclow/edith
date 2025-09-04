import axios, { AxiosResponse } from 'axios';
import {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  User,
  PasswordResetRequest,
  PasswordReset,
  PasswordChange,
  EmailVerification,
  ResendVerification,
  Session,
  TwoFactorSetup
} from '../pages/Auth/types';

// Konfiguracja axios dla auth
const authApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Dla obsługi cookies z tokenami
});

// Interceptor dla dodawania token authorization
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor dla obsługi błędów i odświeżania tokenów
authApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Utworzenie nowego instance axios bez interceptorów żeby uniknąć nieskończonej pętli
          const refreshInstance = axios.create({
            baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
            timeout: 10000,
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });
          
          const response = await refreshInstance.post('/auth/refresh-token', {
            refreshToken
          });
          
          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);
          
          // Ponów pierwotne żądanie z nowym tokenem
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return authApi(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - wyloguj użytkownika
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/auth';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Real API calls
export const realAuthApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/login', credentials);
    const { data } = response.data; // Backend returns { success: true, data: {...} }
    
    return {
      user: data.user,
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
      expiresIn: data.tokens.expiresIn,
      tokenType: 'Bearer'
    };
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await authApi.post('/auth/register', data);
    const { data: responseData } = response.data; // Backend returns { success: true, data: {...} }
    
    return {
      user: responseData.user,
      accessToken: responseData.tokens.accessToken,
      refreshToken: responseData.tokens.refreshToken,
      expiresIn: responseData.tokens.expiresIn,
      tokenType: 'Bearer'
    };
  },

  logout: async (): Promise<void> => {
    try {
      await authApi.post('/auth/logout');
    } catch (error) {
      // Ignoruj błędy logout - i tak czyścimy lokalne dane
      console.warn('Logout API call failed:', error);
    }
    
    // Wyczyść lokalne dane
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await authApi.post('/auth/refresh-token', {
      refreshToken
    });
    const { data } = response.data; // Backend returns { success: true, data: {...} }
    
    return {
      user: data.user,
      accessToken: data.tokens.accessToken,
      refreshToken: data.tokens.refreshToken,
      expiresIn: data.tokens.expiresIn,
      tokenType: 'Bearer'
    };
  },

  forgotPassword: async (data: PasswordResetRequest): Promise<{ success: boolean; message: string }> => {
    const response = await authApi.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: PasswordReset): Promise<{ success: boolean; message: string }> => {
    const response = await authApi.post('/auth/reset-password', data);
    return response.data;
  },

  changePassword: async (data: PasswordChange): Promise<{ success: boolean; message: string }> => {
    const response = await authApi.post('/auth/change-password', data);
    return response.data;
  },

  verifyEmail: async (data: EmailVerification): Promise<{ success: boolean; message: string }> => {
    const response = await authApi.post('/auth/verify-email', data);
    return response.data;
  },

  resendVerification: async (data: ResendVerification): Promise<{ success: boolean; message: string }> => {
    const response = await authApi.post('/auth/resend-verification', data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await authApi.get<{ success: boolean; data: User }>('/auth/profile');
    return response.data.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await authApi.put<{ success: boolean; data: User }>('/auth/profile', data);
    return response.data.data;
  },

  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await authApi.post<{ success: boolean; data: { avatarUrl: string } }>(
      '/auth/avatar', 
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },

  getSessions: async (): Promise<Session[]> => {
    const response = await authApi.get<{ success: boolean; data: Session[] }>('/auth/sessions');
    return response.data.data;
  },

  terminateSession: async (sessionId: string): Promise<void> => {
    await authApi.delete(`/auth/sessions/${sessionId}`);
  },

  setupTwoFactor: async (): Promise<TwoFactorSetup> => {
    const response = await authApi.post<{ success: boolean; data: TwoFactorSetup }>('/auth/2fa/setup');
    return response.data.data;
  },

  verifyTwoFactor: async (token: string): Promise<{ success: boolean; backupCodes: string[] }> => {
    const response = await authApi.post('/auth/2fa/verify', { token });
    return response.data;
  },

  disableTwoFactor: async (password: string): Promise<{ success: boolean }> => {
    const response = await authApi.post('/auth/2fa/disable', { password });
    return response.data;
  }
};

export default authApi;
