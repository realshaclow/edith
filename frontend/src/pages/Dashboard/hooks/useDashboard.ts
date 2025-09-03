import { useState, useEffect, useCallback } from 'react';
import { 
  DashboardStats, 
  StudyProgress, 
  ProtocolUsage, 
  SystemAlert, 
  PerformanceMetric, 
  RecentActivity 
} from '../types';
import { studiesApi, protocolsApi } from '../../../services/api';
import { StudyStatus } from '../../../types';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudies: 0,
    activeStudies: 0,
    completedStudies: 0,
    totalProtocols: 0,
    totalSamples: 0,
    successRate: 0,
    avgExecutionTime: 0,
    recentActivity: 0
  });

  const [activeStudies, setActiveStudies] = useState<StudyProgress[]>([]);
  const [protocolUsage, setProtocolUsage] = useState<ProtocolUsage[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard statistics
  const fetchStats = useCallback(async () => {
    try {
      const [studiesResponse, protocolsResponse] = await Promise.all([
        studiesApi.getAll(),
        protocolsApi.getAll()
      ]);

      if (studiesResponse.success && protocolsResponse.success) {
        const studies = studiesResponse.data || [];
        const protocols = protocolsResponse.data || [];

        const activeCount = studies.filter(s => s.status === StudyStatus.ACTIVE || s.status === StudyStatus.PAUSED).length;
        const completedCount = studies.filter(s => s.status === StudyStatus.COMPLETED).length;
        const totalSamples = studies.reduce((acc, study) => acc + (study.sessions?.length || 0), 0);

        setStats({
          totalStudies: studies.length,
          activeStudies: activeCount,
          completedStudies: completedCount,
          totalProtocols: protocols.length,
          totalSamples,
          successRate: studies.length > 0 ? (completedCount / studies.length) * 100 : 0,
          avgExecutionTime: 45, // Mock data - should be calculated from actual execution times
          recentActivity: studies.filter(s => {
            const createdDate = new Date(s.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdDate >= weekAgo;
          }).length
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Nie udało się pobrać statystyk dashboardu');
    }
  }, []);

  // Fetch active studies with progress
  const fetchActiveStudies = useCallback(async () => {
    try {
      const response = await studiesApi.getAll();
      if (response.success) {
        const studies = response.data || [];
        const activeStudiesData: StudyProgress[] = studies
          .filter(study => study.status === StudyStatus.ACTIVE || study.status === StudyStatus.PAUSED)
          .map(study => ({
            id: study.id,
            name: study.name,
            protocol: study.protocolName || 'Nieznany protokół',
            progress: Math.random() * 100, // Mock progress - should be calculated from actual execution
            status: study.status === StudyStatus.ACTIVE ? 'active' : 'paused',
            startDate: study.createdAt,
            estimatedCompletion: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            operator: study.createdBy || 'Nieznany operator',
            priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any
          }));

        setActiveStudies(activeStudiesData);
      }
    } catch (err) {
      console.error('Error fetching active studies:', err);
    }
  }, []);

  // Generate mock protocol usage data
  const generateProtocolUsage = useCallback(() => {
    const mockUsage: ProtocolUsage[] = [
      {
        id: 'astm-d638',
        name: 'ASTM D638 - Właściwości rozciągania',
        category: 'Mechaniczne',
        usageCount: 23,
        successRate: 95.7,
        avgDuration: 45,
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'astm-d256',
        name: 'ASTM D256 - Udarność Izod',
        category: 'Mechaniczne',
        usageCount: 18,
        successRate: 92.3,
        avgDuration: 30,
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'iso-1133',
        name: 'ISO 1133 - Wskaźnik płynięcia',
        category: 'Reologiczne',
        usageCount: 15,
        successRate: 98.1,
        avgDuration: 25,
        lastUsed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setProtocolUsage(mockUsage);
  }, []);

  // Generate mock alerts
  const generateAlerts = useCallback(() => {
    const mockAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'warning',
        title: 'Serwer bazy danych',
        message: 'Wykorzystanie dysku przekroczyło 85%',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionable: true,
        actionUrl: '/system/storage'
      },
      {
        id: '2',
        type: 'info',
        title: 'Aktualizacja dostępna',
        message: 'Nowa wersja systemu EDITH v2.1.3 jest dostępna',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        read: false,
        actionable: true,
        actionUrl: '/system/updates'
      },
      {
        id: '3',
        type: 'success',
        title: 'Backup ukończony',
        message: 'Automatyczna kopia zapasowa została utworzona pomyślnie',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        read: true
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  // Generate performance data
  const generatePerformanceData = useCallback(() => {
    const data: PerformanceMetric[] = [];
    const now = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        studiesCompleted: Math.floor(Math.random() * 10) + 1,
        successRate: 85 + Math.random() * 15,
        avgDuration: 30 + Math.random() * 30,
        efficiency: 70 + Math.random() * 30
      });
    }

    setPerformanceData(data);
  }, []);

  // Generate recent activity
  const generateRecentActivity = useCallback(() => {
    const activities: RecentActivity[] = [
      {
        id: '1',
        type: 'study_completed',
        title: 'Badanie ukończone',
        description: 'Test ASTM D638 dla materiału PP-01 został zakończony',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        user: 'Jan Kowalski'
      },
      {
        id: '2',
        type: 'study_created',
        title: 'Nowe badanie',
        description: 'Utworzono badanie ISO 1133 dla próbek PE-15',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        user: 'Anna Nowak'
      },
      {
        id: '3',
        type: 'protocol_added',
        title: 'Nowy protokół',
        description: 'Dodano protokół ASTM D790 - Właściwości zginania',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        user: 'System'
      },
      {
        id: '4',
        type: 'report_generated',
        title: 'Raport wygenerowany',
        description: 'Miesięczny raport produktywności został utworzony',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        user: 'System'
      }
    ];

    setRecentActivity(activities);
  }, []);

  // Mark alert as read
  const markAlertAsRead = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, read: true } : alert
    ));
  }, []);

  // Dismiss alert
  const dismissAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  }, []);

  // Refresh all data
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchStats(),
        fetchActiveStudies(),
        generateProtocolUsage(),
        generateAlerts(),
        generatePerformanceData(),
        generateRecentActivity()
      ]);
    } catch (err) {
      setError('Nie udało się odświeżyć danych dashboardu');
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats, fetchActiveStudies, generateProtocolUsage, generateAlerts, generatePerformanceData, generateRecentActivity]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  return {
    stats,
    activeStudies,
    protocolUsage,
    alerts,
    performanceData,
    recentActivity,
    isLoading,
    error,
    markAlertAsRead,
    dismissAlert,
    refreshData
  };
};
