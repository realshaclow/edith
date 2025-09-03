import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Snackbar,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  Save as SaveIcon,
  Notifications as NotificationIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useStudyExecution } from './hooks/useStudyExecution';
import { useTimer } from './hooks/useTimer';
import { useStudies } from '../../../hooks/useStudies';
import { usePredefinedProtocols } from '../../../hooks/usePredefinedProtocols';
import TimerDisplay from './components/TimerDisplay';
import ProtocolInstructionsDisplay from './components/ProtocolInstructionsDisplay';
import DataCollectionPanel from './components/DataCollectionPanel';
import StepNavigation from './components/StepNavigation';
import {
  ExecutionStep,
  ExecutionSettings,
  ProtocolInstructions,
  ExecutionDataPoint
} from './types';
import { Study } from '../../../types';

// Funkcja do przekształcania protokołu na kroki wykonania
const transformProtocolToExecutionSteps = (protocol: any): ExecutionStep[] => {
  if (!protocol?.steps) return [];
  
  return protocol.steps.map((step: any, index: number) => ({
    id: step.id || `step-${index + 1}`,
    title: step.title || step.name || `Krok ${index + 1}`,
    description: step.description || '',
    instructions: step.instructions || [],
    duration: step.duration ? parseInt(step.duration.match(/\d+/)?.[0] || '10') : 10,
    safetyNotes: step.safety || [],
    requiredEquipment: step.equipment || [],
    dataPoints: step.dataPoints || [],
    tips: step.tips || [],
    criticalPoints: step.criticalPoints || []
  }));
};

// Funkcja do przekształcania ustawień studium na ustawienia wykonania
const transformStudySettingsToExecutionSettings = (studySettings: any): ExecutionSettings => {
  const sessionSettings = studySettings?.sessionSettings || {};
  const validationSettings = studySettings?.validationSettings || {};
  
  return {
    autoSave: sessionSettings.autoSaveInterval ? true : false,
    autoAdvance: false,
    requireApproval: validationSettings.requireApproval || false,
    allowPause: true,
    showTimer: true,
    showProgress: true,
    enableNotifications: true,
    soundNotifications: false,
    autoBackup: true,
    strictMode: validationSettings.requireAllSteps || false
  };
};

// Mock data - używane jako fallback gdy nie ma danych z API
const mockSettings: ExecutionSettings = {
  autoSave: true,
  autoAdvance: false,
  requireApproval: false,
  allowPause: true,
  showTimer: true,
  showProgress: true,
  enableNotifications: true,
  soundNotifications: false,
  autoBackup: true,
  strictMode: false
};

