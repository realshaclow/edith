import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Grid,
  InputAdornment,
  Button
} from '@mui/material';
import {
  Thermostat as TempIcon,
  WaterDrop as HumidityIcon,
  Speed as PressureIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { StudyExecution } from '../types/execution';

interface EnvironmentPanelProps {
  environment: StudyExecution['environment'];
  onUpdateEnvironment: (environment: Partial<StudyExecution['environment']>) => void;
}

export const EnvironmentPanel: React.FC<EnvironmentPanelProps> = ({
  environment,
  onUpdateEnvironment
}) => {
  const [tempValues, setTempValues] = useState({
    temperature: environment.temperature?.toString() || '',
    humidity: environment.humidity?.toString() || '',
    pressure: environment.pressure?.toString() || '',
    notes: environment.notes || ''
  });

  const handleValueChange = (field: string, value: string) => {
    setTempValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const updates: Partial<StudyExecution['environment']> = {
      temperature: tempValues.temperature ? Number(tempValues.temperature) : undefined,
      humidity: tempValues.humidity ? Number(tempValues.humidity) : undefined,
      pressure: tempValues.pressure ? Number(tempValues.pressure) : undefined,
      notes: tempValues.notes || ''
    };
    onUpdateEnvironment(updates);
  };

  const hasChanges = 
    tempValues.temperature !== (environment.temperature?.toString() || '') ||
    tempValues.humidity !== (environment.humidity?.toString() || '') ||
    tempValues.pressure !== (environment.pressure?.toString() || '') ||
    tempValues.notes !== (environment.notes || '');

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          🌡️ Warunki środowiskowe
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Temperatura"
              type="number"
              value={tempValues.temperature}
              onChange={(e) => handleValueChange('temperature', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TempIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">°C</InputAdornment>
              }}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Wilgotność"
              type="number"
              value={tempValues.humidity}
              onChange={(e) => handleValueChange('humidity', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HumidityIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">%</InputAdornment>
              }}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Ciśnienie"
              type="number"
              value={tempValues.pressure}
              onChange={(e) => handleValueChange('pressure', e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PressureIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: <InputAdornment position="end">hPa</InputAdornment>
              }}
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Uwagi środowiskowe"
              multiline
              rows={3}
              value={tempValues.notes}
              onChange={(e) => handleValueChange('notes', e.target.value)}
              placeholder="Dodatkowe informacje o warunkach..."
              size="small"
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={!hasChanges}
              size="small"
            >
              Zapisz warunki
            </Button>
          </Grid>
        </Grid>

        {/* Current values display */}
        {(environment.temperature || environment.humidity || environment.pressure) && (
          <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Aktualne warunki:
            </Typography>
            
            {environment.temperature && (
              <Typography variant="body2">
                🌡️ {environment.temperature}°C
              </Typography>
            )}
            
            {environment.humidity && (
              <Typography variant="body2">
                💧 {environment.humidity}%
              </Typography>
            )}
            
            {environment.pressure && (
              <Typography variant="body2">
                📊 {environment.pressure} hPa
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
