/**
 * OAuth Types for Frontend
 * Professional OAuth integration types
 */

// OAuth Provider Configuration
export enum OAuthProviderType {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  MICROSOFT = 'MICROSOFT'
}

export interface OAuthProvider {
  id: OAuthProviderType;
  name: string;
  displayName: string;
  icon: string;
  color: string;
  enabled: boolean;
}

// OAuth Flow Types
export interface OAuthAuthenticateRequest {
  provider: OAuthProviderType;
  returnUrl?: string;
}

export interface OAuthCallbackParams {
  provider: OAuthProviderType;
  code: string;
  state?: string;
  error?: string;
  error_description?: string;
}

export interface OAuthAuthenticateResponse {
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    avatar?: string;
    role: string;
    isActive: boolean;
    isVerified: boolean;
    language: string;
    timezone: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  };
  isNewUser: boolean;
}

// OAuth Account Management
export interface OAuthAccountInfo {
  provider: OAuthProviderType;
  email: string;
  isLinked: boolean;
  linkedAt?: string;
  lastUsed?: string;
}

export interface OAuthLinkRequest {
  provider: OAuthProviderType;
  returnUrl?: string;
}

export interface OAuthUnlinkRequest {
  provider: OAuthProviderType;
}

export interface OAuthLinkResponse {
  success: boolean;
  message: string;
  account?: OAuthAccountInfo;
}

// OAuth Error Types
export interface OAuthError {
  provider: OAuthProviderType;
  error: string;
  error_description?: string;
  details?: any;
}

// OAuth State Management
export interface OAuthState {
  provider?: OAuthProviderType;
  returnUrl?: string;
  isAuthenticating: boolean;
  isLinking: boolean;
  error?: OAuthError;
  linkedAccounts: OAuthAccountInfo[];
}

// OAuth Context Types
export interface OAuthContextType {
  // Authentication
  authenticateWithOAuth: (provider: OAuthProviderType, returnUrl?: string) => Promise<void>;
  handleOAuthCallback: (params: OAuthCallbackParams) => Promise<OAuthAuthenticateResponse>;
  
  // Account Management
  linkOAuthAccount: (provider: OAuthProviderType) => Promise<OAuthLinkResponse>;
  unlinkOAuthAccount: (provider: OAuthProviderType) => Promise<OAuthLinkResponse>;
  getLinkedAccounts: () => Promise<OAuthAccountInfo[]>;
  
  // State
  oauthState: OAuthState;
  availableProviders: OAuthProvider[];
  
  // Utilities
  getProviderInfo: (provider: OAuthProviderType) => OAuthProvider | undefined;
  isProviderLinked: (provider: OAuthProviderType) => boolean;
}

// OAuth Component Props
export interface OAuthButtonProps {
  provider: OAuthProviderType;
  mode: 'login' | 'register' | 'link';
  disabled?: boolean;
  fullWidth?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  size?: 'small' | 'medium' | 'large';
  onSuccess?: (response: OAuthAuthenticateResponse) => void;
  onError?: (error: OAuthError) => void;
  children?: React.ReactNode;
}

export interface OAuthButtonGroupProps {
  mode: 'login' | 'register' | 'link';
  providers?: OAuthProviderType[];
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  onSuccess?: (response: OAuthAuthenticateResponse) => void;
  onError?: (error: OAuthError) => void;
}

export interface OAuthAccountListProps {
  accounts: OAuthAccountInfo[];
  onUnlink?: (provider: OAuthProviderType) => void;
  showActions?: boolean;
}

// OAuth Configuration
export interface OAuthConfig {
  baseUrl: string;
  endpoints: {
    authenticate: string;
    callback: string;
    link: string;
    unlink: string;
    accounts: string;
  };
  providers: {
    [K in OAuthProviderType]: {
      enabled: boolean;
      scopes?: string[];
    };
  };
}
