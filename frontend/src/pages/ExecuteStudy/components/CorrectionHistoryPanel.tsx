import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Alert,
  Badge,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
  Schedule as TimeIcon,
  Assignment as StepIcon,
  Science as SampleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { StudyExecution, StudySample } from '../types/professional';

interface CorrectionHistoryPanelProps {
  execution: StudyExecution;
  currentSample: StudySample;
  onGoToStep?: (stepIndex: number) => void;
}

interface CorrectionEntry {
  stepId: string;
  stepTitle: string;
  stepIndex: number;
  correctionNotes: string[];
}

export const CorrectionHistoryPanel: React.FC<CorrectionHistoryPanelProps> = ({
  execution,
  currentSample,
  onGoToStep
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Zbierz wszystkie korekty dla bieżącej próbki
  const corrections: CorrectionEntry[] = execution.steps
    .map((step, index) => {
      const stepMeasurements = currentSample.measurements.filter(m => m.stepId === step.id);
      const correctionNotes = stepMeasurements
        .map(m => m.notes || '')
        .filter(notes => notes.includes('[KOREKTA'))
        .flatMap(notes => 
          notes.split('\n').filter(line => line.includes('[KOREKTA'))
        );

      if (correctionNotes.length === 0) return null;

      return {
        stepId: step.id,
        stepTitle: step.title,
        stepIndex: index,
        correctionNotes
      };
    })
    .filter((correction): correction is CorrectionEntry => correction !== null);

  const totalCorrections = corrections.reduce((sum, correction) => sum + correction.correctionNotes.length, 0);

  if (corrections.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <EditIcon color="disabled" />
          <Typography variant="h6" color="text.secondary">
            Historia korekt
          </Typography>
        </Box>
        <Alert severity="info">
          Brak korekt dla próbki <strong>{currentSample.name}</strong>
        </Alert>
      </Paper>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: 0 }}>
      <Box sx={{ p: 2, pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Badge badgeContent={totalCorrections} color="warning">
            <EditIcon color="warning" />
          </Badge>
          <Typography variant="h6">
            Historia korekt
          </Typography>
          <Chip 
            label={`Próbka: ${currentSample.name}`}
            size="small"
            variant="outlined"
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Znajdź {totalCorrections} korekt w {corrections.length} krokach
        </Typography>
      </Box>

      <Divider />

      {corrections.map((correction, index) => (
        <Accordion 
          key={correction.stepId}
          expanded={expanded === correction.stepId}
          onChange={handleChange(correction.stepId)}
          sx={{ 
            '&:before': { display: 'none' },
            boxShadow: 'none',
            borderBottom: index < corrections.length - 1 ? '1px solid' : 'none',
            borderColor: 'divider'
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
              <StepIcon color="warning" />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  Krok {correction.stepIndex + 1}: {correction.stepTitle}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {correction.correctionNotes.length} korekt
                </Typography>
              </Box>
              <Chip 
                label={`${correction.correctionNotes.length}`}
                color="warning"
                size="small"
                sx={{ minWidth: 40 }}
              />
            </Box>
          </AccordionSummary>
          
          <AccordionDetails sx={{ pt: 0 }}>
            <List dense>
              {correction.correctionNotes.map((note, noteIndex) => (
                <ListItem key={noteIndex} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <TimeIcon fontSize="small" color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {note}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
            
            {onGoToStep && (
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<StepIcon />}
                  onClick={() => onGoToStep(correction.stepIndex)}
                >
                  Przejdź do kroku
                </Button>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};
