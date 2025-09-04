import { PrismaClient, Prisma, Study, StudySession, StudyResult } from '@prisma/client';

export class StudyRepository {
  constructor(private prisma: PrismaClient) {}

  // Study CRUD Operations
  async create(data: Prisma.StudyCreateInput): Promise<Study> {
    return this.prisma.study.create({
      data,
      include: {
        protocol: {
          select: {
            id: true,
            title: true,
            category: true
          }
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        sessions: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });
  }

  async findById(id: string): Promise<Study | null> {
    return this.prisma.study.findUnique({
      where: { id },
      include: {
        protocol: {
          select: {
            id: true,
            title: true,
            category: true,
            description: true
          }
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        sessions: true
      }
    });
  }

  async findMany(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    protocolId?: string;
    startDateFrom?: Date;
    startDateTo?: Date;
    createdBy?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ studies: Study[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      protocolId,
      startDateFrom,
      startDateTo,
      createdBy,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const skip = (page - 1) * limit;
    
    const where: Prisma.StudyWhereInput = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(status && { status: status as any }),
      ...(priority && { priority: priority as any }),
      ...(protocolId && { protocolId }),
      ...(startDateFrom && {
        startDate: {
          gte: startDateFrom
        }
      }),
      ...(startDateTo && {
        startDate: {
          lte: startDateTo
        }
      }),
      ...(createdBy && { createdBy })
    };

    const orderBy: Prisma.StudyOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    const [studies, total] = await Promise.all([
      this.prisma.study.findMany({
        where,
        include: {
          protocol: {
            select: {
              id: true,
              title: true,
              category: true
            }
          },
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true
            }
          },
          sessions: {
            select: {
              id: true,
              status: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      this.prisma.study.count({ where })
    ]);

    return { studies, total };
  }

  async update(id: string, data: Prisma.StudyUpdateInput): Promise<Study> {
    return this.prisma.study.update({
      where: { id },
      data,
      include: {
        protocol: {
          select: {
            id: true,
            title: true,
            category: true
          }
        },
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        sessions: {
          select: {
            id: true,
            status: true
          }
        }
      }
    });
  }

  async delete(id: string): Promise<Study> {
    return this.prisma.study.delete({
      where: { id }
    });
  }

  // Study Session Operations
  async createSession(studyId: string, sessionData: any): Promise<StudySession> {
    return this.prisma.studySession.create({
      data: {
        ...sessionData,
        studyId
      },
      include: {
        study: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async findSessionById(sessionId: string): Promise<StudySession | null> {
    return this.prisma.studySession.findUnique({
      where: { id: sessionId },
      include: {
        study: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async findSessions(studyId: string, params: {
    page?: number;
    limit?: number;
    status?: string;
    operatorId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ sessions: StudySession[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      status,
      operatorId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const skip = (page - 1) * limit;
    
    const where: Prisma.StudySessionWhereInput = {
      studyId,
      ...(status && { status: status as any }),
      ...(operatorId && { operatorId })
    };

    const orderBy: Prisma.StudySessionOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    const [sessions, total] = await Promise.all([
      this.prisma.studySession.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      this.prisma.studySession.count({ where })
    ]);

    return { sessions, total };
  }

  async updateSession(sessionId: string, data: Prisma.StudySessionUpdateInput): Promise<StudySession> {
    return this.prisma.studySession.update({
      where: { id: sessionId },
      data,
      include: {
        study: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async deleteSession(sessionId: string): Promise<StudySession> {
    return this.prisma.studySession.delete({
      where: { id: sessionId }
    });
  }

  // Study Result Operations
  async createResult(data: Prisma.StudyResultCreateInput): Promise<StudyResult> {
    return this.prisma.studyResult.create({
      data
    });
  }

  async findResults(studyId: string, params: {
    page?: number;
    limit?: number;
    sessionId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ results: StudyResult[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      sessionId,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = params;

    const skip = (page - 1) * limit;
    
    const where: Prisma.StudyResultWhereInput = {
      ...(sessionId && { sessionId })
    };

    const orderBy: Prisma.StudyResultOrderByWithRelationInput = {
      [sortBy]: sortOrder
    };

    const [results, total] = await Promise.all([
      this.prisma.studyResult.findMany({
        where,
        orderBy,
        skip,
        take: limit
      }),
      this.prisma.studyResult.count({ where })
    ]);

    return { results, total };
  }

  // Statistics
  async getStudyStats(userId?: string): Promise<any> {
    const whereClause = userId ? { createdBy: userId } : {};

    const [
      totalStudies,
      activeStudies,
      completedStudies,
      draftStudies,
      totalSessions
    ] = await Promise.all([
      this.prisma.study.count({ where: whereClause }),
      this.prisma.study.count({ where: { ...whereClause, status: 'ACTIVE' as any } }),
      this.prisma.study.count({ where: { ...whereClause, status: 'COMPLETED' as any } }),
      this.prisma.study.count({ where: { ...whereClause, status: 'DRAFT' as any } }),
      this.prisma.studySession.count({
        where: userId ? { study: { createdBy: userId } } : {}
      })
    ]);

    return {
      totalStudies,
      activeStudies,
      completedStudies,
      draftStudies,
      totalSessions
    };
  }
}
