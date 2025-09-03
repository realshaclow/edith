/**
 * OAuth Hook
 * Professional OAuth state management and integration
 */

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  OAuthProviderType,
  OAuthProvider as IOAuthProvider,
  OAuthState,
  OAuthContextType,
  OAuthAuthenticateResponse,
  OAuthCallbackParams,
  OAuthAccountInfo,
  OAuthLinkResponse,
  OAuthError
} from '../types/oauth';
import { oauthApiService } from '../services/oauthApiService';
import { useAuthContext } from './useAuth';

// OAuth Provider configurations
const OAUTH_PROVIDERS: IOAuthProvider[] = [
  {
    id: OAuthProviderType.GOOGLE,
    name: 'google',
    displayName: 'Google',
    icon: 'Google',
    color: '#db4437',
    enabled: true
  },
  {
    id: OAuthProviderType.GITHUB,
    name: 'github',
    displayName: 'GitHub',
    icon: 'GitHub',
    color: '#333333',
    enabled: true
  },
  {
    id: OAuthProviderType.MICROSOFT,
    name: 'microsoft',
    displayName: 'Microsoft',
    icon: 'Microsoft',
    color: '#00a1f1',
    enabled: true
  }
];

// OAuth State Management
type OAuthAction =
  | { type: 'SET_AUTHENTICATING'; payload: { provider: OAuthProviderType; isAuthenticating: boolean } }
  | { type: 'SET_LINKING'; payload: { provider: OAuthProviderType; isLinking: boolean } }
  | { type: 'SET_ERROR'; payload: OAuthError }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LINKED_ACCOUNTS'; payload: OAuthAccountInfo[] }
  | { type: 'UPDATE_LINKED_ACCOUNT'; payload: OAuthAccountInfo }
  | { type: 'REMOVE_LINKED_ACCOUNT'; payload: OAuthProviderType }
  | { type: 'RESET_STATE' };

const oauthReducer = (state: OAuthState, action: OAuthAction): OAuthState => {
  switch (action.type) {
    case 'SET_AUTHENTICATING':
      return {
        ...state,
        provider: action.payload.provider,
        isAuthenticating: action.payload.isAuthenticating,
        isLinking: false,
        error: undefined
      };

    case 'SET_LINKING':
      return {
        ...state,
        provider: action.payload.provider,
        isLinking: action.payload.isLinking,
        isAuthenticating: false,
        error: undefined
      };

    case 'SET_ERROR':
      return {
        ...state,
        isAuthenticating: false,
        isLinking: false,
        error: action.payload
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: undefined
      };

    case 'SET_LINKED_ACCOUNTS':
      return {
        ...state,
        linkedAccounts: action.payload
      };

    case 'UPDATE_LINKED_ACCOUNT':
      return {
        ...state,
        linkedAccounts: [
          ...state.linkedAccounts.filter(acc => acc.provider !== action.payload.provider),
          action.payload
        ]
      };

    case 'REMOVE_LINKED_ACCOUNT':
      return {
        ...state,
        linkedAccounts: state.linkedAccounts.filter(acc => acc.provider !== action.payload)
      };

    case 'RESET_STATE':
      return {
        isAuthenticating: false,
        isLinking: false,
        linkedAccounts: [],
        error: undefined
      };

    default:
      return state;
  }
};

const initialState: OAuthState = {
  isAuthenticating: false,
  isLinking: false,
  linkedAccounts: [],
  error: undefined
};

// OAuth Context
const OAuthContext = createContext<OAuthContextType | null>(null);

