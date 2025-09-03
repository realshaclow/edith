/**
 * OAuth Profile Mappers
 * Utilities for mapping OAuth provider profiles to standardized format
 */

import { OAuthProfile, OAuthProvider } from '../types';

export class OAuthProfileMapper {
  
  /**
   * Map Google OAuth profile to standardized format
   */
  static mapGoogleProfile(profile: any, accessToken: string, refreshToken?: string): OAuthProfile {
    return {
      id: profile.id,
      provider: OAuthProvider.GOOGLE,
      email: profile.emails?.[0]?.value || '',
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      username: profile.username || profile.displayName,
      displayName: profile.displayName,
      avatar: profile.photos?.[0]?.value,
      profileUrl: profile.profileUrl,
      accessToken,
      refreshToken,
      raw: profile._json
    };
  }

  /**
   * Map GitHub OAuth profile to standardized format
   */
  static mapGitHubProfile(profile: any, accessToken: string, refreshToken?: string): OAuthProfile {
    const displayName = profile.displayName || profile.username;
    const nameParts = displayName?.split(' ') || [];
    
    return {
      id: profile.id,
      provider: OAuthProvider.GITHUB,
      email: profile.emails?.[0]?.value || profile._json?.email,
      firstName: profile.name?.givenName || nameParts[0],
      lastName: profile.name?.familyName || nameParts.slice(1).join(' '),
      username: profile.username,
      displayName: profile.displayName,
      avatar: profile.photos?.[0]?.value || profile._json?.avatar_url,
      profileUrl: profile.profileUrl || profile._json?.html_url,
      accessToken,
      refreshToken,
      raw: profile._json
    };
  }

  /**
   * Map Microsoft OAuth profile to standardized format
   */
  static mapMicrosoftProfile(profile: any, accessToken: string, refreshToken?: string): OAuthProfile {
    return {
      id: profile.id,
      provider: OAuthProvider.MICROSOFT,
      email: profile.emails?.[0]?.value || profile._json?.mail || profile._json?.userPrincipalName,
      firstName: profile.name?.givenName || profile._json?.givenName,
      lastName: profile.name?.familyName || profile._json?.surname,
      username: profile.displayName || profile._json?.displayName,
      displayName: profile.displayName || profile._json?.displayName,
      avatar: undefined, // Microsoft doesn't provide avatar in basic scope
      profileUrl: undefined,
      accessToken,
      refreshToken,
      raw: profile._json
    };
  }

  /**
   * Map any OAuth provider profile based on provider type
   */
  static mapProfile(
    provider: OAuthProvider, 
    profile: any, 
    accessToken: string, 
    refreshToken?: string
  ): OAuthProfile {
    switch (provider) {
      case OAuthProvider.GOOGLE:
        return this.mapGoogleProfile(profile, accessToken, refreshToken);
      case OAuthProvider.GITHUB:
        return this.mapGitHubProfile(profile, accessToken, refreshToken);
      case OAuthProvider.MICROSOFT:
        return this.mapMicrosoftProfile(profile, accessToken, refreshToken);
      default:
        throw new Error(`Unsupported OAuth provider: ${provider}`);
    }
  }

  /**
   * Validate OAuth profile data
   */
  static validateProfile(profile: OAuthProfile): boolean {
    return !!(
      profile.id &&
      profile.provider &&
      profile.email &&
      profile.email.includes('@')
    );
  }

  /**
   * Sanitize profile data for storage
   */
  static sanitizeProfile(profile: OAuthProfile): Partial<OAuthProfile> {
    return {
      id: profile.id,
      provider: profile.provider,
      email: profile.email.toLowerCase().trim(),
      firstName: profile.firstName?.trim(),
      lastName: profile.lastName?.trim(),
      username: profile.username?.trim(),
      displayName: profile.displayName?.trim(),
      avatar: profile.avatar,
      profileUrl: profile.profileUrl,
      raw: profile.raw
    };
  }
}
