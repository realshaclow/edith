import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Container, Paper, Typography, Alert, CircularProgress, Grid } from '@mui/material';
import { useProfessionalStudyExecution as useStudyExecution } from './hooks/useProfessionalStudyExecution';
import { StudyExecution, StudySample } from './types/professional';
import { ProfessionalExecutionProgress } from './components/ProfessionalExecutionProgress';
import { IndividualSampleProgress } from './components/IndividualSampleProgress';
import { ProfessionalExecutionControls } from './components/ProfessionalExecutionControls';
import { ProfessionalEnvironmentPanel } from './components/ProfessionalEnvironmentPanel';
import { SessionPanel } from './components/SessionPanel';
import { SamplePanel } from './components/SamplePanel';
import { ProfessionalExecutionHeader } from './components/ProfessionalExecutionHeader';
import { ProfessionalStepCard } from './components/ProfessionalStepCard';
import { BatchStepCard } from './components/BatchStepCard';
import { TestConditionsPanel } from './components/TestConditionsPanel';
import { StickyExecutionNavigation } from './components/StickyExecutionNavigation';
import { CorrectionHistoryPanel } from './components/CorrectionHistoryPanel';
import { StudySummary } from './components/StudySummary';

export const ExecuteStudy: React.FC = () => {
  const { studyId } = useParams<{ studyId: string }>();
  // const [batchMode, setBatchMode] = useState(false); // Wyłączone na razie
  const batchMode = false; // Zawsze tryb indywidualny
  const {
    execution,
    isLoading,
    error,
    startTime,
    currentTime,
    isPaused,
    getElapsedTime,
    formatElapsedTime,
    isExecutionActive,
    startExecution,
    pauseExecution,
    resumeExecution,
    completeExecution,
    startSession,
    completeSession,
    goToStep,
    goToStepForCurrentSample,
    goToNextStepForCurrentSample,
    goToPreviousStepForCurrentSample,
    goToSample,
    completeSample,
    skipSample,
    updateMeasurement,
    updateTestCondition,
    updateEnvironment,
    addNote,
    completeCurrentStep,
    getSampleCurrentStep,
    getSampleProgress,
    completeStepForSample,
    uncompleteStepForSample,
    addCorrectionNote,
    goToStepForCorrection,
    editMeasurementInStep
  } = useStudyExecution(studyId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Ładowanie badania...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  const handleCompleteSample = (sampleId: string) => {
    completeSample(sampleId, 'pass'); // Default to 'pass' for compatibility
  };

  const handleSkipSample = (sampleId: string) => {
    skipSample(sampleId, 'Skipped by user'); // Default reason
  };

  const handleGoToStepForCorrection = (sampleId: string, stepIndex: number, reason?: string) => {
    goToStepForCorrection(stepIndex); // Original function takes only stepIndex
  };

  if (!execution) {
    return (
      <Container>
        <Alert severity="warning" sx={{ mt: 2 }}>
          Nie znaleziono badania do wykonania
        </Alert>
      </Container>
    );
  }

  const currentStep = execution.steps[execution.currentStepIndex];
  const currentSample = execution.samples[execution.currentSampleIndex];

  // W trybie grupowym używamy globalnego currentStepIndex, w indywidualnym - aktualny krok próbki
  const actualCurrentStepIndex = batchMode 
    ? execution.currentStepIndex
    : getSampleCurrentStep(currentSample); // W trybie indywidualnym używaj aktualnego kroku próbki
  
  const isStepCompleted = batchMode 
    ? execution.steps[execution.currentStepIndex]?.isCompleted 
    : currentSample.completedSteps.includes(execution.steps[actualCurrentStepIndex]?.id);

  const handleCompleteStep = async () => {
    console.log('🎯 handleCompleteStep called', {
      batchMode,
      actualCurrentStepIndex,
      currentSample: currentSample?.name,
      totalSteps: execution.steps.length,
      executionCurrentStepIndex: execution.currentStepIndex
    });
    
    if (batchMode) {
      // W trybie grupowym zakończ krok dla wszystkich próbek
      await completeCurrentStep();
    } else {
      // W trybie indywidualnym zakończ krok dla bieżącej próbki
      if (currentSample) {
        const currentStepId = execution.steps[actualCurrentStepIndex].id;
        console.log('📝 Completing step:', {
          stepId: currentStepId,
          stepIndex: actualCurrentStepIndex,
          stepTitle: execution.steps[actualCurrentStepIndex].title
        });
        
        await completeStepForSample(currentSample.id, currentStepId);
        
        // Automatycznie przejdź do następnego kroku jeśli nie jest to ostatni krok
        if (actualCurrentStepIndex < execution.steps.length - 1) {
          const nextStepIndex = actualCurrentStepIndex + 1;
          console.log('🔄 Auto-advancing to next step after completion:', {
            completedStepIndex: actualCurrentStepIndex,
            nextStepIndex: nextStepIndex,
            nextStepTitle: execution.steps[nextStepIndex]?.title
          });
          
          // Używamy setTimeout żeby dać czas na zaktualizowanie stanu po completeStepForSample
          setTimeout(() => {
            console.log('⏭️ Executing navigation to step:', nextStepIndex);
            // Po zakończeniu kroku, logika getSampleCurrentStep automatycznie zwróci następny krok
            // więc nie musimy explicite nawigować, ale dla pewności ustawimy execution.currentStepIndex
            goToStep(nextStepIndex);
          }, 100);
        } else {
          console.log('🏁 This is the last step, no auto-advance');
        }
      }
    }
  };

  // Sprawdź czy badanie jest ukończone
  if (execution?.status === 'COMPLETED') {
    return (
      <StudySummary
        execution={execution}
        onExportReport={() => console.log('Export report')}
        onSaveResults={() => console.log('Save results')}
        onBackToStudies={() => window.history.back()}
      />
    );
  }

  return (
    <Box sx={{ pb: 12 }}> {/* Padding bottom dla sticky navigation */}
      <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Professional Header */}
      <ProfessionalExecutionHeader 
        execution={execution}
        startTime={startTime}
        currentTime={currentTime}
        isPaused={isPaused}
        getElapsedTime={getElapsedTime}
        formatElapsedTime={formatElapsedTime}
        onStart={startExecution}
        onPause={pauseExecution}
        onResume={resumeExecution}
        onComplete={completeExecution}
      />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Main execution area */}
        <Grid item xs={12} lg={8}>
          {/* Progress - tryb indywidualny */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <IndividualSampleProgress
              execution={execution}
              currentSample={currentSample}
              onStepClick={goToStepForCurrentSample}
              onSampleChange={goToSample}
              getSampleCurrentStep={getSampleCurrentStep}
              getSampleProgress={getSampleProgress}
            />
          </Paper>

          {/* Test Conditions - Main Study Parameters */}
          <TestConditionsPanel
            execution={execution}
            currentSample={currentSample}
            disabled={!isExecutionActive()}
            onTestConditionUpdate={updateTestCondition}
          />

          {/* Current step - tryb indywidualny */}
          {currentStep && currentSample && (
            <ProfessionalStepCard
              step={currentStep}
              sample={currentSample}
              execution={execution}
              disabled={!isExecutionActive()}
              onMeasurementUpdate={(stepId: string, measurementId: string, value: string | number, notes?: string) => 
                updateMeasurement(currentSample.id, stepId, measurementId, value, notes)
              }
              onAddNote={addNote}
              onComplete={completeCurrentStep}
            />
          )}
        </Grid>

        {/* Right column - Management panels */}
        <Grid item xs={12} lg={4}>
            {/* Session Panel */}
            <SessionPanel
              execution={execution}
              onStartSession={startSession}
              onCompleteSession={completeSession}
            />

            {/* Sample Panel */}
            <Box sx={{ mt: 2 }}>
              <SamplePanel
                execution={execution}
                onSampleSelect={goToSample}
                onCompleteSample={handleCompleteSample}
                onSkipSample={handleSkipSample}
              />
            </Box>

            {/* Environment Panel */}
            <Box sx={{ mt: 2 }}>
              <ProfessionalEnvironmentPanel
                execution={execution}
                onEnvironmentUpdate={updateEnvironment}
              />
            </Box>

            {/* Correction History Panel */}
            <Box sx={{ mt: 2 }}>
              <CorrectionHistoryPanel
                execution={execution}
                currentSample={currentSample}
                onGoToStep={goToStepForCurrentSample}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Sticky Navigation */}
      <StickyExecutionNavigation
        execution={execution}
        currentSample={currentSample}
        batchMode={batchMode}
        disabled={!isExecutionActive()}
        getSampleCurrentStep={getSampleCurrentStep}
        getSampleProgress={getSampleProgress}
        onCompleteStep={handleCompleteStep}
        onGoToStepForCorrection={handleGoToStepForCorrection}
        onEditMeasurement={editMeasurementInStep}
        onSampleChange={goToSample}
        isStepCompleted={isStepCompleted}
      />
    </Box>
  );
};