const mockSteps: ExecutionStep[] = [
  {
    id: 'step-1',
    title: 'Przygotowanie próbki',
    description: 'Przygotowanie próbki do badania według protokołu',
    instructions: [
      'Zważyć próbkę na wadze analitycznej',
      'Zmierzyć wymiary próbki',
      'Sprawdzić stan próbki'
    ],
    duration: 10,
    safetyNotes: ['Zachować ostrożność przy użyciu wagi analitycznej'],
    requiredEquipment: ['Waga analityczna', 'Suwmiarka'],
    dataPoints: [
      {
        id: 'weight',
        name: 'Masa próbki',
        type: 'measurement',
        unit: 'g',
        required: true,
        validationRules: [
          { type: 'required', message: 'Masa jest wymagana' },
          { type: 'min', value: 0.1, message: 'Masa musi być większa niż 0.1g' }
        ]
      },
      {
        id: 'dimensions',
        name: 'Wymiary próbki',
        type: 'observation',
        required: true,
        description: 'Długość x szerokość x wysokość w mm'
      }
    ]
  },
  {
    id: 'step-2',
    title: 'Kondycjonowanie',
    description: 'Kondycjonowanie próbki w określonych warunkach',
    instructions: [
      'Umieścić próbkę w komorze klimatycznej',
      'Ustawić temperaturę 23°C ± 2°C',
      'Ustawić wilgotność 50% ± 5%',
      'Kondycjonować przez 24h'
    ],
    duration: 1440, // 24h
    temperature: 23,
    autoAdvance: true,
    dataPoints: [
      {
        id: 'chamber_temp',
        name: 'Temperatura komory',
        type: 'measurement',
        unit: '°C',
        required: true,
        validationRules: [
          { type: 'range', value: { min: 21, max: 25 }, message: 'Temperatura musi być w zakresie 21-25°C' }
        ]
      },
      {
        id: 'chamber_humidity',
        name: 'Wilgotność komory',
        type: 'measurement',
        unit: '%',
        required: true,
        validationRules: [
          { type: 'range', value: { min: 45, max: 55 }, message: 'Wilgotność musi być w zakresie 45-55%' }
        ]
      }
    ]
  },
  {
    id: 'step-3',
    title: 'Badanie właściwości',
    description: 'Wykonanie badania właściwości mechanicznych',
    instructions: [
      'Zamocować próbkę w maszynie wytrzymałościowej',
      'Ustawić prędkość naciągania 5 mm/min',
      'Przeprowadzić test do zerwania',
      'Zarejestrować wyniki'
    ],
    duration: 15,
    safetyNotes: ['Uwaga na ruchome części maszyny', 'Używać okularów ochronnych'],
    dataPoints: [
      {
        id: 'max_force',
        name: 'Maksymalna siła',
        type: 'measurement',
        unit: 'N',
        required: true
      },
      {
        id: 'elongation',
        name: 'Wydłużenie przy zerwaniu',
        type: 'measurement',
        unit: 'mm',
        required: true
      },
      {
        id: 'break_image',
        name: 'Zdjęcie miejsca zerwania',
        type: 'image',
        required: false
      }
    ]
  }
];

const mockProtocolInstructions: ProtocolInstructions = {
  stepId: 'step-1',
  title: 'ASTM D638 - Właściwości rozciągające tworzyw sztucznych',
  overview: 'Test określa właściwości rozciągające tworzyw sztucznych w formie standardowych próbek testowych.',
  detailedInstructions: [
    'Przygotować próbki zgodnie z wymiarami standardowymi',
    'Skondycjonować próbki w standardowych warunkach',
    'Przeprowadzić test rozciągania z określoną prędkością',
    'Zarejestrować wszystkie wymagane parametry'
  ],
  safetyGuidelines: [
    'Używać środków ochrony osobistej',
    'Zachować ostrożność przy obsłudze maszyny testowej',
    'Sprawdzić kalibrację urządzeń przed rozpoczęciem'
  ],
  equipment: ['Maszyna wytrzymałościowa', 'Suwmiarka', 'Waga analityczna'],
  materials: ['Próbki testowe', 'Chusteczki czyszczące'],
  duration: 30,
  temperature: 23,
  specialConditions: ['Wilgotność względna: 50% ± 5%'],
  troubleshooting: [
    {
      problem: 'Próbka się ślizga w uchwytach',
      cause: 'Nieprawidłowe zamocowanie lub zużyte uchwyty',
      solution: 'Sprawdzić zamocowanie i stan uchwytów',
      prevention: 'Regularna kontrola i konserwacja uchwytów'
    }
  ],
  qualityControls: [
    'Sprawdzić wymiary próbki przed testem',
    'Weryfikować warunki środowiskowe',
    'Kontrolować prędkość naciągania'
  ],
  criticalPoints: [
    'Prawidłowe zamocowanie próbki',
    'Stabilne warunki środowiskowe',
    'Kalibracja urządzeń pomiarowych'
  ]
};

