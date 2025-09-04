import { PrismaClient } from '@prisma/client';
import {
  StudyExecutionData,
  StudyExecutionSampleData,
  StudyMeasurementData,
  StudyExportData,
  CreateStudyExecutionRequest,
  CreateSampleRequest,
  AddMeasurementRequest,
  CreateExportRequest,
  StudyExecutionFilters,
  PaginationOptions,
  ExecutionStatus,
  SampleStatus
} from '../types';

export class StudyExecutionRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Tworzy nowe wykonanie badania
   */
  async createExecution(data: CreateStudyExecutionRequest, operatorName: string, operatorPosition: string): Promise<StudyExecutionData> {
    const execution = await this.prisma.studyExecution.create({
      data: {
        studyId: data.studyId,
        studyName: data.studyName,
        protocolId: data.protocolId,
        protocolName: data.protocolName,
        category: data.category,
        operatorId: data.operatorId,
        operatorName,
        operatorPosition,
        environment: data.environment as any,
        testConditions: data.testConditions,
        estimatedDuration: data.estimatedDuration,
        notes: data.notes,
        tags: data.tags,
        totalSteps: data.samples.length,
        samples: {
          create: data.samples.map((sample, index) => ({
            sampleNumber: index + 1,
            name: sample.name,
            description: sample.description,
            material: sample.material,
            properties: sample.properties,
            estimatedTime: sample.estimatedTime,
            notes: sample.notes,
            batchNumber: sample.batchNumber,
            lotNumber: sample.lotNumber,
            operatorId: data.operatorId,
            operatorName
          }))
        }
      },
      include: {
        samples: {
          include: {
            measurements: true
          }
        },
        measurements: true,
        exports: true
      }
    });

    return this.mapExecutionToData(execution);
  }

  /**
   * Pobiera wykonanie badania z wszystkimi powiązanymi danymi
   */
  async getExecutionById(id: string): Promise<StudyExecutionData | null> {
    const execution = await this.prisma.studyExecution.findUnique({
      where: { id },
      include: {
        samples: {
          include: {
            measurements: true
          },
          orderBy: { sampleNumber: 'asc' }
        },
        measurements: {
          orderBy: { timestamp: 'asc' }
        },
        exports: {
          orderBy: { requestedAt: 'desc' }
        }
      }
    });

    return execution ? this.mapExecutionToData(execution) : null;
  }

  /**
   * Pobiera listę wykonań badań z filtrami i paginacją
   */
  async getExecutions(
    filters: StudyExecutionFilters = {},
    pagination: PaginationOptions
  ): Promise<{ data: StudyExecutionData[]; total: number }> {
    const where: any = {};

    if (filters.status?.length) {
      where.status = { in: filters.status };
    }

    if (filters.operatorId) {
      where.operatorId = filters.operatorId;
    }

    if (filters.studyId) {
      where.studyId = filters.studyId;
    }

    if (filters.category) {
      where.category = { contains: filters.category, mode: 'insensitive' };
    }

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo;
      }
    }

    if (filters.search) {
      where.OR = [
        { studyName: { contains: filters.search, mode: 'insensitive' } },
        { protocolName: { contains: filters.search, mode: 'insensitive' } },
        { operatorName: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.tags?.length) {
      where.tags = {
        hasEvery: filters.tags
      };
    }

    const [executions, total] = await Promise.all([
      this.prisma.studyExecution.findMany({
        where,
        include: {
          samples: {
            include: {
              measurements: true
            }
          },
          measurements: true,
          exports: true
        },
        orderBy: pagination.sortBy ? {
          [pagination.sortBy]: pagination.sortOrder || 'desc'
        } : { createdAt: 'desc' },
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit
      }),
      this.prisma.studyExecution.count({ where })
    ]);

    return {
      data: executions.map(this.mapExecutionToData),
      total
    };
  }

  /**
   * Aktualizuje status wykonania badania
   */
  async updateExecutionStatus(
    id: string,
    status: ExecutionStatus,
    data: {
      progress?: number;
      currentStep?: number;
      notes?: string;
      startedAt?: Date;
      completedAt?: Date;
      pausedAt?: Date;
    } = {}
  ): Promise<StudyExecutionData> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
      ...data
    };

    // Automatyczne ustawianie dat
    if (status === ExecutionStatus.IN_PROGRESS && !data.startedAt) {
      updateData.startedAt = new Date();
    }

    if (status === ExecutionStatus.COMPLETED && !data.completedAt) {
      updateData.completedAt = new Date();
    }

    if (status === ExecutionStatus.PAUSED && !data.pausedAt) {
      updateData.pausedAt = new Date();
    }

    const execution = await this.prisma.studyExecution.update({
      where: { id },
      data: updateData,
      include: {
        samples: {
          include: {
            measurements: true
          }
        },
        measurements: true,
        exports: true
      }
    });

    return this.mapExecutionToData(execution);
  }

  /**
   * Aktualizuje status próbki
   */
  async updateSampleStatus(
    sampleId: string,
    status: SampleStatus,
    data: {
      progress?: number;
      quality?: 'pass' | 'fail' | 'warning';
      notes?: string;
      startedAt?: Date;
      completedAt?: Date;
      operatorId?: string;
      operatorName?: string;
    } = {}
  ): Promise<StudyExecutionSampleData> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
      ...data
    };

    // Automatyczne ustawianie dat
    if (status === SampleStatus.IN_PROGRESS && !data.startedAt) {
      updateData.startedAt = new Date();
    }

    if (status === SampleStatus.COMPLETED && !data.completedAt) {
      updateData.completedAt = new Date();
    }

    const sample = await this.prisma.studyExecutionSample.update({
      where: { id: sampleId },
      data: updateData,
      include: {
        measurements: true
      }
    });

    return this.mapSampleToData(sample);
  }

  /**
   * Dodaje pomiar do próbki
   */
  async addMeasurement(data: AddMeasurementRequest): Promise<StudyMeasurementData> {
    const measurement = await this.prisma.studyMeasurement.create({
      data: {
        executionId: (await this.prisma.studyExecutionSample.findUnique({
          where: { id: data.sampleId },
          select: { executionId: true }
        }))!.executionId,
        sampleId: data.sampleId,
        stepId: data.stepId,
        measurementId: data.measurementId,
        value: data.value,
        textValue: data.textValue,
        unit: data.unit,
        operator: data.operator,
        equipment: data.equipment,
        method: data.method,
        conditions: data.conditions,
        notes: data.notes,
        rawData: data.rawData
      }
    });

    return this.mapMeasurementToData(measurement);
  }

  /**
   * Tworzy nowy eksport
   */
  async createExport(data: CreateExportRequest): Promise<StudyExportData> {
    const execution = await this.prisma.studyExecution.findUnique({
      where: { id: data.executionId },
      select: { studyId: true }
    });

    if (!execution) {
      throw new Error('Execution not found');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: data.requestedById },
      select: { firstName: true, lastName: true }
    });

    const filename = this.generateExportFilename(data.format, data.type);

    const exportRecord = await this.prisma.studyExport.create({
      data: {
        executionId: data.executionId,
        studyId: execution.studyId,
        format: data.format,
        type: data.type as any,
        filename,
        includeCharts: data.includeCharts ?? true,
        includeSamples: data.includeSamples ?? true,
        includeRawData: data.includeRawData ?? false,
        template: data.template,
        requestedById: data.requestedById,
        requestedBy: user ? `${user.firstName} ${user.lastName}` : 'Unknown',
        expiresAt: data.expiresAt,
        metadata: data.metadata
      }
    });

    return this.mapExportToData(exportRecord);
  }

  /**
   * Aktualizuje status eksportu
   */
  async updateExportStatus(
    id: string,
    status: any,
    data: {
      progress?: number;
      filepath?: string;
      size?: number;
      errors?: string[];
      startedAt?: Date;
      completedAt?: Date;
    } = {}
  ): Promise<StudyExportData> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
      ...data
    };

    if (status === 'IN_PROGRESS' && !data.startedAt) {
      updateData.startedAt = new Date();
    }

    if (status === 'COMPLETED' && !data.completedAt) {
      updateData.completedAt = new Date();
    }

    const exportRecord = await this.prisma.studyExport.update({
      where: { id },
      data: updateData
    });

    return this.mapExportToData(exportRecord);
  }

  /**
   * Pobiera eksporty dla wykonania badania
   */
  async getExportsByExecution(executionId: string): Promise<StudyExportData[]> {
    const exports = await this.prisma.studyExport.findMany({
      where: { executionId },
      orderBy: { requestedAt: 'desc' }
    });

    return exports.map(this.mapExportToData);
  }

  /**
   * Mapuje Prisma model na nasze typy
   */
  private mapExecutionToData(execution: any): StudyExecutionData {
    return {
      id: execution.id,
      studyId: execution.studyId,
      studyName: execution.studyName,
      protocolId: execution.protocolId,
      protocolName: execution.protocolName,
      category: execution.category,
      operatorId: execution.operatorId,
      operatorName: execution.operatorName,
      operatorPosition: execution.operatorPosition,
      status: execution.status,
      progress: execution.progress,
      currentStep: execution.currentStep,
      totalSteps: execution.totalSteps,
      startedAt: execution.startedAt,
      completedAt: execution.completedAt,
      pausedAt: execution.pausedAt,
      estimatedDuration: execution.estimatedDuration,
      actualDuration: execution.actualDuration,
      environment: execution.environment,
      testConditions: execution.testConditions,
      overallStatus: execution.overallStatus,
      summary: execution.summary,
      recommendations: execution.recommendations,
      attachments: execution.attachments || [],
      passedSamples: execution.passedSamples,
      failedSamples: execution.failedSamples,
      completionPercentage: execution.completionPercentage,
      notes: execution.notes,
      tags: execution.tags || [],
      metadata: execution.metadata,
      samples: execution.samples?.map(this.mapSampleToData) || [],
      measurements: execution.measurements?.map(this.mapMeasurementToData) || [],
      exports: execution.exports?.map(this.mapExportToData) || []
    };
  }

  private mapSampleToData(sample: any): StudyExecutionSampleData {
    return {
      id: sample.id,
      executionId: sample.executionId,
      sampleNumber: sample.sampleNumber,
      name: sample.name,
      description: sample.description,
      material: sample.material,
      status: sample.status,
      progress: sample.progress,
      startedAt: sample.startedAt,
      completedAt: sample.completedAt,
      estimatedTime: sample.estimatedTime,
      actualTime: sample.actualTime,
      operatorId: sample.operatorId,
      operatorName: sample.operatorName,
      quality: sample.quality,
      anomalies: sample.anomalies || [],
      properties: sample.properties,
      conditions: sample.conditions,
      notes: sample.notes,
      tags: sample.tags || [],
      location: sample.location,
      batchNumber: sample.batchNumber,
      lotNumber: sample.lotNumber,
      measurements: sample.measurements?.map(this.mapMeasurementToData) || []
    };
  }

  private mapMeasurementToData(measurement: any): StudyMeasurementData {
    return {
      id: measurement.id,
      executionId: measurement.executionId,
      sampleId: measurement.sampleId,
      stepId: measurement.stepId,
      measurementId: measurement.measurementId,
      value: measurement.value,
      textValue: measurement.textValue,
      unit: measurement.unit,
      isValid: measurement.isValid,
      quality: measurement.quality,
      confidence: measurement.confidence,
      uncertainty: measurement.uncertainty,
      operator: measurement.operator,
      equipment: measurement.equipment,
      method: measurement.method,
      timestamp: measurement.timestamp,
      duration: measurement.duration,
      conditions: measurement.conditions,
      notes: measurement.notes,
      flags: measurement.flags || [],
      rawData: measurement.rawData,
      calculatedData: measurement.calculatedData,
      attachments: measurement.attachments || []
    };
  }

  private mapExportToData(exportRecord: any): StudyExportData {
    return {
      id: exportRecord.id,
      executionId: exportRecord.executionId,
      studyId: exportRecord.studyId,
      format: exportRecord.format,
      type: exportRecord.type,
      filename: exportRecord.filename,
      filepath: exportRecord.filepath,
      size: exportRecord.size,
      includeCharts: exportRecord.includeCharts,
      includeSamples: exportRecord.includeSamples,
      includeRawData: exportRecord.includeRawData,
      template: exportRecord.template,
      status: exportRecord.status,
      progress: exportRecord.progress,
      requestedAt: exportRecord.requestedAt,
      startedAt: exportRecord.startedAt,
      completedAt: exportRecord.completedAt,
      expiresAt: exportRecord.expiresAt,
      requestedById: exportRecord.requestedById,
      requestedBy: exportRecord.requestedBy,
      downloadCount: exportRecord.downloadCount,
      lastDownloadAt: exportRecord.lastDownloadAt,
      metadata: exportRecord.metadata,
      errors: exportRecord.errors || []
    };
  }

  /**
   * Generuje nazwę pliku eksportu
   */
  private generateExportFilename(format: any, type: any): string {
    const timestamp = new Date().toISOString().split('T')[0];
    const formatLower = format.toLowerCase();
    const typeLower = type.toLowerCase().replace(/_/g, '-');
    
    return `edith-${typeLower}-${timestamp}.${formatLower}`;
  }
}
