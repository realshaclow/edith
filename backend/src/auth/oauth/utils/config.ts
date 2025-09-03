/**
 * OAuth Configuration
 * Centralized configuration for OAuth providers
 */

import { OAuthStrategyConfig, OAuthProvider } from '../types';

export class OAuthConfigManager {
  private static instance: OAuthConfigManager;
  private config: OAuthStrategyConfig;

  private constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  public static getInstance(): OAuthConfigManager {
    if (!OAuthConfigManager.instance) {
      OAuthConfigManager.instance = new OAuthConfigManager();
    }
    return OAuthConfigManager.instance;
  }

  private loadConfig(): OAuthStrategyConfig {
    return {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackUrl: process.env.GOOGLE_CALLBACK_URL || '/api/auth/oauth/google/callback',
        scope: ['profile', 'email']
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        callbackUrl: process.env.GITHUB_CALLBACK_URL || '/api/auth/oauth/github/callback',
        scope: ['user:email', 'read:user']
      },
      microsoft: {
        clientId: process.env.MICROSOFT_CLIENT_ID || '',
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
        callbackUrl: process.env.MICROSOFT_CALLBACK_URL || '/api/auth/oauth/microsoft/callback',
        scope: ['user.read']
      }
    };
  }

  private validateConfig(): void {
    const requiredEnvVars = [
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'GITHUB_CLIENT_ID', 
      'GITHUB_CLIENT_SECRET',
      'MICROSOFT_CLIENT_ID',
      'MICROSOFT_CLIENT_SECRET'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.warn(`⚠️  Missing OAuth environment variables: ${missingVars.join(', ')}`);
      console.warn('Some OAuth providers may not be available.');
    }
  }

  public getConfig(): OAuthStrategyConfig {
    return this.config;
  }

  public getProviderConfig(provider: OAuthProvider) {
    switch (provider) {
      case OAuthProvider.GOOGLE:
        return this.config.google;
      case OAuthProvider.GITHUB:
        return this.config.github;
      case OAuthProvider.MICROSOFT:
        return this.config.microsoft;
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }

  public isProviderEnabled(provider: OAuthProvider): boolean {
    const config = this.getProviderConfig(provider);
    return !!(config?.clientId && config?.clientSecret);
  }

  public getEnabledProviders(): OAuthProvider[] {
    return Object.values(OAuthProvider).filter(provider => 
      this.isProviderEnabled(provider)
    );
  }
}

export const oauthConfig = OAuthConfigManager.getInstance();
