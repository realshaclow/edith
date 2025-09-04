import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  LinearProgress,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Thermostat as TemperatureIcon,
  WaterDrop as HumidityIcon,
  Speed as SpeedIcon,
  Science as ConditionIcon,
  CheckCircle as CompleteIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Assignment as TestIcon
} from '@mui/icons-material';
import { StudyExecution, StudySample, TestCondition } from '../types/professional';

interface TestConditionsPanelProps {
  execution: StudyExecution;
  currentSample: StudySample;
  disabled?: boolean;
  onTestConditionUpdate: (conditionName: string, actualValue: string, isSet: boolean) => void;
}

export const TestConditionsPanel: React.FC<TestConditionsPanelProps> = ({
  execution,
  currentSample,
  disabled = false,
  onTestConditionUpdate
}) => {
  // Local state for managing test condition values
  const [localConditions, setLocalConditions] = useState<Record<string, string>>({});
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  // Initialize local state from execution
  useEffect(() => {
    const initial: Record<string, string> = {};
    execution.testConditions.forEach(condition => {
      initial[condition.name] = condition.actualValue || '';
    });
    setLocalConditions(initial);
  }, [execution.testConditions]);

  const handleConditionChange = (conditionName: string, value: string) => {
    setLocalConditions(prev => ({
      ...prev,
      [conditionName]: value
    }));
    
    // Update immediately
    onTestConditionUpdate(conditionName, value, value.trim() !== '');
  };

  // Translation function for test condition names
  const translateConditionName = (name: string): string => {
    const translations: Record<string, string> = {
      // Basic conditions
      'temperature': 'Temperatura',
      'humidity': 'Wilgotność',
      'pressure': 'Ciśnienie',
      'conditioning': 'Kondycjonowanie',
      'testSpeed': 'Prędkość testu',
      'test_speed': 'Prędkość testu',
      'TestDuration': 'Czas trwania testu',
      'testDuration': 'Czas trwania testu',
      'test_duration': 'Czas trwania testu',
      'environment': 'Środowisko',
      'atmosphere': 'Atmosfera',
      'preheating': 'Podgrzewanie',
      'cooling': 'Chłodzenie',
      
      // Mechanical testing
      'loading_rate': 'Szybkość obciążenia',
      'loadingRate': 'Szybkość obciążenia',
      'strain_rate': 'Szybkość odkształcenia',
      'strainRate': 'Szybkość odkształcenia',
      'crosshead_speed': 'Prędkość trawersy',
      'crossheadSpeed': 'Prędkość trawersy',
      'test_temperature': 'Temperatura testu',
      'testTemperature': 'Temperatura testu',
      'gauge_length': 'Długość pomiarowa',
      'gaugeLength': 'Długość pomiarowa',
      
      // Sample preparation
      'specimen_preparation': 'Przygotowanie próbki',
      'specimenPreparation': 'Przygotowanie próbki',
      'sample_thickness': 'Grubość próbki',
      'sampleThickness': 'Grubość próbki',
      'specimen_conditioning': 'Kondycjonowanie próbki',
      'specimenConditioning': 'Kondycjonowanie próbki',
      
      // Thermal testing  
      'heating_rate': 'Szybkość nagrzewania',
      'heatingRate': 'Szybkość nagrzewania',
      'cooling_rate': 'Szybkość chłodzenia',
      'coolingRate': 'Szybkość chłodzenia',
      'melting_temperature': 'Temperatura topnienia',
      'meltingTemperature': 'Temperatura topnienia',
      'deflection_temperature': 'Temperatura ugięcia',
      'deflectionTemperature': 'Temperatura ugięcia',
      
      // Flow and viscosity
      'melt_flow_rate': 'Wskaźnik płynięcia',
      'meltFlowRate': 'Wskaźnik płynięcia',
      'viscosity': 'Lepkość',
      'mooney_viscosity': 'Lepkość Mooney',
      'mooneyViscosity': 'Lepkość Mooney',
      
      // Impact testing
      'impact_velocity': 'Prędkość uderzenia',
      'impactVelocity': 'Prędkość uderzenia',
      'notch_depth': 'Głębokość karbu',
      'notchDepth': 'Głębokość karbu',
      'pendulum_energy': 'Energia wahadła',
      'pendulumEnergy': 'Energia wahadła',
      
      // Flammability
      'oxygen_concentration': 'Stężenie tlenu',
      'oxygenConcentration': 'Stężenie tlenu',
      'flame_application': 'Aplikacja płomienia',
      'flameApplication': 'Aplikacja płomienia',
      'burning_rate': 'Szybkość spalania',
      'burningRate': 'Szybkość spalania',
      
      // Environmental
      'weathering_conditions': 'Warunki starzenia',
      'weatheringConditions': 'Warunki starzenia',
      'uv_exposure': 'Napromieniowanie UV',
      'uvExposure': 'Napromieniowanie UV',
      'relative_humidity': 'Wilgotność względna',
      'relativeHumidity': 'Wilgotność względna',
      
      // Density and composition
      'density': 'Gęstość',
      'ash_content': 'Zawartość popiołu',
      'ashContent': 'Zawartość popiołu',
      'migration_temperature': 'Temperatura migracji',
      'migrationTemperature': 'Temperatura migracji'
    };

    // Check if we have exact translation
    if (translations[name]) {
      return translations[name];
    }

    // Check for partial matches (case insensitive)
    const lowerName = name.toLowerCase();
    for (const [key, value] of Object.entries(translations)) {
      if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
        return value;
      }
    }

    // If no translation found, capitalize first letter and return
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const getConditionIcon = (conditionName: string) => {
    const name = conditionName.toLowerCase();
    if (name.includes('temperatura') || name.includes('temperature')) return <TemperatureIcon />;
    if (name.includes('wilgotność') || name.includes('humidity')) return <HumidityIcon />;
    if (name.includes('prędkość') || name.includes('speed')) return <SpeedIcon />;
    return <ConditionIcon />;
  };

  const getCompletedConditions = () => {
    return execution.testConditions.filter(c => c.isSet).length;
  };

  const getProgress = () => {
    if (execution.testConditions.length === 0) return 100;
    return (getCompletedConditions() / execution.testConditions.length) * 100;
  };

  const getRequiredConditions = () => {
    return execution.testConditions.filter(c => c.required);
  };

  const areRequiredConditionsSet = () => {
    const required = getRequiredConditions();
    return required.every(c => c.isSet);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <TestIcon color="primary" />
              <Typography variant="h6">
                Główne Parametry Badania
              </Typography>
              {areRequiredConditionsSet() && (
                <Chip 
                  icon={<CompleteIcon />} 
                  label="Ustawione" 
                  color="success" 
                  size="small" 
                />
              )}
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton 
                size="small" 
                onClick={() => setIsExpanded(!isExpanded)}
                sx={{ ml: 1 }}
              >
                {isExpanded ? <CollapseIcon /> : <ExpandIcon />}
              </IconButton>
            </Box>
          </Box>
        }
        subheader={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Ustaw wymagane warunki testowe dla badania zgodnie z protokołem
            </Typography>
            <Box sx={{ mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={getProgress()} 
                sx={{ mb: 0.5 }}
              />
              <Typography variant="caption" color="text.secondary">
                {getCompletedConditions()} z {execution.testConditions.length} warunków ustawionych
              </Typography>
            </Box>
          </Box>
        }
      />

      {isExpanded && (
        <CardContent>
          {/* Disabled warning */}
          {disabled && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Badanie musi być aktywne (rozpoczęte) aby móc ustawiać parametry testowe.
            </Alert>
          )}

        {/* Test Conditions List */}
        {execution.testConditions && execution.testConditions.length > 0 ? (
          <List>
            {execution.testConditions.map((condition, index) => {
              const currentValue = localConditions[condition.name] || '';
              const isValueSet = condition.isSet;
              
              return (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon>
                      {getConditionIcon(condition.name)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle2">
                            {translateConditionName(condition.name)}
                          </Typography>
                          {condition.required && (
                            <Chip label="Wymagane" size="small" color="warning" variant="outlined" />
                          )}
                          {isValueSet && (
                            <Chip icon={<CompleteIcon />} label="Ustawione" size="small" color="success" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            Wymagana wartość: {condition.value} {condition.unit}
                            {condition.tolerance && ` (±${condition.tolerance})`}
                          </Typography>
                          {condition.description && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                              {condition.description}
                            </Typography>
                          )}
                          <TextField
                            size="small"
                            label="Rzeczywista wartość"
                            value={currentValue}
                            onChange={(e) => handleConditionChange(condition.name, e.target.value)}
                            disabled={disabled}
                            fullWidth
                            placeholder={`Wprowadź wartość w ${condition.unit}`}
                            error={condition.required && !isValueSet}
                            helperText={
                              condition.required && !isValueSet 
                                ? 'To pole jest wymagane' 
                                : undefined
                            }
                            sx={{ maxWidth: 300 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < execution.testConditions.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        ) : (
          <Alert severity="info">
            Brak zdefiniowanych warunków testowych dla tego protokołu
          </Alert>
        )}

        {/* Warning for required conditions */}
        {!areRequiredConditionsSet() && execution.testConditions.some(c => c.required) && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Niektóre wymagane warunki testowe nie zostały jeszcze ustawione. 
              Upewnij się, że wszystkie wymagane parametry są skonfigurowane przed kontynuowaniem badania.
            </Typography>
          </Alert>
        )}

        {/* Info message */}
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Główne parametry badania</strong> są podstawowymi warunkami wymaganymi przez protokół testowy. 
            Te parametry dotyczą całego badania i powinny być ustawione na początku wykonywania.
          </Typography>
        </Alert>
        </CardContent>
      )}
    </Card>
  );
};
