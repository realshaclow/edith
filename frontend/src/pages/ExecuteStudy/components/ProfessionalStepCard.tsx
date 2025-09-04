import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
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
  Assignment as InstructionIcon,
  Science as MeasurementIcon,
  Notes as NotesIcon,
  CheckCircle as CompleteIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ExpandMore as ExpandIcon,
  Timer as TimerIcon
} from '@mui/icons-material';
import { ExecutionStep, StudySample, StudyExecution, ExecutionMeasurement } from '../types/professional';

interface ProfessionalStepCardProps {
  step: ExecutionStep;
  sample: StudySample;
  execution: StudyExecution;
  disabled?: boolean;
  onMeasurementUpdate: (stepId: string, measurementId: string, value: string | number, notes?: string) => void;
  onAddNote: (stepId: string, note: string) => void;
  onComplete: (measurements: ExecutionMeasurement[], notes?: string) => Promise<void>;
}

export const ProfessionalStepCard: React.FC<ProfessionalStepCardProps> = ({
  step,
  sample,
  execution,
  disabled = false,
  onMeasurementUpdate,
  onAddNote,
  onComplete
}) => {
  const [localMeasurements, setLocalMeasurements] = useState<{ [key: string]: string | number }>({});
  const [localNotes, setLocalNotes] = useState<{ [key: string]: string }>({});
  const [stepNotes, setStepNotes] = useState('');

  // Get sample measurements for this step
  const sampleMeasurements = sample.measurements.filter(m => m.stepId === step.id);
  const isStepCompleted = sample.completedSteps.includes(step.id);

  const handleMeasurementChange = (measurementId: string, value: string | number) => {
    setLocalMeasurements(prev => ({
      ...prev,
      [measurementId]: value
    }));
    
    // Update immediately
    onMeasurementUpdate(step.id, measurementId, value, localNotes[measurementId] || '');
  };

  const handleMeasurementNoteChange = (measurementId: string, note: string) => {
    setLocalNotes(prev => ({
      ...prev,
      [measurementId]: note
    }));
  };

  const getCompletedMeasurements = () => {
    return step.measurements.filter(measurement => {
      const sampleMeasurement = sampleMeasurements.find(sm => sm.measurementId === measurement.id);
      return sampleMeasurement && sampleMeasurement.value !== undefined;
    }).length;
  };

  const getProgress = () => {
    if (step.measurements.length === 0) return 100;
    return (getCompletedMeasurements() / step.measurements.length) * 100;
  };

  const canCompleteStep = () => {
    const requiredMeasurements = step.measurements.filter(m => m.isRequired);
    const completedRequired = requiredMeasurements.filter(measurement => {
      const sampleMeasurement = sampleMeasurements.find(sm => sm.measurementId === measurement.id);
      return sampleMeasurement && sampleMeasurement.value !== undefined;
    });
    
    return completedRequired.length === requiredMeasurements.length;
  };

  // Translation function for measurement names
  const translateMeasurementName = (name: string): string => {
    const translations: Record<string, string> = {
      // Mechanical properties
      'tensile_strength': 'Wytrzymałość na rozciąganie',
      'tensileStrength': 'Wytrzymałość na rozciąganie',
      'yield_strength': 'Granica plastyczności',
      'yieldStrength': 'Granica plastyczności',
      'elongation': 'Wydłużenie',
      'elastic_modulus': 'Moduł sprężystości',
      'elasticModulus': 'Moduł sprężystości',
      'flexural_strength': 'Wytrzymałość na zginanie',
      'flexuralStrength': 'Wytrzymałość na zginanie',
      'flexural_modulus': 'Moduł zginania',
      'flexuralModulus': 'Moduł zginania',
      
      // Impact properties
      'impact_strength': 'Udarność',
      'impactStrength': 'Udarność',
      'izod_impact': 'Udarność Izod',
      'izodImpact': 'Udarność Izod',
      'charpy_impact': 'Udarność Charpy',
      'charpyImpact': 'Udarność Charpy',
      
      // Thermal properties
      'melting_point': 'Temperatura topnienia',
      'meltingPoint': 'Temperatura topnienia',
      'glass_transition': 'Przejście szkliste',
      'glassTransition': 'Przejście szkliste',
      'deflection_temperature': 'Temperatura ugięcia',
      'deflectionTemperature': 'Temperatura ugięcia',
      'heat_capacity': 'Pojemność cieplna',
      'heatCapacity': 'Pojemność cieplna',
      
      // Flow properties
      'melt_flow_rate': 'Wskaźnik płynięcia',
      'meltFlowRate': 'Wskaźnik płynięcia',
      'viscosity': 'Lepkość',
      'mooney_viscosity': 'Lepkość Mooney',
      'mooneyViscosity': 'Lepkość Mooney',
      
      // Physical properties
      'density': 'Gęstość',
      'hardness': 'Twardość',
      'shore_hardness': 'Twardość Shore',
      'shoreHardness': 'Twardość Shore',
      'thickness': 'Grubość',
      'weight': 'Masa',
      'volume': 'Objętość',
      
      // Chemical properties
      'ash_content': 'Zawartość popiołu',
      'ashContent': 'Zawartość popiołu',
      'moisture_content': 'Zawartość wilgoci',
      'moistureContent': 'Zawartość wilgoci',
      'volatile_content': 'Zawartość substancji lotnych',
      'volatileContent': 'Zawartość substancji lotnych',
      
      // Flammability
      'oxygen_index': 'Indeks tlenowy',
      'oxygenIndex': 'Indeks tlenowy',
      'burning_rate': 'Szybkość spalania',
      'burningRate': 'Szybkość spalania',
      'flame_spread': 'Rozprzestrzenianie płomienia',
      'flameSpread': 'Rozprzestrzenianie płomienia',
      
      // Environmental
      'weathering_resistance': 'Odporność na starzenie',
      'weatheringResistance': 'Odporność na starzenie',
      'uv_resistance': 'Odporność na UV',
      'uvResistance': 'Odporność na UV',
      'color_change': 'Zmiana koloru',
      'colorChange': 'Zmiana koloru'
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

  const handleCompleteStep = async () => {
    if (!canCompleteStep()) return;

    const executionMeasurements: ExecutionMeasurement[] = step.measurements.map(measurement => {
      const sampleMeasurement = sampleMeasurements.find(sm => sm.measurementId === measurement.id);
      return {
        ...measurement,
        actualValue: sampleMeasurement?.value || localMeasurements[measurement.id],
        isCompleted: !!sampleMeasurement || !!localMeasurements[measurement.id],
        notes: sampleMeasurement?.notes || localNotes[measurement.id] || ''
      };
    });

    await onComplete(executionMeasurements, stepNotes);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">
                {step.title}
              </Typography>
              {isStepCompleted && (
                <Chip 
                  icon={<CompleteIcon />} 
                  label="Zakończony" 
                  color="success" 
                  size="small" 
                />
              )}
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Chip 
                label={`Próbka: ${sample.name}`}
                color="primary"
                variant="outlined"
                size="small"
              />
              {step.estimatedDuration && (
                <Chip 
                  icon={<TimerIcon />}
                  label={`${step.estimatedDuration} min`}
                  variant="outlined"
                  size="small"
                />
              )}
            </Box>
          </Box>
        }
        subheader={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {step.description}
            </Typography>
            <Box sx={{ mb: 1 }}>
              <LinearProgress 
                variant="determinate" 
                value={getProgress()} 
                sx={{ mb: 0.5 }}
              />
              <Typography variant="caption" color="text.secondary">
                {getCompletedMeasurements()} z {step.measurements.length} pomiarów wykonanych
              </Typography>
            </Box>
          </Box>
        }
      />

      <CardContent>
        {/* Disabled warning */}
        {disabled && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Badanie musi być aktywne (rozpoczęte) aby móc wprowadzać pomiary i wykonywać kroki.
          </Alert>
        )}

        {/* Instructions */}
        {step.instructions && step.instructions.length > 0 && (
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandIcon />}>
              <Box display="flex" alignItems="center" gap={1}>
                <InstructionIcon color="primary" />
                <Typography variant="subtitle2">
                  Instrukcje wykonania ({step.instructions.length})
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <List dense>
                {step.instructions.map((instruction, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <Typography variant="body2" color="primary" fontWeight="bold">
                        {index + 1}.
                      </Typography>
                    </ListItemIcon>
                    <ListItemText primary={instruction} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Measurements */}
        {step.measurements && step.measurements.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <MeasurementIcon color="primary" />
              <Typography variant="subtitle2">
                Pomiary i obserwacje
              </Typography>
            </Box>

            <Box sx={{ display: 'grid', gap: 2 }}>
              {step.measurements.map((measurement) => {
                const sampleMeasurement = sampleMeasurements.find(sm => sm.measurementId === measurement.id);
                const currentValue = sampleMeasurement?.value || localMeasurements[measurement.id] || '';
                const currentNotes = sampleMeasurement?.notes || localNotes[measurement.id] || '';
                
                return (
                  <Card key={measurement.id} variant="outlined" sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                      <Typography variant="subtitle2">
                        {translateMeasurementName(measurement.name)}
                        {measurement.isRequired && (
                          <Chip 
                            label="Wymagany" 
                            color="error" 
                            size="small" 
                            sx={{ ml: 1 }} 
                          />
                        )}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {measurement.unit}
                      </Typography>
                    </Box>

                    {measurement.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {measurement.description}
                      </Typography>
                    )}

                    <Box display="flex" gap={2} alignItems="flex-start">
                      <TextField
                        label="Wartość"
                        type={measurement.dataType === 'NUMBER' ? 'number' : 'text'}
                        value={currentValue}
                        onChange={(e) => handleMeasurementChange(measurement.id, e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                        disabled={disabled}
                        error={measurement.isRequired && !currentValue}
                        helperText={
                          measurement.expectedValue ? 
                            `Oczekiwana: ${measurement.expectedValue}` : 
                            undefined
                        }
                      />
                      
                      <TextField
                        label="Notatki"
                        value={currentNotes}
                        onChange={(e) => handleMeasurementNoteChange(measurement.id, e.target.value)}
                        size="small"
                        sx={{ flex: 1 }}
                        disabled={disabled}
                        multiline
                        maxRows={2}
                      />
                    </Box>

                    {measurement.tolerance && measurement.expectedValue && currentValue && (
                      <Box sx={{ mt: 1 }}>
                        {Math.abs(Number(currentValue) - Number(measurement.expectedValue)) <= Number(measurement.tolerance) ? (
                          <Alert severity="success" sx={{ py: 0 }}>
                            Wartość w tolerancji (±{measurement.tolerance})
                          </Alert>
                        ) : (
                          <Alert severity="warning" sx={{ py: 0 }}>
                            Wartość poza tolerancją (±{measurement.tolerance})
                          </Alert>
                        )}
                      </Box>
                    )}
                  </Card>
                );
              })}
            </Box>
          </Box>
        )}

        {/* Step notes */}
        <Box sx={{ mb: 3 }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <NotesIcon color="primary" />
            <Typography variant="subtitle2">
              Notatki do kroku
            </Typography>
          </Box>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Dodaj notatki dotyczące wykonania tego kroku..."
            value={stepNotes}
            onChange={(e) => setStepNotes(e.target.value)}
            size="small"
            disabled={disabled}
          />
        </Box>

        {/* Info message */}
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          {!canCompleteStep() && (
            <Alert severity="info" sx={{ display: 'inline-flex' }}>
              <InfoIcon sx={{ mr: 1 }} />
              Uzupełnij wszystkie wymagane pomiary
            </Alert>
          )}
          {isStepCompleted && (
            <Alert severity="success" sx={{ display: 'inline-flex' }}>
              <CompleteIcon sx={{ mr: 1 }} />
              Krok zakończony
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
