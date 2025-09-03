/**
 * OAuth Database Service
 * Professional service for managing OAuth accounts in database
 */

import { PrismaClient } from '@prisma/client';
import { OAuthProfile, OAuthProvider } from '../types';
import { UserRole } from '../../types';

export class OAuthDatabaseService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Find user by OAuth account
   */
  async findUserByOAuthAccount(provider: OAuthProvider, providerId: string) {
    try {
      const oauthAccount = await (this.prisma as any).oAuthAccount.findUnique({
        where: {
          providerId_provider: {
            providerId,
            provider
          }
        },
        include: {
          user: true
        }
      });

      return oauthAccount?.user || null;
    } catch (error) {
      console.error('Error finding user by OAuth account:', error);
      return null;
    }
  }

  /**
   * Find user by email
   */
  async findUserByEmail(email: string) {
    try {
      return await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Create new user from OAuth profile
   */
  async createUserFromOAuth(profile: OAuthProfile) {
    try {
      const user = await this.prisma.user.create({
        data: {
          email: profile.email.toLowerCase(),
          username: profile.username || profile.email.split('@')[0],
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatar: profile.avatar,
          role: UserRole.USER, // Default role for OAuth users
          isActive: true,
          isVerified: true, // OAuth users are pre-verified
          passwordHash: '', // OAuth users don't need password
          lastLoginAt: new Date()
        }
      });

      // Create OAuth account separately
      await (this.prisma as any).oAuthAccount.create({
        data: {
          userId: user.id,
          provider: profile.provider,
          providerId: profile.id,
          email: profile.email.toLowerCase(),
          profileData: profile.raw
        }
      });

      console.log(`✅ Created new user from ${profile.provider} OAuth: ${user.email}`);
      return user;
    } catch (error) {
      console.error('Error creating user from OAuth:', error);
      throw new Error('Failed to create user from OAuth profile');
    }
  }

  /**
   * Link OAuth account to existing user
   */
  async linkOAuthToUser(userId: string, profile: OAuthProfile) {
    try {
      // Check if OAuth account already exists
      const existingAccount = await (this.prisma as any).oAuthAccount.findUnique({
        where: {
          providerId_provider: {
            providerId: profile.id,
            provider: profile.provider
          }
        }
      });

      if (existingAccount) {
        throw new Error('OAuth account is already linked to another user');
      }

      // Create OAuth account
      const oauthAccount = await (this.prisma as any).oAuthAccount.create({
        data: {
          userId,
          provider: profile.provider,
          providerId: profile.id,
          email: profile.email.toLowerCase(),
          profileData: profile.raw
        }
      });

      // Update user last login
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          lastLoginAt: new Date(),
          avatar: profile.avatar || undefined
        }
      });

      console.log(`✅ Linked ${profile.provider} OAuth account to user: ${userId}`);
      return oauthAccount;
    } catch (error) {
      console.error('Error linking OAuth to user:', error);
      throw error;
    }
  }

  /**
   * Update OAuth account information
   */
  async updateOAuthAccount(userId: string, profile: OAuthProfile) {
    try {
      const oauthAccount = await (this.prisma as any).oAuthAccount.update({
        where: {
          userId_provider: {
            userId,
            provider: profile.provider
          }
        },
        data: {
          email: profile.email.toLowerCase(),
          profileData: profile.raw,
          lastUsed: new Date()
        }
      });

      // Update user information
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          lastLoginAt: new Date(),
          avatar: profile.avatar || undefined
        }
      });

      console.log(`✅ Updated ${profile.provider} OAuth account for user: ${userId}`);
      return oauthAccount;
    } catch (error) {
      console.error('Error updating OAuth account:', error);
      throw new Error('Failed to update OAuth account');
    }
  }

  /**
   * Unlink OAuth account from user
   */
  async unlinkOAuthFromUser(userId: string, provider: OAuthProvider) {
    try {
      // Check if user has password or other OAuth accounts
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get user's OAuth accounts
      const oauthAccounts = await (this.prisma as any).oAuthAccount.findMany({
        where: { userId }
      });

      const hasPassword = user.passwordHash && user.passwordHash.length > 0;
      const otherOAuthAccounts = oauthAccounts.filter((acc: any) => acc.provider !== provider);

      if (!hasPassword && otherOAuthAccounts.length === 0) {
        throw new Error('Cannot unlink the only authentication method');
      }

      // Remove OAuth account
      await (this.prisma as any).oAuthAccount.delete({
        where: {
          userId_provider: {
            userId,
            provider
          }
        }
      });

      console.log(`✅ Unlinked ${provider} OAuth account from user: ${userId}`);
      return { success: true };
    } catch (error) {
      console.error('Error unlinking OAuth account:', error);
      throw error;
    }
  }

  /**
   * Get user's OAuth accounts
   */
  async getUserOAuthAccounts(userId: string) {
    try {
      const accounts = await (this.prisma as any).oAuthAccount.findMany({
        where: { userId },
        select: {
          provider: true,
          email: true,
          createdAt: true,
          lastUsed: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return accounts;
    } catch (error) {
      console.error('Error getting user OAuth accounts:', error);
      return [];
    }
  }

  /**
   * Check if email is already used by OAuth account
   */
  async isEmailUsedByOAuth(email: string, excludeProvider?: OAuthProvider) {
    try {
      const where: any = {
        email: email.toLowerCase()
      };

      if (excludeProvider) {
        where.provider = {
          not: excludeProvider
        };
      }

      const account = await (this.prisma as any).oAuthAccount.findFirst({
        where
      });

      return !!account;
    } catch (error) {
      console.error('Error checking email usage:', error);
      return false;
    }
  }
}
