/**
 * OAuth API Service
 * Professional OAuth API integration
 */

import axios, { AxiosResponse } from 'axios';
import {
  OAuthProviderType,
  OAuthAuthenticateResponse,
  OAuthCallbackParams,
  OAuthAccountInfo,
  OAuthLinkRequest,
  OAuthUnlinkRequest,
  OAuthLinkResponse,
  OAuthError
} from '../types/oauth';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// OAuth endpoints
const OAUTH_ENDPOINTS = {
  authenticate: (provider: string) => `/auth/oauth/${provider.toLowerCase()}`,
  callback: (provider: string) => `/auth/oauth/${provider.toLowerCase()}/callback`,
  link: '/auth/oauth/link',
  unlink: '/auth/oauth/unlink',
  accounts: '/auth/oauth/accounts'
};

export class OAuthApiService {
  private static instance: OAuthApiService;
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  constructor() {
    this.setupInterceptors();
  }

  public static getInstance(): OAuthApiService {
    if (!OAuthApiService.instance) {
      OAuthApiService.instance = new OAuthApiService();
    }
    return OAuthApiService.instance;
  }

  /**
   * Setup axios interceptors for token management
   */
  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('OAuth API Error:', error);
        
        if (error.response?.status === 401) {
          // Handle unauthorized access
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth';
        }
        
        return Promise.reject(this.formatError(error));
      }
    );
  }

  /**
   * Format API errors to OAuth error format
   */
  private formatError(error: any): OAuthError {
    const provider = error.config?.url?.includes('google') ? OAuthProviderType.GOOGLE :
                    error.config?.url?.includes('github') ? OAuthProviderType.GITHUB :
                    error.config?.url?.includes('microsoft') ? OAuthProviderType.MICROSOFT :
                    OAuthProviderType.GOOGLE; // fallback

    return {
      provider,
      error: error.response?.data?.error || error.message || 'Unknown OAuth error',
      error_description: error.response?.data?.message || error.response?.data?.error_description,
      details: error.response?.data
    };
  }

  /**
   * Initiate OAuth authentication
   * Redirects user to OAuth provider
   */
  public async authenticateWithProvider(
    provider: OAuthProviderType,
    returnUrl?: string
  ): Promise<void> {
    try {
      // Store return URL in session storage
      if (returnUrl) {
        sessionStorage.setItem('oauth_return_url', returnUrl);
      }

      // Build authentication URL
      const authUrl = `${API_BASE_URL}${OAUTH_ENDPOINTS.authenticate(provider)}`;
      const params = new URLSearchParams();
      
      if (returnUrl) {
        params.append('returnUrl', returnUrl);
      }

      // Add CSRF protection state
      const state = this.generateState();
      params.append('state', state);
      sessionStorage.setItem('oauth_state', state);

      const finalUrl = params.toString() ? `${authUrl}?${params.toString()}` : authUrl;
      
      // Redirect to OAuth provider
      window.location.href = finalUrl;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Handle OAuth callback
   * Process the callback from OAuth provider
   */
  public async handleCallback(
    params: OAuthCallbackParams
  ): Promise<OAuthAuthenticateResponse> {
    try {
      // Verify state parameter
      const storedState = sessionStorage.getItem('oauth_state');
      if (params.state && storedState && params.state !== storedState) {
        throw new Error('Invalid OAuth state parameter');
      }

      // Clean up stored state
      sessionStorage.removeItem('oauth_state');

      // Handle OAuth errors
      if (params.error) {
        throw new Error(params.error_description || params.error);
      }

      if (!params.code) {
        throw new Error('No authorization code received');
      }

      // Exchange code for tokens
      const response = await this.apiClient.post<OAuthAuthenticateResponse>(
        OAUTH_ENDPOINTS.callback(params.provider),
        {
          code: params.code,
          state: params.state
        }
      );

      const authResponse = response.data;

      // Store tokens
      if (authResponse.tokens) {
        localStorage.setItem('accessToken', authResponse.tokens.accessToken);
        localStorage.setItem('refreshToken', authResponse.tokens.refreshToken);
      }

      return authResponse;
    } catch (error) {
      sessionStorage.removeItem('oauth_state');
      throw this.formatError(error);
    }
  }

  /**
   * Link OAuth account to current user
   */
  public async linkAccount(
    provider: OAuthProviderType,
    returnUrl?: string
  ): Promise<void> {
    try {
      // Store link context
      sessionStorage.setItem('oauth_action', 'link');
      if (returnUrl) {
        sessionStorage.setItem('oauth_return_url', returnUrl);
      }

      // Initiate OAuth flow for linking
      await this.authenticateWithProvider(provider, returnUrl);
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Unlink OAuth account from current user
   */
  public async unlinkAccount(
    provider: OAuthProviderType
  ): Promise<OAuthLinkResponse> {
    try {
      const response = await this.apiClient.delete<OAuthLinkResponse>(
        OAUTH_ENDPOINTS.unlink,
        {
          data: { provider }
        }
      );

      return response.data;
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Get linked OAuth accounts for current user
   */
  public async getLinkedAccounts(): Promise<OAuthAccountInfo[]> {
    try {
      const response = await this.apiClient.get<{ accounts: OAuthAccountInfo[] }>(
        OAUTH_ENDPOINTS.accounts
      );

      return response.data.accounts || [];
    } catch (error) {
      throw this.formatError(error);
    }
  }

  /**
   * Check if OAuth provider is available
   */
  public async checkProviderAvailability(
    provider: OAuthProviderType
  ): Promise<boolean> {
    try {
      const response = await this.apiClient.get(
        `${OAUTH_ENDPOINTS.authenticate(provider)}/availability`
      );
      return response.data.available || false;
    } catch (error) {
      console.warn(`Provider ${provider} availability check failed:`, error);
      return false;
    }
  }

  /**
   * Generate secure state parameter for CSRF protection
   */
  private generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Get return URL from session storage
   */
  public getReturnUrl(): string | null {
    return sessionStorage.getItem('oauth_return_url');
  }

  /**
   * Clear OAuth session data
   */
  public clearSession(): void {
    sessionStorage.removeItem('oauth_return_url');
    sessionStorage.removeItem('oauth_state');
    sessionStorage.removeItem('oauth_action');
  }
}

// Export singleton instance
export const oauthApiService = OAuthApiService.getInstance();
export default oauthApiService;
