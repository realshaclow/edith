import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stepper,
  Step,
  StepLabel,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  ArrowBack,
  ArrowForward,
  Save,
  Assessment,
  Warning,
  CheckCircle,
  Schedule,
  Person,
  Science
} from '@mui/icons-material';
import { Toaster } from 'react-hot-toast';
import { useExecuteStudy } from './hooks/useExecuteStudy';
import { ExecutionView } from './types';
import {
  OverviewPanel,
  ProtocolReviewPanel,
  SamplePreparationPanel,
  ExecutionPanel,
  ResultsPanel,
  ReportPanel
} from './components';

const VIEW_LABELS: Record<ExecutionView, string> = {
  'overview': 'Przegląd',
  'protocol-review': 'Protokół',
  'sample-preparation': 'Przygotowanie próbek',
  'execution': 'Wykonywanie',
  'results': 'Wyniki',
  'report': 'Raport'
};

const VIEW_ICONS: Record<ExecutionView, React.ReactNode> = {
  'overview': <Assessment />,
  'protocol-review': <Science />,
  'sample-preparation': <Schedule />,
  'execution': <PlayArrow />,
  'results': <CheckCircle />,
  'report': <Assessment />
};

interface ExecuteStudyProps {
  studyId?: string;
}

const ExecuteStudy: React.FC<ExecuteStudyProps> = ({ studyId: propStudyId }) => {
  const { id: paramStudyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const studyId = propStudyId || paramStudyId;
  
  const {
    context,
    session,
    progress,
    currentView,
    isLoading,
    error,
    startExecution,
    pauseExecution,
    resumeExecution,
    stopExecution,
    nextStep,
    previousStep,
    nextSample,
    previousSample,
    updateMeasurement,
    updateParameter,
    updateCondition,
    completeStep,
    saveSession,
    generateReport,
    setView
  } = useExecuteStudy();

  // Initialize execution if studyId is provided
  useEffect(() => {
    console.log('ExecuteStudy Debug:', { studyId, session, contextStudyId: context.studyId });
    if (studyId && !session && !context.studyId) {
      console.log('Starting execution for studyId:', studyId);
      const operator = 'Current User'; // Should be from auth context
      startExecution(studyId, operator);
    }
  }, [studyId, session, context.studyId, startExecution]);

  const handleViewChange = (view: ExecutionView) => {
    setView(view);
  };

  const handleStartPause = () => {
    if (!session) return;
    
    if (session.status === 'active') {
      pauseExecution();
    } else if (session.status === 'paused') {
      resumeExecution();
    }
  };

  const handleStop = () => {
    if (window.confirm('Czy na pewno chcesz przerwać wykonywanie badania?')) {
      stopExecution();
    }
  };

  const handleSave = async () => {
    await saveSession();
  };

  const handleGenerateReport = async (): Promise<boolean> => {
    return await generateReport();
  };

  const handleBackToStudies = () => {
    navigate('/studies');
  };

  const getStatusColor = () => {
    if (!session) return 'default';
    switch (session.status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'primary';
      case 'aborted': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = () => {
    if (!session) return <Schedule />;
    switch (session.status) {
      case 'active': return <PlayArrow />;
      case 'paused': return <Pause />;
      case 'completed': return <CheckCircle />;
      case 'aborted': return <Stop />;
      default: return <Schedule />;
    }
  };

  const renderViewContent = () => {
    switch (currentView) {
      case 'overview':
        return <OverviewPanel context={context} session={session} progress={progress} onStartExecution={startExecution} />;
      case 'protocol-review':
        return <ProtocolReviewPanel protocol={context.protocol} onNext={() => setView('sample-preparation')} />;
      case 'sample-preparation':
        return <SamplePreparationPanel samples={context.samples} onNext={() => setView('execution')} />;
      case 'execution':
        return (
          <ExecutionPanel 
            context={context} 
            session={session} 
            onNext={nextStep} 
            onPrevious={previousStep}
            onUpdateMeasurement={updateMeasurement}
            onUpdateParameter={updateParameter}
            onUpdateCondition={updateCondition}
            onCompleteStep={completeStep}
          />
        );
      case 'results':
        return <ResultsPanel session={session} context={context} />;
      case 'report':
        return <ReportPanel session={session} context={context} onGenerateReport={handleGenerateReport} />;
      default:
        return <OverviewPanel context={context} session={session} progress={progress} onStartExecution={startExecution} />;
    }
  };

  if (!studyId || studyId.trim() === '') {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          <AlertTitle>Brak ID badania</AlertTitle>
          Nie można rozpocząć wykonywania badania bez podania ID badania.
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              StudyId: "{studyId}" (type: {typeof studyId})
            </Typography>
          </Box>
        </Alert>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">
          <AlertTitle>Błąd</AlertTitle>
          {error}
          <Box mt={2}>
            <Button variant="contained" onClick={handleBackToStudies}>
              Powrót do listy badań
            </Button>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs>
            <Typography variant="h4" component="h1" gutterBottom>
              Wykonywanie badania
            </Typography>
            {context.studyName && (
              <Typography variant="h6" color="text.secondary">
                {context.studyName}
              </Typography>
            )}
          </Grid>
          
          <Grid item>
            <Box display="flex" alignItems="center" gap={2}>
              {session && (
                <Chip
                  icon={getStatusIcon()}
                  label={session.status.toUpperCase()}
                  color={getStatusColor()}
                  variant="outlined"
                />
              )}
              
              <Tooltip title="Operator">
                <Chip icon={<Person />} label={context.operator} />
              </Tooltip>
              
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handleBackToStudies}
              >
                Powrót
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Progress Bar */}
        {session && (
          <Box mt={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="body2" color="text.secondary">
                Postęp: Próbka {progress.currentSample + 1}/{progress.totalSamples}, 
                Krok {progress.currentStep + 1}/{progress.totalSteps}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round((progress.completedSteps / (progress.totalSteps * progress.totalSamples)) * 100)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(progress.completedSteps / (progress.totalSteps * progress.totalSamples)) * 100}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}
      </Paper>

      {/* Navigation */}
      <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" gap={1}>
            {Object.entries(VIEW_LABELS).map(([view, label]) => (
              <Button
                key={view}
                variant={currentView === view ? 'contained' : 'outlined'}
                startIcon={VIEW_ICONS[view as ExecutionView]}
                onClick={() => handleViewChange(view as ExecutionView)}
                size="small"
              >
                {label}
              </Button>
            ))}
          </Box>

          {session && (
            <Box display="flex" gap={1}>
              <Tooltip title={session.status === 'active' ? 'Wstrzymaj' : 'Wznów'}>
                <IconButton
                  onClick={handleStartPause}
                  color={session.status === 'active' ? 'warning' : 'success'}
                  disabled={session.status === 'completed' || session.status === 'aborted'}
                >
                  {session.status === 'active' ? <Pause /> : <PlayArrow />}
                </IconButton>
              </Tooltip>

              <Tooltip title="Zatrzymaj">
                <IconButton
                  onClick={handleStop}
                  color="error"
                  disabled={session.status === 'completed' || session.status === 'aborted'}
                >
                  <Stop />
                </IconButton>
              </Tooltip>

              <Tooltip title="Zapisz sesję">
                <IconButton onClick={handleSave} color="primary">
                  <Save />
                </IconButton>
              </Tooltip>

              <Tooltip title="Generuj raport">
                <IconButton onClick={handleGenerateReport} color="primary">
                  <Assessment />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Main Content */}
      <Paper elevation={1} sx={{ minHeight: '60vh' }}>
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <LinearProgress sx={{ width: '100%' }} />
          </Box>
        ) : (
          renderViewContent()
        )}
      </Paper>

      {/* Sample Navigation */}
      {session && context.samples.length > 1 && (
        <Paper elevation={1} sx={{ p: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Próbki
          </Typography>
          <Box display="flex" gap={1} alignItems="center">
            <IconButton
              onClick={previousSample}
              disabled={progress.currentSample === 0}
            >
              <ArrowBack />
            </IconButton>
            
            <Box display="flex" gap={1} mx={2}>
              {context.samples.map((sample, index) => (
                <Chip
                  key={sample.id}
                  label={`${index + 1}`}
                  color={index === progress.currentSample ? 'primary' : 'default'}
                  variant={index === progress.currentSample ? 'filled' : 'outlined'}
                  clickable
                  onClick={() => {/* goToSample(index) */}}
                />
              ))}
            </Box>
            
            <IconButton
              onClick={nextSample}
              disabled={progress.currentSample === context.samples.length - 1}
            >
              <ArrowForward />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default ExecuteStudy;
