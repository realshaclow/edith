import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { PrismaClient } from '@prisma/client';
import { UserRole } from '../types';
import { generateTokenPair, generateSessionId } from '../utils/jwt';

export interface OAuthProfile {
  id: string;
  provider: 'google' | 'github' | 'microsoft';
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  avatar?: string;
  profileUrl?: string;
  raw: any;
}

export class OAuthService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.setupStrategies();
  }

  private setupStrategies() {
    // Google OAuth Strategy
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/oauth/google/callback'
      }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const oauthProfile: OAuthProfile = {
            id: profile.id,
            provider: 'google',
            email: profile.emails?.[0]?.value || '',
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            username: profile.username || profile.displayName,
            avatar: profile.photos?.[0]?.value,
            profileUrl: profile.profileUrl,
            raw: profile._json
          };

          const user = await this.handleOAuthUser(oauthProfile);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }));
    }

    // GitHub OAuth Strategy
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL || '/api/auth/oauth/github/callback'
      }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const oauthProfile: OAuthProfile = {
            id: profile.id,
            provider: 'github',
            email: profile.emails?.[0]?.value || '',
            firstName: profile.name?.givenName || profile.displayName?.split(' ')[0],
            lastName: profile.name?.familyName || profile.displayName?.split(' ').slice(1).join(' '),
            username: profile.username,
            avatar: profile.photos?.[0]?.value,
            profileUrl: profile.profileUrl,
            raw: profile._json
          };

          const user = await this.handleOAuthUser(oauthProfile);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }));
    }

    // Microsoft OAuth Strategy
    if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
      passport.use(new MicrosoftStrategy({
        clientID: process.env.MICROSOFT_CLIENT_ID,
        clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
        callbackURL: process.env.MICROSOFT_CALLBACK_URL || '/api/auth/oauth/microsoft/callback',
        scope: ['user.read']
      }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
        try {
          const oauthProfile: OAuthProfile = {
            id: profile.id,
            provider: 'microsoft',
            email: profile.emails?.[0]?.value || profile._json?.mail || profile._json?.userPrincipalName,
            firstName: profile.name?.givenName || profile._json?.givenName,
            lastName: profile.name?.familyName || profile._json?.surname,
            username: profile.displayName || profile._json?.displayName,
            avatar: undefined, // Microsoft doesn't provide avatar in basic scope
            profileUrl: undefined,
            raw: profile._json
          };

          const user = await this.handleOAuthUser(oauthProfile);
          return done(null, user);
        } catch (error) {
          return done(error, false);
        }
      }));
    }

    // Passport serialization
    passport.serializeUser((user: any, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done) => {
      try {
        const user = await this.prisma.user.findUnique({
          where: { id }
        });
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
  }

  /**
   * Handle OAuth user - create or update user account
   */
  private async handleOAuthUser(oauthProfile: OAuthProfile) {
    // Check if user exists by email
    let user = await this.prisma.user.findUnique({
      where: { email: oauthProfile.email },
      include: {
        oauthAccounts: true
      }
    });

    if (user) {
      // Update existing user with OAuth data if needed
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          avatar: oauthProfile.avatar || user.avatar,
          lastLoginAt: new Date()
        },
        include: {
          oauthAccounts: true
        }
      });

      // Create or update OAuth account
      await this.prisma.oAuthAccount.upsert({
        where: {
          userId_provider: {
            userId: user.id,
            provider: oauthProfile.provider.toUpperCase() as any
          }
        },
        create: {
          userId: user.id,
          provider: oauthProfile.provider.toUpperCase() as any,
          providerId: oauthProfile.id,
          email: oauthProfile.email,
          profileData: oauthProfile.raw
        },
        update: {
          email: oauthProfile.email,
          profileData: oauthProfile.raw,
          lastUsed: new Date()
        }
      });
    } else {
      // Create new user
      user = await this.prisma.user.create({
        data: {
          email: oauthProfile.email,
          username: oauthProfile.username,
          firstName: oauthProfile.firstName,
          lastName: oauthProfile.lastName,
          avatar: oauthProfile.avatar,
          role: UserRole.USER, // Default role for OAuth users
          isActive: true,
          isVerified: true, // OAuth users are pre-verified
          passwordHash: '', // OAuth users don't have password
          lastLoginAt: new Date(),
          oauthAccounts: {
            create: {
              provider: oauthProfile.provider.toUpperCase() as any,
              providerId: oauthProfile.id,
              email: oauthProfile.email,
              profileData: oauthProfile.raw
            }
          }
        },
        include: {
          oauthAccounts: true
        }
      });
    }

    return user;
  }

  /**
   * Generate tokens and session for OAuth user
   */
  async generateOAuthTokens(user: any, ipAddress?: string, userAgent?: string) {
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
   * Link OAuth account to existing user
   */
  async linkOAuthAccount(userId: string, oauthProfile: OAuthProfile) {
    try {
      await this.prisma.oAuthAccount.create({
        data: {
          userId,
          provider: oauthProfile.provider.toUpperCase() as any,
          providerId: oauthProfile.id,
          email: oauthProfile.email,
          profileData: oauthProfile.raw
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error linking OAuth account:', error);
      return { success: false, error: 'Failed to link account' };
    }
  }

  /**
   * Unlink OAuth account
   */
  async unlinkOAuthAccount(userId: string, provider: string) {
    try {
      await this.prisma.oAuthAccount.delete({
        where: {
          userId_provider: {
            userId,
            provider: provider.toUpperCase() as any
          }
        }
      });

      return { success: true };
    } catch (error) {
      console.error('Error unlinking OAuth account:', error);
      return { success: false, error: 'Failed to unlink account' };
    }
  }

  /**
   * Get user's OAuth accounts
   */
  async getUserOAuthAccounts(userId: string) {
    try {
      const accounts = await this.prisma.oAuthAccount.findMany({
        where: { userId },
        select: {
          provider: true,
          email: true,
          createdAt: true,
          lastUsed: true
        }
      });

      return { success: true, data: accounts };
    } catch (error) {
      console.error('Error getting OAuth accounts:', error);
      return { success: false, error: 'Failed to get accounts' };
    }
  }
}
