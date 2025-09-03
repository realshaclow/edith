import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Container,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  Save,
  Refresh,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { Toaster } from 'react-hot-toast';
import { useCreateStudy } from './hooks/useCreateStudy';
import {
  BasicInfoStep,
  ProtocolSelectionStep,
  ParametersStep,
  SettingsStep,
  TimelineStep,
  ResourcesStep,
  ReviewStep
} from './components';
import { CreateStudyStep } from './types';

const STEP_LABELS: Record<CreateStudyStep, string> = {
  'basic-info': 'Podstawowe informacje',
  'protocol-selection': 'Wybór protokołu',
  'parameters': 'Parametry',
  'settings': 'Ustawienia',
  'timeline': 'Harmonogram',
  'resources': 'Zasoby',
  'review': 'Przegląd'
};

const STEP_DESCRIPTIONS: Record<CreateStudyStep, string> = {
  'basic-info': 'Podaj nazwę, opis i cele badania',
  'protocol-selection': 'Wybierz protokół badawczy do wykorzystania',
  'parameters': 'Skonfiguruj parametry badania',
  'settings': 'Ustaw warunki próbek i środowiska',
  'timeline': 'Zaplanuj harmonogram badania',
  'resources': 'Określ potrzebne zasoby i budżet',
  'review': 'Sprawdź dane i utwórz badanie'
};

const STEPS: CreateStudyStep[] = [
  'basic-info',
  'protocol-selection',
  'parameters',
  'settings',
  'timeline',
  'resources',
  'review'
];

interface CreateStudyProps {
  initialProtocolId?: string;
}

const CreateStudy: React.FC<CreateStudyProps> = ({ initialProtocolId }) => {
  const { protocolId } = useParams<{ protocolId?: string }>();
  const navigate = useNavigate();
  
  const {
    studyData,
    selectedProtocol,
    errors,
    isLoading,
    currentStep,
    isStepValid,
    updateStudyData,
    setSelectedProtocol,
    validateStep,
    nextStep,
    previousStep,
    goToStep,
    submitStudy,
    resetForm
  } = useCreateStudy(initialProtocolId || protocolId);

  const currentStepIndex = STEPS.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === STEPS.length - 1;

  const handleStepClick = (step: CreateStudyStep) => {
    // Pozwól przejście tylko do wcześniejszych kroków lub aktualnego
    const stepIndex = STEPS.indexOf(step);
    if (stepIndex <= currentStepIndex) {
      goToStep(step);
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleSubmit = async () => {
    const success = await submitStudy();
    if (!success) {
      // Błąd jest już obsłużony w hooku
    }
  };

  const handleReset = () => {
    if (window.confirm('Czy na pewno chcesz zresetować formularz? Wszystkie wprowadzone dane zostaną utracone.')) {
      resetForm();
    }
  };

  const getStepProgress = () => {
    // Tylko wymagane kroki liczymy do postępu
    const requiredSteps: CreateStudyStep[] = ['basic-info', 'protocol-selection', 'settings', 'timeline'];
    const completedRequiredSteps = requiredSteps.filter(step => isStepValid(step)).length;
    return (completedRequiredSteps / requiredSteps.length) * 100;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic-info':
        return (
          <BasicInfoStep
            studyData={studyData}
            errors={errors}
            onUpdate={updateStudyData}
          />
        );
      case 'protocol-selection':
        return (
          <ProtocolSelectionStep
            selectedProtocol={selectedProtocol}
            errors={errors}
            onSelectProtocol={setSelectedProtocol}
          />
        );
      case 'parameters':
        return (
          <ParametersStep
            studyData={studyData}
            errors={errors}
            onUpdate={updateStudyData}
          />
        );
      case 'settings':
        return (
          <SettingsStep
            studyData={studyData}
            errors={errors}
            onUpdate={updateStudyData}
          />
        );
      case 'timeline':
        return (
          <TimelineStep
            studyData={studyData}
            errors={errors}
            onUpdate={updateStudyData}
          />
        );
      case 'resources':
        return (
          <ResourcesStep
            studyData={studyData}
            errors={errors}
            onUpdate={updateStudyData}
          />
        );
      case 'review':
        return (
          <ReviewStep
            studyData={studyData}
            selectedProtocol={selectedProtocol}
            isStepValid={(step: string) => isStepValid(step as CreateStudyStep)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg">
      <Toaster position="top-right" />
      
      <Box py={3}>
        {/* Header */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom>
                  Tworzenie nowego badania
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {STEP_DESCRIPTIONS[currentStep]}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={2}>
                <Tooltip title="Resetuj formularz">
                  <IconButton onClick={handleReset} color="secondary">
                    <Refresh />
                  </IconButton>
                </Tooltip>
                
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/studies')}
                >
                  Powrót do listy
                </Button>
              </Box>
            </Box>

            {/* Progress */}
            <Box mb={2}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" color="text.secondary">
                  Postęp: {currentStepIndex + 1} z {STEPS.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Math.round(getStepProgress())}% ukończone
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getStepProgress()} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>

            {/* Step indicator chips */}
            <Box display="flex" gap={1} flexWrap="wrap">
              {STEPS.map((step, index) => (
                <Chip
                  key={step}
                  label={STEP_LABELS[step]}
                  variant={step === currentStep ? 'filled' : 'outlined'}
                  color={
                    step === currentStep ? 'primary' :
                    isStepValid(step) ? 'success' : 'default'
                  }
                  icon={
                    isStepValid(step) ? <CheckCircle /> :
                    index <= currentStepIndex ? <Warning /> : undefined
                  }
                  onClick={() => handleStepClick(step)}
                  sx={{ 
                    cursor: index <= currentStepIndex ? 'pointer' : 'default',
                    opacity: index <= currentStepIndex ? 1 : 0.6
                  }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Step Content */}
        <Box mb={3}>
          {renderStepContent()}
        </Box>

        {/* Navigation */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              onClick={handlePrevious}
              disabled={isFirstStep || isLoading}
              startIcon={<ArrowBack />}
              variant="outlined"
            >
              Poprzedni
            </Button>

            <Box display="flex" alignItems="center" gap={2}>
              {currentStep === 'review' && (
                <Chip
                  label={
                    STEPS.every(step => isStepValid(step)) 
                      ? 'Gotowe do utworzenia' 
                      : 'Sprawdź wymagane pola'
                  }
                  color={
                    STEPS.every(step => isStepValid(step)) 
                      ? 'success' 
                      : 'warning'
                  }
                  icon={
                    STEPS.every(step => isStepValid(step)) 
                      ? <CheckCircle /> 
                      : <Warning />
                  }
                />
              )}
            </Box>

            {isLastStep ? (
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !STEPS.every(step => isStepValid(step))}
                startIcon={<Save />}
                variant="contained"
                size="large"
              >
                {isLoading ? 'Tworzenie...' : 'Utwórz badanie'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isStepValid(currentStep) || isLoading}
                endIcon={<ArrowForward />}
                variant="contained"
              >
                Następny
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateStudy;
