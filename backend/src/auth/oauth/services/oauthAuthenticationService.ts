/**
 * OAuth Authentication Service
 * Main service for handling OAuth authentication flows
 */

import { PrismaClient } from '@prisma/client';
import { OAuthProfile, OAuthProvider, OAuthAuthenticatedUser } from '../types';
import { OAuthDatabaseService } from './oauthDatabaseService';
import { OAuthProfileMapper } from '../utils/profileMapper';
import { generateTokenPair, generateSessionId } from '../../utils/jwt';

export class OAuthAuthenticationService {
  private databaseService: OAuthDatabaseService;
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.databaseService = new OAuthDatabaseService(prisma);
  }

  /**
   * Authenticate user with OAuth profile
   * This is the main method called after OAuth provider authentication
   */
  async authenticateWithOAuth(
    profile: OAuthProfile,
    ipAddress?: string,
    userAgent?: string
  ): Promise<OAuthAuthenticatedUser> {
    try {
      // Validate profile data
      if (!OAuthProfileMapper.validateProfile(profile)) {
        throw new Error('Invalid OAuth profile data');
      }

      // Sanitize profile data
      const sanitizedProfile = OAuthProfileMapper.sanitizeProfile(profile);

      // Check if user exists by OAuth account
      let user = await this.databaseService.findUserByOAuthAccount(
        profile.provider,
        profile.id
      );

      let isNewUser = false;

      if (user) {
        // Update existing OAuth account
        await this.databaseService.updateOAuthAccount(user.id, profile);
      } else {
        // Check if user exists by email
        user = await this.databaseService.findUserByEmail(profile.email);
        
        if (user) {
          // Link OAuth to existing user
          await this.databaseService.linkOAuthToUser(user.id, profile);
        } else {
          // Create new user
          user = await this.databaseService.createUserFromOAuth(profile);
          isNewUser = true;
        }
      }

      // Generate JWT tokens
      const tokens = await this.generateTokensForUser(
        user,
        ipAddress,
        userAgent
      );

      return {
        id: user.id,
        email: user.email,
        role: user.role,
        tokens,
        profile: sanitizedProfile as OAuthProfile,
        isNewUser
      };
    } catch (error: any) {
      console.error('OAuth authentication error:', error);
      throw new Error(`OAuth authentication failed: ${error.message}`);
    }
  }

  /**
   * Link OAuth account to authenticated user
   */
  async linkAccountToUser(
    userId: string,
    profile: OAuthProfile
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Validate profile
      if (!OAuthProfileMapper.validateProfile(profile)) {
        return { success: false, message: 'Invalid OAuth profile data' };
      }

      // Check if OAuth account is already linked to another user
      const existingUser = await this.databaseService.findUserByOAuthAccount(
        profile.provider,
        profile.id
      );

      if (existingUser && existingUser.id !== userId) {
        return { 
          success: false, 
          message: `${profile.provider} account is already linked to another user` 
        };
      }

      // Link account
      await this.databaseService.linkOAuthToUser(userId, profile);

      return { 
        success: true, 
        message: `${profile.provider} account linked successfully` 
      };
    } catch (error: any) {
      console.error('Error linking OAuth account:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to link OAuth account' 
      };
    }
  }

  /**
   * Unlink OAuth account from user
   */
  async unlinkAccountFromUser(
    userId: string,
    provider: OAuthProvider
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.databaseService.unlinkOAuthFromUser(userId, provider);
      return { 
        success: true, 
        message: `${provider} account unlinked successfully` 
      };
    } catch (error: any) {
      console.error('Error unlinking OAuth account:', error);
      return { 
        success: false, 
        message: error.message || 'Failed to unlink OAuth account' 
      };
    }
  }

  /**
   * Get user's linked OAuth accounts
   */
  async getUserLinkedAccounts(userId: string) {
    try {
      return await this.databaseService.getUserOAuthAccounts(userId);
    } catch (error) {
      console.error('Error getting user OAuth accounts:', error);
      return [];
    }
  }

  /**
   * Generate JWT tokens and create session for user
   */
  private async generateTokensForUser(
    user: any,
    ipAddress?: string,
    userAgent?: string
  ) {
    const sessionId = generateSessionId();
    const tokens = await generateTokenPair(
      user.id,
      user.email,
      user.role,
      sessionId
    );

    // Create session record
    await this.prisma.userSession.create({
      data: {
        id: sessionId,
        userId: user.id,
        token: sessionId,
        refreshToken: tokens.refreshToken,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      }
    });

    return tokens;
  }

  /**
   * Check if email is available for OAuth registration
   */
  async isEmailAvailable(email: string, provider?: OAuthProvider): Promise<boolean> {
    try {
      // Check regular user accounts
      const user = await this.databaseService.findUserByEmail(email);
      if (user) return false;

      // Check OAuth accounts
      const isUsedByOAuth = await this.databaseService.isEmailUsedByOAuth(
        email,
        provider
      );
      
      return !isUsedByOAuth;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  }
}
