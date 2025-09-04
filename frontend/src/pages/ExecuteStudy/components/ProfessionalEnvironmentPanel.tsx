import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Alert,
  Chip,
  IconButton
} from '@mui/material';
import {
  Science as EnvironmentIcon,
  Save as SaveIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon
} from '@mui/icons-material';
import { StudyExecution } from '../types/professional';

interface ProfessionalEnvironmentPanelProps {
  execution: StudyExecution;
  onEnvironmentUpdate: (data: any) => void;
}

export const ProfessionalEnvironmentPanel: React.FC<ProfessionalEnvironmentPanelProps> = ({
  execution,
  onEnvironmentUpdate
}) => {
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [pressure, setPressure] = useState('');
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const handleSave = () => {
    onEnvironmentUpdate({
      temperature,
      humidity,
      pressure,
      notes,
      recordedAt: new Date()
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <EnvironmentIcon color="primary" />
          <Typography variant="h6">
            Warunki Środowiskowe
          </Typography>
        </Box>
        <IconButton 
          size="small" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
        </IconButton>
      </Box>

      {isExpanded && (
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Temperatura (°C)"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            size="small"
            placeholder="np. 23.5"
          />
        
        <TextField
          label="Wilgotność (%)"
          value={humidity}
          onChange={(e) => setHumidity(e.target.value)}
          size="small"
          placeholder="np. 50"
        />
        
        <TextField
          label="Ciśnienie (hPa)"
          value={pressure}
          onChange={(e) => setPressure(e.target.value)}
          size="small"
          placeholder="np. 1013"
        />

        <Divider />
        
        <TextField
          label="Notatki środowiskowe"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          multiline
          rows={3}
          size="small"
          placeholder="Dodatkowe informacje o warunkach..."
        />

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          size="small"
        >
          Zapisz warunki
        </Button>

        <Alert severity="info" sx={{ mt: 1 }}>
          Warunki środowiskowe są zapisywane dla całego badania
        </Alert>
        </Box>
      )}
    </Paper>
  );
};
