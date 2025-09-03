import React from 'react';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  ArrowForward as NextIcon,
  PlayArrow as StartIcon,
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as PendingIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Timer as TimerIcon,
  Pause as PauseIcon
} from '@mui/icons-material';
import { ExecutionStep, NavigationState, StepTimer } from '../types';

interface StepNavigationProps {
  steps: ExecutionStep[];
  currentStepIndex: number;
  navigationState: NavigationState;
  stepTimers: StepTimer[];
  onStepChange: (stepIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onComplete: () => void;
  showStepContent?: boolean;
  orientation?: 'horizontal' | 'vertical';
  compact?: boolean;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  steps,
  currentStepIndex,
  navigationState,
  stepTimers,
  onStepChange,
  onNext,
  onPrevious,
  onComplete,
  showStepContent = true,
  orientation = 'vertical',
  compact = false
}) => {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'active';
    return 'pending';
  };

  const getStepIcon = (stepIndex: number, step: ExecutionStep) => {
    const status = getStepStatus(stepIndex);
    const timer = stepTimers.find(t => t.stepId === step.id);
    
    switch (status) {
      case 'completed':
        return <CompleteIcon color="success" />;
      case 'active':
        if (timer?.isRunning) {
          return timer.isPaused ? <PauseIcon color="warning" /> : <TimerIcon color="primary" />;
        }
        return <StartIcon color="primary" />;
      default:
        return <PendingIcon color="disabled" />;
    }
  };

  const formatStepDuration = (timer: StepTimer) => {
    const minutes = Math.floor(timer.totalTime / 60);
    const seconds = timer.totalTime % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStepProgress = (step: ExecutionStep, timer: StepTimer) => {
    if (!step.duration || !timer.targetDuration) return 0;
    return Math.min((timer.totalTime / timer.targetDuration) * 100, 100);
  };

  if (compact) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Krok {currentStepIndex + 1} z {steps.length}
            </Typography>
            <Chip 
              label={`${Math.round((currentStepIndex / steps.length) * 100)}%`}
              color="primary"
              size="small"
            />
          </Box>
          
          <LinearProgress 
            variant="determinate" 
            value={(currentStepIndex / steps.length) * 100}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" gutterBottom>
            {steps[currentStepIndex]?.title}
          </Typography>
          
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button
              startIcon={<BackIcon />}
              onClick={onPrevious}
              disabled={!navigationState.canGoBack}
              variant="outlined"
              size="small"
            >
              Poprzedni
            </Button>
            
            {navigationState.canComplete ? (
              <Button
                startIcon={<CompleteIcon />}
                onClick={onComplete}
                variant="contained"
                color="success"
                size="small"
              >
                Zakończ
              </Button>
            ) : (
              <Button
                endIcon={<NextIcon />}
                onClick={onNext}
                disabled={!navigationState.canGoNext}
                variant="contained"
                size="small"
              >
                Następny
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            Postęp wykonania
          </Typography>
          <Chip 
            label={`${currentStepIndex + 1}/${steps.length}`}
            color="primary"
          />
        </Box>

        <Stepper 
          activeStep={currentStepIndex} 
          orientation={orientation}
          sx={{ mb: 3 }}
        >
          {steps.map((step, index) => {
            const timer = stepTimers.find(t => t.stepId === step.id);
            const status = getStepStatus(index);
            const progress = timer ? getStepProgress(step, timer) : 0;
            
            return (
              <Step key={step.id} completed={status === 'completed'}>
                <StepLabel
                  icon={
                    <Badge 
                      badgeContent={timer?.isRunning ? formatStepDuration(timer) : ''}
                      color="primary"
                      invisible={!timer?.isRunning}
                    >
                      {getStepIcon(index, step)}
                    </Badge>
                  }
                  onClick={() => onStepChange(index)}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box>
                    <Typography variant="subtitle2">
                      {step.title}
                    </Typography>
                    
                    {step.duration && (
                      <Typography variant="caption" color="text.secondary">
                        Planowany czas: {step.duration} min
                      </Typography>
                    )}
                    
                    {timer && timer.totalTime > 0 && (
                      <Box mt={1}>
                        <Typography variant="caption" display="block">
                          Rzeczywisty czas: {formatStepDuration(timer)}
                        </Typography>
                        {step.duration && (
                          <LinearProgress 
                            variant="determinate" 
                            value={progress}
                            color={progress > 100 ? 'warning' : 'primary'}
                            sx={{ height: 4, borderRadius: 2, mt: 0.5 }}
                          />
                        )}
                      </Box>
                    )}
                    
                    {step.isOptional && (
                      <Chip 
                        label="Opcjonalny" 
                        size="small" 
                        variant="outlined"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </StepLabel>
                
                {showStepContent && orientation === 'vertical' && (
                  <StepContent>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {step.description}
                    </Typography>
                    
                    {step.safetyNotes && step.safetyNotes.length > 0 && (
                      <Box mb={2}>
                        <Typography variant="caption" color="warning.main" display="block">
                          ⚠️ Uwagi bezpieczeństwa:
                        </Typography>
                        {step.safetyNotes.map((note, noteIndex) => (
                          <Typography key={noteIndex} variant="caption" display="block" color="text.secondary">
                            • {note}
                          </Typography>
                        ))}
                      </Box>
                    )}
                    
                    {index === currentStepIndex && (
                      <Box mt={2}>
                        <Button
                          size="small"
                          onClick={() => onStepChange(index)}
                          variant="outlined"
                        >
                          Przejdź do kroku
                        </Button>
                      </Box>
                    )}
                  </StepContent>
                )}
              </Step>
            );
          })}
        </Stepper>

        {/* Navigation Controls */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            startIcon={<BackIcon />}
            onClick={onPrevious}
            disabled={!navigationState.canGoBack}
            variant="outlined"
          >
            Poprzedni krok
          </Button>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              {currentStepIndex + 1} z {steps.length}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={((currentStepIndex + 1) / steps.length) * 100}
              sx={{ width: 100, ml: 1 }}
            />
          </Box>
          
          {navigationState.canComplete ? (
            <Button
              startIcon={<CompleteIcon />}
              onClick={onComplete}
              variant="contained"
              color="success"
            >
              Zakończ badanie
            </Button>
          ) : (
            <Button
              endIcon={<NextIcon />}
              onClick={onNext}
              disabled={!navigationState.canGoNext}
              variant="contained"
            >
              Następny krok
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StepNavigation;
