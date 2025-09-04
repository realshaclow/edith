import { Router } from 'express';
import { StudyExecutionController } from '../controllers/StudyExecutionController';
import { StudyExecutionService } from '../services/StudyExecutionService';
import { StudyExecutionRepository } from '../repositories/StudyExecutionRepository';
import { PrismaClient } from '@prisma/client';
import {
  validateCreateExecution,
  validateAddMeasurement,
  validateCreateExport,
  validatePagination,
  validateStatus,
  validateDateRange,
  validateId,
  errorHandler,
  requestLogger
} from '../middleware/validationMiddleware';
import { authenticate as authMiddleware } from '../../auth/middleware/authMiddleware';

// Inicjalizacja zależności
const prisma = new PrismaClient();
const repository = new StudyExecutionRepository(prisma);
const service = new StudyExecutionService(repository);
const controller = new StudyExecutionController(service);

const router = Router();

// Middleware dla wszystkich tras
router.use(requestLogger);
router.use(authMiddleware);

// Trasy dla wykonań badań
router.post(
  '/study-executions',
  validateCreateExecution,
  controller.createExecution.bind(controller)
);

router.get(
  '/study-executions/:id',
  validateId('id'),
  controller.getExecutionById.bind(controller)
);

router.get(
  '/study-executions',
  validatePagination,
  validateStatus,
  validateDateRange,
  controller.getExecutions.bind(controller)
);

// Trasy do zarządzania cyklem życia wykonania
router.post(
  '/study-executions/:id/start',
  validateId('id'),
  controller.startExecution.bind(controller)
);

router.post(
  '/study-executions/:id/pause',
  validateId('id'),
  controller.pauseExecution.bind(controller)
);

router.post(
  '/study-executions/:id/resume',
  validateId('id'),
  controller.resumeExecution.bind(controller)
);

router.post(
  '/study-executions/:id/complete',
  validateId('id'),
  controller.completeExecution.bind(controller)
);

// Trasy do zarządzania próbkami
router.post(
  '/study-executions/samples/:sampleId/start',
  validateId('sampleId'),
  controller.startSample.bind(controller)
);

router.post(
  '/study-executions/samples/:sampleId/complete',
  validateId('sampleId'),
  controller.completeSample.bind(controller)
);

router.post(
  '/study-executions/samples/:sampleId/skip',
  validateId('sampleId'),
  controller.skipSample.bind(controller)
);

// Trasy do pomiarów
router.post(
  '/study-executions/measurements',
  validateAddMeasurement,
  controller.addMeasurement.bind(controller)
);

// Trasa do aktualizacji postępu
router.put(
  '/study-executions/:id/progress',
  validateId('id'),
  controller.updateProgress.bind(controller)
);

// Trasy do eksportów
router.post(
  '/study-executions/:id/exports',
  validateId('id'),
  validateCreateExport,
  controller.createExport.bind(controller)
);

router.get(
  '/study-executions/:id/exports',
  validateId('id'),
  controller.getExports.bind(controller)
);

// Trasa do zapisu w systemie EDITH
router.post(
  '/study-executions/:id/save',
  validateId('id'),
  controller.saveToEdithSystem.bind(controller)
);

// Middleware obsługi błędów (musi być na końcu)
router.use(errorHandler);

export { router as studyExecutionRouter };
export { prisma, repository, service, controller };
