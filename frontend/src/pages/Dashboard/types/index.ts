export interface DashboardStats {
  totalStudies: number;
  activeStudies: number;
  completedStudies: number;
  totalProtocols: number;
  totalSamples: number;
  successRate: number;
  avgExecutionTime: number;
  recentActivity: number;
}

export interface StudyProgress {
  id: string;
  name: string;
  protocol: string;
  progress: number;
  status: 'active' | 'paused' | 'completed' | 'failed';
  startDate: string;
  estimatedCompletion?: string;
  operator: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface ProtocolUsage {
  id: string;
  name: string;
  category: string;
  usageCount: number;
  successRate: number;
  avgDuration: number;
  lastUsed: string;
}

export interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionable?: boolean;
  actionUrl?: string;
}

export interface PerformanceMetric {
  date: string;
  studiesCompleted: number;
  successRate: number;
  avgDuration: number;
  efficiency: number;
}

export interface RecentActivity {
  id: string;
  type: 'study_created' | 'study_completed' | 'protocol_added' | 'error_occurred' | 'report_generated';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  metadata?: Record<string, any>;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: () => void;
  disabled?: boolean;
  badge?: string;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'stats' | 'list' | 'table' | 'custom';
  size: 'small' | 'medium' | 'large' | 'full';
  position: { x: number; y: number };
  data?: any;
  config?: Record<string, any>;
  visible: boolean;
  refreshInterval?: number;
}
