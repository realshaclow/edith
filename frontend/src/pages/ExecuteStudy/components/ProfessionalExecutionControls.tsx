import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Alert
} from '@mui/material';
import {
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  CheckCircle as CompleteIcon
} from '@mui/icons-material';
import { StudyExecution } from '../types/professional';

interface ProfessionalExecutionControlsProps {
  execution: StudyExecution;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: (measurements: any[], notes?: string) => Promise<void>;
}

export const ProfessionalExecutionControls: React.FC<ProfessionalExecutionControlsProps> = ({
  execution,
  onPrevious,
  onNext,
  onComplete
}) => {
  const currentStep = execution.steps[execution.currentStepIndex];
  const currentSample = execution.samples[execution.currentSampleIndex];
  
  const canGoBack = execution.currentStepIndex > 0;
  const canGoForward = execution.currentStepIndex < execution.steps.length - 1;
  const isLastStep = execution.currentStepIndex === execution.steps.length - 1;
  
  const isStepCompleted = currentSample && currentStep && 
    currentSample.completedSteps.includes(currentStep.id);

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Left side - Navigation info */}
          <Box>
            <Typography variant="h6">
              Krok {execution.currentStepIndex + 1} z {execution.steps.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentStep?.title} • Próbka: {currentSample?.name}
            </Typography>
            {isStepCompleted && (
              <Chip 
                icon={<CompleteIcon />} 
                label="Krok zakończony" 
                color="success" 
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          </Box>

          {/* Right side - Navigation buttons */}
          <Box display="flex" gap={2} alignItems="center">
            <ButtonGroup variant="outlined">
              <Button
                startIcon={<PrevIcon />}
                onClick={onPrevious}
                disabled={!canGoBack}
              >
                Poprzedni
              </Button>
              
              <Button
                endIcon={<NextIcon />}
                onClick={onNext}
                disabled={!canGoForward}
              >
                Następny
              </Button>
            </ButtonGroup>

            {isLastStep && !isStepCompleted && (
              <Alert severity="info" sx={{ ml: 2 }}>
                To ostatni krok dla tej próbki
              </Alert>
            )}
          </Box>
        </Box>

        {/* Sample navigation */}
        {execution.samples.length > 1 && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Próbki w sesji
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {execution.samples.map((sample, index) => (
                <Chip
                  key={sample.id}
                  label={sample.name}
                  color={index === execution.currentSampleIndex ? 'primary' : 'default'}
                  variant={sample.status === 'COMPLETED' ? 'filled' : 'outlined'}
                  size="small"
                />
              ))}
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
