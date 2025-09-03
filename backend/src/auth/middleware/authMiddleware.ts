import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthError, UserProfile, AuthSession, PermissionType } from '../types';
import { verifyToken, extractTokenFromHeader, isTokenBlacklisted } from '../utils/jwt';
import { rolePermissions } from '../utils/config';

/**
 * Authentication middleware - verifies JWT token and adds user to request
 */
export const authenticate = (prisma: PrismaClient) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from Authorization header
      const token = extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Token autoryzacji jest wymagany'
        });
      }

      // Check if token is blacklisted
      if (isTokenBlacklisted(token)) {
        return res.status(401).json({
          success: false,
          error: 'Token został unieważniony'
        });
      }

      // Verify token
      const payload = await verifyToken(token);

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
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
          preferences: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Użytkownik nie znaleziony'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Konto zostało dezaktywowane'
        });
      }

      // Get session
      const session = await prisma.userSession.findUnique({
        where: { id: payload.sessionId }
      });

      if (!session || !session.isActive) {
        return res.status(401).json({
          success: false,
          error: 'Sesja wygasła lub została unieważniona'
        });
      }

      // Check if session is expired
      if (session.expiresAt < new Date()) {
        await prisma.userSession.update({
          where: { id: session.id },
          data: { isActive: false }
        });
        
        return res.status(401).json({
          success: false,
          error: 'Sesja wygasła'
        });
      }

      // Update session last used time
      await prisma.userSession.update({
        where: { id: session.id },
        data: { lastUsedAt: new Date() }
      });

      // Get user permissions based on role
      const permissions = rolePermissions[user.role] || [];

      // Add user and session to request
      req.user = user as UserProfile;
      req.session = {
        id: session.id,
        userId: session.userId,
        token: session.token,
        refreshToken: session.refreshToken || undefined,
        ipAddress: session.ipAddress || undefined,
        userAgent: session.userAgent || undefined,
        device: session.device || undefined,
        location: session.location || undefined,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        lastUsedAt: session.lastUsedAt,
        isActive: session.isActive
      };
      req.permissions = permissions as PermissionType[];

      next();
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({
        success: false,
        error: 'Nieprawidłowy token autoryzacji'
      });
    }
  };
};

/**
 * Authorization middleware - checks if user has required permissions
 */
export const authorize = (...requiredPermissions: PermissionType[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.permissions) {
      return res.status(401).json({
        success: false,
        error: 'Autoryzacja jest wymagana'
      });
    }

    // Check if user has required permissions
    const hasPermission = requiredPermissions.every(permission => 
      req.permissions!.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: 'Brak wymaganych uprawnień'
      });
    }

    next();
  };
};

/**
 * Role-based authorization middleware
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Autoryzacja jest wymagana'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Brak wymaganych uprawnień'
      });
    }

    next();
  };
};

/**
 * Optional authentication - doesn't fail if no token, but adds user if valid token provided
 */
export const optionalAuth = (prisma: PrismaClient) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = extractTokenFromHeader(req.headers.authorization);
      
      if (!token) {
        return next(); // No token, continue without user
      }

      // Try to authenticate but don't fail if invalid
      const payload = await verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      });

      if (user && user.isActive) {
        req.user = user as UserProfile;
        req.permissions = rolePermissions[user.role] as PermissionType[] || [];
      }

      next();
    } catch (error) {
      // Authentication failed, but continue without user
      next();
    }
  };
};

/**
 * Rate limiting for authentication endpoints
 */
export const authRateLimit = (windowMs: number, maxAttempts: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientId = req.ip || 'unknown';
    const now = Date.now();
    const clientAttempts = attempts.get(clientId);

    if (!clientAttempts || now > clientAttempts.resetTime) {
      // Reset or initialize attempts
      attempts.set(clientId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (clientAttempts.count >= maxAttempts) {
      return res.status(429).json({
        success: false,
        error: 'Zbyt wiele prób. Spróbuj ponownie później.',
        retryAfter: Math.ceil((clientAttempts.resetTime - now) / 1000)
      });
    }

    // Increment attempts
    clientAttempts.count++;
    next();
  };
};

/**
 * Admin only middleware
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Autoryzacja jest wymagana'
    });
  }

  if (!['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      error: 'Dostęp tylko dla administratorów'
    });
  }

  next();
};

/**
 * Self or admin middleware - allows access to own resources or admin access
 */
export const selfOrAdmin = (userIdParam: string = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Autoryzacja jest wymagana'
      });
    }

    const targetUserId = req.params[userIdParam];
    const isOwner = req.user.id === targetUserId;
    const isAdmin = ['SUPER_ADMIN', 'ADMIN'].includes(req.user.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Dostęp tylko do własnych zasobów lub dla administratorów'
      });
    }

    next();
  };
};
