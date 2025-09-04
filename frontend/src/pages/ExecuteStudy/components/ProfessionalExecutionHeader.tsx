import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  IconButton,
  LinearProgress,
  Avatar,
  Divider
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Science as StudyIcon,
  Person as PersonIcon,
  Build as EquipmentIcon,
  Timer as TimerIcon,
  Assignment as ProtocolIcon
} from '@mui/icons-material';
import { StudyExecution, ExecutionStatus } from '../types/professional';

interface ProfessionalExecutionHeaderProps {
  execution: StudyExecution;
  startTime?: Date | null;
  currentTime?: Date;
  isPaused?: boolean;
  getElapsedTime?: () => number;
  formatElapsedTime?: (ms: number) => string;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onComplete: () => void;
}

export const ProfessionalExecutionHeader: React.FC<ProfessionalExecutionHeaderProps> = ({
  execution,
  startTime,
  currentTime,
  isPaused,
  getElapsedTime,
  formatElapsedTime,
  onStart,
  onPause,
  onResume,
  onComplete
}) => {
  const getStatusColor = (status: ExecutionStatus) => {
    switch (status) {
      case 'IN_PROGRESS': return 'success';
      case 'PAUSED': return 'warning';
      case 'COMPLETED': return 'primary';
      case 'CANCELLED': return 'error';
      case 'NOT_STARTED': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: ExecutionStatus) => {
    switch (status) {
      case 'IN_PROGRESS': return 'W trakcie';
      case 'PAUSED': return 'Wstrzymane';
      case 'COMPLETED': return 'Zakończone';
      case 'CANCELLED': return 'Anulowane';
      case 'NOT_STARTED': return 'Nie rozpoczęte';
      default: return 'Nieznany';
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getOverallProgress = () => {
    // Calculate progress based on completed steps across all samples
    const stepsPerSample = execution.stepMeasurements?.length || 0;
    const totalSteps = execution.samples.length * stepsPerSample;
    
    if (totalSteps === 0) return 0;
    
    // Count completed steps across all samples
    let completedSteps = 0;
    execution.samples.forEach(sample => {
      completedSteps += sample.completedSteps.length;
    });
    
    const stepProgress = (completedSteps / totalSteps) * 100;
    
    // If study hasn't started, return 0
    if (!startTime || execution.status === 'NOT_STARTED') {
      return 0;
    }
    
    // If study is running, show step-based progress
    if (execution.status === 'IN_PROGRESS' || execution.status === 'PAUSED') {
      return Math.min(stepProgress, 100);
    }
    
    // If completed, return 100
    if (execution.status === 'COMPLETED') {
      return 100;
    }
    
    return stepProgress;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Main header row */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        <Box flex={1}>
          <Box display="flex" alignItems="center" mb={1}>
            <StudyIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              {execution.studyName}
            </Typography>
            <Chip 
              label={getStatusText(execution.status)}
              color={getStatusColor(execution.status) as any}
              sx={{ ml: 2 }}
            />
          </Box>
          
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <ProtocolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {execution.protocolName} • {execution.category}
            </Typography>
          </Box>
        </Box>

        {/* Action buttons */}
        <Box display="flex" gap={1}>
          {execution.status === 'NOT_STARTED' && (
            <Button
              variant="contained"
              startIcon={<StartIcon />}
              onClick={onStart}
              size="large"
            >
              Rozpocznij
            </Button>
          )}

          {execution.status === 'IN_PROGRESS' && (
            <>
              <Button
                variant="outlined"
                startIcon={<PauseIcon />}
                onClick={onPause}
              >
                Wstrzymaj
              </Button>
              <Button
                variant="contained"
                startIcon={<StopIcon />}
                onClick={onComplete}
                color="success"
              >
                Zakończ
              </Button>
            </>
          )}

          {execution.status === 'PAUSED' && (
            <Button
              variant="contained"
              startIcon={<StartIcon />}
              onClick={onResume}
            >
              Wznów
            </Button>
          )}
        </Box>
      </Box>

      {/* Progress bar */}
      <Box sx={{ mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="body2" color="text.secondary">
            Postęp wykonania
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {Math.round(getOverallProgress())}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={getOverallProgress()} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Details row */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Left side - Personnel and equipment */}
        <Box display="flex" alignItems="center" gap={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2">
              {execution.operator.name}
            </Typography>
            {execution.operator.position && (
              <Typography variant="caption" color="text.secondary">
                ({execution.operator.position})
              </Typography>
            )}
          </Box>

          {execution.equipment && (
            <Box display="flex" alignItems="center" gap={1}>
              <EquipmentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2">
                {execution.equipment.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {execution.equipment.model}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Right side - Time and sample info */}
        <Box display="flex" alignItems="center" gap={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <TimerIcon sx={{ fontSize: 16, color: startTime ? 'primary.main' : 'text.secondary' }} />
            <Typography variant="body2">
              {startTime && formatElapsedTime ? (
                <span>
                  {formatElapsedTime(getElapsedTime ? getElapsedTime() : 0)}
                  {isPaused && <span style={{ color: '#f57c00' }}> (wstrzymane)</span>}
                </span>
              ) : (
                execution.estimatedDuration ? formatDuration(Number(execution.estimatedDuration)) : 'Czas nieznany'
              )}
            </Typography>
          </Box>

          <Box display="flex" gap={1}>
            <Chip 
              size="small" 
              label={`${execution.samples.length} próbek`}
              variant="outlined"
            />
            <Chip 
              size="small" 
              label={`${execution.sessions.length} sesji`}
              variant="outlined"
            />
            <Chip 
              size="small" 
              label={`${execution.steps.length} kroków`}
              variant="outlined"
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
