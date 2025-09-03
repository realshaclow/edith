/**
 * OAuth Types and Interfaces
 * Professional OAuth system type definitions
 */

export enum OAuthProvider {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  MICROSOFT = 'MICROSOFT'
}

export interface OAuthProfile {
  id: string;
  provider: OAuthProvider;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  displayName?: string;
  avatar?: string;
  profileUrl?: string;
  accessToken?: string;
  refreshToken?: string;
  raw: any;
}

export interface OAuthAccount {
  id: string;
  userId: string;
  provider: OAuthProvider;
  providerId: string;
  email: string;
  profileData?: any;
  createdAt: Date;
  lastUsed: Date;
}

export interface OAuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
  tokenType?: string;
}

export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  scope?: string[];
}

export interface OAuthStrategyConfig {
  google?: OAuthConfig;
  github?: OAuthConfig;
  microsoft?: OAuthConfig;
}

export interface OAuthAuthenticatedUser {
  id: string;
  email: string;
  role: string;
  tokens: OAuthTokens;
  profile: OAuthProfile;
  isNewUser: boolean;
}

export interface OAuthError {
  provider: OAuthProvider;
  error: string;
  details?: any;
  timestamp: Date;
}

export interface OAuthLinkRequest {
  userId: string;
  provider: OAuthProvider;
  code: string;
  state?: string;
}

export interface OAuthUnlinkRequest {
  userId: string;
  provider: OAuthProvider;
}

export interface OAuthAccountInfo {
  provider: OAuthProvider;
  email: string;
  isLinked: boolean;
  linkedAt?: Date;
  lastUsed?: Date;
}
