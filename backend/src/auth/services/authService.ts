import { PrismaClient } from '@prisma/client';
import { 
  LoginRequest, 
  RegisterRequest, 
  AuthResponse, 
  UserProfile, 
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthSession,
  UserRole,
  AuthError
} from '../types';
import { hashPassword, verifyPassword, validatePasswordStrength } from '../utils/password';
import { generateTokenPair, generateSessionId } from '../utils/jwt';
import { securityConfig } from '../utils/config';
import { v4 as uuidv4 } from 'uuid';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Validate password strength
      const passwordValidation = validatePasswordStrength(data.password);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: passwordValidation.errors.join(', ')
        };
      }

      // Check if user already exists
      const existingUser = await this.prisma.user.findFirst({
        where: {
          OR: [
            { email: data.email.toLowerCase() },
            { username: data.username }
          ]
        }
      });

      if (existingUser) {
        return {
          success: false,
          error: 'Użytkownik o podanym emailu lub nazwie użytkownika już istnieje'
        };
      }

      // Hash password
      const passwordHash = await hashPassword(data.password);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: data.email.toLowerCase(),
          username: data.username,
          passwordHash,
          firstName: data.firstName,
          lastName: data.lastName,
          title: data.title,
          affiliation: data.affiliation,
          department: data.department,
          position: data.position,
          phone: data.phone,
          role: UserRole.USER, // Default role
          emailVerificationToken: uuidv4()
        }
      });

      // Generate session and tokens
      const sessionId = generateSessionId();
      const tokens = await generateTokenPair(
        user.id,
        user.email,
        user.role,
        sessionId
      );

      // Create session record
      await this.createSession(user.id, sessionId, tokens.refreshToken);

      // Convert to UserProfile
      const userProfile = this.mapUserToProfile(user);

      return {
        success: true,
        data: {
          user: userProfile,
          tokens
        },
        message: 'Rejestracja zakończona pomyślnie'
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Błąd podczas rejestracji'
      };
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    try {
      // Find user
      const user = await this.prisma.user.findUnique({
        where: { email: data.email.toLowerCase() }
      });

      if (!user) {
        return {
          success: false,
          error: 'Nieprawidłowy email lub hasło'
        };
      }

      // Check if account is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Konto zostało dezaktywowane'
        };
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        const unlockTime = user.lockedUntil.toLocaleString('pl-PL');
        return {
          success: false,
          error: `Konto zostało zablokowane do ${unlockTime}`
        };
      }

      // Verify password
      const isPasswordValid = await verifyPassword(data.password, user.passwordHash);
      
      if (!isPasswordValid) {
        // Increment login attempts
        await this.handleFailedLogin(user.id);
        return {
          success: false,
          error: 'Nieprawidłowy email lub hasło'
        };
      }

      // Reset login attempts on successful login
      await this.resetLoginAttempts(user.id);

      // Generate session and tokens
      const sessionId = generateSessionId();
      const tokens = await generateTokenPair(
        user.id,
        user.email,
        user.role,
        sessionId
      );

      // Create session record
      await this.createSession(user.id, sessionId, tokens.refreshToken, ipAddress, userAgent);

      // Update last login
      await this.prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Convert to UserProfile
      const userProfile = this.mapUserToProfile(user);

      return {
        success: true,
        data: {
          user: userProfile,
          tokens
        },
        message: 'Logowanie zakończone pomyślnie'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Błąd podczas logowania'
      };
    }
  }

  /**
   * Logout user
   */
  async logout(sessionId: string): Promise<{ success: boolean; message?: string }> {
    try {
      await this.prisma.userSession.update({
        where: { id: sessionId },
        data: { 
          isActive: false,
          revokedAt: new Date()
        }
      });

      return {
        success: true,
        message: 'Wylogowanie zakończone pomyślnie'
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        message: 'Błąd podczas wylogowania'
      };
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      return user ? this.mapUserToProfile(user) : null;
    } catch (error) {
      console.error('Get profile error:', error);
      return null;
    }
  }

  /**
   * Change password
   */
  async changePassword(userId: string, data: ChangePasswordRequest): Promise<{ success: boolean; error?: string }> {
    try {
      // Get user
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return { success: false, error: 'Użytkownik nie znaleziony' };
      }

      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(data.currentPassword, user.passwordHash);
      if (!isCurrentPasswordValid) {
        return { success: false, error: 'Nieprawidłowe obecne hasło' };
      }

      // Validate new password
      const passwordValidation = validatePasswordStrength(data.newPassword);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors.join(', ') };
      }

      // Hash new password
      const newPasswordHash = await hashPassword(data.newPassword);

      // Update password
      await this.prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash }
      });

      // Revoke all active sessions except current one
      await this.revokeAllUserSessions(userId, true);

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: 'Błąd podczas zmiany hasła' };
    }
  }

  /**
   * Handle failed login attempt
   */
  private async handleFailedLogin(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { loginAttempts: true }
    });

    if (!user) return;

    const newAttempts = user.loginAttempts + 1;
    const maxAttempts = securityConfig.password.maxLoginAttempts;

    const updateData: any = {
      loginAttempts: newAttempts
    };

    // Lock account if max attempts reached
    if (newAttempts >= maxAttempts) {
      const lockoutDuration = securityConfig.password.lockoutDuration * 60 * 1000; // Convert to ms
      updateData.lockedUntil = new Date(Date.now() + lockoutDuration);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: updateData
    });
  }

  /**
   * Reset login attempts
   */
  private async resetLoginAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: 0,
        lockedUntil: null
      }
    });
  }

  /**
   * Create session record
   */
  private async createSession(
    userId: string, 
    sessionId: string, 
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.prisma.userSession.create({
      data: {
        id: sessionId,
        userId,
        token: sessionId,
        refreshToken,
        ipAddress,
        userAgent,
        expiresAt
      }
    });
  }

  /**
   * Revoke all user sessions
   */
  private async revokeAllUserSessions(userId: string, keepCurrent: boolean = false): Promise<void> {
    await this.prisma.userSession.updateMany({
      where: { 
        userId,
        isActive: true
      },
      data: {
        isActive: false,
        revokedAt: new Date()
      }
    });
  }

  /**
   * Map User model to UserProfile
   */
  private mapUserToProfile(user: any): UserProfile {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      title: user.title,
      affiliation: user.affiliation,
      department: user.department,
      position: user.position,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      isActive: user.isActive,
      isVerified: user.isVerified,
      language: user.language,
      timezone: user.timezone,
      preferences: user.preferences,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
