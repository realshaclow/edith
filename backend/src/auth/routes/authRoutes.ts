import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../controllers/authController';
import { authenticate, authRateLimit } from '../middleware/authMiddleware';
import { 
  validateRegistration,
  validateLogin,
  validateChangePassword,
  validateForgotPassword,
  validateResetPassword,
  validateUpdateProfile,
  validateRefreshToken
} from '../validators/authValidators';
import { securityConfig } from '../utils/config';
import { OAuthManager } from '../oauth';

export const createAuthRoutes = (prisma: PrismaClient): Router => {
  const router = Router();
  const authController = new AuthController(prisma);

  // Initialize OAuth system
  const oauthManager = OAuthManager.getInstance(prisma);
  oauthManager.initialize();

  // Rate limiting middleware for auth endpoints
  const loginRateLimit = authRateLimit(
    securityConfig.rateLimiting.loginAttempts.windowMs,
    securityConfig.rateLimiting.loginAttempts.maxAttempts
  );

  const registrationRateLimit = authRateLimit(
    securityConfig.rateLimiting.registration.windowMs,
    securityConfig.rateLimiting.registration.maxAttempts
  );

  const passwordResetRateLimit = authRateLimit(
    securityConfig.rateLimiting.passwordReset.windowMs,
    securityConfig.rateLimiting.passwordReset.maxAttempts
  );

  // Public routes
  router.post('/register', registrationRateLimit, validateRegistration, authController.register);
  router.post('/login', loginRateLimit, validateLogin, authController.login);
  router.post('/forgot-password', passwordResetRateLimit, validateForgotPassword, authController.forgotPassword);
  router.post('/reset-password', passwordResetRateLimit, validateResetPassword, authController.resetPassword);
  router.post('/refresh-token', validateRefreshToken, authController.refreshToken);

  // OAuth routes (public)
  router.use('/oauth', oauthManager.getRouter());

  // Protected routes (require authentication)
  router.use(authenticate(prisma));
  
  router.post('/logout', authController.logout);
  router.get('/profile', authController.profile);
  router.put('/profile', validateUpdateProfile, authController.updateProfile);
  router.post('/change-password', validateChangePassword, authController.changePassword);
  router.get('/sessions', authController.getSessions);
  router.delete('/sessions/:sessionId', authController.revokeSession);

  return router;
};

export default createAuthRoutes;
