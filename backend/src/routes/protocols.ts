import express from 'express';
import { body, param } from 'express-validator';
import { 
  getProtocols, 
  getProtocolByIdController, 
  getProtocolsByCategory,
  getProtocolCategoriesController,
  createProtocol,
  updateProtocol,
  deleteProtocol
} from '../controllers/protocolController';

const router = express.Router();

// Walidatory
const createProtocolValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Tytuł musi mieć od 1 do 200 znaków'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Opis może mieć maksymalnie 1000 znaków'),
  body('category')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Kategoria jest wymagana'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'intermediate', 'advanced'])
    .withMessage('Nieprawidłowy poziom trudności')
];

const updateProtocolValidation = [
  param('id').isString().withMessage('ID musi być stringiem'),
  ...createProtocolValidation.map(validator => validator.optional())
];

const getProtocolValidation = [
  param('id').isString().withMessage('ID musi być stringiem')
];

const getCategoryValidation = [
  param('category').isString().withMessage('Kategoria musi być stringiem')
];

// Routes
router.get('/', getProtocols);
router.get('/categories', getProtocolCategoriesController);
router.get('/category/:category', getCategoryValidation, getProtocolsByCategory);
router.get('/:id', getProtocolValidation, getProtocolByIdController);
router.post('/', createProtocolValidation, createProtocol);
router.put('/:id', updateProtocolValidation, updateProtocol);
router.delete('/:id', getProtocolValidation, deleteProtocol);

export default router;
