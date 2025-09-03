import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  IconButton,
  Tooltip,
  Stack,
  Divider
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { StudyListStats } from '../types';
import { StudyStatus } from '../../../../types';
import { getStatusLabel, getStatusColor } from '../utils';

interface StudyStatisticsProps {
  stats: StudyListStats;
  onRefresh?: () => void;
  isLoading?: boolean;
  compact?: boolean;
}

const StudyStatistics: React.FC<StudyStatisticsProps> = ({
  stats,
  onRefresh,
  isLoading = false,
  compact = false
}) => {
  const getStatusIcon = (status: StudyStatus) => {
    switch (status) {
      case StudyStatus.COMPLETED:
        return <SuccessIcon color="success" />;
      case StudyStatus.ACTIVE:
        return <AssessmentIcon color="primary" />;
      case StudyStatus.PAUSED:
        return <ErrorIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getProgressColor = (value: number, max: number): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    const percentage = (value / max) * 100;
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'primary';
    if (percentage >= 40) return 'warning';
    return 'error';
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  };

  const formatPercentage = (value: number): string => {
    return `${Math.round(value)}%`;
  };

  if (compact) {
    return (
      <Box display="flex" alignItems="center" gap={2} p={1}>
        <Chip
          icon={<AssessmentIcon />}
          label={`${stats.total} badań`}
          variant="outlined"
          size="small"
        />
        
        <Chip
          icon={<SuccessIcon />}
          label={`${stats.byStatus[StudyStatus.COMPLETED] || 0} ukończonych`}
          color="success"
          variant="outlined"
          size="small"
        />
        
        {(stats.byStatus[StudyStatus.ACTIVE] || 0) > 0 && (
          <Chip
            icon={<ScheduleIcon />}
            label={`${stats.byStatus[StudyStatus.ACTIVE] || 0} aktywnych`}
            color="primary"
            variant="outlined"
            size="small"
          />
        )}
        
        {stats.successRate && (
          <Chip
            label={`${formatPercentage(stats.successRate)} sukces`}
            color={stats.successRate >= 80 ? 'success' : 'warning'}
            variant="outlined"
            size="small"
          />
        )}

        {onRefresh && (
          <Tooltip title="Odśwież statystyki">
            <IconButton size="small" onClick={onRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h6" component="h2">
          Statystyki badań
        </Typography>
        {onRefresh && (
          <Tooltip title="Odśwież statystyki">
            <IconButton onClick={onRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Overall Stats */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <AssessmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" component="div">
                    {stats.total}
                  </Typography>
                  <Typography color="text.secondary">
                    Wszystkich badań
                  </Typography>
                </Box>
              </Box>
              
              <Box display="flex" gap={1} mt={2}>
                <Chip
                  icon={<TrendingUpIcon />}
                  label={`+${stats.recentActivity.created} nowych`}
                  color="success"
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Success Rate */}
        {stats.successRate !== undefined && (
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                    <SuccessIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div">
                      {formatPercentage(stats.successRate)}
                    </Typography>
                    <Typography color="text.secondary">
                      Wskaźnik sukcesu
                    </Typography>
                  </Box>
                </Box>
                
                <LinearProgress
                  variant="determinate"
                  value={stats.successRate}
                  color={getProgressColor(stats.successRate, 100)}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Average Execution Time */}
        {stats.averageExecutionTime !== undefined && (
          <Grid item xs={12} md={6} lg={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                    <ScheduleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="div">
                      {formatDuration(stats.averageExecutionTime)}
                    </Typography>
                    <Typography color="text.secondary">
                      Średni czas wykonania
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recent Activity */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ostatnia aktywność
              </Typography>
              
              <Stack spacing={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Utworzone
                  </Typography>
                  <Chip
                    label={stats.recentActivity.created}
                    color="primary"
                    size="small"
                  />
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Zaktualizowane
                  </Typography>
                  <Chip
                    label={stats.recentActivity.updated}
                    color="info"
                    size="small"
                  />
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Wykonane
                  </Typography>
                  <Chip
                    label={stats.recentActivity.executed}
                    color="success"
                    size="small"
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Distribution */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rozkład statusów
              </Typography>
              
              <Stack spacing={2}>
                {Object.entries(stats.byStatus).map(([status, count]) => {
                  const statusEnum = status as StudyStatus;
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  
                  return (
                    <Box key={status}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Box display="flex" alignItems="center" gap={1}>
                          {getStatusIcon(statusEnum)}
                          <Typography variant="body2">
                            {getStatusLabel(statusEnum)}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" color="text.secondary">
                            {count} ({formatPercentage(percentage)})
                          </Typography>
                        </Box>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={getStatusColor(statusEnum) as any}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Category Distribution */}
        {Object.keys(stats.byCategory).length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Kategorie badań
                </Typography>
                
                <Stack spacing={1}>
                  {Object.entries(stats.byCategory)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([category, count]) => {
                      const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                      
                      return (
                        <Box key={category} display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" noWrap>
                            {category}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{ width: 60, height: 4, borderRadius: 2 }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40 }}>
                              {count}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                </Stack>
                
                {Object.keys(stats.byCategory).length > 5 && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="text.secondary" align="center">
                      +{Object.keys(stats.byCategory).length - 5} więcej kategorii
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default StudyStatistics;
