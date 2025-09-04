/**
 * EDITH Study Execution Module
 * 
 * Kompletny system do zarządzania wykonywaniem badań materiałowych
 * z integracją z bazą danych i systemem eksportów.
 * 
 * Struktura modułu:
 * - types/ - Definicje TypeScript i interfejsy
 * - repositories/ - Warstwa dostępu do danych (Prisma)
 * - services/ - Logika biznesowa i walidacja
 * - controllers/ - Kontrolery Express.js
 * - middleware/ - Middleware do walidacji i autoryzacji
 * - routes/ - Definicje tras API
 * - utils/ - Narzędzia pomocnicze i obsługa błędów
 */

// Eksport typów
export * from './types';

// Eksport warstwy danych
export { StudyExecutionRepository } from './repositories/StudyExecutionRepository';

// Eksport logiki biznesowej
export { StudyExecutionService } from './services/StudyExecutionService';

// Eksport kontrolerów
export { StudyExecutionController } from './controllers/StudyExecutionController';

// Eksport middleware
export * from './middleware/validationMiddleware';

// Eksport tras
export { studyExecutionRouter } from './routes';

// Eksport narzędzi
export * from './utils';

// Eksport głównych instancji (dla łatwej integracji)
export { prisma, repository, service, controller } from './routes';
