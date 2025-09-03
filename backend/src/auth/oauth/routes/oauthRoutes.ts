/**
 * OAuth Routes
 * Professional     // Protected routes - authentication required
    
    // Link OAuth account to authenticated user
    this.router.post('/link', authenticate, this.controller.linkAccount);

    // Unlink OAuth account from authenticated user
    this.router.delete('/unlink/:provider', authenticate, this.controller.unlinkAccount);

    // Get user's linked OAuth accounts
    this.router.get('/accounts', authenticate, this.controller.getLinkedAccounts);r OAuth authentication endpoints
 */

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { OAuthController } from '../controllers/oauthController';
import { authenticate } from '../../middleware/authMiddleware';

export class OAuthRoutes {
  private router: Router;
  private controller: OAuthController;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.controller = new OAuthController(prisma);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Public routes - no authentication required
    
    // Get available OAuth providers
    this.router.get('/providers', this.controller.getAvailableProviders);

    // Google OAuth
    this.router.get('/google', this.controller.initiateGoogleAuth);
    this.router.get('/google/callback', this.controller.handleGoogleCallback);

    // GitHub OAuth
    this.router.get('/github', this.controller.initiateGitHubAuth);
    this.router.get('/github/callback', this.controller.handleGitHubCallback);

    // Microsoft OAuth
    this.router.get('/microsoft', this.controller.initiateMicrosoftAuth);
    this.router.get('/microsoft/callback', this.controller.handleMicrosoftCallback);

    // Protected routes - authentication required
    
    // Link OAuth account to authenticated user
    this.router.post('/link', authenticate, this.controller.linkAccount);

    // Unlink OAuth account from authenticated user
    this.router.delete('/unlink/:provider', authenticate, this.controller.unlinkAccount);

    // Get user's linked OAuth accounts
    this.router.get('/accounts', authenticate, this.controller.getLinkedAccounts);
  }

  public getRouter(): Router {
    return this.router;
  }
}
