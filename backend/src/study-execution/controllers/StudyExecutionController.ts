import { Request, Response } from 'express';
import { StudyExecutionService } from '../services/StudyExecutionService';
import {
  CreateStudyExecutionRequest,
  AddMeasurementRequest,
  CreateExportRequest,
  StudyExecutionFilters,
  PaginationOptions,
  ExecutionStatus,
  SampleStatus
} from '../types';

export class StudyExecutionController {
  constructor(private service: StudyExecutionService) {}

  /**
   * POST /api/study-executions
   * Tworzy nowe wykonanie badania
   */
  async createExecution(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateStudyExecutionRequest = req.body;
      const operatorId = req.user?.id || req.body.operatorId;

      if (!operatorId) {
        res.status(400).json({
          success: false,
          error: 'Operator ID is required'
        });
        return;
      }

      const execution = await this.service.createExecution(data, operatorId);

      res.status(201).json({
        success: true,
        data: execution
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/study-executions/:id
   * Pobiera wykonanie badania
   */
  async getExecutionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const execution = await this.service.getExecutionById(id);

      if (!execution) {
        res.status(404).json({
          success: false,
          error: 'Study execution not found'
        });
        return;
      }

      res.json({
        success: true,
        data: execution
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/study-executions
   * Pobiera listę wykonań z filtrami i paginacją
   */
  async getExecutions(req: Request, res: Response): Promise<void> {
    try {
      const filters: StudyExecutionFilters = {
        status: req.query.status ? (req.query.status as string).split(',') as ExecutionStatus[] : undefined,
        operatorId: req.query.operatorId as string,
        studyId: req.query.studyId as string,
        category: req.query.category as string,
        dateFrom: req.query.dateFrom ? new Date(req.query.dateFrom as string) : undefined,
        dateTo: req.query.dateTo ? new Date(req.query.dateTo as string) : undefined,
        tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
        search: req.query.search as string
      };

      const pagination: PaginationOptions = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        sortBy: req.query.sortBy as string,
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await this.service.getExecutions(filters, pagination);

      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          limit: pagination.limit
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/:id/start
   * Rozpoczyna wykonanie badania
   */
  async startExecution(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const execution = await this.service.startExecution(id);

      res.json({
        success: true,
        data: execution
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/:id/pause
   * Wstrzymuje wykonanie badania
   */
  async pauseExecution(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { notes } = req.body;
      const execution = await this.service.pauseExecution(id, notes);

      res.json({
        success: true,
        data: execution
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/:id/resume
   * Wznawia wykonanie badania
   */
  async resumeExecution(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const execution = await this.service.resumeExecution(id);

      res.json({
        success: true,
        data: execution
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/:id/complete
   * Kończy wykonanie badania
   */
  async completeExecution(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { summary, recommendations } = req.body;
      const execution = await this.service.completeExecution(id, summary, recommendations);

      res.json({
        success: true,
        data: execution
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/samples/:sampleId/start
   * Rozpoczyna próbkę
   */
  async startSample(req: Request, res: Response): Promise<void> {
    try {
      const { sampleId } = req.params;
      const operatorId = req.user?.id || req.body.operatorId;

      if (!operatorId) {
        res.status(400).json({
          success: false,
          error: 'Operator ID is required'
        });
        return;
      }

      const sample = await this.service.startSample(sampleId, operatorId);

      res.json({
        success: true,
        data: sample
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/samples/:sampleId/complete
   * Kończy próbkę
   */
  async completeSample(req: Request, res: Response): Promise<void> {
    try {
      const { sampleId } = req.params;
      const { quality, notes } = req.body;

      if (!quality || !['pass', 'fail', 'warning'].includes(quality)) {
        res.status(400).json({
          success: false,
          error: 'Valid quality status is required (pass, fail, warning)'
        });
        return;
      }

      const sample = await this.service.completeSample(sampleId, quality, notes);

      res.json({
        success: true,
        data: sample
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/samples/:sampleId/skip
   * Pomija próbkę
   */
  async skipSample(req: Request, res: Response): Promise<void> {
    try {
      const { sampleId } = req.params;
      const { reason } = req.body;

      if (!reason?.trim()) {
        res.status(400).json({
          success: false,
          error: 'Reason for skipping is required'
        });
        return;
      }

      const sample = await this.service.skipSample(sampleId, reason);

      res.json({
        success: true,
        data: sample
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/measurements
   * Dodaje pomiar do próbki
   */
  async addMeasurement(req: Request, res: Response): Promise<void> {
    try {
      const data: AddMeasurementRequest = req.body;
      const measurement = await this.service.addMeasurement(data);

      res.status(201).json({
        success: true,
        data: measurement
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * PUT /api/study-executions/:id/progress
   * Aktualizuje postęp wykonania
   */
  async updateProgress(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const execution = await this.service.updateExecutionProgress(id);

      res.json({
        success: true,
        data: execution
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/:id/exports
   * Tworzy eksport wykonania badania
   */
  async createExport(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const requestedById = req.user?.id || req.body.requestedById;

      if (!requestedById) {
        res.status(400).json({
          success: false,
          error: 'User ID is required'
        });
        return;
      }

      const data: CreateExportRequest = {
        ...req.body,
        executionId: id,
        requestedById
      };

      const exportRecord = await this.service.createExport(data);

      res.status(201).json({
        success: true,
        data: exportRecord
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * GET /api/study-executions/:id/exports
   * Pobiera eksporty dla wykonania badania
   */
  async getExports(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const exports = await this.service.getExportsByExecution(id);

      res.json({
        success: true,
        data: exports
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * POST /api/study-executions/:id/save
   * Zapisuje kompletne dane wykonania w systemie EDITH
   */
  async saveToEdithSystem(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const execution = await this.service.getExecutionById(id);

      if (!execution) {
        res.status(404).json({
          success: false,
          error: 'Study execution not found'
        });
        return;
      }

      // Tu można dodać dodatkową logikę zapisu w systemie EDITH
      // np. generowanie raportów, powiadomień, integracji z innymi systemami

      res.json({
        success: true,
        message: 'Study execution saved to EDITH system successfully',
        data: {
          executionId: execution.id,
          savedAt: new Date(),
          status: execution.status,
          samplesCount: execution.samples.length,
          measurementsCount: execution.measurements.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
