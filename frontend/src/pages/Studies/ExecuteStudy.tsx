import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Divider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Save as SaveIcon,
  CheckCircle as CompleteIcon,
  Warning as WarningIcon,
  Assignment as TaskIcon,
  Science as ScienceIcon,
  DataUsage as DataIcon,
  Timer as TimerIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Upload as UploadIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { StudyTemplate, StudySession, DataCollectionStep, DataPoint, SampleData, StudySettings } from '../../types';
import { useStudies } from '../../hooks';

const ExecuteStudy: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fetchStudy, study, isLoading, createStudySession } = useStudies();
  
  const [studyTemplate, setStudyTemplate] = useState<StudyTemplate | null>(null);
  const [session, setSession] = useState<StudySession | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [sessionStatus, setSessionStatus] = useState<'preparing' | 'in_progress' | 'paused' | 'completed' | 'cancelled'>('preparing');
  const [samples, setSamples] = useState<SampleData[]>([]);
  const [currentSample, setCurrentSample] = useState<SampleData | null>(null);
  const [dataDialog, setDataDialog] = useState(false);
  const [editingDataPoint, setEditingDataPoint] = useState<any>(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [autoSave, setAutoSave] = useState(true);

  useEffect(() => {
    if (id) {
      fetchStudy(id);
    }
  }, [id, fetchStudy]);

  useEffect(() => {
    if (study) {
      // Convert Study to StudyTemplate format for compatibility
      const template: StudyTemplate = {
        id: study.id,
        name: study.name,
        description: study.description,
        protocolId: study.protocolId || undefined,
        protocolName: study.protocolName,
        category: study.category,
        dataCollectionPlan: [], // Will be loaded from protocol
        parameters: [],
        settings: (study.settings as StudySettings) || {
          sampleSettings: {
            minSamples: 3,
            maxSamples: 20,
            defaultSamples: 5,
            sampleNaming: 'automatic',
            samplePrefix: 'SAMPLE'
          },
          repetitionSettings: {
            allowRepetitions: true,
            maxRepetitions: 3,
            repetitionNaming: 'automatic'
          },
          validationSettings: {
            requireAllSteps: true,
            allowSkippingOptional: false,
            requireApproval: false
          },
          exportSettings: {
            autoExport: false,
            exportFormat: 'xlsx',
            includeCalculations: true,
            includeCharts: true
          }
        },
        status: study.status === 'ACTIVE' ? 'active' : 'draft',
        createdAt: study.createdAt,
        updatedAt: study.updatedAt,
        createdBy: study.createdBy
      };
      
      setStudyTemplate(template);
      initializeSamples(template);
    }
  }, [study]);

  

  const initializeSamples = (template: StudyTemplate) => {
    const sampleCount = template.settings.sampleSettings.defaultSamples;
    const prefix = template.settings.sampleSettings.samplePrefix;
    
    const newSamples: SampleData[] = Array.from({ length: sampleCount }, (_, index) => ({
      id: `sample-${index + 1}`,
      sampleNumber: index + 1,
      sampleName: `${prefix}-${(index + 1).toString().padStart(2, '0')}`,
      status: 'pending',
      data: {},
      measurements: {},
      startTime: undefined,
      endTime: undefined,
      notes: ''
    }));

    setSamples(newSamples);
  };

  const startSession = () => {
    if (!studyTemplate) return;

    const newSession: StudySession = {
      id: `session-${Date.now()}`,
      studyId: studyTemplate.id || '',
      operator: 'Current User',
      startTime: new Date(),
      data: {},
      notes: sessionNotes,
      status: 'in_progress',
      createdAt: new Date().toISOString()
    };

    setSession(newSession);
    setSessionStatus('in_progress');
    setCurrentSample(samples[0]);
  };

  const pauseSession = () => {
    setSessionStatus('paused');
    if (session) {
      setSession({
        ...session,
        status: 'in_progress'
      });
    }
  };

  const resumeSession = () => {
    setSessionStatus('in_progress');
    if (session) {
      setSession({
        ...session,
        status: 'in_progress'
      });
    }
  };

  const stopSession = () => {
    setSessionStatus('cancelled');
    if (session) {
      setSession({
        ...session,
        status: 'cancelled',
        endTime: new Date()
      });
    }
  };

  const completeSession = async () => {
    if (!session || !studyTemplate) return;

    try {
      // Zbierz wszystkie dane z próbek
      const allData: Record<string, number> = {};
      const completedSamples = samples.filter(s => s.status === 'completed');
      
      completedSamples.forEach((sample, index) => {
        if (sample.data) {
          Object.entries(sample.data).forEach(([key, value]) => {
            const prefixedKey = `sample${index + 1}_${key}`;
            if (typeof value === 'number') {
              allData[prefixedKey] = value;
            }
          });
        }
      });

      // Utwórz request do zapisania sesji
      const sessionRequest = {
        studyId: session.studyId,
        sampleId: completedSamples.length > 0 ? completedSamples[0].id : undefined,
        operator: session.operator,
        equipment: session.equipment,
        data: allData,
        conditions: session.conditions,
        notes: session.notes || sessionNotes
      };

      console.log('Saving session:', sessionRequest);
      
      // Zapisz sesję w API
      const savedSession = await createStudySession(sessionRequest);
      
      if (savedSession) {
        console.log('Session saved successfully:', savedSession);
        
        const completedSession = {
          ...session,
          id: savedSession.id, // Użyj ID z API
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
          progress: {
            ...session.progress,
            completedSteps: studyTemplate?.dataCollectionPlan.length || 0,
            completedSamples: completedSamples.length
          }
        };

        setSessionStatus('completed');
        setSession(completedSession);
      } else {
        console.error('Failed to save session');
        // TODO: Add error notification
      }
    } catch (error) {
      console.error('Error completing session:', error);
      // TODO: Add error notification
    }
  };

  const handleDataInput = (dataPointId: string, value: any) => {
    if (!currentSample || !session) return;

    const updatedSamples = samples.map(sample => {
      if (sample.id === currentSample.id) {
        return {
          ...sample,
          data: {
            ...sample.data,
            [dataPointId]: value
          }
        };
      }
      return sample;
    });

    setSamples(updatedSamples);
    setCurrentSample({
      ...currentSample,
      data: {
        ...currentSample.data,
        [dataPointId]: value
      }
    });

    if (autoSave) {
      // Auto-save logic
      console.log('Auto-saving data...');
    }
  };

  const nextStep = () => {
    if (activeStep < (studyTemplate?.dataCollectionPlan.length || 0) - 1) {
      setActiveStep(activeStep + 1);
    } else {
      completeCurrentSample();
    }
  };

  const prevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const completeCurrentSample = () => {
    if (!currentSample) return;

    const updatedSamples = samples.map(sample => {
      if (sample.id === currentSample.id) {
        return {
          ...sample,
          status: 'completed' as const,
          endTime: new Date().toISOString()
        };
      }
      return sample;
    });

    setSamples(updatedSamples);

    const nextSample = samples.find(s => s.status === 'pending');
    if (nextSample) {
      setCurrentSample(nextSample);
      setActiveStep(0);
    } else {
      completeSession();
    }
  };

  const switchToSample = (sample: SampleData) => {
    setCurrentSample(sample);
    setActiveStep(0);
  };

  const addSample = () => {
    if (!studyTemplate) return;

    const newSample: SampleData = {
      id: `sample-${Date.now()}`,
      sampleNumber: samples.length + 1,
      sampleName: `${studyTemplate.settings.sampleSettings.samplePrefix}-${(samples.length + 1).toString().padStart(2, '0')}`,
      status: 'pending',
      data: {},
      measurements: {},
      startTime: undefined,
      endTime: undefined,
      notes: ''
    };

    setSamples([...samples, newSample]);
  };

  const removeSample = (sampleId: string) => {
    const updatedSamples = samples.filter(s => s.id !== sampleId);
    setSamples(updatedSamples);
    
    if (currentSample?.id === sampleId) {
      const nextSample = updatedSamples.find(s => s.status === 'pending');
      setCurrentSample(nextSample || null);
    }
  };

  const exportResults = () => {
    // TODO: Implement export functionality
    console.log('Exporting results...', { session, samples });
  };

  if (!studyTemplate) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Ładowanie badania...</Typography>
      </Box>
    );
  }

  const currentStep = studyTemplate.dataCollectionPlan[activeStep];
  const completedSamplesCount = samples.filter(s => s.status === 'completed').length;
  const progress = ((completedSamplesCount * studyTemplate.dataCollectionPlan.length + activeStep) / 
    (samples.length * studyTemplate.dataCollectionPlan.length)) * 100;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate('/studies')} sx={{ mr: 1 }}>
            <BackIcon />
          </IconButton>
          <ScienceIcon sx={{ mr: 1, fontSize: 28 }} />
          <Box>
            <Typography variant="h4">
              {studyTemplate.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Protokół: {studyTemplate.protocolName}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={1}>
          {sessionStatus === 'preparing' && (
            <Button
              variant="contained"
              startIcon={<StartIcon />}
              onClick={startSession}
              disabled={samples.length === 0}
            >
              Rozpocznij sesję
            </Button>
          )}
          
          {sessionStatus === 'in_progress' && (
            <>
              <Button
                variant="outlined"
                startIcon={<PauseIcon />}
                onClick={pauseSession}
              >
                Pauza
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<StopIcon />}
                onClick={stopSession}
              >
                Zatrzymaj
              </Button>
            </>
          )}

          {sessionStatus === 'paused' && (
            <Button
              variant="contained"
              startIcon={<StartIcon />}
              onClick={resumeSession}
            >
              Wznów
            </Button>
          )}

          {(sessionStatus === 'completed' || sessionStatus === 'cancelled') && (
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportResults}
            >
              Eksportuj wyniki
            </Button>
          )}
        </Box>
      </Box>

      {/* Progress Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Postęp sesji
            </Typography>
            <Chip 
              label={sessionStatus === 'preparing' ? 'Przygotowanie' : 
                    sessionStatus === 'in_progress' ? 'W trakcie' :
                    sessionStatus === 'paused' ? 'Pauza' :
                    sessionStatus === 'completed' ? 'Ukończono' : 'Zatrzymano'}
              color={sessionStatus === 'completed' ? 'success' : 
                     sessionStatus === 'in_progress' ? 'primary' : 'default'}
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ mb: 1, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="text.secondary">
            {completedSamplesCount} z {samples.length} próbek ukończono | 
            Krok {activeStep + 1} z {studyTemplate.dataCollectionPlan.length}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Left Panel - Samples */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Próbki ({samples.length})
                </Typography>
                {sessionStatus === 'preparing' && (
                  <IconButton size="small" onClick={addSample}>
                    <AddIcon />
                  </IconButton>
                )}
              </Box>
              
              <List dense>
                {samples.map((sample) => (
                  <ListItem
                    key={sample.id}
                    button
                    selected={currentSample?.id === sample.id}
                    onClick={() => switchToSample(sample)}
                    sx={{
                      border: currentSample?.id === sample.id ? 2 : 1,
                      borderColor: currentSample?.id === sample.id ? 'primary.main' : 'divider',
                      borderRadius: 1,
                      mb: 1
                    }}
                  >
                    <ListItemIcon>
                      {sample.status === 'completed' ? (
                        <CompleteIcon color="success" />
                      ) : sample.status === 'in_progress' ? (
                        <TimerIcon color="primary" />
                      ) : (
                        <TaskIcon color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={sample.sampleName}
                      secondary={sample.status === 'completed' ? 'Ukończono' : 
                                sample.status === 'in_progress' ? 'W trakcie' : 'Oczekuje'}
                    />
                    {sessionStatus === 'preparing' && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSample(sample.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </ListItem>
                ))}
              </List>

              {sessionStatus === 'preparing' && (
                <Box mt={2}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Notatki sesji"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Dodaj notatki do tej sesji..."
                  />
                  
                  <FormControlLabel
                    control={
                      <Switch
                        checked={autoSave}
                        onChange={(e) => setAutoSave(e.target.checked)}
                      />
                    }
                    label="Automatyczny zapis"
                    sx={{ mt: 1 }}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Panel - Steps and Data Collection */}
        <Grid item xs={12} md={9}>
          {sessionStatus === 'preparing' ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Przygotowanie do sesji
                </Typography>
                <Typography variant="body1" paragraph>
                  Skonfiguruj próbki i rozpocznij sesję badawczą.
                </Typography>
                
                <Alert severity="info" sx={{ mb: 2 }}>
                  Przed rozpoczęciem sesji upewnij się, że wszystkie próbki są przygotowane 
                  zgodnie z protokołem {studyTemplate.protocolName}.
                </Alert>

                <Typography variant="subtitle1" gutterBottom>
                  Kroki do wykonania:
                </Typography>
                <List>
                  {studyTemplate.dataCollectionPlan.map((step, index) => (
                    <ListItem key={step.id}>
                      <ListItemIcon>
                        <Typography variant="h6" color="primary">
                          {index + 1}
                        </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={step.stepName}
                        secondary={step.description}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="between" alignItems="center" mb={3}>
                  <Typography variant="h6">
                    {currentStep?.stepName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Próbka: {currentSample?.sampleName}
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {currentStep?.description}
                </Typography>

                {/* Data Points */}
                <Grid container spacing={2}>
                  {currentStep?.dataPoints.map((dataPoint) => (
                    <Grid item xs={12} sm={6} key={dataPoint.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            {dataPoint.name}
                            {dataPoint.validation?.required && (
                              <Typography component="span" color="error"> *</Typography>
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {dataPoint.description}
                          </Typography>

                          {dataPoint.isCalculated ? (
                            <TextField
                              fullWidth
                              disabled
                              label="Wartość obliczona"
                              value={currentSample?.data[dataPoint.id] || 'Brak danych'}
                              InputProps={{
                                endAdornment: dataPoint.unit && (
                                  <Typography variant="body2" color="text.secondary">
                                    {dataPoint.unit}
                                  </Typography>
                                )
                              }}
                            />
                          ) : (
                            <TextField
                              fullWidth
                              type={dataPoint.dataType === 'number' ? 'number' : 'text'}
                              label="Wartość"
                              value={currentSample?.data[dataPoint.id] || ''}
                              onChange={(e) => handleDataInput(dataPoint.id, e.target.value)}
                              required={dataPoint.validation?.required}
                              InputProps={{
                                endAdornment: dataPoint.unit && (
                                  <Typography variant="body2" color="text.secondary">
                                    {dataPoint.unit}
                                  </Typography>
                                )
                              }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Navigation */}
                <Box display="flex" justifyContent="space-between" mt={4}>
                  <Button
                    disabled={activeStep === 0}
                    onClick={prevStep}
                  >
                    Poprzedni krok
                  </Button>
                  
                  <Button
                    variant="contained"
                    onClick={nextStep}
                  >
                    {activeStep === studyTemplate.dataCollectionPlan.length - 1 
                      ? 'Ukończ próbkę' 
                      : 'Następny krok'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExecuteStudy;
