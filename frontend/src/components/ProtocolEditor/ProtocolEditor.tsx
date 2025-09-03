import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TextField
} from '@mui/material';
import {
  Save as SaveIcon,
  Preview as PreviewIcon,
  Download as ExportIcon,
  Upload as ImportIcon,
  Refresh as ResetIcon
} from '@mui/icons-material';

import { useProtocolEditor } from './hooks/useProtocolEditor';
import { getCategoryColor, getDifficultyColor } from './utils/helpers';

// Import komponentów edycji
import BasicInfoEditor from './components/BasicInfoEditor';
import OverviewEditor from './components/OverviewEditor';
import EquipmentEditor from './components/EquipmentEditor';
import MaterialsEditor from './components/MaterialsEditor';
import SafetyEditor from './components/SafetyEditor';
import TestConditionsEditor from './components/TestConditionsEditor';
import StepsEditor from './components/StepsEditor';
import CalculationsEditor from './components/CalculationsEditor';
import AcceptanceCriteriaEditor from './components/AcceptanceCriteriaEditor';
import ReferencesEditor from './components/ReferencesEditor';
import ProtocolPreview from './components/ProtocolPreview';
import CommonIssuesEditor from './components/CommonIssuesEditor';
import TypicalValuesEditor from './components/TypicalValuesEditor';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ paddingTop: 16 }}>
    {value === index && children}
  </div>
);

interface ProtocolEditorProps {
  protocolId?: string;
  initialData?: any;
  onSave?: (protocol: any) => void;
  onCancel?: () => void;
  onLoad?: () => void; // Callback po załadowaniu danych
}

