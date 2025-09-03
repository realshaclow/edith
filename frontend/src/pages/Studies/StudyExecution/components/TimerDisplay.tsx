import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Refresh as ResetIcon,
  Timer as TimerIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useTimer } from '../hooks/useTimer';

interface TimerDisplayProps {
  stepId: string;
  stepTitle: string;
  targetDuration?: number; // w sekundach
  autoStart?: boolean;
  showControls?: boolean;
  onComplete?: () => void;
  onWarning?: (remainingTime: number) => void;
  warningThreshold?: number;
  size?: 'small' | 'medium' | 'large';
  variant?: 'card' | 'inline' | 'minimal';
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({
  stepId,
  stepTitle,
  targetDuration,
  autoStart = false,
  showControls = true,
  onComplete,
  onWarning,
  warningThreshold = 60,
  size = 'medium',
  variant = 'card'
}) => {
  const {
    isRunning,
    isPaused,
    totalTime,
    progress,
    remainingTime,
    isOvertime,
    formattedTime,
    formattedRemainingTime,
    formattedTargetTime,
    start,
    pause,
    resume,
    stop,
    reset
  } = useTimer({
    targetTime: targetDuration,
    autoStart,
    onComplete,
    onWarning,
    warningThreshold
  });

  const getTimerColor = () => {
    if (isOvertime) return 'error';
    if (remainingTime <= warningThreshold) return 'warning';
    return 'primary';
  };

  const getTimerStatus = () => {
    if (isOvertime) return 'PRZEKROCZONO';
    if (isPaused) return 'WSTRZYMANO';
    if (isRunning) return 'DZIAŁA';
    return 'ZATRZYMANO';
  };

  const TimerContent = () => (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <TimerIcon color={getTimerColor()} />
          <Typography variant={size === 'large' ? 'h6' : 'subtitle1'} fontWeight="bold">
            {stepTitle}
          </Typography>
        </Box>
        <Chip 
          label={getTimerStatus()} 
          color={getTimerColor()}
          size="small"
          variant={isRunning ? 'filled' : 'outlined'}
        />
      </Box>

      {/* Main Timer Display */}
      <Box textAlign="center" mb={2}>
        <Typography 
          variant={size === 'large' ? 'h3' : size === 'medium' ? 'h4' : 'h5'}
          color={getTimerColor()}
          fontFamily="monospace"
          fontWeight="bold"
        >
          {formattedTime}
        </Typography>
        
        {targetDuration && (
          <>
            <Typography variant="body2" color="text.secondary">
              z {formattedTargetTime} (pozostało: {formattedRemainingTime})
            </Typography>
            
            <Box mt={1}>
              <LinearProgress 
                variant="determinate" 
                value={Math.min(progress, 100)}
                color={getTimerColor()}
                sx={{ height: 8, borderRadius: 4 }}
              />
              <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                {progress.toFixed(1)}% ukończono
              </Typography>
            </Box>
          </>
        )}
      </Box>

      {/* Warnings */}
      {isOvertime && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon />
            <Typography variant="body2">
              Przekroczono planowany czas o {formattedTime}
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Controls */}
      {showControls && (
        <Box display="flex" justifyContent="center" gap={1}>
          {!isRunning ? (
            <Tooltip title="Rozpocznij">
              <IconButton 
                onClick={start} 
                color="primary"
                size={size}
              >
                <PlayIcon />
              </IconButton>
            </Tooltip>
          ) : isPaused ? (
            <Tooltip title="Wznów">
              <IconButton 
                onClick={resume} 
                color="primary"
                size={size}
              >
                <PlayIcon />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Wstrzymaj">
              <IconButton 
                onClick={pause} 
                color="warning"
                size={size}
              >
                <PauseIcon />
              </IconButton>
            </Tooltip>
          )}
          
          <Tooltip title="Zatrzymaj">
            <IconButton 
              onClick={stop} 
              color="error"
              size={size}
              disabled={!isRunning && totalTime === 0}
            >
              <StopIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Resetuj">
            <IconButton 
              onClick={reset} 
              color="default"
              size={size}
              disabled={isRunning}
            >
              <ResetIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </>
  );

  if (variant === 'minimal') {
    return (
      <Box display="flex" alignItems="center" gap={2}>
        <TimerIcon color={getTimerColor()} fontSize="small" />
        <Typography 
          variant="body2" 
          fontFamily="monospace"
          color={getTimerColor()}
        >
          {formattedTime}
        </Typography>
        {targetDuration && (
          <Typography variant="caption" color="text.secondary">
            / {formattedTargetTime}
          </Typography>
        )}
      </Box>
    );
  }

  if (variant === 'inline') {
    return (
      <Box p={2} border={1} borderColor="divider" borderRadius={1}>
        <TimerContent />
      </Box>
    );
  }

  return (
    <Card elevation={2}>
      <CardContent>
        <TimerContent />
      </CardContent>
    </Card>
  );
};

export default TimerDisplay;
