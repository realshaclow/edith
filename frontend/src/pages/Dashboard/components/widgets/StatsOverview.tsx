import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Science,
  PlayArrow,
  CheckCircle,
  Assignment,
  BugReport,
  Speed
} from '@mui/icons-material';
import { DashboardStats } from '../../types';

interface StatsOverviewProps {
  stats: DashboardStats;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color, 
  trend, 
  progress,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" width="60%" height={24} />
          <Skeleton variant="text" width="40%" height={32} sx={{ mt: 1 }} />
          <Skeleton variant="text" width="80%" height={20} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box flex={1}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold" color={`${color}.main`}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              borderRadius: '12px',
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {React.cloneElement(icon as React.ReactElement, {
              sx: { color: `${color}.main`, fontSize: 24 }
            })}
          </Box>
        </Box>

        {trend && (
          <Box display="flex" alignItems="center" mt={2}>
            {trend.isPositive ? (
              <TrendingUp sx={{ color: 'success.main', fontSize: 16, mr: 0.5 }} />
            ) : (
              <TrendingDown sx={{ color: 'error.main', fontSize: 16, mr: 0.5 }} />
            )}
            <Typography 
              variant="caption" 
              color={trend.isPositive ? 'success.main' : 'error.main'}
              fontWeight="medium"
            >
              {Math.abs(trend.value)}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              vs ostatni miesiąc
            </Typography>
          </Box>
        )}

        {progress !== undefined && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="caption" color="text.secondary">
                Cel miesięczny
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: `${color}.lighter`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: `${color}.main`,
                  borderRadius: 3
                }
              }} 
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats, isLoading }) => {
  const getSuccessRateColor = (rate: number): 'success' | 'warning' | 'error' => {
    if (rate >= 90) return 'success';
    if (rate >= 70) return 'warning';
    return 'error';
  };

  const statCards = [
    {
      title: 'Łączna liczba badań',
      value: stats.totalStudies,
      subtitle: 'wszystkie badania',
      icon: <Science />,
      color: 'primary' as const,
      trend: { value: 12.5, isPositive: true },
      progress: 75
    },
    {
      title: 'Aktywne badania',
      value: stats.activeStudies,
      subtitle: 'w trakcie realizacji',
      icon: <PlayArrow />,
      color: 'warning' as const,
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: 'Ukończone badania',
      value: stats.completedStudies,
      subtitle: 'zakończone pomyślnie',
      icon: <CheckCircle />,
      color: 'success' as const,
      trend: { value: 15.7, isPositive: true },
      progress: 82
    },
    {
      title: 'Dostępne protokoły',
      value: stats.totalProtocols,
      subtitle: 'gotowe do użycia',
      icon: <Assignment />,
      color: 'info' as const
    },
    {
      title: 'Wskaźnik sukcesu',
      value: `${Math.round(stats.successRate)}%`,
      subtitle: 'pomyślnie zakończone',
      icon: <TrendingUp />,
      color: getSuccessRateColor(stats.successRate),
      trend: { value: 3.1, isPositive: true }
    },
    {
      title: 'Średni czas wykonania',
      value: `${stats.avgExecutionTime}min`,
      subtitle: 'na jedno badanie',
      icon: <Speed />,
      color: 'secondary' as const,
      trend: { value: 5.2, isPositive: false }
    },
    {
      title: 'Łączna liczba próbek',
      value: stats.totalSamples,
      subtitle: 'przetworzone próbki',
      icon: <BugReport />,
      color: 'info' as const,
      progress: 68
    },
    {
      title: 'Aktywność w tym tygodniu',
      value: stats.recentActivity,
      subtitle: 'nowe badania',
      icon: <TrendingUp />,
      color: 'primary' as const,
      trend: { value: 22.1, isPositive: true }
    }
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((card, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatCard {...card} isLoading={isLoading} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsOverview;
