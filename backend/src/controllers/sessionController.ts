import { Response, NextFunction, Request } from 'express';
import { ApiResponse, CreateStudySessionFromFrontendDto } from '../types';

/**
 * Create a new study session
 */
export const createStudySession = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const prisma = (req as any).prisma;
    const sessionData: CreateStudySessionFromFrontendDto = req.body;

    // Create session with results
    const session = await prisma.studySession.create({
      data: {
        studyId: sessionData.studyId,
        sessionName: `Session ${new Date().toISOString().split('T')[0]}`,
        status: 'COMPLETED',
        operatorId: 'temp-user-id', // Using existing temp user
        totalSteps: 1,
        totalSamples: 1,
        completedSteps: 1,
        completedSamples: 1,
        notes: sessionData.notes || '',
        startedAt: new Date(),
        completedAt: new Date()
      },
      include: {
        study: {
          select: { name: true, protocolId: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get session by ID
 */
export const getSessionById = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const prisma = (req as any).prisma;
    const sessionId = req.params.id;

    const session = await prisma.studySession.findUnique({
      where: { id: sessionId },
      include: {
        study: {
          select: { name: true, protocolId: true, description: true }
        }
      }
    });

    if (!session) {
      res.status(404).json({
        success: false,
        message: 'Session not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Get all sessions for a study
 */
export const getStudySessions = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const prisma = (req as any).prisma;
    const studyId = req.params.studyId;

    const sessions = await prisma.studySession.findMany({
      where: { studyId: studyId },
      include: {
        study: {
          select: { name: true, protocolId: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Error fetching study sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Update session
 */
export const updateStudySession = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const prisma = (req as any).prisma;
    const sessionId = req.params.id;
    const updateData = req.body;

    const session = await prisma.studySession.update({
      where: { id: sessionId },
      data: updateData,
      include: {
        study: {
          select: { name: true, protocolId: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

/**
 * Delete session
 */
export const deleteStudySession = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const prisma = (req as any).prisma;
    const sessionId = req.params.id;

    await prisma.studySession.delete({
      where: { id: sessionId }
    });

    res.status(200).json({
      success: true,
      message: 'Session deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
