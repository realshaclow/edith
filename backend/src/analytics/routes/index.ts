import { Router } from 'express';
import { analyticsController } from '../controllers/analyticsController';
import { authenticate } from '../../auth/middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// === PUBLICZNE ENDPOINTY (bez autoryzacji) ===
router.get('/public/system', analyticsController.getSystemStats);

// === CHRONIONE ENDPOINTY (z autoryzacją) ===
// Dashboard stats - główne statystyki
router.get('/dashboard', authenticate(prisma), analyticsController.getDashboardStats);

// Poszczególne sekcje statystyk
router.get('/system', authenticate(prisma), analyticsController.getSystemStats);
router.get('/users', authenticate(prisma), analyticsController.getUserStats);
router.get('/protocols', authenticate(prisma), analyticsController.getProtocolStats);
router.get('/studies', authenticate(prisma), analyticsController.getStudyStats);
router.get('/performance', authenticate(prisma), analyticsController.getPerformanceStats);

export default router;