// OAuth Provider Component
export const OAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(oauthReducer, initialState);
  const { isAuthenticated, login: authLogin } = useAuthContext();
  const location = useLocation();

  /**
   * Load linked accounts when user is authenticated
   */
  const loadLinkedAccounts = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const accounts = await oauthApiService.getLinkedAccounts();
      dispatch({ type: 'SET_LINKED_ACCOUNTS', payload: accounts });
    } catch (error) {
      console.error('Failed to load linked accounts:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadLinkedAccounts();
  }, [loadLinkedAccounts]);

  /**
   * Handle OAuth callback from URL parameters
   */
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const provider = location.pathname.match(/\/auth\/oauth\/(\w+)\/callback/)?.[1];
    
    if (provider && (searchParams.has('code') || searchParams.has('error'))) {
      const providerType = provider.toUpperCase() as OAuthProviderType;
      
      const callbackParams: OAuthCallbackParams = {
        provider: providerType,
        code: searchParams.get('code') || '',
        state: searchParams.get('state') || undefined,
        error: searchParams.get('error') || undefined,
        error_description: searchParams.get('error_description') || undefined
      };

      handleOAuthCallback(callbackParams);
    }
  }, [location]);

  /**
   * Authenticate with OAuth provider
   */
  const authenticateWithOAuth = useCallback(async (
    provider: OAuthProviderType,
    returnUrl?: string
  ): Promise<void> => {
    try {
      dispatch({ type: 'SET_AUTHENTICATING', payload: { provider, isAuthenticating: true } });
      dispatch({ type: 'CLEAR_ERROR' });

      await oauthApiService.authenticateWithProvider(provider, returnUrl);
      // Redirect happens in the service
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as OAuthError });
      dispatch({ type: 'SET_AUTHENTICATING', payload: { provider, isAuthenticating: false } });
    }
  }, []);

  /**
   * Handle OAuth callback
   */
  const handleOAuthCallback = useCallback(async (
    params: OAuthCallbackParams
  ): Promise<OAuthAuthenticateResponse> => {
    try {
      dispatch({ type: 'SET_AUTHENTICATING', payload: { provider: params.provider, isAuthenticating: true } });

      const response = await oauthApiService.handleCallback(params);

      // Check if this was a linking action
      const action = sessionStorage.getItem('oauth_action');
      
      if (action === 'link') {
        // Handle account linking
        await loadLinkedAccounts();
        sessionStorage.removeItem('oauth_action');
      } else {
        // Handle authentication - update auth context
        // This should trigger the main auth system
        if (response.tokens) {
          // The auth context should handle this automatically via token storage
          // Force refresh of auth state
          window.location.reload();
        }
      }

      // Get return URL and navigate
      const returnUrl = oauthApiService.getReturnUrl() || '/dashboard';
      oauthApiService.clearSession();
      
      dispatch({ type: 'SET_AUTHENTICATING', payload: { provider: params.provider, isAuthenticating: false } });
      
      window.location.href = returnUrl;
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as OAuthError });
      dispatch({ type: 'SET_AUTHENTICATING', payload: { provider: params.provider, isAuthenticating: false } });
      
      // Navigate to auth page on error
      window.location.href = '/auth';
      throw error;
    }
  }, [loadLinkedAccounts]);

  /**
   * Link OAuth account to current user
   */
  const linkOAuthAccount = useCallback(async (
    provider: OAuthProviderType
  ): Promise<OAuthLinkResponse> => {
    try {
      dispatch({ type: 'SET_LINKING', payload: { provider, isLinking: true } });
      dispatch({ type: 'CLEAR_ERROR' });

      await oauthApiService.linkAccount(provider);
      // Redirect happens in the service
      
      return { success: true, message: 'Account linking initiated' };
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as OAuthError });
      dispatch({ type: 'SET_LINKING', payload: { provider, isLinking: false } });
      throw error;
    }
  }, []);

  /**
   * Unlink OAuth account from current user
   */
  const unlinkOAuthAccount = useCallback(async (
    provider: OAuthProviderType
  ): Promise<OAuthLinkResponse> => {
    try {
      const response = await oauthApiService.unlinkAccount(provider);
      
      if (response.success) {
        dispatch({ type: 'REMOVE_LINKED_ACCOUNT', payload: provider });
      }

      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as OAuthError });
      throw error;
    }
  }, []);

  /**
   * Get linked accounts (refresh from server)
   */
  const getLinkedAccounts = useCallback(async (): Promise<OAuthAccountInfo[]> => {
    await loadLinkedAccounts();
    return state.linkedAccounts;
  }, [loadLinkedAccounts, state.linkedAccounts]);

  /**
   * Get provider information
   */
  const getProviderInfo = useCallback((provider: OAuthProviderType): IOAuthProvider | undefined => {
    return OAUTH_PROVIDERS.find(p => p.id === provider);
  }, []);

  /**
   * Check if provider is linked
   */
  const isProviderLinked = useCallback((provider: OAuthProviderType): boolean => {
    return state.linkedAccounts.some(acc => acc.provider === provider && acc.isLinked);
  }, [state.linkedAccounts]);

  const contextValue: OAuthContextType = {
    // Authentication
    authenticateWithOAuth,
    handleOAuthCallback,
    
    // Account Management
    linkOAuthAccount,
    unlinkOAuthAccount,
    getLinkedAccounts,
    
    // State
    oauthState: state,
    availableProviders: OAUTH_PROVIDERS,
    
    // Utilities
    getProviderInfo,
    isProviderLinked
  };

  return (
    <OAuthContext.Provider value={contextValue}>
      {children}
    </OAuthContext.Provider>
  );
};

// Hook to use OAuth context
export const useOAuth = (): OAuthContextType => {
  const context = useContext(OAuthContext);
  if (!context) {
    throw new Error('useOAuth must be used within an OAuthProvider');
  }
  return context;
};

export default useOAuth;
