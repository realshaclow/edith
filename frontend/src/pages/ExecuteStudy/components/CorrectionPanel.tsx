import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Divider,
  Alert,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  NavigateBefore as BackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { StudyExecution, StudySample, ExecutionStep } from '../types/professional';

interface CorrectionPanelProps {
  execution: StudyExecution;
  currentSample: StudySample;
  onGoToStepForCorrection: (sampleId: string, stepIndex: number, reason?: string) => void;
  onEditMeasurement: (sampleId: string, stepId: string, measurementId: string, newValue: number, reason: string) => void;
  getSampleCurrentStep: (sample: StudySample) => number;
}

export const CorrectionPanel: React.FC<CorrectionPanelProps> = ({
  execution,
  currentSample,
  onGoToStepForCorrection,
  onEditMeasurement,
  getSampleCurrentStep
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<any>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editReason, setEditReason] = useState<string>('');
  const [stepDialogOpen, setStepDialogOpen] = useState(false);
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(0);
  const [stepReason, setStepReason] = useState<string>('');

  const currentStepIndex = getSampleCurrentStep(currentSample);
  const completedSteps = currentSample.completedSteps;

  // Pobierz ukończone kroki z pomiarami
  const completedStepsWithMeasurements = execution.steps
    .map((step, index) => ({
      step,
      index,
      isCompleted: completedSteps.includes(step.id),
      measurements: currentSample.measurements.filter(m => m.stepId === step.id)
    }))
    .filter(item => item.isCompleted);

  const handleEditMeasurement = (measurement: any, stepId: string) => {
    setSelectedMeasurement({ ...measurement, stepId });
    setEditValue(measurement.value?.toString() || '');
    setEditReason('');
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedMeasurement && editValue && editReason) {
      const newValue = parseFloat(editValue);
      if (!isNaN(newValue)) {
        onEditMeasurement(
          currentSample.id,
          selectedMeasurement.stepId,
          selectedMeasurement.measurementId,
          newValue,
          editReason
        );
        setEditDialogOpen(false);
        setSelectedMeasurement(null);
        setEditValue('');
        setEditReason('');
      }
    }
  };

  const handleGoToStep = () => {
    if (stepReason.trim()) {
      onGoToStepForCorrection(currentSample.id, selectedStepIndex, stepReason);
      setStepDialogOpen(false);
      setStepReason('');
    }
  };

  const openStepDialog = (stepIndex: number) => {
    setSelectedStepIndex(stepIndex);
    setStepDialogOpen(true);
  };

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <HistoryIcon color="warning" />
        <Typography variant="h6">
          System korekt
        </Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 2 }}>
        Możesz edytować pomiary z ukończonych kroków lub cofnąć się do wcześniejszego kroku.
      </Alert>

      {completedStepsWithMeasurements.length === 0 && (
        <Alert severity="warning">
          Brak ukończonych kroków do korekty.
        </Alert>
      )}

      {completedStepsWithMeasurements.map((item, index) => (
        <Accordion key={item.step.id} sx={{ mb: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <Typography variant="subtitle2">
                Krok {item.index + 1}: {item.step.title}
              </Typography>
              <Chip 
                size="small" 
                label={`${item.measurements.length} pomiarów`}
                color="primary"
                variant="outlined"
              />
              {item.index < currentStepIndex && (
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  startIcon={<BackIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    openStepDialog(item.index);
                  }}
                  sx={{ ml: 'auto' }}
                >
                  Cofnij tutaj
                </Button>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {item.measurements.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Parametr</TableCell>
                      <TableCell>Wartość</TableCell>
                      <TableCell>Czas</TableCell>
                      <TableCell>Akcje</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {item.measurements.map((measurement, mIndex) => (
                      <TableRow key={`${measurement.stepId}-${mIndex}`}>
                        <TableCell>{measurement.measurementId}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {measurement.value}
                            {measurement.notes?.includes('[KOREKTA') && (
                              <Chip size="small" label="Skorygowane" color="warning" />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {new Date(measurement.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleEditMeasurement(measurement, item.step.id)}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Brak pomiarów w tym kroku
              </Typography>
            )}
            
            {item.measurements.some(m => m.notes?.includes('[KOREKTA')) && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Historia korekt:
                </Typography>
                {item.measurements
                  .filter(m => m.notes?.includes('[KOREKTA'))
                  .map((m, idx) => (
                    <Typography 
                      key={idx} 
                      variant="body2" 
                      sx={{ 
                        fontFamily: 'monospace', 
                        fontSize: '0.75rem',
                        color: 'warning.main',
                        mb: 0.5
                      }}
                    >
                      {m.notes?.split('\n').filter(line => line.includes('[KOREKTA')).join('\n')}
                    </Typography>
                  ))}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {/* Dialog edycji pomiaru */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edytuj pomiar</DialogTitle>
        <DialogContent>
          {selectedMeasurement && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Parametr: {selectedMeasurement.measurementId}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Obecna wartość: {selectedMeasurement.value}
              </Typography>
              
              <TextField
                fullWidth
                label="Nowa wartość"
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                margin="normal"
              />
              
              <TextField
                fullWidth
                label="Powód korekty"
                multiline
                rows={3}
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                margin="normal"
                required
                placeholder="Opisz powód wprowadzenia korekty..."
              />
              
              <Alert severity="warning" sx={{ mt: 2 }}>
                Korekta zostanie zapisana w historii pomiarów z oznaczeniem czasu.
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} startIcon={<CancelIcon />}>
            Anuluj
          </Button>
          <Button 
            onClick={handleSaveEdit}
            variant="contained"
            disabled={!editValue || !editReason.trim()}
            startIcon={<SaveIcon />}
          >
            Zapisz korektę
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog cofania do kroku */}
      <Dialog open={stepDialogOpen} onClose={() => setStepDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cofnij do kroku</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Typography variant="body1" gutterBottom>
              Cofnięcie do kroku {selectedStepIndex + 1} spowoduje:
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Box component="ul" sx={{ margin: 0, pl: 2 }}>
                <li>Usunięcie wszystkich późniejszych kroków</li>
                <li>Utratę pomiarów z usuniętych kroków</li>
                <li>Możliwość ponownego wykonania kroków</li>
              </Box>
            </Alert>
            
            <TextField
              fullWidth
              label="Powód cofnięcia"
              multiline
              rows={3}
              value={stepReason}
              onChange={(e) => setStepReason(e.target.value)}
              margin="normal"
              required
              placeholder="Opisz powód cofnięcia do tego kroku..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStepDialogOpen(false)} startIcon={<CancelIcon />}>
            Anuluj
          </Button>
          <Button 
            onClick={handleGoToStep}
            variant="contained"
            color="warning"
            disabled={!stepReason.trim()}
            startIcon={<BackIcon />}
          >
            Cofnij do kroku
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
