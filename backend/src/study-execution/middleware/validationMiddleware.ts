import { Request, Response, NextFunction } from 'express';
import {
  CreateStudyExecutionRequest,
  AddMeasurementRequest,
  CreateExportRequest,
  ExecutionStatus,
  SampleStatus
} from '../types';

/**
 * Middleware do walidacji danych tworzenia wykonania badania
 */
export const validateCreateExecution = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const data = req.body as CreateStudyExecutionRequest;

    if (!data.studyId || typeof data.studyId !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Valid study ID is required'
      });
      return;
    }

    if (!data.protocolId || typeof data.protocolId !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Protocol ID is required'
      });
      return;
    }

    if (data.testConditions && typeof data.testConditions !== 'object') {
      res.status(400).json({
        success: false,
        error: 'Test conditions must be an object'
      });
      return;
    }

    if (!Array.isArray(data.samples) || data.samples.length === 0) {
      res.status(400).json({
        success: false,
        error: 'At least one sample is required'
      });
      return;
    }

    // Walidacja próbek
    for (let i = 0; i < data.samples.length; i++) {
      const sample = data.samples[i];
      
      if (!sample.name || typeof sample.name !== 'string') {
        res.status(400).json({
          success: false,
          error: `Sample ${i + 1}: name is required`
        });
        return;
      }

      if (!sample.material || typeof sample.material !== 'string') {
        res.status(400).json({
          success: false,
          error: `Sample ${i + 1}: material is required`
        });
        return;
      }

      if (sample.properties && typeof sample.properties !== 'object') {
        res.status(400).json({
          success: false,
          error: `Sample ${i + 1}: properties must be an object`
        });
        return;
      }
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid request data'
    });
  }
};

/**
 * Middleware do walidacji danych pomiaru
 */
export const validateAddMeasurement = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const data = req.body as AddMeasurementRequest;

    if (!data.sampleId || typeof data.sampleId !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Valid sample ID is required'
      });
      return;
    }

    if (!data.stepId || typeof data.stepId !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Step ID is required'
      });
      return;
    }

    if (!data.measurementId || typeof data.measurementId !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Measurement ID is required'
      });
      return;
    }

    if (data.value === undefined || data.value === null) {
      res.status(400).json({
        success: false,
        error: 'Measurement value is required'
      });
      return;
    }

    if (typeof data.value !== 'number' && typeof data.value !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Measurement value must be a number or string'
      });
      return;
    }

    if (data.unit && typeof data.unit !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Measurement unit must be a string'
      });
      return;
    }

    if (data.conditions && typeof data.conditions !== 'object') {
      res.status(400).json({
        success: false,
        error: 'Measurement conditions must be an object'
      });
      return;
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid measurement data'
    });
  }
};

/**
 * Middleware do walidacji danych eksportu
 */
export const validateCreateExport = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const data = req.body as CreateExportRequest;

    if (!data.format || typeof data.format !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Export format is required'
      });
      return;
    }

    const validFormats = ['pdf', 'excel', 'csv', 'json'];
    if (!validFormats.includes(data.format)) {
      res.status(400).json({
        success: false,
        error: `Export format must be one of: ${validFormats.join(', ')}`
      });
      return;
    }

    if (data.template && typeof data.template !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Export template must be a string'
      });
      return;
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid export data'
    });
  }
};

/**
 * Middleware do walidacji parametrów paginacji
 */
export const validatePagination = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.query.page) {
      const page = parseInt(req.query.page as string);
      if (isNaN(page) || page < 1) {
        res.status(400).json({
          success: false,
          error: 'Page must be a positive integer'
        });
        return;
      }
    }

    if (req.query.limit) {
      const limit = parseInt(req.query.limit as string);
      if (isNaN(limit) || limit < 1 || limit > 100) {
        res.status(400).json({
          success: false,
          error: 'Limit must be between 1 and 100'
        });
        return;
      }
    }

    if (req.query.sortOrder) {
      const sortOrder = req.query.sortOrder as string;
      if (!['asc', 'desc'].includes(sortOrder)) {
        res.status(400).json({
          success: false,
          error: 'Sort order must be "asc" or "desc"'
        });
        return;
      }
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid pagination parameters'
    });
  }
};

/**
 * Middleware do walidacji statusów
 */
export const validateStatus = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.query.status) {
      const statuses = (req.query.status as string).split(',');
      const validStatuses = [
        ExecutionStatus.NOT_STARTED, 
        ExecutionStatus.IN_PROGRESS, 
        ExecutionStatus.PAUSED, 
        ExecutionStatus.COMPLETED, 
        ExecutionStatus.FAILED, 
        ExecutionStatus.CANCELLED
      ];
      
      for (const status of statuses) {
        if (!validStatuses.includes(status as ExecutionStatus)) {
          res.status(400).json({
            success: false,
            error: `Invalid status: ${status}. Valid statuses: ${validStatuses.join(', ')}`
          });
          return;
        }
      }
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid status parameters'
    });
  }
};

/**
 * Middleware do walidacji dat
 */
export const validateDateRange = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;

    if (req.query.dateFrom) {
      dateFrom = new Date(req.query.dateFrom as string);
      if (isNaN(dateFrom.getTime())) {
        res.status(400).json({
          success: false,
          error: 'Invalid dateFrom format'
        });
        return;
      }
    }

    if (req.query.dateTo) {
      dateTo = new Date(req.query.dateTo as string);
      if (isNaN(dateTo.getTime())) {
        res.status(400).json({
          success: false,
          error: 'Invalid dateTo format'
        });
        return;
      }
    }

    if (dateFrom && dateTo && dateFrom > dateTo) {
      res.status(400).json({
        success: false,
        error: 'dateFrom cannot be later than dateTo'
      });
      return;
    }

    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Invalid date parameters'
    });
  }
};

/**
 * Middleware do obsługi błędów
 */
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error in study execution API:', error);

  // Prisma errors
  if (error.code === 'P2002') {
    res.status(409).json({
      success: false,
      error: 'Resource already exists'
    });
    return;
  }

  if (error.code === 'P2025') {
    res.status(404).json({
      success: false,
      error: 'Resource not found'
    });
    return;
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      error: error.message
    });
    return;
  }

  // Default error
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};

/**
 * Middleware do logowania requestów
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });

  next();
};

/**
 * Middleware do walidacji ID w ścieżce
 */
export const validateId = (paramName: string = 'id') => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = req.params[paramName];
  
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: `Valid ${paramName} is required`
    });
    return;
  }

  next();
};

/**
 * Middleware do sprawdzania autoryzacji (placeholder)
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Tu można dodać sprawdzanie tokenów JWT, sesji itp.
  // Na razie przepuszczamy wszystko
  
  // Przykład sprawdzania podstawowego tokenu
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // Tu można dodać weryfikację tokenu
    req.user = { id: 'default-user-id' } as any; // Placeholder
  }

  next();
};
