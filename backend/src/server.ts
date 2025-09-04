import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { PrismaClient } from '@prisma/client';

// Import routes
import { studyRoutes } from './modules/study';
import analyticsRoutes from './analytics/routes';
import { createAuthRoutes } from './auth';
import { createProtocolRoutes } from './modules/protocol';
import { studyExecutionRouter } from './study-execution/routes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize Passport
app.use(passport.initialize());
// Note: We don't use passport.session() because we're using JWT tokens

// Make Prisma available in req object
app.use((req: Request, res: Response, next: NextFunction) => {
  (req as any).prisma = prisma;
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Edith Research API'
  });
});

// Public endpoint for operators list (for study creation)
app.get('/api/public/operators', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        isVerified: true
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        title: true,
        department: true,
        position: true
      },
      orderBy: [
        { firstName: 'asc' },
        { lastName: 'asc' }
      ],
      take: 50 // Limit to reasonable number
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching operators:', error);
    res.status(500).json({
      success: false,
      error: 'Błąd podczas pobierania listy operatorów'
    });
  }
});

// API Routes
app.use('/api/auth', createAuthRoutes(prisma));
app.use('/api/analytics', analyticsRoutes);
app.use('/api/studies', studyRoutes);
app.use('/api/protocols', createProtocolRoutes(prisma)); // New protocol module
app.use('/api', studyExecutionRouter); // Study execution routes

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  });
});

const PORT = process.env.PORT || 5000;

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Analytics: http://localhost:${PORT}/api/analytics/public/system`);
});

export default app;
