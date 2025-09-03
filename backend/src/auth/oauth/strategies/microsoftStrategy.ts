/**
 * Microsoft OAuth Strategy
 * Professional Microsoft OAuth 2.0 authentication strategy
 */

import passport from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import { PrismaClient } from '@prisma/client';
import { OAuthProfile, OAuthProvider } from '../types';
import { OAuthProfileMapper } from '../utils/profileMapper';
import { OAuthAuthenticationService } from '../services/oauthAuthenticationService';
import { oauthConfig } from '../utils/config';
import { UserProfile } from '../../types';

export class MicrosoftOAuthStrategy {
  private strategy?: MicrosoftStrategy;
  private prisma: PrismaClient;
  private authService: OAuthAuthenticationService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.authService = new OAuthAuthenticationService(prisma);
    this.initializeStrategy();
  }

  private initializeStrategy(): void {
    const config = oauthConfig.getProviderConfig(OAuthProvider.MICROSOFT);
    
    if (!config?.clientId || !config?.clientSecret) {
      console.warn('⚠️  Microsoft OAuth configuration missing. Microsoft authentication disabled.');
      return;
    }

    this.strategy = new MicrosoftStrategy(
      {
        clientID: config.clientId,
        clientSecret: config.clientSecret,
        callbackURL: config.callbackUrl,
        scope: config.scope || ['user.read']
      },
      this.verifyCallback.bind(this)
    );

    passport.use('microsoft', this.strategy);
    console.log('✅ Microsoft OAuth strategy initialized');
  }

  private async verifyCallback(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any
  ): Promise<void> {
    try {
      // Map profile to standardized format
      const oauthProfile = OAuthProfileMapper.mapMicrosoftProfile(
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
      console.error('Microsoft OAuth verification error:', error);
      return done(error, false);
    }
  }

  public static initialize(prisma: PrismaClient): MicrosoftOAuthStrategy {
    return new MicrosoftOAuthStrategy(prisma);
  }

  public getStrategy(): MicrosoftStrategy | undefined {
    return this.strategy;
  }
}
