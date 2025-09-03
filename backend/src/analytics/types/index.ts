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
