/**
 * OAuth Manager
 * Main OAuth system coordinator - initializes strategies and provides routing
 */

import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

// Import strategies
import { GoogleOAuthStrategy, GitHubOAuthStrategy, MicrosoftOAuthStrategy } from './strategies';

// Import routes
import { OAuthRoutes } from './routes/oauthRoutes';

// Import configuration
import { oauthConfig } from './utils/config';

export class OAuthManager {
  private static instance: OAuthManager;
  private prisma: PrismaClient;
  private router: Router;
  private isInitialized = false;

  private constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.router = Router();
  }

  public static getInstance(prisma?: PrismaClient): OAuthManager {
    if (!OAuthManager.instance) {
      if (!prisma) {
        throw new Error('Prisma client is required for OAuth Manager initialization');
      }
      OAuthManager.instance = new OAuthManager(prisma);
    }
    return OAuthManager.instance;
  }

  /**
   * Initialize OAuth system
   * Sets up all strategies and configures passport
   */
  public initialize(): void {
    if (this.isInitialized) {
      console.log('⚠️  OAuth Manager already initialized');
      return;
    }

    try {
      console.log('🔐 Initializing OAuth Manager...');

      // Initialize OAuth strategies
      this.initializeStrategies();

      // Setup passport session serialization (disabled for JWT)
      this.setupPassportSerialization();

      // Setup routes
      this.setupRoutes();

      this.isInitialized = true;
      console.log('✅ OAuth Manager initialized successfully');
      
      // Log enabled providers
      const enabledProviders = oauthConfig.getEnabledProviders();
      if (enabledProviders.length > 0) {
        console.log(`🔗 Enabled OAuth providers: ${enabledProviders.join(', ')}`);
      } else {
        console.log('⚠️  No OAuth providers are enabled. Check environment variables.');
      }
    } catch (error) {
      console.error('❌ Failed to initialize OAuth Manager:', error);
      throw error;
    }
  }

  /**
   * Initialize all OAuth strategies
   */
  private initializeStrategies(): void {
    console.log('📝 Initializing OAuth strategies...');

    try {
      // Initialize Google strategy
      if (oauthConfig.isProviderEnabled('GOOGLE' as any)) {
        GoogleOAuthStrategy.initialize(this.prisma);
      }

      // Initialize GitHub strategy
      if (oauthConfig.isProviderEnabled('GITHUB' as any)) {
        GitHubOAuthStrategy.initialize(this.prisma);
      }

      // Initialize Microsoft strategy
      if (oauthConfig.isProviderEnabled('MICROSOFT' as any)) {
        MicrosoftOAuthStrategy.initialize(this.prisma);
      }

      console.log('✅ OAuth strategies initialized');
    } catch (error) {
      console.error('❌ Failed to initialize OAuth strategies:', error);
      throw error;
    }
  }

  /**
   * Setup passport serialization (disabled for JWT-based auth)
   */
  private setupPassportSerialization(): void {
    // Disable sessions for JWT-based authentication
    passport.serializeUser((user, done) => {
      done(null, false);
    });

    passport.deserializeUser((user, done) => {
      done(null, false);
    });
  }

  /**
   * Setup OAuth routes
   */
  private setupRoutes(): void {
    console.log('🛣️  Setting up OAuth routes...');

    const oauthRoutes = new OAuthRoutes(this.prisma);
    this.router.use('/', oauthRoutes.getRouter());

    console.log('✅ OAuth routes configured');
  }

  /**
   * Get configured router with all OAuth routes
   */
  public getRouter(): Router {
    if (!this.isInitialized) {
      throw new Error('OAuth Manager must be initialized before getting router');
    }
    return this.router;
  }

  /**
   * Get OAuth configuration info
   */
  public getConfigInfo() {
    return {
      isInitialized: this.isInitialized,
      enabledProviders: oauthConfig.getEnabledProviders(),
      availableStrategies: {
        google: oauthConfig.isProviderEnabled('GOOGLE' as any),
        github: oauthConfig.isProviderEnabled('GITHUB' as any),
        microsoft: oauthConfig.isProviderEnabled('MICROSOFT' as any)
      }
    };
  }

  /**
   * Health check for OAuth system
   */
  public healthCheck() {
    return {
      status: this.isInitialized ? 'healthy' : 'uninitialized',
      enabledProviders: oauthConfig.getEnabledProviders().length,
      timestamp: new Date().toISOString()
    };
  }
}
