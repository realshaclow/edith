import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../services/authService';
import { 
  LoginRequest, 
  RegisterRequest, 
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateProfileRequest
} from '../types';
import { refreshAccessToken, verifyToken, blacklistToken, extractTokenFromHeader } from '../utils/jwt';
import { validateAuthEnvironment } from '../utils/config';

export class AuthController {
  private authService: AuthService;

  constructor(private prisma: PrismaClient) {
    this.authService = new AuthService(prisma);
    
    // Validate environment on startup
    validateAuthEnvironment();
  }

  /**
   * Register new user
   */
  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: RegisterRequest = req.body;
      const result = await this.authService.register(data);
      
      const statusCode = result.success ? 201 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error('Registration controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  /**
   * Login user
   */
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: LoginRequest = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');
      
      const result = await this.authService.login(data, ipAddress, userAgent);
      
      const statusCode = result.success ? 200 : 401;
      
      // Set refresh token as httpOnly cookie if login successful
      if (result.success && result.data?.tokens.refreshToken) {
        res.cookie('refreshToken', result.data.tokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
      }
      
      res.status(statusCode).json(result);
    } catch (error) {
      console.error('Login controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  /**
   * Logout user
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const sessionId = req.session?.id;
      const token = extractTokenFromHeader(req.headers.authorization);
      
      if (sessionId) {
        await this.authService.logout(sessionId);
      }
      
      if (token) {
        blacklistToken(token);
      }
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken');
      
      res.json({
        success: true,
        message: 'Wylogowanie zakończone pomyślnie'
      });
    } catch (error) {
      console.error('Logout controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  /**
   * Get current user profile
   */
  profile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Użytkownik nie jest zalogowany'
        });
        return;
      }

      res.json({
        success: true,
        data: req.user
      });
    } catch (error) {
      console.error('Profile controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  /**
   * Update user profile
   */
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Użytkownik nie jest zalogowany'
        });
        return;
      }

      const data: UpdateProfileRequest = req.body;
      
      // Update user in database
      const updatedUser = await this.prisma.user.update({
        where: { id: req.user.id },
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          title: data.title,
          affiliation: data.affiliation,
          department: data.department,
          position: data.position,
          phone: data.phone,
          language: data.language,
          timezone: data.timezone,
          preferences: data.preferences
        }
      });

      // Get updated profile
      const profile = await this.authService.getProfile(updatedUser.id);
      
      res.json({
        success: true,
        data: profile,
        message: 'Profil został zaktualizowany'
      });
    } catch (error) {
      console.error('Update profile controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  /**
   * Change password
   */
  changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Użytkownik nie jest zalogowany'
        });
        return;
      }

      const data: ChangePasswordRequest = req.body;
      const result = await this.authService.changePassword(req.user.id, data);
      
      const statusCode = result.success ? 200 : 400;
      res.status(statusCode).json(result);
    } catch (error) {
      console.error('Change password controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  /**
   * Refresh access token
   */
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    try {
      let refreshToken = req.body.refreshToken || req.cookies.refreshToken;
      
      if (!refreshToken) {
        res.status(401).json({
          success: false,
          error: 'Refresh token jest wymagany'
        });
        return;
      }

      // Verify refresh token and generate new token pair
      const tokens = await refreshAccessToken(refreshToken);
      
      // Update refresh token cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({
        success: true,
        data: tokens
      });
    } catch (error) {
      console.error('Refresh token controller error:', error);
      res.status(401).json({
        success: false,
        error: 'Nieprawidłowy refresh token'
      });
    }
  };

  /**
   * Forgot password - send reset email
   */
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email }: ForgotPasswordRequest = req.body;
      
      // TODO: Implement email sending logic
      // For now, just generate a reset token and save it
      
      const user = await this.prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        // Don't reveal if user exists or not for security
        res.json({
          success: true,
          message: 'Jeśli podany adres email jest zarejestrowany, wkrótce otrzymasz link do resetowania hasła'
        });
        return;
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15);
      
      const resetExpiry = new Date();
      resetExpiry.setHours(resetExpiry.getHours() + 1); // 1 hour expiry
      
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: resetToken,
          passwordResetExpiresAt: resetExpiry
        }
      });

      // TODO: Send email with reset link
      console.log(`Password reset token for ${email}: ${resetToken}`);
      
      res.json({
        success: true,
        message: 'Jeśli podany adres email jest zarejestrowany, wkrótce otrzymasz link do resetowania hasła'
      });
    } catch (error) {
      console.error('Forgot password controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  /**
   * Reset password with token
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, newPassword }: ResetPasswordRequest = req.body;
      
      // Find user by reset token
      const user = await this.prisma.user.findFirst({
        where: {
          passwordResetToken: token,
          passwordResetExpiresAt: {
            gt: new Date()
          }
        }
      });

      if (!user) {
        res.status(400).json({
          success: false,
          error: 'Nieprawidłowy lub wygasły token resetowania hasła'
        });
        return;
      }

      // Hash new password
      const { hashPassword } = await import('../utils/password');
      const passwordHash = await hashPassword(newPassword);
      
      // Update password and clear reset token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          passwordResetToken: null,
          passwordResetExpiresAt: null,
          loginAttempts: 0,
          lockedUntil: null
        }
      });

      // Revoke all active sessions for security
      await this.prisma.userSession.updateMany({
        where: { 
          userId: user.id,
          isActive: true
        },
        data: {
          isActive: false,
          revokedAt: new Date()
        }
      });
      
      res.json({
        success: true,
        message: 'Hasło zostało pomyślnie zresetowane'
      });
    } catch (error) {
      console.error('Reset password controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  /**
   * Get user sessions
   */
  getSessions = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Użytkownik nie jest zalogowany'
        });
        return;
      }

      const sessions = await this.prisma.userSession.findMany({
        where: { 
          userId: req.user.id,
          isActive: true
        },
        select: {
          id: true,
          ipAddress: true,
          userAgent: true,
          device: true,
          location: true,
          createdAt: true,
          lastUsedAt: true
        },
        orderBy: { lastUsedAt: 'desc' }
      });

      res.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error('Get sessions controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  /**
   * Revoke session
   */
  revokeSession = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Użytkownik nie jest zalogowany'
        });
        return;
      }

      const { sessionId } = req.params;
      
      // Verify session belongs to user
      const session = await this.prisma.userSession.findFirst({
        where: {
          id: sessionId,
          userId: req.user.id
        }
      });

      if (!session) {
        res.status(404).json({
          success: false,
          error: 'Sesja nie znaleziona'
        });
        return;
      }

      // Revoke session
      await this.prisma.userSession.update({
        where: { id: sessionId },
        data: {
          isActive: false,
          revokedAt: new Date()
        }
      });

      res.json({
        success: true,
        message: 'Sesja została unieważniona'
      });
    } catch (error) {
      console.error('Revoke session controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };

  // Get users list for operator selection
  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.prisma.user.findMany({
        where: {
          isActive: true,
          isVerified: true
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          username: true,
          title: true,
          department: true,
          position: true
        },
        orderBy: [
          { firstName: 'asc' },
          { lastName: 'asc' }
        ]
      });

      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error('Get users controller error:', error);
      res.status(500).json({
        success: false,
        error: 'Wewnętrzny błąd serwera'
      });
    }
  };
}
