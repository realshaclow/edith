import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Divider
} from '@mui/material';
import {
  Thermostat as TemperatureIcon,
  WaterDrop as HumidityIcon,
  Speed as SpeedIcon,
  Science as ConditionIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { StudyExecution } from '../../types/professional';

interface TestConditionsSummaryProps {
  execution: StudyExecution;
}

export const TestConditionsSummary: React.FC<TestConditionsSummaryProps> = ({
  execution
}) => {
  const getConditionIcon = (conditionName: string) => {
    const name = conditionName.toLowerCase();
    if (name.includes('temperatura') || name.includes('temperature')) return <TemperatureIcon color="primary" />;
    if (name.includes('wilgotność') || name.includes('humidity')) return <HumidityIcon color="primary" />;
    if (name.includes('prędkość') || name.includes('speed')) return <SpeedIcon color="primary" />;
    return <ConditionIcon color="primary" />;
  };

  const translateConditionName = (name: string): string => {
    const translations: Record<string, string> = {
      'temperature': 'Temperatura',
      'humidity': 'Wilgotność',
      'pressure': 'Ciśnienie',
      'TestDuration': 'Czas trwania testu',
      'testDuration': 'Czas trwania testu',
      'test_duration': 'Czas trwania testu',
      'testSpeed': 'Prędkość testu',
      'test_speed': 'Prędkość testu'
    };
    return translations[name] || name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Warunki Testowe
      </Typography>

      {/* Environment Conditions */}
      <Box mb={3}>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Warunki środowiskowe
        </Typography>
        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'success.light', 
            color: 'success.contrastText',
            borderRadius: 1,
            mb: 2
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Temperatura:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {execution.environment.temperature}°C
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Wilgotność:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {execution.environment.humidity}% RH
            </Typography>
          </Box>
          {execution.environment.pressure && (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2">Ciśnienie:</Typography>
              <Typography variant="body2" fontWeight="bold">
                {execution.environment.pressure} hPa
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Steps Information */}
      {execution.steps && execution.steps.length > 0 ? (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Kroki badania
          </Typography>
          <List dense>
            {execution.steps.slice(0, 3).map((step: any, index: number) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ConditionIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2">
                        {step.title}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" fontWeight="bold">
                          {step.measurements.length} pomiarów
                        </Typography>
                        {step.isCompleted && (
                          <CheckIcon color="success" fontSize="small" />
                        )}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {step.description}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            {execution.steps.length > 3 && (
              <ListItem sx={{ px: 0 }}>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary" fontStyle="italic">
                      ... i {execution.steps.length - 3} więcej kroków
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Brak zdefiniowanych kroków badania
        </Typography>
      )}

      {/* Protocol Information */}
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Informacje o protokole
        </Typography>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">ID Protokołu:</Typography>
            <Typography variant="body2" fontWeight="medium">
              {execution.protocolId}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Typ badania:</Typography>
            <Chip 
              label="Materiałowe" 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
