import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProtocolService } from '../services/protocol.service';
import { createProtocolSchema, updateProtocolSchema, protocolQuerySchema } from '../validators';
import { ZodError } from 'zod';

interface CustomRequest extends Request {
  user?: any;
  prisma: PrismaClient;
}

export class ProtocolController {
  private service: ProtocolService;

  constructor(prisma: PrismaClient) {
    this.service = new ProtocolService(prisma);
  }

  // Pobierz wszystkie protokoły (z paginacją i filtrami)
  getProtocols = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = protocolQuerySchema.parse(req.query);
      const userId = req.user?.id;

      const result = await this.service.getProtocols(query, userId);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Pobierz protokół po ID
  getProtocolById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const protocol = await this.service.getProtocolById(id, userId);

      if (!protocol) {
        res.status(404).json({
          success: false,
          error: 'Protokół nie został znaleziony'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: protocol
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Brak uprawnień')) {
        res.status(403).json({
          success: false,
          error: error.message
        });
        return;
      }
      next(error);
    }
  };

  // Pobierz protokoły użytkownika
  getUserProtocols = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Wymagane uwierzytelnienie'
        });
        return;
      }

      const query = protocolQuerySchema.partial().parse(req.query);
      const result = await this.service.getUserProtocols(userId, query);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Pobierz publiczne protokoły
  getPublicProtocols = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = protocolQuerySchema.partial().parse(req.query);
      const result = await this.service.getPublicProtocols(query);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Utwórz nowy protokół
  createProtocol = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Wymagane uwierzytelnienie'
        });
        return;
      }

      const validatedData = createProtocolSchema.parse(req.body);
      const protocol = await this.service.createProtocol(validatedData, userId);

      res.status(201).json({
        success: true,
        data: protocol,
        message: 'Protokół został utworzony pomyślnie'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Błędne dane wejściowe',
          details: error.issues
        });
        return;
      }
      next(error);
    }
  };

  // Aktualizuj protokół
  updateProtocol = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Wymagane uwierzytelnienie'
        });
        return;
      }

      const validatedData = updateProtocolSchema.parse(req.body);
      const protocol = await this.service.updateProtocol(id, validatedData, userId);

      res.status(200).json({
        success: true,
        data: protocol,
        message: 'Protokół został zaktualizowany pomyślnie'
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          error: 'Błędne dane wejściowe',
          details: error.issues
        });
        return;
      }
      if (error instanceof Error) {
        if (error.message.includes('nie został znaleziony')) {
          res.status(404).json({
            success: false,
            error: error.message
          });
          return;
        }
        if (error.message.includes('Brak uprawnień') || error.message.includes('predefiniowanych')) {
          res.status(403).json({
            success: false,
            error: error.message
          });
          return;
        }
      }
      next(error);
    }
  };

  // Usuń protokół
  deleteProtocol = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Wymagane uwierzytelnienie'
        });
        return;
      }

      const success = await this.service.deleteProtocol(id, userId);

      if (!success) {
        res.status(500).json({
          success: false,
          error: 'Błąd podczas usuwania protokołu'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Protokół został usunięty pomyślnie'
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('nie został znaleziony')) {
          res.status(404).json({
            success: false,
            error: error.message
          });
          return;
        }
        if (error.message.includes('Brak uprawnień') || error.message.includes('predefiniowanych')) {
          res.status(403).json({
            success: false,
            error: error.message
          });
          return;
        }
      }
      next(error);
    }
  };

  // Duplikuj protokół
  duplicateProtocol = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { title } = req.body;
      const userId = req.user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'Wymagane uwierzytelnienie'
        });
        return;
      }

      const protocol = await this.service.duplicateProtocol(id, userId, title);

      res.status(201).json({
        success: true,
        data: protocol,
        message: 'Protokół został zduplikowany pomyślnie'
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('nie został znaleziony')) {
        res.status(404).json({
          success: false,
          error: error.message
        });
        return;
      }
      next(error);
    }
  };

  // Pobierz statystyki protokołów
  getProtocolStats = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.service.getProtocolStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  // Wyszukaj protokoły
  searchProtocols = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Parametr wyszukiwania jest wymagany'
        });
        return;
      }

      const userId = req.user?.id;
      const protocols = await this.service.searchProtocols(q, userId);

      res.status(200).json({
        success: true,
        data: protocols
      });
    } catch (error) {
      next(error);
    }
  };

  // Pobierz protokoły według kategorii
  getProtocolsByCategory = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { category } = req.params;
      const userId = req.user?.id;
      
      const protocols = await this.service.getProtocolsByCategory(category, userId);

      res.status(200).json({
        success: true,
        data: protocols
      });
    } catch (error) {
      next(error);
    }
  };
}
