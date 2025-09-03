/**
 * OAuth System Index
 * Main export point for the professional OAuth authentication system
 */

// Main OAuth Manager
export { OAuthManager } from './oauthManager';

// Types and Interfaces
export * from './types';

// Services
export * from './services';

// Strategies
export * from './strategies';

// Controllers
export { OAuthController } from './controllers/oauthController';

// Routes
export { OAuthRoutes } from './routes/oauthRoutes';

// Utilities
export { oauthConfig, OAuthConfigManager } from './utils/config';
export { OAuthProfileMapper } from './utils/profileMapper';

/**
 * Quick Start Guide:
 * 
 * 1. Set up environment variables:
 *    - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL
 *    - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL
 *    - MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET, MICROSOFT_CALLBACK_URL
 * 
 * 2. Initialize OAuth system:
 *    ```typescript
 *    import { OAuthManager } from './auth/oauth';
 *    import { PrismaClient } from '@prisma/client';
 *    
 *    const prisma = new PrismaClient();
 *    const oauthManager = OAuthManager.getInstance(prisma);
 *    oauthManager.initialize();
 *    
 *    // Add OAuth routes to your Express app
 *    app.use('/api/auth/oauth', oauthManager.getRouter());
 *    ```
 * 
 * 3. Available endpoints:
 *    - GET /api/auth/oauth/providers - Get available providers
 *    - GET /api/auth/oauth/google - Initiate Google OAuth
 *    - GET /api/auth/oauth/google/callback - Google OAuth callback
 *    - GET /api/auth/oauth/github - Initiate GitHub OAuth
 *    - GET /api/auth/oauth/github/callback - GitHub OAuth callback
 *    - GET /api/auth/oauth/microsoft - Initiate Microsoft OAuth
 *    - GET /api/auth/oauth/microsoft/callback - Microsoft OAuth callback
 *    - POST /api/auth/oauth/link - Link OAuth account (authenticated)
 *    - DELETE /api/auth/oauth/unlink/:provider - Unlink OAuth account (authenticated)
 *    - GET /api/auth/oauth/accounts - Get linked accounts (authenticated)
 */
