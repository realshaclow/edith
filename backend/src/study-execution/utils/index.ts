import { Response } from 'express';

/**
 * Standardowy format odpowiedzi API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  totalPages: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Klasa do obsługi odpowiedzi API
 */
export class ResponseHelper {
  /**
   * Zwraca sukces z danymi
   */
  static success<T>(res: Response, data: T, message?: string, status: number = 200): void {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message
    };
    res.status(status).json(response);
  }

  /**
   * Zwraca sukces z danymi i paginacją
   */
  static successWithPagination<T>(
    res: Response,
    data: T[],
    pagination: PaginationMeta,
    message?: string,
    status: number = 200
  ): void {
    const response: ApiResponse<T[]> = {
      success: true,
      data,
      pagination,
      message
    };
    res.status(status).json(response);
  }

  /**
   * Zwraca błąd
   */
  static error(res: Response, error: string, status: number = 400): void {
    const response: ApiResponse = {
      success: false,
      error
    };
    res.status(status).json(response);
  }

  /**
   * Zwraca błąd walidacji
   */
  static validationError(res: Response, error: string): void {
    ResponseHelper.error(res, error, 400);
  }

  /**
   * Zwraca błąd nie znaleziono
   */
  static notFound(res: Response, resource: string = 'Resource'): void {
    ResponseHelper.error(res, `${resource} not found`, 404);
  }

  /**
   * Zwraca błąd nieautoryzowany
   */
  static unauthorized(res: Response, message: string = 'Unauthorized'): void {
    ResponseHelper.error(res, message, 401);
  }

  /**
   * Zwraca błąd serwera
   */
  static internalError(res: Response, message: string = 'Internal server error'): void {
    ResponseHelper.error(res, message, 500);
  }
}

/**
 * Klasa do obsługi błędów specyficznych dla systemu
 */
export class StudyExecutionError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number = 400) {
    super(message);
    this.name = 'StudyExecutionError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

/**
 * Predefiniowane kody błędów
 */
export const ErrorCodes = {
  EXECUTION_NOT_FOUND: 'EXECUTION_NOT_FOUND',
  SAMPLE_NOT_FOUND: 'SAMPLE_NOT_FOUND',
  MEASUREMENT_NOT_FOUND: 'MEASUREMENT_NOT_FOUND',
  INVALID_STATUS_TRANSITION: 'INVALID_STATUS_TRANSITION',
  PROTOCOL_NOT_FOUND: 'PROTOCOL_NOT_FOUND',
  UNAUTHORIZED_OPERATOR: 'UNAUTHORIZED_OPERATOR',
  EQUIPMENT_NOT_AVAILABLE: 'EQUIPMENT_NOT_AVAILABLE',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  EXPORT_FAILED: 'EXPORT_FAILED',
  DATABASE_ERROR: 'DATABASE_ERROR'
} as const;

/**
 * Helper do tworzenia błędów
 */
export class ErrorFactory {
  static executionNotFound(id: string): StudyExecutionError {
    return new StudyExecutionError(
      `Study execution with ID ${id} not found`,
      ErrorCodes.EXECUTION_NOT_FOUND,
      404
    );
  }

  static sampleNotFound(id: string): StudyExecutionError {
    return new StudyExecutionError(
      `Sample with ID ${id} not found`,
      ErrorCodes.SAMPLE_NOT_FOUND,
      404
    );
  }

  static invalidStatusTransition(from: string, to: string): StudyExecutionError {
    return new StudyExecutionError(
      `Invalid status transition from ${from} to ${to}`,
      ErrorCodes.INVALID_STATUS_TRANSITION,
      400
    );
  }

  static validationFailed(message: string): StudyExecutionError {
    return new StudyExecutionError(
      message,
      ErrorCodes.VALIDATION_FAILED,
      400
    );
  }

  static databaseError(message: string): StudyExecutionError {
    return new StudyExecutionError(
      message,
      ErrorCodes.DATABASE_ERROR,
      500
    );
  }
}

/**
 * Helper do parsowania błędów Prisma
 */
export class PrismaErrorParser {
  static parse(error: any): StudyExecutionError {
    switch (error.code) {
      case 'P2002':
        return new StudyExecutionError(
          'Resource already exists',
          'DUPLICATE_RESOURCE',
          409
        );
      case 'P2025':
        return new StudyExecutionError(
          'Resource not found',
          'RESOURCE_NOT_FOUND',
          404
        );
      case 'P2003':
        return new StudyExecutionError(
          'Foreign key constraint failed',
          'CONSTRAINT_VIOLATION',
          400
        );
      case 'P2005':
        return new StudyExecutionError(
          'Invalid field value',
          'INVALID_VALUE',
          400
        );
      default:
        return ErrorFactory.databaseError(error.message || 'Database operation failed');
    }
  }
}

/**
 * Helper do formatowania danych paginacji
 */
export class PaginationHelper {
  static createMeta(
    total: number,
    page: number,
    limit: number
  ): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    
    return {
      total,
      page,
      totalPages,
      limit,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  static calculateOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}

/**
 * Helper do walidacji
 */
export class ValidationHelper {
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidDate(date: string): boolean {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  }

  static isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
  }

  static isPositiveInteger(value: any): boolean {
    return Number.isInteger(value) && value > 0;
  }
}

/**
 * Helper do formatowania dat
 */
export class DateHelper {
  static formatISO(date: Date): string {
    return date.toISOString();
  }

  static parseISO(dateString: string): Date {
    return new Date(dateString);
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  static diffInMinutes(startDate: Date, endDate: Date): number {
    return Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60));
  }

  static formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    }
    
    return remainingMinutes === 0 
      ? `${hours}h` 
      : `${hours}h ${remainingMinutes}m`;
  }
}

/**
 * Helper do logowania
 */
export class Logger {
  static info(message: string, meta?: any): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || '');
  }

  static error(message: string, error?: any): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  }

  static warn(message: string, meta?: any): void {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta || '');
  }

  static debug(message: string, meta?: any): void {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta || '');
  }
}
