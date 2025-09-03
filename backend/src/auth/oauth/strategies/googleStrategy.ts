/**
 * Google OAuth Strategy
 * Professional Google OAuth 2.0 authentication strategy
 */

import passport from 'passport';
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { OAuthProfile, OAuthProvider } from '../types';
import { OAuthProfileMapper } from '../utils/profileMapper';
import { OAuthAuthenticationService } from '../services/oauthAuthenticationService';
import { oauthConfig } from '../utils/config';
import { UserProfile } from '../../types';

export class GoogleOAuthStrategy {
  private strategy?: GoogleStrategy;
  private prisma: PrismaClient;
  private authService: OAuthAuthenticationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.authService = new OAuthAuthenticationService(prisma);
    this.initializeStrategy();
  }

  private initializeStrategy(): void {
    const config = oauthConfig.getProviderConfig(OAuthProvider.GOOGLE);
    
    if (!config?.clientId || !config?.clientSecret) {
      console.warn('⚠️  Google OAuth configuration missing. Google authentication disabled.');
      return;
    }

    this.strategy = new GoogleStrategy(
      {
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackUrl,
        scope: config.scope || ['profile', 'email']
      },
      this.verifyCallback.bind(this)
    );

    passport.use('google', this.strategy);
    console.log('✅ Google OAuth strategy initialized');
  }

  private async verifyCallback(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback
  ): Promise<void> {
    try {
      // Map profile to standardized format
      const oauthProfile = OAuthProfileMapper.mapGoogleProfile(
        profile, 
        accessToken, 
        refreshToken
      );

      // Authenticate user with OAuth profile
      const authenticatedUser = await this.authService.authenticateWithOAuth(oauthProfile);

      // Get full user profile from database
      const userProfile = await (this.prisma as any).user.findUnique({
        where: { id: authenticatedUser.id },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          title: true,
          affiliation: true,
          department: true,
          position: true,
          phone: true,
          avatar: true,
          role: true,
          isActive: true,
          isVerified: true,
          language: true,
          timezone: true,
          lastLogin: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!userProfile) {
        return done(new Error('User not found after OAuth authentication'), false);
      }

      return done(null, userProfile as UserProfile);
    } catch (error) {
      console.error('Google OAuth verification error:', error);
      return done(error, false);
    }
  }

  public static initialize(prisma: PrismaClient): GoogleOAuthStrategy {
    return new GoogleOAuthStrategy(prisma);
  }

  public getStrategy(): GoogleStrategy | undefined {
    return this.strategy;
  }
}
