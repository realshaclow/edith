import { PrismaClient } from '@prisma/client';
import { 
  SystemStats, 
  UserStats, 
  ProtocolStats, 
  StudyStats, 
  PerformanceStats,
  DashboardStats 
} from '../types';

const prisma = new PrismaClient();

export class AnalyticsService {
  // Pobierz statystyki użytkowników
  async getUserStats(): Promise<UserStats> {
    const totalUsers = await prisma.user.count();
    
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
      where: { isActive: true }
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: { gte: oneMonthAgo }
      }
    });

    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: { gte: oneWeekAgo }
      }
    });

    const roleStats = {
      SUPER_ADMIN: 0,
      RESEARCHER: 0,
      OPERATOR: 0
    };

    usersByRole.forEach(role => {
      if (role.role in roleStats) {
        roleStats[role.role as keyof typeof roleStats] = role._count.role;
      }
    });

    return {
      totalUsers,
      activeUsers,
      usersByRole: roleStats,
      newUsersThisMonth,
      newUsersThisWeek
    };
  }

  // Pobierz statystyki protokołów
  async getProtocolStats(): Promise<ProtocolStats> {
    const totalProtocols = await prisma.protocol.count();
    
    const activeProtocols = await prisma.protocol.count({
      where: { isActive: true }
    });

    const predefinedProtocols = await prisma.protocol.count({
      where: { type: 'PREDEFINED' }
    });

    const customProtocols = await prisma.protocol.count({
      where: { type: 'USER' }
    });

    const protocolsByCategory = await prisma.protocol.groupBy({
      by: ['category'],
      _count: { category: true },
      where: { isActive: true }
    });

    const categoryStats: Record<string, number> = {};
    protocolsByCategory.forEach(cat => {
      categoryStats[cat.category] = cat._count.category;
    });

    // Najpopularniejsze protokoły (na razie mockowe, bo nie mamy jeszcze tabeli użycia)
    const mostUsedProtocols = await prisma.protocol.findMany({
      select: {
        id: true,
        title: true
      },
      where: { isActive: true },
      take: 5
    });

    return {
      totalProtocols,
      activeProtocols,
      predefinedProtocols,
      customProtocols,
      protocolsByCategory: categoryStats,
      mostUsedProtocols: mostUsedProtocols.map(p => ({
        ...p,
        usageCount: Math.floor(Math.random() * 100) + 1 // Mock data
      }))
    };
  }

  // Pobierz statystyki badań
  async getStudyStats(): Promise<StudyStats> {
    const totalStudies = await prisma.study.count();

    const completedStudies = await prisma.study.count({
      where: { status: 'ARCHIVED' }
    });

    const inProgressStudies = await prisma.study.count({
      where: { status: 'ACTIVE' }
    });

    const pendingStudies = await prisma.study.count({
      where: { status: 'DRAFT' }
    });

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const studiesThisMonth = await prisma.study.count({
      where: {
        createdAt: { gte: oneMonthAgo }
      }
    });

    const studiesThisWeek = await prisma.study.count({
      where: {
        createdAt: { gte: oneWeekAgo }
      }
    });

    return {
      totalStudies,
      completedStudies,
      inProgressStudies,
      pendingStudies,
      studiesThisMonth,
      studiesThisWeek,
      avgStudyDuration: 45 // Mock data - would need actual calculation
    };
  }

  // Pobierz statystyki wydajności
  async getPerformanceStats(): Promise<PerformanceStats> {
    const startTime = process.uptime();
    
    return {
      systemUptime: Math.floor(startTime / 3600), // w godzinach
      avgResponseTime: 150, // Mock data
      errorRate: 0.1, // Mock data
      apiCallsToday: 1234, // Mock data
      peakUsageHours: [
        { hour: 9, usage: 80 },
        { hour: 10, usage: 95 },
        { hour: 11, usage: 85 },
        { hour: 14, usage: 90 },
        { hour: 15, usage: 75 }
      ]
    };
  }

  // Pobierz podstawowe statystyki systemu
  async getSystemStats(): Promise<SystemStats> {
    const activeUsers = await prisma.user.count({
      where: { isActive: true }
    });

    const totalProtocols = await prisma.protocol.count({
      where: { isActive: true }
    });

    const totalStudies = await prisma.study.count();

    const systemUptime = Math.floor(process.uptime() / 3600);

    return {
      activeUsers,
      totalProtocols,
      totalStudies,
      systemUptime
    };
  }

  // Pobierz wszystkie statystyki dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    const [system, users, protocols, studies, performance] = await Promise.all([
      this.getSystemStats(),
      this.getUserStats(),
      this.getProtocolStats(),
      this.getStudyStats(),
      this.getPerformanceStats()
    ]);

    return {
      system,
      users,
      protocols,
      studies,
      performance
    };
  }
}

export const analyticsService = new AnalyticsService();
