import { Response, NextFunction, Request } from 'express';
import { ApiResponse } from '../types';
import { ResearchProtocols, getProtocolById, getAllProtocols, getProtocolCategories } from '../data/research-protocols';

/**
 * Pobierz wszystkie predefiniowane protokoły
 */
export const getPredefinedProtocols = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const protocols = getAllProtocols();
    
    res.status(200).json({
      success: true,
      data: protocols
    });
  } catch (error) {
    console.error('Error fetching predefined protocols:', error);
    next(error);
  }
};

/**
 * Pobierz predefiniowany protokół po ID
 */
export const getPredefinedProtocolById = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const protocol = getProtocolById(id);
    
    if (!protocol) {
      res.status(404).json({
        success: false,
        error: 'Protocol not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: protocol
    });
  } catch (error) {
    console.error('Error fetching predefined protocol:', error);
    next(error);
  }
};

/**
 * Pobierz kategorie predefiniowanych protokołów
 */
export const getProtocolCategoriesController = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const categories = getProtocolCategories();
    
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching protocol categories:', error);
    next(error);
  }
};
