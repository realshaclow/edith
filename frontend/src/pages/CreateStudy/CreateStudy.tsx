import React from 'react';
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  useTheme,
  Container,
  Alert,
  LinearProgress,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon,
  Science as ScienceIcon,
  Info as InfoIcon,
  Tune as TuneIcon,
  Thermostat as TestIcon,
  Schedule as SessionIcon,
  Assessment as MeasurementIcon,
  Person as OperatorIcon,
  Preview as ReviewIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCreateStudy } from './hooks/useCreateStudy';
import { StepMeasurementsStep } from './components/StepMeasurementsStep';
import { BasicInfoStep } from './components/BasicInfoStep';
import { SampleConfigurationStep } from './components/SampleConfigurationStep';
import { ProtocolSelectionStep } from './components/ProtocolSelectionStep';
import { SessionConfigurationStep } from './components/SessionConfigurationStep';
import { OperatorEquipmentStep } from './components/OperatorEquipmentStep';
import { ReviewStep } from './components/ReviewStep';
import { TestConditionsStep } from './components/TestConditionsStep';

// Wszystkie komponenty kroków są już zaimplementowane

const stepIcons = {
  'protocol-selection': <ScienceIcon />,
  'basic-info': <InfoIcon />,
  'sample-configuration': <TuneIcon />,
  'test-conditions': <TestIcon />,
  'session-configuration': <SessionIcon />,
  'step-measurements': <MeasurementIcon />,
  'operator-equipment': <OperatorIcon />,
  'review': <ReviewIcon />,
};

const stepLabels = {
  'protocol-selection': 'Wybór Protokołu',
  'basic-info': 'Podstawowe Info',
  'sample-configuration': 'Konfiguracja Próbek',
  'test-conditions': 'Warunki Testowe',
  'session-configuration': 'Konfiguracja Sesji',
  'step-measurements': 'Pomiary dla Kroków',
  'operator-equipment': 'Operator i Sprzęt',
  'review': 'Przegląd',
};

// Tymczasowe komponenty-placeholder
const PlaceholderStep: React.FC<{ stepName: string }> = ({ stepName }) => (
  <Box sx={{ textAlign: 'center', py: 8 }}>
    <Typography variant="h5" gutterBottom>
      {stepLabels[stepName as keyof typeof stepLabels]}
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Ten krok będzie zaimplementowany w następnej iteracji.
    </Typography>
    <Alert severity="info" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
      Obecnie skupiamy się na kroku "Pomiary dla Kroków" - sercu całego systemu.
    </Alert>
  </Box>
);

