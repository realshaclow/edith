/**
 * Przykład integracji modułu study-execution z głównym serwerem Express
 * 
 * Ten plik pokazuje jak zintegrować nowy moduł z istniejącym backendem
 */

import express from 'express';
import cors from 'cors';
import { studyExecutionRouter } from './study-execution';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing - dodanie nowego modułu
app.use('/api', studyExecutionRouter);

// Podstawowe trasy
app.get('/', (req, res) => {
  res.json({
    message: 'EDITH Backend API',
    version: '1.0.0',
    modules: ['study-execution'],
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    modules: {
      'study-execution': 'active'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 EDITH Backend server running on port ${PORT}`);
    console.log(`📊 Study Execution API available at http://localhost:${PORT}/api/study-executions`);
    console.log(`🏥 Health check at http://localhost:${PORT}/health`);
  });
}

export default app;
