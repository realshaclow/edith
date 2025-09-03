import { Response, NextFunction, Request } from 'express';
import { CreateStudyDto, UpdateStudyDto, ApiResponse } from '../types';
import { getProtocolById } from '../data/research-protocols';

/**
 * Pobierz wszystkie badania
 */
export const getStudies = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const prisma = (req as any).prisma;
    const studies = await prisma.study.findMany({
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        sessions: {
          select: { id: true, sessionName: true, status: true, createdAt: true }
        },
        _count: {
          select: { sessions: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: studies
    });
  } catch (error) {
    console.error('Error fetching studies:', error);
    next(error);
  }
};

/**
 * Pobierz badanie po ID
 */
export const getStudyById = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const prisma = (req as any).prisma;
    
    const study = await prisma.study.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        },
        sessions: {
          include: {
            operator: {
              select: { id: true, firstName: true, lastName: true, email: true }
            },
            samples: {
              select: { id: true, sampleName: true, status: true }
            },
            _count: {
              select: { results: true }
            }
          }
        },
        dataCollectionPlan: {
          include: {
            dataPoints: true,
            requiredConditions: true
          },
          orderBy: { stepNumber: 'asc' }
        }
      }
    });

    if (!study) {
      res.status(404).json({
        success: false,
        error: 'Study not found'
      });
      return;
    }

    // Dodaj informacje o protokole jeśli to predefiniowany protokół
    let protocolData = null;
    if (study.protocolId) {
      protocolData = getProtocolById(study.protocolId);
    }

    res.status(200).json({
      success: true,
      data: {
        ...study,
        protocol: protocolData
      }
    });
  } catch (error) {
    console.error('Error fetching study:', error);
    next(error);
  }
};

/**
 * Utwórz nowe badanie
 */
export const createStudy = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const data: CreateStudyDto = req.body;
    const prisma = (req as any).prisma;

    console.log('POST /api/studies - Request body:', data);

    // Sprawdź/stwórz dummy user dla development
    let userId = 'temp-user-id';
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      const dummyUser = await prisma.user.create({
        data: {
          id: userId,
          email: 'temp@example.com',
          username: 'tempuser',
          passwordHash: 'dummy',
          firstName: 'Temp',
          lastName: 'User'
        }
      });
      console.log('Created dummy user:', dummyUser.id);
    }

    let protocol: any = null;
    let isPredefindedProtocol = false;

    // Sprawdź czy to predefiniowany protokół (z plików TS)
    if (data.protocolId) {
      protocol = getProtocolById(data.protocolId);
      if (protocol) {
        isPredefindedProtocol = true;
        console.log('Using predefiniend protocol:', protocol.title);
      } else {
        // Sprawdź w bazie danych
        const dbProtocol = await prisma.protocol.findUnique({
          where: { id: data.protocolId }
        });
        if (dbProtocol) {
          protocol = dbProtocol;
          console.log('Using database protocol:', dbProtocol.title);
        } else {
          res.status(400).json({
            success: false,
            error: 'Protocol not found'
          });
          return;
        }
      }
    } else {
      res.status(400).json({
        success: false,
        error: 'Protocol ID is required'
      });
      return;
    }

    // Przygotuj dane
    const studyData = {
      name: data.name,
      description: data.description,
      protocolId: data.protocolId, // Zawsze zapisz rzeczywisty protocolId
      protocolName: data.protocolName || protocol.title,
      category: data.category || protocol.category,
      settings: data.settings || {},
      parameters: data.parameters || [],
      createdBy: userId
    };

    console.log('Extracted data:', studyData);

    // Utwórz badanie w transakcji
    const study = await prisma.$transaction(async (tx: any) => {
      const newStudy = await tx.study.create({
        data: studyData
      });

      console.log('Created study:', newStudy);

      // Utwórz plan zbierania danych na podstawie kroków protokołu
      if (protocol.steps && protocol.steps.length > 0) {
        await Promise.all(protocol.steps.map((step: any, index: number) => 
          tx.studyDataCollectionStep.create({
            data: {
              studyId: newStudy.id,
              stepNumber: index + 1,
              protocolStepId: step.id,
              stepName: step.title,
              description: step.description,
              estimatedDuration: step.duration,
              isRequired: true,
              executionNotes: step.instructions?.join('\n') || ''
            }
          })
        ));
      }

      return newStudy;
    });

    res.status(201).json({
      success: true,
      data: study,
      message: 'Study created successfully'
    });
  } catch (error) {
    console.error('Error creating study:', error);
    next(error);
  }
};

/**
 * Zaktualizuj badanie
 */
export const updateStudy = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const data: UpdateStudyDto = req.body;
    const userId = 'temp-user-id'; // TODO: Pobierz z middleware auth
    const prisma = (req as any).prisma;

    // Sprawdź czy badanie istnieje i czy user ma uprawnienia
    const existingStudy = await prisma.study.findUnique({
      where: { id },
      select: { createdBy: true }
    });

    if (!existingStudy) {
      res.status(404).json({
        success: false,
        error: 'Study not found'
      });
      return;
    }

    if (existingStudy.createdBy !== userId) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    // Aktualizuj badanie
    const updatedStudy = await prisma.study.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        status: data.status,
        settings: data.settings,
        parameters: data.parameters
      },
      include: {
        creator: {
          select: { id: true, firstName: true, lastName: true, email: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: updatedStudy,
      message: 'Study updated successfully'
    });
  } catch (error) {
    console.error('Error updating study:', error);
    next(error);
  }
};

/**
 * Usuń badanie
 */
export const deleteStudy = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = 'temp-user-id'; // TODO: Pobierz z middleware auth
    const prisma = (req as any).prisma;

    // Sprawdź czy badanie istnieje i czy user ma uprawnienia
    const existingStudy = await prisma.study.findUnique({
      where: { id },
      select: { createdBy: true }
    });

    if (!existingStudy) {
      res.status(404).json({
        success: false,
        error: 'Study not found'
      });
      return;
    }

    if (existingStudy.createdBy !== userId) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
      return;
    }

    // Usuń badanie (kaskadowo usuną się powiązane dane)
    await prisma.study.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Study deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting study:', error);
    next(error);
  }
};