const CreateStudy: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const {
    currentStep,
    studyData,
    protocolData,
    isLoading,
    errors,
    currentStepIndex,
    totalSteps,
    isFirstStep,
    isLastStep,
    updateStudyData,
    setProtocol,
    goToNextStep,
    goToPreviousStep,
    validateCurrentStep,
    createStudy,
    addMeasurementToStep,
    removeMeasurementFromStep,
    updateMeasurementInStep,
    addSuggestedMeasurements,
    totalMeasurements,
    isStudyReady,
    steps,
  } = useCreateStudy();

  const handleNext = async () => {
    if (isLastStep) {
      const result = await createStudy();
      if (result.success) {
        navigate(`/studies/${result.data.id}`);
      }
    } else if (validateCurrentStep()) {
      goToNextStep();
    }
  };

  const handlePrevious = () => {
    goToPreviousStep();
  };

  const handleCancel = () => {
    navigate('/studies');
  };

  const renderStepContent = () => {
    const commonProps = {
      studyData,
      protocolData: protocolData || undefined,
      errors,
      onUpdateStudyData: updateStudyData,
      onNext: handleNext,
      onPrevious: handlePrevious,
      isFirstStep,
      isLastStep,
      isValid: Object.keys(errors).length === 0,
    };

    switch (currentStep) {
      case 'protocol-selection':
        return (
          <ProtocolSelectionStep 
            {...commonProps} 
            onSetProtocol={setProtocol} 
          />
        );
      
      case 'basic-info':
        return <BasicInfoStep {...commonProps} />;
      
      case 'sample-configuration':
        return <SampleConfigurationStep {...commonProps} />;
      
      case 'test-conditions':
        return <TestConditionsStep {...commonProps} />;
      
      case 'session-configuration':
        return <SessionConfigurationStep {...commonProps} />;
      
      case 'step-measurements':
        return (
          <StepMeasurementsStep 
            {...commonProps}
            protocolData={protocolData || undefined}
            onAddMeasurement={addMeasurementToStep}
            onRemoveMeasurement={removeMeasurementFromStep}
            onUpdateMeasurement={updateMeasurementInStep}
            onAddSuggestedMeasurements={addSuggestedMeasurements}
          />
        );
      
      case 'operator-equipment':
        return <OperatorEquipmentStep {...commonProps} />;
      
      case 'review':
        return <ReviewStep {...commonProps} />;
      
      default:
        return null;
    }
  };

  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ flex: 1, py: 4, pb: 12 }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'background.paper',
            minHeight: '85vh',
          }}
        >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Utwórz Nowe Studium
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Skonfiguruj wszystkie parametry dla nowego studium badawczego z pomiarami per krok protokołu.
          </Typography>
          
          {/* Progress Bar */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              Krok {currentStepIndex + 1} z {totalSteps} ({Math.round(progress)}%)
              {totalMeasurements > 0 && ` • ${totalMeasurements} pomiarów skonfigurowanych`}
            </Typography>
          </Box>
        </Box>

        {/* Stepper */}
        <Stepper 
          activeStep={currentStepIndex} 
          alternativeLabel
          sx={{ 
            mb: 4,
            '& .MuiStepLabel-root': {
              cursor: 'pointer',
            },
          }}
        >
          {steps.map((step, index) => (
            <Step key={step}>
              <StepLabel
                StepIconComponent={() => (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: index <= currentStepIndex 
                        ? theme.palette.primary.main 
                        : theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300',
                      color: index <= currentStepIndex 
                        ? theme.palette.primary.contrastText 
                        : theme.palette.text.secondary,
                      transition: 'all 0.2s ease-in-out',
                      // Highlight the measurements step
                      border: step === 'step-measurements' ? `2px solid ${theme.palette.success.main}` : 'none',
                    }}
                  >
                    {stepIcons[step]}
                  </Box>
                )}
              >
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontWeight: index === currentStepIndex ? 600 : 400,
                    color: index === currentStepIndex 
                      ? theme.palette.primary.main 
                      : step === 'step-measurements'
                      ? theme.palette.success.main
                      : theme.palette.text.secondary,
                  }}
                >
                  {stepLabels[step]}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Alert */}
        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Proszę poprawić następujące błędy:
            </Typography>
            <ul style={{ margin: '8px 0 0 20px' }}>
              {Object.entries(errors).map(([field, fieldErrors]) => (
                <li key={field}>
                  {fieldErrors.join(', ')}
                </li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Step Content */}
        <Box sx={{ minHeight: '400px', mb: 4 }}>
          {renderStepContent()}
        </Box>

        {/* Footer info */}
        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" display="block">
            💡 <strong>Tip:</strong> Krok "Pomiary dla Kroków" pozwala zdefiniować jakie konkretne dane 
            będą zbierane podczas wykonywania każdego kroku protokołu w sesji badawczej.
          </Typography>
          {protocolData && (
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
              📋 <strong>Protokół:</strong> {protocolData.title} • 
              <strong> Kategoria:</strong> {protocolData.category} • 
              <strong> Czas:</strong> {protocolData.estimatedDuration}
            </Typography>
          )}
        </Box>
      </Paper>
      </Container>

      {/* Sticky Footer with Navigation */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          p: 2,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              onClick={handleCancel}
              variant="outlined"
              color="secondary"
              sx={{ minWidth: 120 }}
            >
              Anuluj
            </Button>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                onClick={handlePrevious}
                disabled={isFirstStep}
                variant="outlined"
                sx={{ minWidth: 120 }}
              >
                Wstecz
              </Button>
              
              <Button
                onClick={handleNext}
                variant="contained"
                disabled={isLoading}
                sx={{ minWidth: 120 }}
              >
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : isLastStep ? (
                  'Zakończ'
                ) : (
                  'Dalej'
                )}
              </Button>
            </Box>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};

export { CreateStudy };
