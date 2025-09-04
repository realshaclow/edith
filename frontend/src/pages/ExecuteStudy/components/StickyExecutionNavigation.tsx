import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Container,
  Typography,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip,
  Drawer,
  ButtonGroup,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import {
  CheckCircle as CompleteIcon,
  Build as CorrectionIcon,
  Science as SampleIcon,
  NavigateNext as NextSampleIcon,
  NavigateBefore as PrevSampleIcon,
} from '@mui/icons-material';
import { StudyExecution, StudySample } from '../types/professional';
import { CorrectionPanel } from './CorrectionPanel';

interface StickyExecutionNavigationProps {
  execution: StudyExecution;
  currentSample: StudySample;
  batchMode: boolean;
  disabled?: boolean;
  getSampleCurrentStep: (sample: StudySample) => number;
  getSampleProgress: (sample: StudySample) => number;
  onCompleteStep: () => void;
  onGoToStepForCorrection: (sampleId: string, stepIndex: number, reason?: string) => void;
  onEditMeasurement: (sampleId: string, stepId: string, measurementId: string, newValue: number, reason: string) => void;
  onSampleChange?: (sampleIndex: number) => void; // Funkcja do zmiany próbki
  isStepCompleted: boolean;
}

export const StickyExecutionNavigation: React.FC<StickyExecutionNavigationProps> = ({
  execution,
  currentSample,
  batchMode,
  disabled = false,
  getSampleCurrentStep,
  getSampleProgress,
  onCompleteStep,
  onGoToStepForCorrection,
  onEditMeasurement,
  onSampleChange,
  isStepCompleted,
}) => {
  const [correctionPanelOpen, setCorrectionPanelOpen] = useState(false);

  const handleCorrectionClick = () => {
    setCorrectionPanelOpen(true);
  };

  // Sprawdź czy można dodawać korekty (krok musi być zakończony lub w trakcie)
  const canCorrect = isStepCompleted || true; // Zawsze pozwalamy na korekty

  const currentStepIndex = batchMode 
    ? execution.currentStepIndex 
    : getSampleCurrentStep(currentSample);

  const currentStep = execution.steps[currentStepIndex];
  const stepNumber = currentStepIndex + 1;
  const totalSteps = execution.steps.length;

  const progress = getSampleProgress(currentSample);

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          borderTop: '1px solid #ddd',
          backgroundColor: 'white',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 48 }}>
            {/* Left side - Step info and sample navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" fontWeight="500">
                Krok {stepNumber}/{totalSteps}: {currentStep?.title}
              </Typography>
              {!batchMode && onSampleChange && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Previous sample button */}
                  <IconButton 
                    size="small"
                    onClick={() => onSampleChange(Math.max(0, execution.currentSampleIndex - 1))}
                    disabled={disabled || execution.currentSampleIndex === 0}
                  >
                    <PrevSampleIcon />
                  </IconButton>
                  
                  {/* Current sample chip with progress */}
                  <Chip 
                    icon={<SampleIcon />}
                    label={`${currentSample.name} (${Math.round(getSampleProgress(currentSample))}%)`}
                    color="primary"
                    size="small"
                    variant="outlined"
                  />
                  
                  {/* Next sample button */}
                  <IconButton 
                    size="small"
                    onClick={() => onSampleChange(Math.min(execution.samples.length - 1, execution.currentSampleIndex + 1))}
                    disabled={disabled || execution.currentSampleIndex === execution.samples.length - 1}
                  >
                    <NextSampleIcon />
                  </IconButton>
                  
                  {/* Sample counter */}
                  <Typography variant="caption" color="text.secondary">
                    {execution.currentSampleIndex + 1}/{execution.samples.length}
                  </Typography>
                </Box>
              )}
              {!batchMode && !onSampleChange && (
                <Chip 
                  label={currentSample.name}
                  color="primary"
                  size="small"
                />
              )}
            </Box>

            {/* Right side - Action buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Correction button */}
              {canCorrect && (
                <Tooltip title="Panel korekt">
                  <IconButton
                    onClick={handleCorrectionClick}
                    color="warning"
                    size="small"
                  >
                    <CorrectionIcon />
                  </IconButton>
                </Tooltip>
              )}

              {/* Complete step button */}
              {!isStepCompleted ? (
                <Button
                  onClick={onCompleteStep}
                  variant="contained"
                  color="success"
                  startIcon={<CompleteIcon />}
                  size="medium"
                  sx={{ minWidth: 140 }}
                  disabled={disabled}
                >
                  Zakończ krok
                </Button>
              ) : (
                <Chip 
                  label="Zakończony"
                  color="success"
                  icon={<CompleteIcon />}
                  size="small"
                />
              )}
            </Box>
          </Box>

          {/* Compact progress bar */}
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ height: 3, borderRadius: 1 }} 
          />
        </Container>
      </Paper>

      {/* Correction Panel Drawer */}
      <Drawer
        anchor="right"
        open={correctionPanelOpen}
        onClose={() => setCorrectionPanelOpen(false)}
        PaperProps={{
          sx: { width: 600, maxWidth: '90vw' }
        }}
      >
        <CorrectionPanel
          execution={execution}
          currentSample={currentSample}
          onGoToStepForCorrection={onGoToStepForCorrection}
          onEditMeasurement={onEditMeasurement}
          getSampleCurrentStep={getSampleCurrentStep}
        />
      </Drawer>
    </>
  );
};
