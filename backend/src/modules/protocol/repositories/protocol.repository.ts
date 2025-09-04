import { PrismaClient } from '@prisma/client';
import { 
  CreateProtocolDto, 
  UpdateProtocolDto, 
  ProtocolResponseDto,
  ProtocolListItemDto,
  ProtocolQueryDto,
  ProtocolStatsDto
} from '../dto';

export class ProtocolRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateProtocolDto, userId: string): Promise<ProtocolResponseDto> {
    const protocol = await this.prisma.protocol.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category as any,
        difficulty: data.difficulty as any,
        estimatedDuration: data.estimatedDuration,
        overview: data.overview as any,
        equipment: data.equipment as any,
        materials: data.materials as any,
        safetyGuidelines: data.safetyGuidelines as any,
        references: data.references as any,
        notes: data.notes as any,
        isPublic: data.isPublic || false,
        createdBy: userId
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        steps: {
          orderBy: { stepNumber: 'asc' }
        },
        testConditions: true,
        calculations: true,
        typicalValues: true,
        commonIssues: true
      }
    });

    return this.mapToResponseDto(protocol);
  }

  async findById(id: string): Promise<ProtocolResponseDto | null> {
    const protocol = await this.prisma.protocol.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        steps: {
          orderBy: { stepNumber: 'asc' }
        },
        testConditions: true,
        calculations: true,
        typicalValues: true,
        commonIssues: true
      }
    });

    return protocol ? this.mapToResponseDto(protocol) : null;
  }

  async findMany(query: ProtocolQueryDto): Promise<{
    data: ProtocolListItemDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      category,
      difficulty,
      search,
      isPublic,
      createdBy,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const where: any = {
      isActive: true
    };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (isPublic !== undefined) where.isPublic = isPublic;
    if (createdBy) where.createdBy = createdBy;
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [protocols, total] = await Promise.all([
      this.prisma.protocol.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              steps: true,
              testConditions: true,
              calculations: true
            }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit
      }),
      this.prisma.protocol.count({ where })
    ]);

    return {
      data: protocols.map(p => this.mapToListItemDto(p)),
      total,
      page,
      limit
    };
  }

  async update(id: string, data: UpdateProtocolDto): Promise<ProtocolResponseDto | null> {
    const protocol = await this.prisma.protocol.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category as any,
        difficulty: data.difficulty as any,
        estimatedDuration: data.estimatedDuration,
        overview: data.overview as any,
        equipment: data.equipment as any,
        materials: data.materials as any,
        safetyGuidelines: data.safetyGuidelines as any,
        references: data.references as any,
        notes: data.notes as any,
        isPublic: data.isPublic,
        isActive: data.isActive
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        steps: {
          orderBy: { stepNumber: 'asc' }
        },
        testConditions: true,
        calculations: true,
        typicalValues: true,
        commonIssues: true
      }
    });

    return this.mapToResponseDto(protocol);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.protocol.delete({
        where: { id }
      });
      return true;
    } catch {
      return false;
    }
  }

  async getStats(): Promise<ProtocolStatsDto> {
    const total = await this.prisma.protocol.count({ 
      where: { isActive: true } 
    });

    const predefined = await this.prisma.protocol.count({ 
      where: { isActive: true, type: 'PREDEFINED' }
    });

    const userCreated = await this.prisma.protocol.count({ 
      where: { isActive: true, type: 'USER' }
    });

    const publicCount = await this.prisma.protocol.count({ 
      where: { isActive: true, isPublic: true }
    });

    const privateCount = await this.prisma.protocol.count({ 
      where: { isActive: true, isPublic: false }
    });

    return {
      total,
      byCategory: {} as any,
      byDifficulty: {} as any,
      byType: {} as any,
      predefined,
      userCreated,
      public: publicCount,
      private: privateCount
    };
  }

  private mapToResponseDto(protocol: any): ProtocolResponseDto {
    return {
      id: protocol.id,
      title: protocol.title,
      description: protocol.description,
      category: protocol.category,
      type: protocol.type,
      version: protocol.version,
      difficulty: protocol.difficulty,
      estimatedDuration: protocol.estimatedDuration,
      overview: protocol.overview,
      equipment: protocol.equipment,
      materials: protocol.materials,
      safetyGuidelines: protocol.safetyGuidelines,
      references: protocol.references,
      notes: protocol.notes,
      steps: protocol.steps?.map((step: any) => ({
        id: step.id,
        stepNumber: step.stepNumber,
        title: step.title,
        description: step.description,
        duration: step.duration,
        instructions: step.instructions,
        tips: step.tips,
        safety: step.safety,
        isRequired: step.isRequired
      })),
      testConditions: protocol.testConditions?.map((condition: any) => ({
        id: condition.id,
        name: condition.name,
        value: condition.value,
        unit: condition.unit,
        tolerance: condition.tolerance,
        category: condition.category,
        required: condition.required,
        description: condition.description
      })),
      calculations: protocol.calculations?.map((calc: any) => ({
        id: calc.id,
        name: calc.name,
        description: calc.description,
        formula: calc.formula,
        variables: calc.variables,
        unit: calc.unit,
        category: calc.category,
        isRequired: calc.isRequired,
        example: calc.example,
        notes: calc.notes
      })),
      acceptanceCriteria: [],
      typicalValues: protocol.typicalValues?.map((value: any) => ({
        id: value.id,
        parameter: value.parameter,
        material: value.material,
        value: value.value,
        unit: value.unit,
        minRange: value.minRange,
        maxRange: value.maxRange,
        conditions: value.conditions,
        category: value.category,
        source: value.source,
        isReference: value.isReference,
        notes: value.notes
      })),
      commonIssues: protocol.commonIssues?.map((issue: any) => ({
        id: issue.id,
        issue: issue.issue,
        cause: issue.cause,
        solution: issue.solution,
        severity: issue.severity,
        frequency: issue.frequency
      })),
      isPublic: protocol.isPublic,
      isActive: protocol.isActive,
      isPredefined: protocol.type === 'PREDEFINED',
      createdAt: protocol.createdAt,
      updatedAt: protocol.updatedAt,
      createdBy: protocol.createdBy,
      creator: protocol.creator
    };
  }

  private mapToListItemDto(protocol: any): ProtocolListItemDto {
    return {
      id: protocol.id,
      title: protocol.title,
      description: protocol.description,
      category: protocol.category,
      type: protocol.type,
      difficulty: protocol.difficulty,
      estimatedDuration: protocol.estimatedDuration,
      isPublic: protocol.isPublic,
      isPredefined: protocol.type === 'PREDEFINED',
      createdAt: protocol.createdAt,
      updatedAt: protocol.updatedAt,
      createdBy: protocol.createdBy,
      creator: protocol.creator,
      _count: protocol._count
    };
  }
}
