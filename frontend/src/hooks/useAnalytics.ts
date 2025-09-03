import { useState, useEffect, useCallback } from 'react';
import { analyticsApi, DashboardStats, SystemStats } from '../services/analyticsApi';

interface UseAnalyticsReturn {
  dashboardStats: DashboardStats | null;
  systemStats: SystemStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useAnalytics = (): UseAnalyticsReturn => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Za teraz pobierz tylko statystyki systemu (publiczne)
      // TODO: Dodać dashboard stats tylko dla zalogowanych użytkowników
      const systemData = await analyticsApi.getSystemStats();

      setSystemStats(systemData);
      setDashboardStats(null); // Wyczyść dashboard stats póki co
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setError(err.response?.data?.error || err.message || 'Błąd pobierania danych analytics');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    dashboardStats,
    systemStats,
    isLoading,
    error,
    refetch
  };
};
