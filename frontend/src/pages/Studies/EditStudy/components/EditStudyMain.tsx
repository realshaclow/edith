import React from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Stack,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  SaveAlt as SaveDraftIcon,
  Cancel as CancelIcon,
  NavigateNext as NextIcon,
  NavigateBefore as BackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { EditStudyMode } from '../types';
import { useEditStudy } from '../hooks';
import { generateStudySteps, getCompletionPercentage } from '../utils';
import BasicInfoStep from './BasicInfoStep';
import ProtocolSelectionStep from './ProtocolSelectionStep';
import TimelineStep from './TimelineStep';
import TeamStep from './TeamStep';
import SettingsStep from './SettingsStep';
import ReviewStep from './ReviewStep';

interface EditStudyMainProps {
  mode?: EditStudyMode;
  onSave?: () => void;
  onCancel?: () => void;
}

const EditStudyMain: React.FC<EditStudyMainProps> = ({
  mode = 'create',
  onSave,
  onCancel,
}) => {
  const { id: studyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const {
    formData,
    validation,
    progress,
    config,
    isLoading,
    isSaving,
    isDirty,
    lastSaved,
    error,
    actions,
  } = useEditStudy({
    studyId,
    mode,
    autoSave: true,
  });

  const steps = generateStudySteps();
  const completionPercentage = getCompletionPercentage(validation);

  const handleSave = async () => {
    const success = await actions.saveStudy();
    if (success) {
      onSave?.();
      navigate('/studies');
    }
  };

  const handleSaveDraft = async () => {
    await actions.saveDraft();
  };

  const handleCancel = () => {
    if (isDirty) {
      const confirmed = window.confirm(
        'Czy na pewno chcesz anulować? Niezapisane zmiany zostaną utracone.'
      );
      if (!confirmed) return;
    }
    onCancel?.();
    navigate('/studies');
  };

  const getStepComponent = (stepId: string) => {
    switch (stepId) {
      case 'basic-info':
        return (
          <BasicInfoStep
            formData={formData}
            validation={validation}
            onUpdate={actions.updateField}
            onUpdateMultiple={actions.updateMultipleFields}
          />
        );
      case 'protocol-selection':
        return (
          <ProtocolSelectionStep
            formData={formData}
            validation={validation}
            onUpdate={actions.updateField}
          />
        );
      case 'timeline':
        return (
          <TimelineStep
            formData={formData}
            validation={validation}
            onUpdate={actions.updateField}
          />
        );
      case 'team':
        return (
          <TeamStep
            formData={formData}
            validation={validation}
            onUpdate={actions.updateField}
            onAddCollaborator={actions.addCollaborator}
            onRemoveCollaborator={actions.removeCollaborator}
          />
        );
      case 'settings':
        return (
          <SettingsStep
            formData={formData}
            validation={validation}
            onUpdate={actions.updateField}
            onAddTag={actions.addTag}
            onRemoveTag={actions.removeTag}
          />
        );
      case 'review':
        return (
          <ReviewStep
            formData={formData}
            validation={validation}
            originalStudy={null}
            mode={mode}
          />
        );
      default:
        return null;
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'create':
        return 'Tworzenie nowego badania';
      case 'edit':
        return 'Edycja badania';
      case 'duplicate':
        return 'Duplikowanie badania';
      case 'template':
        return 'Tworzenie szablonu badania';
      default:
        return 'Badanie';
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <LinearProgress />
          <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
            Ładowanie danych badania...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {getModeTitle()}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              {lastSaved && (
                <Typography variant="caption" color="text.secondary">
                  Ostatni zapis: {lastSaved.toLocaleTimeString()}
                </Typography>
              )}
              {isSaving && <Chip label="Zapisywanie..." size="small" color="info" />}
              {isDirty && <Chip label="Niezapisane zmiany" size="small" color="warning" />}
            </Stack>
          </Box>

          {/* Progress indicator */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Postęp wypełnienia
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completionPercentage}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={completionPercentage}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>

          {/* Error display */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Action buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Anuluj
            </Button>
            {mode === 'edit' && config.allowPartialSave && (
              <Button
                variant="outlined"
                startIcon={<SaveDraftIcon />}
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                Zapisz szkic
              </Button>
            )}
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={isSaving || (!progress.isValid && !config.allowPartialSave)}
            >
              {mode === 'create' ? 'Utwórz badanie' : 'Zapisz zmiany'}
            </Button>
          </Stack>
        </Paper>

        {/* Stepper */}
        <Paper sx={{ p: 3 }}>
          <Stepper activeStep={progress.currentStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step key={step.id}>
                <StepLabel
                  optional={
                    step.optional && (
                      <Typography variant="caption">Opcjonalne</Typography>
                    )
                  }
                >
                  {step.title}
                </StepLabel>
                <StepContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {step.description}
                  </Typography>
                  
                  {getStepComponent(step.id)}
                  
                  <Divider sx={{ my: 3 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      startIcon={<BackIcon />}
                      onClick={actions.previousStep}
                      disabled={progress.currentStep === 0}
                    >
                      Poprzedni
                    </Button>
                    <Button
                      variant="contained"
                      endIcon={<NextIcon />}
                      onClick={actions.nextStep}
                      disabled={progress.currentStep === steps.length - 1}
                    >
                      {progress.currentStep === steps.length - 1 ? 'Zakończ' : 'Następny'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditStudyMain;
