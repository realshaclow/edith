import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip
} from '@mui/material';
import {
  Timer as TimerIcon,
  TrendingUp as TrendIcon,
  Assessment as StatsIcon,
  Speed as PerformanceIcon
} from '@mui/icons-material';
import { StudyExecution } from '../../types/professional';

interface ExecutionStatisticsProps {
  execution: StudyExecution;
}

export const ExecutionStatistics: React.FC<ExecutionStatisticsProps> = ({
  execution
}) => {
  const completedSamples = execution.samples.filter(sample => sample.status === 'COMPLETED').length;
  const totalSamples = execution.samples.length;
  const successRate = totalSamples > 0 ? (completedSamples / totalSamples) * 100 : 0;

  const calculateAverageTime = () => {
    const completedSamplesWithTimes = execution.samples.filter(sample => 
      sample.status === 'COMPLETED' && sample.completedAt && sample.startedAt
    );
    
    if (completedSamplesWithTimes.length === 0) return 0;
    
    const totalTime = completedSamplesWithTimes.reduce((sum, sample) => {
      const duration = sample.completedAt!.getTime() - sample.startedAt!.getTime();
      return sum + duration;
    }, 0);
    
    return totalTime / completedSamplesWithTimes.length;
  };

  const formatTime = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const averageTimePerStep = calculateAverageTime();

  const getPerformanceLevel = () => {
    if (successRate >= 95) return { level: 'Doskonała', color: 'success' as const };
    if (successRate >= 85) return { level: 'Bardzo dobra', color: 'primary' as const };
    if (successRate >= 70) return { level: 'Dobra', color: 'warning' as const };
    return { level: 'Wymaga uwagi', color: 'error' as const };
  };

  const performance = getPerformanceLevel();

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <StatsIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Statystyki Wykonania
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* Success Rate */}
        <Grid item xs={12}>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'primary.light', 
              color: 'primary.contrastText',
              borderRadius: 1,
              textAlign: 'center'
            }}
          >
            <Typography variant="h4" fontWeight="bold">
              {Math.round(successRate)}%
            </Typography>
            <Typography variant="body2">
              Wskaźnik powodzenia
            </Typography>
          </Box>
        </Grid>

        {/* Sample Statistics */}
        <Grid item xs={6}>
          <Box textAlign="center" py={1}>
            <Typography variant="h5" fontWeight="bold" color="success.main">
              {completedSamples}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ukończone próbki
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box textAlign="center" py={1}>
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {totalSamples}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Łączna liczba próbek
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        {/* Performance Metrics */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={1}>
              <PerformanceIcon fontSize="small" />
              <Typography variant="subtitle2">
                Wydajność
              </Typography>
            </Box>
            <Chip 
              label={performance.level}
              color={performance.color}
              size="small"
              variant="outlined"
            />
          </Box>
        </Grid>

        {/* Average Time */}
        {averageTimePerStep > 0 && (
          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1}>
                <TimerIcon fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  Średni czas na próbkę
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold">
                {formatTime(averageTimePerStep)}
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Trend Analysis */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <TrendIcon fontSize="small" />
              <Typography variant="body2" color="text.secondary">
                Status badania
              </Typography>
            </Box>
            <Typography variant="body2" fontWeight="bold">
              {execution.status === 'COMPLETED' ? 'Zakończone' : 'W trakcie'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
