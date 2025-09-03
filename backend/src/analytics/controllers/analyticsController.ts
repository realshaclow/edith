import { Request, Response } from 'express';
import { analyticsService } from '../services/analyticsService';

export class AnalyticsController {
  // GET /api/analytics/dashboard
  async getDashboardStats(req: Request, res: Response) {
    try {
      const stats = await analyticsService.getDashboardStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch dashboard statistics'
      });
    }
  }

  // GET /api/analytics/system
  async getSystemStats(req: Request, res: Response) {
    try {
      const stats = await analyticsService.getSystemStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch system statistics'
      });
    }
  }

  // GET /api/analytics/users
  async getUserStats(req: Request, res: Response) {
    try {
      const stats = await analyticsService.getUserStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch user statistics'
      });
    }
  }

  // GET /api/analytics/protocols
  async getProtocolStats(req: Request, res: Response) {
    try {
      const stats = await analyticsService.getProtocolStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching protocol stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch protocol statistics'
      });
    }
  }

  // GET /api/analytics/studies
  async getStudyStats(req: Request, res: Response) {
    try {
      const stats = await analyticsService.getStudyStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching study stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch study statistics'
      });
    }
  }

  // GET /api/analytics/performance
  async getPerformanceStats(req: Request, res: Response) {
    try {
      const stats = await analyticsService.getPerformanceStats();
      
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Error fetching performance stats:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch performance statistics'
      });
    }
  }
}

export const analyticsController = new AnalyticsController();
