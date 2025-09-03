/**
 * OAuth Controller
 * Professional controller for handling OAuth authentication endpoints
 */

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';
import { OAuthAuthenticationService } from '../services';
import { OAuthProfile, OAuthProvider } from '../types';
import { oauthConfig } from '../utils/config';

export class OAuthController {
  private oauthService: OAuthAuthenticationService;

  constructor(prisma: PrismaClient) {
    this.oauthService = new OAuthAuthenticationService(prisma);
  }

  /**
   * Get available OAuth providers
   */
  getAvailableProviders = async (req: Request, res: Response) => {
    try {
      const enabledProviders = oauthConfig.getEnabledProviders();
      
      res.json({
        success: true,
        data: {
          providers: enabledProviders,
          redirectUrls: enabledProviders.reduce((acc, provider) => {
            const config = oauthConfig.getProviderConfig(provider);
            acc[provider.toLowerCase()] = `/api/auth/oauth/${provider.toLowerCase()}`;
            return acc;
          }, {} as Record<string, string>)
        }
      });
    } catch (error) {
      console.error('Error getting OAuth providers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get OAuth providers'
      });
    }
  };

  /**
   * Initiate Google OAuth
   */
  initiateGoogleAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!oauthConfig.isProviderEnabled(OAuthProvider.GOOGLE)) {
      return res.status(404).json({
        success: false,
        message: 'Google OAuth is not configured'
      });
    }

    passport.authenticate('google', {
      scope: ['profile', 'email']
    })(req, res, next);
  };

  /**
   * Handle Google OAuth callback
   */
  handleGoogleCallback = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('google', { session: false }, async (err: any, profile: OAuthProfile) => {
      try {
        if (err || !profile) {
          return res.redirect('/auth/error?message=Google authentication failed');
        }

        const result = await this.oauthService.authenticateWithOAuth(
          profile,
          req.ip,
          req.get('User-Agent')
        );

        // Set secure HTTP-only cookie with refresh token
        res.cookie('refreshToken', result.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect to frontend with access token
        const redirectUrl = result.isNewUser 
          ? `/auth/welcome?token=${result.tokens.accessToken}`
          : `/dashboard?token=${result.tokens.accessToken}`;
        
        res.redirect(redirectUrl);
      } catch (error: any) {
        console.error('Google OAuth callback error:', error);
        res.redirect(`/auth/error?message=${encodeURIComponent(error.message)}`);
      }
    })(req, res, next);
  };

  /**
   * Initiate GitHub OAuth
   */
  initiateGitHubAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!oauthConfig.isProviderEnabled(OAuthProvider.GITHUB)) {
      return res.status(404).json({
        success: false,
        message: 'GitHub OAuth is not configured'
      });
    }

    passport.authenticate('github', {
      scope: ['user:email']
    })(req, res, next);
  };

  /**
   * Handle GitHub OAuth callback
   */
  handleGitHubCallback = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('github', { session: false }, async (err: any, profile: OAuthProfile) => {
      try {
        if (err || !profile) {
          return res.redirect('/auth/error?message=GitHub authentication failed');
        }

        const result = await this.oauthService.authenticateWithOAuth(
          profile,
          req.ip,
          req.get('User-Agent')
        );

        // Set secure HTTP-only cookie with refresh token
        res.cookie('refreshToken', result.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect to frontend with access token
        const redirectUrl = result.isNewUser 
          ? `/auth/welcome?token=${result.tokens.accessToken}`
          : `/dashboard?token=${result.tokens.accessToken}`;
        
        res.redirect(redirectUrl);
      } catch (error: any) {
        console.error('GitHub OAuth callback error:', error);
        res.redirect(`/auth/error?message=${encodeURIComponent(error.message)}`);
      }
    })(req, res, next);
  };

  /**
   * Initiate Microsoft OAuth
   */
  initiateMicrosoftAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!oauthConfig.isProviderEnabled(OAuthProvider.MICROSOFT)) {
      return res.status(404).json({
        success: false,
        message: 'Microsoft OAuth is not configured'
      });
    }

    passport.authenticate('microsoft', {
      scope: ['user.read']
    })(req, res, next);
  };

  /**
   * Handle Microsoft OAuth callback
   */
  handleMicrosoftCallback = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('microsoft', { session: false }, async (err: any, profile: OAuthProfile) => {
      try {
        if (err || !profile) {
          return res.redirect('/auth/error?message=Microsoft authentication failed');
        }

        const result = await this.oauthService.authenticateWithOAuth(
          profile,
          req.ip,
          req.get('User-Agent')
        );

        // Set secure HTTP-only cookie with refresh token
        res.cookie('refreshToken', result.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        // Redirect to frontend with access token
        const redirectUrl = result.isNewUser 
          ? `/auth/welcome?token=${result.tokens.accessToken}`
          : `/dashboard?token=${result.tokens.accessToken}`;
        
        res.redirect(redirectUrl);
      } catch (error: any) {
        console.error('Microsoft OAuth callback error:', error);
        res.redirect(`/auth/error?message=${encodeURIComponent(error.message)}`);
      }
    })(req, res, next);
  };

  /**
   * Link OAuth account to authenticated user
   */
  linkAccount = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { provider, code } = req.body;
      
      if (!provider || !code) {
        return res.status(400).json({
          success: false,
          message: 'Provider and authorization code are required'
        });
      }

      // This would need to be implemented based on how you handle OAuth linking
      // For now, return success placeholder
      res.json({
        success: true,
        message: 'OAuth account linking not yet implemented'
      });
    } catch (error: any) {
      console.error('Error linking OAuth account:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to link OAuth account'
      });
    }
  };

  /**
   * Unlink OAuth account from authenticated user
   */
  unlinkAccount = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const { provider } = req.params;
      
      if (!provider || !Object.values(OAuthProvider).includes(provider as OAuthProvider)) {
        return res.status(400).json({
          success: false,
          message: 'Valid provider is required'
        });
      }

      const result = await this.oauthService.unlinkAccountFromUser(
        userId,
        provider as OAuthProvider
      );

      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      console.error('Error unlinking OAuth account:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to unlink OAuth account'
      });
    }
  };

  /**
   * Get user's linked OAuth accounts
   */
  getLinkedAccounts = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const accounts = await this.oauthService.getUserLinkedAccounts(userId);

      res.json({
        success: true,
        data: accounts
      });
    } catch (error: any) {
      console.error('Error getting linked accounts:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get linked accounts'
      });
    }
  };
}
