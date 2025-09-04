import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  Chip,
  Paper
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as PendingIcon,
  PlayCircle as ActiveIcon
} from '@mui/icons-material';
import { StudyExecution } from '../types/professional';

interface ProfessionalExecutionProgressProps {
  execution: StudyExecution;
  onStepClick: (stepIndex: number) => void;
}

export const ProfessionalExecutionProgress: React.FC<ProfessionalExecutionProgressProps> = ({
  execution,
  onStepClick
}) => {
  const currentSample = execution.samples[execution.currentSampleIndex];
  const currentSession = execution.sessions[execution.currentSessionIndex];
  
  const getStepStatus = (stepIndex: number) => {
    if (!currentSample) return 'pending';
    
    const step = execution.steps[stepIndex];
    if (currentSample.completedSteps.includes(step.id)) {
      return 'completed';
    } else if (stepIndex === execution.currentStepIndex) {
      return 'active';
    } else {
      return 'pending';
    }
  };

  const getStepIcon = (stepIndex: number) => {
    const status = getStepStatus(stepIndex);
    switch (status) {
      case 'completed':
        return <CompleteIcon color="success" />;
      case 'active':
        return <ActiveIcon color="primary" />;
      default:
        return <PendingIcon color="disabled" />;
    }
  };

  const getOverallProgress = () => {
    // Calculate progress based on completed steps across all samples
    const stepsPerSample = execution.stepMeasurements?.length || execution.steps.length || 0;
    const totalSteps = execution.samples.length * stepsPerSample;
    
    if (totalSteps === 0) return 0;
    
    // Count completed steps across all samples
    let completedSteps = 0;
    execution.samples.forEach(sample => {
      completedSteps += sample.completedSteps.length;
    });
    
    return (completedSteps / totalSteps) * 100;
  };

  const getSessionProgress = () => {
    if (!currentSession || !currentSession.samplesAssigned) return 0;
    
    const completedSamples = execution.samples.filter(sample => 
      currentSession.samplesAssigned.includes(sample.id) && 
      sample.status === 'COMPLETED'
    ).length;
    
    return (completedSamples / currentSession.samplesAssigned.length) * 100;
  };

  return (
    <Box>
      {/* Session and sample progress */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box>
          <Typography variant="h6">
            Postęp wykonania
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {currentSession?.name} • Próbka: {currentSample?.name}
          </Typography>
        </Box>
        
        <Box display="flex" gap={1}>
          <Chip 
            label={`${execution.currentStepIndex + 1} / ${execution.steps.length}`}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Chip 
            label={`${Math.round(getOverallProgress())}%`}
            color="success"
            size="small"
          />
        </Box>
      </Box>

      {/* Current sample progress */}
      {currentSample && (
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2">
              Postęp próbki {currentSample.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {currentSample.completedSteps.length} / {execution.steps.length} kroków
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getOverallProgress()} 
            sx={{ height: 8, borderRadius: 4, mb: 1 }}
          />
        </Box>
      )}

      {/* Session progress */}
      {currentSession && execution.sessions.length > 1 && (
        <Box sx={{ mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2">
              Postęp sesji {currentSession.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {execution.samples.filter(s => 
                currentSession.samplesAssigned.includes(s.id) && s.status === 'COMPLETED'
              ).length} / {currentSession.samplesAssigned.length} próbek
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getSessionProgress()} 
            sx={{ height: 6, borderRadius: 3, mb: 1 }}
            color="secondary"
          />
        </Box>
      )}

      {/* Steps stepper */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Kroki protokołu
        </Typography>
        
        <Stepper 
          activeStep={execution.currentStepIndex} 
          orientation="vertical"
          sx={{ maxHeight: 300, overflow: 'auto' }}
        >
          {execution.steps.map((step, index) => {
            const status = getStepStatus(index);
            
            return (
              <Step key={step.id} completed={status === 'completed'}>
                <StepButton 
                  onClick={() => onStepClick(index)}
                  icon={getStepIcon(index)}
                >
                  <StepLabel>
                    <Box>
                      <Typography variant="body2">
                        {step.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {step.measurements.length} pomiarów
                        {step.estimatedDuration && ` • ${step.estimatedDuration} min`}
                      </Typography>
                    </Box>
                  </StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </Paper>
    </Box>
  );
};