const StudyExecutionMain: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Hooks
  const { study: fetchedStudy, fetchStudy } = useStudies();
  const { protocol: fetchedProtocol, fetchPredefinedProtocol } = usePredefinedProtocols();
  
  // State
  const [study, setStudy] = useState<Study | null>(null);
  const [protocolData, setProtocolData] = useState<any>(null);
  const [executionSteps, setExecutionSteps] = useState<ExecutionStep[]>([]);
  const [settings, setSettings] = useState<ExecutionSettings>(mockSettings);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [settingsDialog, setSettingsDialog] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({ open: false, title: '', message: '', action: () => {} });
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'warning' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Ładowanie danych studium
  useEffect(() => {
    const loadStudyData = async () => {
      if (!id) {
        setError('Brak ID studium');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Loading study with ID:', id);
        await fetchStudy(id);
        
      } catch (err) {
        console.error('Błąd podczas ładowania danych studium:', err);
        setError('Błąd podczas ładowania danych studium');
        setLoading(false);
      }
    };

    loadStudyData();
  }, [id, fetchStudy]);

  // Obsługa załadowanego studium
  useEffect(() => {
    if (!fetchedStudy) {
      return;
    }

    console.log('Study loaded:', fetchedStudy);
    setStudy(fetchedStudy);

    // Pobierz protokół jeśli studium ma protocolId
    if (fetchedStudy.protocolId) {
      console.log('Loading protocol:', fetchedStudy.protocolId);
      fetchPredefinedProtocol(fetchedStudy.protocolId);
    } else {
      // Jeśli brak protocolId, zakończ loading
      setLoading(false);
    }
  }, [fetchedStudy, fetchPredefinedProtocol]);

  // Obsługa załadowanego protokołu
  useEffect(() => {
    if (!fetchedProtocol || !study) {
      return;
    }

    console.log('Protocol loaded:', fetchedProtocol);
    setProtocolData(fetchedProtocol);
    
    // Przekształć protokół na kroki wykonania
    const steps = transformProtocolToExecutionSteps(fetchedProtocol);
    console.log('Execution steps generated:', steps);
    setExecutionSteps(steps);
    
    // Przekształć ustawienia studium na ustawienia wykonania
    const executionSettings = transformStudySettingsToExecutionSettings(study.settings);
    setSettings(executionSettings);
    
    setLoading(false);
  }, [fetchedProtocol, study]);

  // Pokazuj loading
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Ładowanie danych studium...</Typography>
      </Box>
    );
  }

  // Pokazuj błąd
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<BackIcon />}
          onClick={() => navigate('/studies')}
        >
          Powrót do listy studiów
        </Button>
      </Box>
    );
  }

  // Brak studium
  if (!study) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Nie znaleziono studium
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<BackIcon />}
          onClick={() => navigate('/studies')}
        >
          Powrót do listy studiów
        </Button>
      </Box>
    );
  }

  // Brak kroków wykonania
  if (executionSteps.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Studium "{study.name}" nie ma zdefiniowanych kroków wykonania.
          {!study.protocolId && " Brak przypisanego protokołu."}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<BackIcon />}
          onClick={() => navigate('/studies')}
        >
          Powrót do listy studiów
        </Button>
      </Box>
    );
  }

  const {
    session,
    currentStep,
    navigationState,
    notifications,
    startSession,
    pauseSession,
    resumeSession,
    completeSession,
    cancelSession,
    nextStep,
    previousStep,
    goToStep,
    completeStep,
    collectData,
    addNote,
    currentSample,
    setCurrentSample,
    dismissNotification,
    getStepTimer
  } = useStudyExecution({
    studyId: id || '',
    steps: executionSteps,
    samples: study?.settings?.sampleSettings ? [{
      id: 'sample-1',
      sampleNumber: 1,
      sampleName: study.settings.sampleSettings.samplePrefix ? 
        `${study.settings.sampleSettings.samplePrefix}-01` : 'SAMPLE-01',
      status: 'pending',
      data: {},
      measurements: {},
      observations: {},
      images: [],
      files: [],
      stepResults: [],
      notes: '',
      qualityChecks: []
    }] : [{
      id: 'sample-1',
      sampleNumber: 1,
      sampleName: 'SAMPLE-01',
      status: 'pending',
      data: {},
      measurements: {},
      observations: {},
      images: [],
      files: [],
      stepResults: [],
      notes: '',
      qualityChecks: []
    }],
    settings,
    onSessionUpdate: (session: any) => {
      console.log('Session updated:', session);
    },
    onStepComplete: (stepId: string, sampleId: string, data: any) => {
      const step = executionSteps.find(s => s.id === stepId);
      setSnackbar({
        open: true,
        message: `Zakończono krok: ${step?.title || 'Nieznany krok'}`,
        severity: 'success'
      });
    },
    onSessionComplete: (session: any) => {
      setSnackbar({
        open: true,
        message: 'Badanie zostało zakończone pomyślnie!',
        severity: 'success'
      });
    },
    onError: (error: string) => {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  });

  const handleStartSession = () => {
    const operator = prompt('Podaj nazwę operatora:');
    if (operator) {
      startSession(operator);
    }
  };

  const handlePauseSession = () => {
    setConfirmDialog({
      open: true,
      title: 'Wstrzymać sesję?',
      message: 'Czy na pewno chcesz wstrzymać aktualną sesję badania?',
      action: () => {
        pauseSession();
        setConfirmDialog({ open: false, title: '', message: '', action: () => {} });
      }
    });
  };

  const handleCompleteSession = () => {
    setConfirmDialog({
      open: true,
      title: 'Zakończyć badanie?',
      message: 'Czy na pewno chcesz zakończyć badanie? Ta akcja jest nieodwracalna.',
      action: () => {
        completeSession();
        setConfirmDialog({ open: false, title: '', message: '', action: () => {} });
      }
    });
  };

  const handleCancelSession = () => {
    setConfirmDialog({
      open: true,
      title: 'Anulować badanie?',
      message: 'Czy na pewno chcesz anulować badanie? Wszystkie dane zostaną utracone.',
      action: () => {
        const reason = prompt('Podaj powód anulowania (opcjonalnie):');
        cancelSession(reason || undefined);
        setConfirmDialog({ open: false, title: '', message: '', action: () => {} });
        navigate('/studies');
      }
    });
  };

  const handleDataChange = useCallback((dataPointId: string, value: any) => {
    if (currentStep && currentSample) {
      collectData(currentStep.id, currentSample.id, dataPointId, value);
    }
  }, [currentStep, currentSample, collectData]);

  const handleStepComplete = () => {
    if (currentStep && currentSample) {
      completeStep(currentStep.id, currentSample.id, currentSample.data);
    }
  };

  const getSessionStatusColor = () => {
    switch (session.status) {
      case 'in_progress': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getSessionStatusText = () => {
    switch (session.status) {
      case 'preparing': return 'Przygotowanie';
      case 'in_progress': return 'W trakcie';
      case 'paused': return 'Wstrzymano';
      case 'completed': return 'Zakończono';
      case 'cancelled': return 'Anulowano';
      default: return 'Nieznany';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <IconButton edge="start" onClick={() => navigate('/studies')} sx={{ mr: 2 }}>
            <BackIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6">
              Wykonywanie badania #{session.sessionNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Operator: {session.operator || 'Nie przypisano'}
            </Typography>
          </Box>

          <Chip 
            label={getSessionStatusText()}
            color={getSessionStatusColor()}
            sx={{ mr: 2 }}
          />

          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        <Grid container spacing={3}>
          {/* Left Panel - Navigation and Instructions */}
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Step Navigation */}
              <StepNavigation
                steps={executionSteps}
                currentStepIndex={session.currentStepIndex}
                navigationState={navigationState}
                stepTimers={session.stepTimers}
                onStepChange={goToStep}
                onNext={nextStep}
                onPrevious={previousStep}
                onComplete={handleCompleteSession}
                compact={true}
              />

              {/* Timer */}
              {settings.showTimer && currentStep && (
                <TimerDisplay
                  stepId={currentStep.id}
                  stepTitle={currentStep.title}
                  targetDuration={currentStep.duration ? currentStep.duration * 60 : undefined}
                  autoStart={session.status === 'in_progress'}
                  size="small"
                  variant="card"
                />
              )}

              {/* Protocol Instructions */}
              {currentStep && (
                <ProtocolInstructionsDisplay
                  instructions={{
                    ...mockProtocolInstructions,
                    stepId: currentStep.id,
                    title: currentStep.title,
                    detailedInstructions: currentStep.instructions,
                    safetyGuidelines: currentStep.safetyNotes || [],
                    equipment: currentStep.requiredEquipment || [],
                    duration: currentStep.duration || 0
                  }}
                  compact={true}
                  showFullscreen={true}
                />
              )}
            </Box>
          </Grid>

          {/* Right Panel - Data Collection */}
          <Grid item xs={12} md={8}>
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Session Controls */}
              {session.status === 'preparing' && (
                <Card>
                  <CardContent>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      Aby rozpocząć sesję badania, kliknij przycisk "Rozpocznij".
                    </Alert>
                    <Button
                      variant="contained"
                      startIcon={<StartIcon />}
                      onClick={handleStartSession}
                      size="large"
                    >
                      Rozpocznij sesję
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Data Collection */}
              {session.status !== 'preparing' && currentStep && currentSample && (
                <DataCollectionPanel
                  stepId={currentStep.id}
                  sampleId={currentSample.id}
                  dataPoints={currentStep.dataPoints || []}
                  currentData={currentSample.data}
                  onDataChange={handleDataChange}
                  onSave={handleStepComplete}
                  readonly={session.status === 'completed' || session.status === 'cancelled'}
                  showValidation={true}
                />
              )}

              {/* Session Summary */}
              {(session.status === 'completed' || session.status === 'cancelled') && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Podsumowanie sesji
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {getSessionStatusText()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Czas rozpoczęcia: {session.startTime?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Czas zakończenia: {session.endTime?.toLocaleString()}
                    </Typography>
                    {session.notes && (
                      <Typography variant="body2" color="text.secondary">
                        Notatki: {session.notes}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Floating Action Buttons */}
      {session.status === 'in_progress' && (
        <Box position="fixed" bottom={16} right={16} display="flex" flexDirection="column" gap={1}>
          <Fab color="warning" onClick={handlePauseSession}>
            <PauseIcon />
          </Fab>
          <Fab color="error" onClick={handleCancelSession}>
            <StopIcon />
          </Fab>
        </Box>
      )}

      {session.status === 'paused' && (
        <Box position="fixed" bottom={16} right={16}>
          <Fab color="primary" onClick={resumeSession}>
            <StartIcon />
          </Fab>
        </Box>
      )}

      {/* Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => { setSettingsDialog(true); setMenuAnchor(null); }}>
          <SettingsIcon sx={{ mr: 1 }} />
          Ustawienia
        </MenuItem>
        <MenuItem onClick={() => setMenuAnchor(null)}>
          <SaveIcon sx={{ mr: 1 }} />
          Zapisz sesję
        </MenuItem>
      </Menu>

      {/* Settings Dialog */}
      <Dialog open={settingsDialog} onClose={() => setSettingsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Ustawienia wykonywania</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoSave}
                  onChange={(e) => setSettings((prev: ExecutionSettings) => ({ ...prev, autoSave: e.target.checked }))}
                />
              }
              label="Automatyczny zapis"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.autoAdvance}
                  onChange={(e) => setSettings((prev: ExecutionSettings) => ({ ...prev, autoAdvance: e.target.checked }))}
                />
              }
              label="Automatyczne przejście do następnego kroku"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.showTimer}
                  onChange={(e) => setSettings((prev: ExecutionSettings) => ({ ...prev, showTimer: e.target.checked }))}
                />
              }
              label="Pokaż timer"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings((prev: ExecutionSettings) => ({ ...prev, enableNotifications: e.target.checked }))}
                />
              }
              label="Włącz powiadomienia"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialog(false)}>Anuluj</Button>
          <Button onClick={() => setSettingsDialog(false)} variant="contained">Zapisz</Button>
        </DialogActions>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.open} onClose={() => setConfirmDialog({ open: false, title: '', message: '', action: () => {} })}>
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, title: '', message: '', action: () => {} })}>
            Anuluj
          </Button>
          <Button onClick={confirmDialog.action} variant="contained" color="primary">
            Potwierdź
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        message={snackbar.message}
      />

      {/* Notifications */}
      {notifications.map((notification: any) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.type === 'error' ? null : 5000}
          onClose={() => dismissNotification(notification.id)}
          message={notification.message}
        />
      ))}
    </Box>
  );
};

export default StudyExecutionMain;
