import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload, TokenPair, UserRole } from '../types';
import { jwtConfig } from './config';

/**
 * Generate JWT token pair (access + refresh)
 */
export const generateTokenPair = async (
  userId: string,
  email: string,
  role: UserRole,
  sessionId?: string
): Promise<TokenPair> => {
  const sessionIdentifier = sessionId || uuidv4();

  const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
    userId,
    email,
    role,
    sessionId: sessionIdentifier
  };

  try {
    // Generate access token
    const accessToken = jwt.sign(
      payload,
      jwtConfig.access.secret,
      jwtConfig.access.options as SignOptions
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { ...payload, type: 'refresh' },
      jwtConfig.refresh.secret,
      jwtConfig.refresh.options as SignOptions
    );

    // Calculate expiry time for access token
    const decoded = jwt.decode(accessToken) as JwtPayload;
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer'
    };
  } catch (error) {
    throw new Error('Failed to generate token pair');
  }
};

/**
 * Verify and decode JWT token
 */
export const verifyToken = async (
  token: string,
  type: 'access' | 'refresh' = 'access'
): Promise<JwtPayload> => {
  try {
    const secret = type === 'access' 
      ? jwtConfig.access.secret 
      : jwtConfig.refresh.secret;

    const decoded = jwt.verify(token, secret) as JwtPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Decode token without verification (for expired token info)
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader?: string): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

/**
 * Generate a secure session ID
 */
export const generateSessionId = (): string => {
  return uuidv4();
};

/**
 * Get token expiry date
 */
export const getTokenExpiry = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

/**
 * Get time until token expires (in seconds)
 */
export const getTimeToExpiry = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, decoded.exp - now);
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string): Promise<TokenPair> => {
  try {
    // Verify refresh token
    const decoded = await verifyToken(refreshToken, 'refresh');
    
    // Generate new token pair
    return await generateTokenPair(
      decoded.userId,
      decoded.email,
      decoded.role,
      decoded.sessionId
    );
  } catch (error) {
    throw new Error('Failed to refresh token');
  }
};

/**
 * Blacklist token (for logout)
 * Note: In production, you'd want to store these in Redis or database
 */
const tokenBlacklist = new Set<string>();

export const blacklistToken = (token: string): void => {
  tokenBlacklist.add(token);
};

export const isTokenBlacklisted = (token: string): boolean => {
  return tokenBlacklist.has(token);
};

/**
 * Clean expired tokens from blacklist
 * Call this periodically to prevent memory leaks
 */
export const cleanExpiredTokensFromBlacklist = (): void => {
  for (const token of tokenBlacklist) {
    if (isTokenExpired(token)) {
      tokenBlacklist.delete(token);
    }
  }
};
