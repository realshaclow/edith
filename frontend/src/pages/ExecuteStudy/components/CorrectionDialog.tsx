import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Divider,
  Chip,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Undo as UndoIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { StudyExecution, StudySample, ExecutionStep } from '../types/professional';

interface CorrectionDialogProps {
  open: boolean;
  onClose: () => void;
  execution: StudyExecution;
  currentSample: StudySample;
  step: ExecutionStep;
  onUncompleteStep: (sampleId: string, stepId: string) => void;
  onAddCorrectionNote: (sampleId: string, stepId: string, note: string) => void;
}

export const CorrectionDialog: React.FC<CorrectionDialogProps> = ({
  open,
  onClose,
  execution,
  currentSample,
  step,
  onUncompleteStep,
  onAddCorrectionNote
}) => {
  const [correctionNote, setCorrectionNote] = useState('');
  const [showUncompleteConfirm, setShowUncompleteConfirm] = useState(false);

  const handleAddCorrection = () => {
    if (correctionNote.trim()) {
      onAddCorrectionNote(currentSample.id, step.id, correctionNote.trim());
      setCorrectionNote('');
      onClose();
    }
  };

  const handleUncompleteStep = () => {
    onUncompleteStep(currentSample.id, step.id);
    setShowUncompleteConfirm(false);
    onClose();
  };

  const isStepCompleted = currentSample.completedSteps.includes(step.id);
  
  // Znajdź pomiary dla tego kroku
  const stepMeasurements = currentSample.measurements.filter(m => m.stepId === step.id);
  
  // Znajdź notatki korekty
  const correctionNotes = stepMeasurements
    .map(m => m.notes || '')
    .filter(notes => notes.includes('[KOREKTA'))
    .flatMap(notes => 
      notes.split('\n').filter(line => line.includes('[KOREKTA'))
    );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <EditIcon color="primary" />
          <Typography variant="h6">
            Korekta kroku: {step.title}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Status kroku */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Status kroku
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              label={isStepCompleted ? 'Zakończony' : 'W trakcie'}
              color={isStepCompleted ? 'success' : 'default'}
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              Próbka: {currentSample.name}
            </Typography>
          </Box>
        </Box>

        {/* Istniejące korekty */}
        {correctionNotes.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Historia korekt
            </Typography>
            <Box sx={{ 
              maxHeight: 150, 
              overflow: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
              bgcolor: 'grey.50'
            }}>
              {correctionNotes.map((note, index) => (
                <Typography 
                  key={index} 
                  variant="body2" 
                  sx={{ mb: 1, fontFamily: 'monospace' }}
                >
                  {note}
                </Typography>
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Sekcja dodawania korekty */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Dodaj notatkę korekty
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Opisz wykonaną korektę, zmianę w pomiarach lub dodatkowe obserwacje..."
            value={correctionNote}
            onChange={(e) => setCorrectionNote(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Alert severity="info" sx={{ mb: 2 }}>
            Notatka korekty zostanie dodana do pomiarów tego kroku z oznaczeniem czasu.
          </Alert>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Sekcja cofania kroku */}
        {isStepCompleted && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Cofnij zakończenie kroku
            </Typography>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningIcon />
                <Typography variant="body2">
                  Cofnięcie zakończenia kroku usunie wszystkie pomiary i oznaczy krok jako niezakończony.
                  Będzie można ponownie wprowadzić dane.
                </Typography>
              </Box>
            </Alert>
            
            {!showUncompleteConfirm ? (
              <Button
                variant="outlined"
                color="warning"
                startIcon={<UndoIcon />}
                onClick={() => setShowUncompleteConfirm(true)}
              >
                Cofnij zakończenie kroku
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<UndoIcon />}
                  onClick={handleUncompleteStep}
                >
                  Potwierdź cofnięcie
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setShowUncompleteConfirm(false)}
                >
                  Anuluj
                </Button>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Anuluj
        </Button>
        <Button 
          onClick={handleAddCorrection}
          variant="contained"
          disabled={!correctionNote.trim()}
          startIcon={<EditIcon />}
        >
          Dodaj korektę
        </Button>
      </DialogActions>
    </Dialog>
  );
};
