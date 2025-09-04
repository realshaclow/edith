import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  LinearProgress,
  Avatar
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  Schedule as TimeIcon,
  Science as StudyIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { StudyExecution } from '../../types/professional';

interface StudySummaryHeaderProps {
  execution: StudyExecution;
  isComplete: boolean;
  completionRate: number;
}

export const StudySummaryHeader: React.FC<StudySummaryHeaderProps> = ({
  execution,
  isComplete,
  completionRate
}) => {
  const getStatusColor = () => {
    if (isComplete) return 'success';
    if (execution.status === 'IN_PROGRESS') return 'primary';
    if (execution.status === 'PAUSED') return 'warning';
    return 'default';
  };

  const getStatusLabel = () => {
    switch (execution.status) {
      case 'IN_PROGRESS': return 'W trakcie';
      case 'PAUSED': return 'Wstrzymane';
      case 'CANCELLED': return 'Anulowane';
      case 'FAILED': return 'Błąd';
      default: return 'Ukończone';
    }
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const end = endTime || new Date();
    const duration = end.getTime() - startTime.getTime();
    const hours = Math.floor(duration / (1000 * 60 * 60));
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
            <StudyIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="primary.main">
              Podsumowanie Badania
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              ID: {execution.id} • Protokół: {execution.protocolId}
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center" gap={2}>
          <Chip
                        icon={isComplete ? <CompleteIcon /> : execution.status === 'PAUSED' ? <WarningIcon /> : <TimeIcon />}
            label={getStatusLabel()}
            color={getStatusColor()}
            size="medium"
            variant={isComplete ? 'filled' : 'outlined'}
          />
        </Box>
      </Box>

      {/* Progress and Stats Row */}
      <Box display="flex" alignItems="center" gap={4} mb={2}>
        <Box flex={1}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" color="text.secondary">
              Postęp wykonania
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {Math.round(completionRate)}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={completionRate}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'grey.200'
            }}
          />
        </Box>
        
        <Box display="flex" gap={3}>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              {execution.samples.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Próbek
            </Typography>
          </Box>
          
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" color="success.main">
              {execution.samples.filter(sample => sample.status === 'COMPLETED').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Ukończone
            </Typography>
          </Box>
          
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              {formatDuration(execution.startedAt, execution.completedAt)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Czas trwania
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Study Information */}
      <Box 
        sx={{ 
          bgcolor: 'grey.50', 
          p: 2, 
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Typography variant="body2" color="text.secondary" mb={1}>
          <strong>Data rozpoczęcia:</strong> {execution.startedAt.toLocaleString('pl-PL')}
        </Typography>
        {execution.completedAt && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            <strong>Data zakończenia:</strong> {execution.completedAt.toLocaleString('pl-PL')}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          <strong>Środowisko:</strong> {execution.environment.temperature}°C, {execution.environment.humidity}% RH
        </Typography>
      </Box>
    </Paper>
  );
};
