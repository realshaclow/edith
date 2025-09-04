import { StudyRepository } from '../repositories/study.repository';
import { 
  CreateStudyDto, 
  UpdateStudyDto, 
  StudyResponseDto, 
  StudyListResponseDto,
  CreateStudySessionDto,
  UpdateStudySessionDto,
  StudySessionResponseDto,
  StudyStatsDto
} from '../dto/study.dto';
import { StudyPriority } from '../types/study.types';
import { Prisma } from '@prisma/client';

export class StudyService {
  constructor(private studyRepository: StudyRepository) {}

  // Study Management
  async createStudy(data: CreateStudyDto, createdBy: string): Promise<StudyResponseDto> {
    const studyData: Prisma.StudyCreateInput = {
      name: data.title,
      description: data.description,
      protocolName: 'Custom Protocol', // We'll get this from protocol relation later
      status: 'DRAFT',
      settings: JSON.stringify(data.settings || {}),
      isTemplate: data.isTemplate || false,
      creator: {
        connect: { id: createdBy }
      },
      // Add protocol connection if protocolId provided
      ...(data.protocolId && {
        protocol: {
          connect: { id: data.protocolId }
        }
      })
    };

    const study = await this.studyRepository.create(studyData);
    return this.mapToStudyResponse(study);
  }

  async getStudyById(id: string): Promise<StudyResponseDto | null> {
    const study = await this.studyRepository.findById(id);
    if (!study) return null;
    return this.mapToStudyResponse(study);
  }

  async getStudies(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    protocolId?: string;
    startDateFrom?: string;
    startDateTo?: string;
    createdBy?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ studies: StudyListResponseDto[]; total: number; page: number; limit: number }> {
    // Convert string dates to Date objects for repository
    const repositoryParams = {
      ...params,
      startDateFrom: params.startDateFrom ? new Date(params.startDateFrom) : undefined,
      startDateTo: params.startDateTo ? new Date(params.startDateTo) : undefined
    };

    const { studies, total } = await this.studyRepository.findMany(repositoryParams);

    return {
      studies: studies.map(this.mapToStudyListResponse),
      total,
      page: params.page || 1,
      limit: params.limit || 10
    };
  }

  async updateStudy(id: string, data: UpdateStudyDto): Promise<StudyResponseDto> {
    const updateData: Prisma.StudyUpdateInput = {
      ...(data.title && { name: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.status && { status: data.status as any }),
      updatedAt: new Date()
    };

    const study = await this.studyRepository.update(id, updateData);
    return this.mapToStudyResponse(study);
  }

  async deleteStudy(id: string): Promise<void> {
    await this.studyRepository.delete(id);
  }

  // Study Session Management
  async createSession(studyId: string, data: CreateStudySessionDto): Promise<StudySessionResponseDto> {
    const sessionData = {
      sessionName: data.sessionName,
      description: `Session for ${data.sessionName}`,
      operatorId: data.operatorId,
      status: 'PLANNED',
      notes: data.notes
    };

    const session = await this.studyRepository.createSession(studyId, sessionData);
    return this.mapToSessionResponse(session);
  }

  async getSessionById(sessionId: string): Promise<StudySessionResponseDto | null> {
    const session = await this.studyRepository.findSessionById(sessionId);
    if (!session) return null;
    return this.mapToSessionResponse(session);
  }

  async getStudySessions(studyId: string, params: {
    page?: number;
    limit?: number;
    status?: string;
    operatorId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ sessions: StudySessionResponseDto[]; total: number; page: number; limit: number }> {
    const { sessions, total } = await this.studyRepository.findSessions(studyId, params);

    return {
      sessions: sessions.map(this.mapToSessionResponse),
      total,
      page: params.page || 1,
      limit: params.limit || 10
    };
  }

  async updateSession(sessionId: string, data: UpdateStudySessionDto): Promise<StudySessionResponseDto> {
    const updateData: Prisma.StudySessionUpdateInput = {
      ...(data.sessionName && { sessionName: data.sessionName }),
      ...(data.status && { status: data.status as any }),
      ...(data.notes !== undefined && { notes: data.notes }),
      updatedAt: new Date()
    };

    const session = await this.studyRepository.updateSession(sessionId, updateData);
    return this.mapToSessionResponse(session);
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.studyRepository.deleteSession(sessionId);
  }

  // Statistics and Analytics
  async getStudyStats(userId?: string): Promise<StudyStatsDto> {
    const stats = await this.studyRepository.getStudyStats(userId);
    
    return {
      totalStudies: stats.totalStudies,
      activeStudies: stats.activeStudies,
      completedStudies: stats.completedStudies,
      draftStudies: stats.draftStudies,
      averageCompletionTime: 0,
      totalSessions: stats.totalSessions,
      completedSessions: 0,
      totalSamples: 0,
      processingTime: Date.now()
    };
  }

  // Utility Methods
  private mapToStudyResponse(study: any): StudyResponseDto {
    return {
      id: study.id,
      title: study.name,
      description: study.description,
      protocolId: study.protocolId,
      protocolName: study.protocol?.title || study.protocolName,
      status: study.status,
      priority: StudyPriority.MEDIUM,
      tags: [],
      createdAt: study.createdAt.toISOString(),
      updatedAt: study.updatedAt.toISOString(),
      startDate: study.startDate?.toISOString(),
      endDate: study.endDate?.toISOString(),
      expectedEndDate: undefined,
      createdBy: study.createdBy,
      modifiedBy: undefined,
      settings: study.settings || {},
      dataCollectionSteps: [],
      studyParameters: [],
      teamMembers: [],
      sessionsCount: study.sessions?.length || 0,
      completedSessionsCount: 0,
      samplesCount: 0,
      estimatedDuration: study.estimatedDuration,
      actualDuration: study.actualDuration,
      notes: study.description,
      version: 1,
      isTemplate: study.isTemplate,
      templateId: undefined
    };
  }

  private mapToStudyListResponse(study: any): StudyListResponseDto {
    return {
      id: study.id,
      title: study.name,
      description: study.description,
      protocolName: study.protocol?.title || study.protocolName,
      status: study.status,
      priority: StudyPriority.MEDIUM,
      tags: [],
      createdAt: study.createdAt.toISOString(),
      startDate: study.startDate?.toISOString(),
      endDate: study.endDate?.toISOString(),
      createdBy: study.createdBy,
      sessionsCount: study.sessions?.length || 0,
      completedSessionsCount: 0,
      samplesCount: 0,
      teamMembersCount: 0,
      estimatedDuration: study.estimatedDuration
    };
  }

  private mapToSessionResponse(session: any): StudySessionResponseDto {
    return {
      id: session.id,
      studyId: session.studyId,
      sessionName: session.sessionName || 'Session',
      status: session.status,
      startTime: session.startTime?.toISOString(),
      endTime: session.endTime?.toISOString(),
      duration: session.actualDuration,
      operatorId: session.operatorId,
      operatorName: session.operator,
      sampleId: undefined,
      sampleName: undefined,
      conditions: {},
      data: [],
      calculations: {},
      qualityCheck: {},
      notes: session.notes,
      completedSteps: 0,
      totalSteps: 0,
      progress: 0,
      createdAt: session.createdAt.toISOString(),
      updatedAt: session.updatedAt.toISOString()
    };
  }
}