const ProtocolEditor: React.FC<ProtocolEditorProps> = ({
  protocolId,
  initialData,
  onSave,
  onCancel,
  onLoad
}) => {
  const {
    protocol,
    updateProtocol,
    saveProtocol,
    saveAsProtocol,
    resetProtocol,
    exportProtocol,
    importProtocol,
    loadProtocol,
    isLoading,
    isDirty,
    errors,
    isValid
  } = useProtocolEditor();

  const [currentTab, setCurrentTab] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showSaveAsDialog, setShowSaveAsDialog] = useState(false);
  const [saveAsTitle, setSaveAsTitle] = useState('');
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });

  const [showResetDialog, setShowResetDialog] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const hasLoadedInitialData = React.useRef(false);

  // Załaduj protokół jeśli podane jest protocolId
  React.useEffect(() => {
    if (protocolId && !hasLoadedInitialData.current) {
      loadProtocol(protocolId).then((success) => {
        if (success) {
          hasLoadedInitialData.current = true;
          onLoad?.();
        }
      });
    } else if (initialData && !hasLoadedInitialData.current) {
      updateProtocol(initialData);
      hasLoadedInitialData.current = true;
      onLoad?.();
    }
  }, [protocolId, initialData, loadProtocol, updateProtocol, onLoad]);

  const tabs = [
    { label: 'Podstawowe', component: BasicInfoEditor },
    { label: 'Przegląd', component: OverviewEditor },
    { label: 'Wyposażenie', component: EquipmentEditor },
    { label: 'Materiały', component: MaterialsEditor },
    { label: 'Bezpieczeństwo', component: SafetyEditor },
    { label: 'Warunki testu', component: TestConditionsEditor },
    { label: 'Kroki procedury', component: StepsEditor },
    { label: 'Obliczenia', component: CalculationsEditor },
    { label: 'Kryteria akceptacji', component: AcceptanceCriteriaEditor },
    { label: 'Typowe problemy', component: CommonIssuesEditor },
    { label: 'Typowe wartości', component: TypicalValuesEditor },
    { label: 'Referencje', component: ReferencesEditor }
  ];

  const handleSave = async () => {
    if (!isValid) {
      setSnackbar({
        open: true,
        message: 'Protokół zawiera błędy. Sprawdź wszystkie pola.',
        severity: 'error'
      });
      return;
    }

    const success = await saveProtocol();
    if (success) {
      setSnackbar({
        open: true,
        message: 'Protokół został zapisany pomyślnie',
        severity: 'success'
      });
      onSave?.(protocol);
    } else {
      setSnackbar({
        open: true,
        message: 'Błąd podczas zapisywania protokołu',
        severity: 'error'
      });
    }
  };

  const handleSaveAs = async () => {
    if (!saveAsTitle.trim()) {
      setSnackbar({
        open: true,
        message: 'Podaj tytuł nowego protokołu',
        severity: 'error'
      });
      return;
    }

    const success = await saveAsProtocol(saveAsTitle);
    if (success) {
      setShowSaveAsDialog(false);
      setSaveAsTitle('');
      setSnackbar({
        open: true,
        message: 'Protokół został zapisany jako nowy',
        severity: 'success'
      });
      onSave?.(protocol);
    } else {
      setSnackbar({
        open: true,
        message: 'Błąd podczas zapisywania protokołu',
        severity: 'error'
      });
    }
  };

  const handleExport = () => {
    if (!isValid) {
      setSnackbar({
        open: true,
        message: 'Protokół zawiera błędy. Nie można eksportować.',
        severity: 'error'
      });
      return;
    }
    
    exportProtocol();
    setSnackbar({
      open: true,
      message: 'Protokół został wyeksportowany',
      severity: 'success'
    });
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.edith')) {
      setSnackbar({
        open: true,
        message: 'Wybierz plik z rozszerzeniem .edith',
        severity: 'error'
      });
      return;
    }

    const success = await importProtocol(file);
    if (success) {
      setSnackbar({
        open: true,
        message: 'Protokół został zaimportowany',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Błąd podczas importu protokołu',
        severity: 'error'
      });
    }

    // Wyczyść input
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleReset = () => {
    setShowResetDialog(false);
    resetProtocol();
    setCurrentTab(0);
    setSnackbar({
      open: true,
      message: 'Protokół został zresetowany',
      severity: 'info'
    });
  };

  const getTabErrors = (tabIndex: number): number => {
    const tabErrorPrefixes = [
      ['title', 'description', 'id', 'category', 'estimatedDuration', 'difficulty'],
      ['overviewPurpose', 'overviewScope', 'overviewPrinciples'],
      ['equipment'],
      ['materials'],
      ['safetyGuidelines'],
      ['testConditions'],
      ['steps'],
      ['calculations'],
      ['acceptanceCriteria'],
      ['commonIssues'],
      ['typicalValues'],
      ['references']
    ];

    const prefixes = tabErrorPrefixes[tabIndex] || [];
    return Object.keys(errors).filter(key => 
      prefixes.some(prefix => key.startsWith(prefix))
    ).length;
  };

  const CurrentTabComponent = tabs[currentTab]?.component;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {protocol.title || 'Nowy protokół badawczy'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              {protocol.category && (
                <Chip
                  label={protocol.category}
                  size="small"
                  sx={{
                    backgroundColor: getCategoryColor(protocol.category),
                    color: 'white'
                  }}
                />
              )}
              {protocol.difficulty && (
                <Chip
                  label={protocol.difficulty}
                  size="small"
                  sx={{
                    backgroundColor: getDifficultyColor(protocol.difficulty),
                    color: 'white'
                  }}
                />
              )}
              {isDirty && (
                <Chip label="Niezapisane zmiany" size="small" color="warning" />
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PreviewIcon />}
              onClick={() => setShowPreview(true)}
              disabled={!isValid}
            >
              Podgląd
            </Button>
            <Button
              variant="outlined"
              startIcon={<ImportIcon />}
              onClick={handleImport}
            >
              Import
            </Button>
            <Button
              variant="outlined"
              startIcon={<ExportIcon />}
              onClick={handleExport}
              disabled={!isValid}
            >
              Eksport
            </Button>
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={() => setShowResetDialog(true)}
              disabled={!isDirty}
            >
              Reset
            </Button>
            {protocolId ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={() => setShowSaveAsDialog(true)}
                  disabled={!isDirty || !isValid || isLoading}
                >
                  Zapisz jako
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!isDirty || !isValid || isLoading}
                >
                  Zapisz
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={!isDirty || !isValid || isLoading}
              >
                Utwórz
              </Button>
            )}
          </Box>
        </Box>

        {/* Progress bar */}
        {isLoading && <LinearProgress sx={{ mb: 1 }} />}

        {/* Error summary */}
        {Object.keys(errors).length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Protokół zawiera {Object.keys(errors).length} błędów. 
            Sprawdź pola oznaczone na czerwono.
          </Alert>
        )}
      </Paper>

      {/* Tabs */}
      <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider', px: 2, flexShrink: 0 }}
        >
          {tabs.map((tab, index) => {
            const errorCount = getTabErrors(index);
            return (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {tab.label}
                    {errorCount > 0 && (
                      <Chip
                        label={errorCount}
                        size="small"
                        color="error"
                        sx={{ minWidth: 20, height: 16 }}
                      />
                    )}
                  </Box>
                }
              />
            );
          })}
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0 }}>
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={currentTab} index={index}>
              {CurrentTabComponent && (
                <Box sx={{ p: 2 }}>
                  <CurrentTabComponent
                    protocol={protocol}
                    updateProtocol={updateProtocol}
                    errors={errors}
                  />
                </Box>
              )}
            </TabPanel>
          ))}
        </Box>
      </Paper>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Podgląd protokołu</DialogTitle>
        <DialogContent>
          <ProtocolPreview protocol={protocol} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Zamknij</Button>
        </DialogActions>
      </Dialog>

      {/* Reset Confirmation Dialog */}
      <Dialog open={showResetDialog} onClose={() => setShowResetDialog(false)}>
        <DialogTitle>Resetuj protokół</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz zresetować protokół? Wszystkie niezapisane zmiany zostaną utracone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowResetDialog(false)}>Anuluj</Button>
          <Button onClick={handleReset} color="error">
            Resetuj
          </Button>
        </DialogActions>
      </Dialog>

      {/* Save As Dialog */}
      <Dialog open={showSaveAsDialog} onClose={() => setShowSaveAsDialog(false)}>
        <DialogTitle>Zapisz jako nowy protokół</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Podaj tytuł dla nowego protokołu:
          </Typography>
          <TextField
            fullWidth
            value={saveAsTitle}
            onChange={(e) => setSaveAsTitle(e.target.value)}
            placeholder="Tytuł nowego protokołu"
            variant="outlined"
            autoFocus
            sx={{ minWidth: 400 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSaveAsDialog(false)}>Anuluj</Button>
          <Button onClick={handleSaveAs} variant="contained" disabled={!saveAsTitle.trim()}>
            Zapisz jako
          </Button>
        </DialogActions>
      </Dialog>

      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".edith"
        style={{ display: 'none' }}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProtocolEditor;
