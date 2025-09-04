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
  Paper,
  Tabs,
  Tab,
  Divider,
  Badge
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  RadioButtonUnchecked as PendingIcon,
  PlayCircle as ActiveIcon,
  Science as SampleIcon,
  Edit as CorrectionIcon
} from '@mui/icons-material';
import { StudyExecution, StudySample } from '../types/professional';

interface IndividualSampleProgressProps {
  execution: StudyExecution;
  currentSample: StudySample;
  onStepClick: (stepIndex: number) => void;
  onSampleChange: (sampleIndex: number) => void;
  getSampleCurrentStep: (sample: StudySample) => number;
  getSampleProgress: (sample: StudySample) => number;
}

export const IndividualSampleProgress: React.FC<IndividualSampleProgressProps> = ({
  execution,
  currentSample,
  onStepClick,
  onSampleChange,
  getSampleCurrentStep,
  getSampleProgress
}) => {
  
  // Używaj funkcji z props zamiast lokalnych definicji
  const currentSampleStepIndex = getSampleCurrentStep(currentSample);
  
  const getStepStatus = (stepIndex: number, sample: StudySample) => {
    const step = execution.steps[stepIndex];
    if (sample.completedSteps.includes(step.id)) {
      return 'completed';
    } else if (stepIndex === currentSampleStepIndex) {
      return 'active';
    } else if (stepIndex < currentSampleStepIndex) {
      return 'completed'; // Kroki przed aktualnym powinny być zakończone
    } else {
      return 'pending';
    }
  };

  const getStepIcon = (stepIndex: number, sample: StudySample) => {
    const status = getStepStatus(stepIndex, sample);
    const step = execution.steps[stepIndex];
    
    // Sprawdź czy krok ma korekty
    const hasCorrectionNotes = sample.measurements
      .filter(m => m.stepId === step.id)
      .some(m => m.notes && m.notes.includes('[KOREKTA'));
    
    const baseIcon = (() => {
      switch (status) {
        case 'completed':
          return <CompleteIcon color="success" />;
        case 'active':
          return <ActiveIcon color="primary" />;
        default:
          return <PendingIcon color="disabled" />;
      }
    })();

    // Jeśli są korekty, dodaj badge z ikoną korekty
    if (hasCorrectionNotes) {
      return (
        <Badge 
          badgeContent={<CorrectionIcon sx={{ fontSize: 12 }} />}
          color="warning"
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: 'warning.main',
              color: 'white',
              minWidth: 16,
              height: 16,
              padding: 0
            }
          }}
        >
          {baseIcon}
        </Badge>
      );
    }

    return baseIcon;
  };

  const getCurrentSampleIndex = () => {
    return execution.samples.findIndex(s => s.id === currentSample.id);
  };

  return (
    <Box>
      {/* Tabs dla próbek */}
      <Paper variant="outlined" sx={{ mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={getCurrentSampleIndex()} 
            onChange={(_, newValue) => onSampleChange(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {execution.samples.map((sample, index) => {
              const progress = getSampleProgress(sample);
              const sampleStepIndex = getSampleCurrentStep(sample);
              
              return (
                <Tab
                  key={sample.id}
                  icon={<SampleIcon />}
                  label={
                    <Box>
                      <Typography variant="body2">{sample.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Krok {sampleStepIndex + 1}/{execution.steps.length}
                      </Typography>
                    </Box>
                  }
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Postęp aktualnej próbki */}
        <Box sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="h6">
                Postęp próbki {currentSample.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Krok {currentSampleStepIndex + 1} z {execution.steps.length}
              </Typography>
            </Box>
            
            <Box display="flex" gap={1}>
              <Chip 
                label={`${currentSample.completedSteps.length}/${execution.steps.length}`}
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip 
                label={`${Math.round(getSampleProgress(currentSample))}%`}
                color="success"
                size="small"
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={getSampleProgress(currentSample)} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Stepper dla aktualnej próbki */}
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Kroki dla próbki {currentSample.name}
        </Typography>
        
        <Stepper 
          activeStep={currentSampleStepIndex} 
          orientation="vertical"
          sx={{ maxHeight: 300, overflow: 'auto' }}
        >
          {execution.steps.map((step, index) => {
            const status = getStepStatus(index, currentSample);
            
            return (
              <Step key={step.id} completed={status === 'completed'}>
                <StepButton 
                  onClick={() => onStepClick(index)}
                  icon={getStepIcon(index, currentSample)}
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
                      {status === 'completed' && (
                        <Typography variant="caption" color="success.main" sx={{ display: 'block' }}>
                          ✓ Zakończony dla {currentSample.name}
                        </Typography>
                      )}
                    </Box>
                  </StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </Paper>

      {/* Podsumowanie wszystkich próbek */}
      <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 2 }}>
          Podsumowanie wszystkich próbek
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {execution.samples.map((sample) => {
            const progress = getSampleProgress(sample);
            const sampleStepIndex = getSampleCurrentStep(sample);
            
            return (
              <Box key={sample.id} sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle2">{sample.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Krok {sampleStepIndex + 1}/{execution.steps.length}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ mt: 1, height: 4 }}
                />
                <Typography variant="caption" color="text.secondary">
                  {Math.round(progress)}% ({sample.completedSteps.length}/{execution.steps.length})
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};
