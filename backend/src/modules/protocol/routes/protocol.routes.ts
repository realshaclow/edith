import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProtocolController } from '../controllers/protocol.controller';

export function createProtocolRoutes(prisma: PrismaClient): Router {
  const router = Router();
  const controller = new ProtocolController(prisma);

  // Publiczne trasy (nie wymagają uwierzytelnienia)
  router.get('/public', controller.getPublicProtocols as any);
  router.get('/search', controller.searchProtocols as any);
  router.get('/category/:category', controller.getProtocolsByCategory as any);
  router.get('/stats', controller.getProtocolStats as any);

  // CRUD operations
  router.get('/', controller.getProtocols as any);
  router.get('/my', controller.getUserProtocols as any);
  router.get('/:id', controller.getProtocolById as any);
  router.post('/', controller.createProtocol as any);
  router.put('/:id', controller.updateProtocol as any);
  router.delete('/:id', controller.deleteProtocol as any);
  
  // Dodatkowe operacje
  router.post('/:id/duplicate', controller.duplicateProtocol as any);

  return router;
}
