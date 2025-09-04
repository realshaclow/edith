import { Request, Response } from 'express';
import { StudyService } from '../services/study.service';
import { StudyRepository } from '../repositories/study.repository';
import { 
  CreateStudySchema,
  UpdateStudySchema,
  StudyQuerySchema,
  CreateStudySessionSchema,
  UpdateStudySessionSchema,
  SessionQuerySchema
} from '../validators/study.validators';
import { StudyPriority, StudyStatus, SessionStatus } from '../types/study.types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const studyRepository = new StudyRepository(prisma);
const studyService = new StudyService(studyRepository);

export class StudyController {
  // Helper methods for type mapping
  private mapPriorityToEnum(priority?: string): StudyPriority | undefined {
    if (!priority) return undefined;
    return priority as StudyPriority;
  }

  private mapStatusToEnum(status?: string): StudyStatus | undefined {
    if (!status) return undefined;
    return status as StudyStatus;
  }

  private mapSessionStatusToEnum(status?: string): SessionStatus | undefined {
    if (!status) return undefined;
    return status as SessionStatus;
  }

  // Study CRUD Operations
  async createStudy(req: Request, res: Response) {
    try {
      const validatedData = CreateStudySchema.parse(req.body);
      const userId = req.user?.id || 'default-user'; // TODO: Implement auth
      
      // Map validated data to proper DTO format
      const studyData = {
        ...validatedData,
        priority: this.mapPriorityToEnum(validatedData.priority),
        settings: validatedData.settings as any // Temporary fix for settings mapping
      };
      
      const study = await studyService.createStudy(studyData, userId);
      
      res.status(201).json({
        success: true,
        data: study,
        message: 'Study created successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create study',
        details: error.issues || null
      });
    }
  }

  async getStudy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const study = await studyService.getStudyById(id);
      
      if (!study) {
        return res.status(404).json({
          success: false,
          error: 'Study not found'
        });
      }
      
      res.json({
        success: true,
        data: study
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch study'
      });
    }
  }

  async getStudies(req: Request, res: Response) {
    try {
      const queryParams = StudyQuerySchema.parse(req.query);
      
      const result = await studyService.getStudies(queryParams);
      
      res.json({
        success: true,
        data: result.studies,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch studies',
        details: error.issues || null
      });
    }
  }

  async updateStudy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const validatedData = UpdateStudySchema.parse(req.body);
      
      // Map validated data to proper DTO format
      const updateData = {
        ...validatedData,
        priority: this.mapPriorityToEnum(validatedData.priority),
        status: this.mapStatusToEnum(validatedData.status),
        settings: validatedData.settings as any // Temporary fix for settings mapping
      };
      
      const study = await studyService.updateStudy(id, updateData);
      
      res.json({
        success: true,
        data: study,
        message: 'Study updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update study',
        details: error.issues || null
      });
    }
  }

  async deleteStudy(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      await studyService.deleteStudy(id);
      
      res.json({
        success: true,
        message: 'Study deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete study'
      });
    }
  }

  // Study Session Management
  async createSession(req: Request, res: Response) {
    try {
      const { studyId } = req.params;
      const validatedData = CreateStudySessionSchema.parse(req.body);
      
      const session = await studyService.createSession(studyId, validatedData);
      
      res.status(201).json({
        success: true,
        data: session,
        message: 'Study session created successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to create session',
        details: error.issues || null
      });
    }
  }

  async getSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      
      const session = await studyService.getSessionById(sessionId);
      
      if (!session) {
        return res.status(404).json({
          success: false,
          error: 'Session not found'
        });
      }
      
      res.json({
        success: true,
        data: session
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch session'
      });
    }
  }

  async getStudySessions(req: Request, res: Response) {
    try {
      const { studyId } = req.params;
      const queryParams = SessionQuerySchema.parse(req.query);
      
      const result = await studyService.getStudySessions(studyId, queryParams);
      
      res.json({
        success: true,
        data: result.sessions,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to fetch sessions',
        details: error.issues || null
      });
    }
  }

  async updateSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const validatedData = UpdateStudySessionSchema.parse(req.body);
      
      // Map validated data to proper DTO format
      const updateData = {
        ...validatedData,
        status: this.mapSessionStatusToEnum(validatedData.status)
      };
      
      const session = await studyService.updateSession(sessionId, updateData);
      
      res.json({
        success: true,
        data: session,
        message: 'Session updated successfully'
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || 'Failed to update session',
        details: error.issues || null
      });
    }
  }

  async deleteSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      
      await studyService.deleteSession(sessionId);
      
      res.json({
        success: true,
        message: 'Session deleted successfully'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete session'
      });
    }
  }

  // Statistics and Analytics
  async getStudyStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id; // TODO: Implement auth
      
      const stats = await studyService.getStudyStats(userId);
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch study statistics'
      });
    }
  }

  // Bulk Operations
  async bulkDeleteStudies(req: Request, res: Response) {
    try {
      const { studyIds } = req.body;
      
      if (!Array.isArray(studyIds) || studyIds.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Invalid studyIds array'
        });
      }
      
      const deletePromises = studyIds.map(id => studyService.deleteStudy(id));
      await Promise.all(deletePromises);
      
      res.json({
        success: true,
        message: `${studyIds.length} studies deleted successfully`
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete studies'
      });
    }
  }

  async exportStudyData(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { format = 'json' } = req.query;
      
      const study = await studyService.getStudyById(id);
      
      if (!study) {
        return res.status(404).json({
          success: false,
          error: 'Study not found'
        });
      }
      
      // Get all sessions for the study
      const sessionsResult = await studyService.getStudySessions(id, { limit: 1000 });
      
      const exportData = {
        study,
        sessions: sessionsResult.sessions,
        exportedAt: new Date().toISOString(),
        format
      };
      
      if (format === 'csv') {
        // TODO: Implement CSV export
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="study-${id}.csv"`);
        res.send('CSV export not implemented yet');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="study-${id}.json"`);
        res.json(exportData);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to export study data'
      });
    }
  }
}

// Create and export controller instance
export const studyController = new StudyController();
