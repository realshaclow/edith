import { Router } from 'express';
import { studyController } from '../controllers/study.controller';
import { authenticate } from '../../../auth/middleware/authMiddleware';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Study CRUD Routes
router.post('/', authenticate(prisma), studyController.createStudy.bind(studyController));
router.get('/stats', authenticate(prisma), studyController.getStudyStats.bind(studyController));
router.get('/', authenticate(prisma), studyController.getStudies.bind(studyController));
router.get('/:id', authenticate(prisma), studyController.getStudy.bind(studyController));
router.put('/:id', authenticate(prisma), studyController.updateStudy.bind(studyController));
router.delete('/:id', authenticate(prisma), studyController.deleteStudy.bind(studyController));

// Study Session Routes
router.post('/:studyId/sessions', authenticate(prisma), studyController.createSession.bind(studyController));
router.get('/:studyId/sessions', authenticate(prisma), studyController.getStudySessions.bind(studyController));
router.get('/sessions/:sessionId', authenticate(prisma), studyController.getSession.bind(studyController));
router.put('/sessions/:sessionId', authenticate(prisma), studyController.updateSession.bind(studyController));
router.delete('/sessions/:sessionId', authenticate(prisma), studyController.deleteSession.bind(studyController));

// Bulk Operations
router.delete('/bulk/delete', authenticate(prisma), studyController.bulkDeleteStudies.bind(studyController));

// Export/Import Routes
router.get('/:id/export', authenticate(prisma), studyController.exportStudyData.bind(studyController));

export default router;
