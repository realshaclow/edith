import express, { Router } from 'express';
import { body, param } from 'express-validator';
import { 
  getStudySessions,
  getSessionById,
  createStudySession,
  updateStudySession,
  deleteStudySession
} from '../controllers/sessionController';

const router: Router = express.Router();

// Walidatory
const createSessionValidation = [
  body('studyId')
    .notEmpty()
    .withMessage('ID badania jest wymagane'),
  body('data')
    .isObject()
    .withMessage('Dane muszą być obiektem'),
  body('operator')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Operator może mieć maksymalnie 100 znaków'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notatki mogą mieć maksymalnie 1000 znaków')
];

const updateSessionValidation = [
  param('id').isString().withMessage('ID musi być stringiem'),
  body('sessionName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Nazwa sesji musi mieć od 1 do 200 znaków'),
  body('status')
    .optional()
    .isIn(['PLANNED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED'])
    .withMessage('Nieprawidłowy status'),
  body('completedSteps')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Liczba ukończonych kroków musi być większa lub równa 0'),
  body('completedSamples')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Liczba ukończonych próbek musi być większa lub równa 0')
];

const getSessionValidation = [
  param('id').isString().withMessage('ID musi być stringiem')
];

// Routes
router.get('/studies/:studyId', getStudySessions);
router.get('/:id', getSessionValidation, getSessionById);
router.post('/studies/sessions', createSessionValidation, createStudySession);
router.put('/:id', updateSessionValidation, updateStudySession);
router.delete('/:id', getSessionValidation, deleteStudySession);

export default router;
