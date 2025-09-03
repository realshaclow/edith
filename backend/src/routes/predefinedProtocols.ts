import express from 'express';
import { param } from 'express-validator';
import { 
  getPredefinedProtocols, 
  getPredefinedProtocolById, 
  getProtocolCategoriesController 
} from '../controllers/predefinedProtocolsController';

const router = express.Router();

// Walidatory
const getProtocolByIdValidation = [
  param('id').isString().notEmpty().withMessage('ID protokołu jest wymagane')
];

// Routes
router.get('/', getPredefinedProtocols);
router.get('/categories', getProtocolCategoriesController);
router.get('/:id', getProtocolByIdValidation, getPredefinedProtocolById);

export default router;
