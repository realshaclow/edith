import authApi from './authApi';
import axios from 'axios';

// Create separate instance for public endpoints
const publicApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

export interface SystemStats {
  activeUsers: number;
  totalProtocols: number;
  totalStudies: number;
  systemUptime: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: {
    SUPER_ADMIN: number;
    RESEARCHER: number;
    OPERATOR: number;
  };
  newUsersThisMonth: number;
  newUsersThisWeek: number;
}

export interface ProtocolStats {
  totalProtocols: number;
  activeProtocols: number;
  predefinedProtocols: number;
  customProtocols: number;
  protocolsByCategory: Record<string, number>;
  mostUsedProtocols: Array<{
    id: string;
    title: string;
    usageCount: number;
  }>;
}

export interface StudyStats {
  totalStudies: number;
  completedStudies: number;
  inProgressStudies: number;
  pendingStudies: number;
  studiesThisMonth: number;
  studiesThisWeek: number;
  avgStudyDuration: number;
}

export interface PerformanceStats {
  systemUptime: number;
  avgResponseTime: number;
  errorRate: number;
  apiCallsToday: number;
  peakUsageHours: Array<{
    hour: number;
    usage: number;
  }>;
}

export interface DashboardStats {
  system: SystemStats;
  users: UserStats;
  protocols: ProtocolStats;
  studies: StudyStats;
  performance: PerformanceStats;
}

export const analyticsApi = {
  // Pobierz wszystkie statystyki dashboard
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await authApi.get('/analytics/dashboard');
    return response.data.data;
  },

  // Pobierz statystyki systemu (publiczne)
  getSystemStats: async (): Promise<SystemStats> => {
    const response = await publicApi.get('/analytics/public/system');
    return response.data.data;
  },

  // Pobierz statystyki użytkowników
  getUserStats: async (): Promise<UserStats> => {
    const response = await authApi.get('/analytics/users');
    return response.data.data;
  },

  // Pobierz statystyki protokołów
  getProtocolStats: async (): Promise<ProtocolStats> => {
    const response = await authApi.get('/analytics/protocols');
    return response.data.data;
  },

  // Pobierz statystyki badań
  getStudyStats: async (): Promise<StudyStats> => {
    const response = await authApi.get('/analytics/studies');
    return response.data.data;
  },

  // Pobierz statystyki wydajności
  getPerformanceStats: async (): Promise<PerformanceStats> => {
    const response = await authApi.get('/analytics/performance');
    return response.data.data;
  }
};
