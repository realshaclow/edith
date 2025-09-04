import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  LinearProgress
} from '@mui/material';
import {
  Assignment as InstructionIcon,
  Science as MeasurementIcon,
  CheckCircle as CompleteIcon,
  ExpandMore as ExpandIcon,
  Timer as TimerIcon,
  PlayArrow as ApplyIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { ExecutionStep, StudySample, StudyExecution, ExecutionMeasurement } from '../types/professional';

interface BatchStepCardProps {
  step: ExecutionStep;
  samples: StudySample[];
  execution: StudyExecution;
  onBatchMeasurementUpdate: (stepId: string, measurementId: string, sampleValues: { [sampleId: string]: string | number }, notes?: string) => void;
  onBatchComplete: (stepId: string, batchData: { [sampleId: string]: ExecutionMeasurement[] }) => Promise<void>;
}

export const BatchStepCard: React.FC<BatchStepCardProps> = ({
  step,
  samples,
  execution,
  onBatchMeasurementUpdate,
  onBatchComplete
}) => {
  const [batchValues, setBatchValues] = useState<{ [measurementId: string]: { [sampleId: string]: string | number } }>({});
  const [batchNotes, setBatchNotes] = useState<{ [measurementId: string]: string }>({});
  const [applyToAllValue, setApplyToAllValue] = useState<{ [measurementId: string]: string | number }>({});

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

  const handleValueChange = (measurementId: string, sampleId: string, value: string | number) => {
    setBatchValues(prev => ({
      ...prev,
      [measurementId]: {
        ...prev[measurementId],
        [sampleId]: value
      }
    }));
  };

  const handleApplyToAll = (measurementId: string) => {
    const valueToApply = applyToAllValue[measurementId];
    if (valueToApply === undefined || valueToApply === '') return;

    const newValues: { [sampleId: string]: string | number } = {};
    samples.forEach(sample => {
      newValues[sample.id] = valueToApply;
    });

    setBatchValues(prev => ({
      ...prev,
      [measurementId]: newValues
    }));

    // Wyczyść pole "zastosuj do wszystkich"
    setApplyToAllValue(prev => ({
      ...prev,
      [measurementId]: ''
    }));
  };

  const getCompletedSamplesForStep = () => {
    return samples.filter(sample => sample.completedSteps.includes(step.id)).length;
  };

  const getProgress = () => {
    if (samples.length === 0) return 100;
    return (getCompletedSamplesForStep() / samples.length) * 100;
  };

  const canCompleteStep = () => {
    const requiredMeasurements = step.measurements.filter(m => m.isRequired);
    
    // Sprawdź czy dla każdej próbki wszystkie wymagane pomiary są wypełnione
    return samples.every(sample => {
      return requiredMeasurements.every(measurement => {
        const currentValue = batchValues[measurement.id]?.[sample.id];
        const existingMeasurement = sample.measurements.find(sm => 
          sm.stepId === step.id && sm.measurementId === measurement.id
        );
        return currentValue !== undefined || existingMeasurement;
      });
    });
  };

  const handleBatchComplete = async () => {
    if (!canCompleteStep()) return;

    const batchData: { [sampleId: string]: ExecutionMeasurement[] } = {};

    samples.forEach(sample => {
      const sampleMeasurements: ExecutionMeasurement[] = step.measurements.map(measurement => {
        const currentValue = batchValues[measurement.id]?.[sample.id];
        const existingMeasurement = sample.measurements.find(sm => 
          sm.stepId === step.id && sm.measurementId === measurement.id
        );

        return {
          ...measurement,
          actualValue: currentValue || existingMeasurement?.value,
          isCompleted: !!(currentValue || existingMeasurement),
          notes: batchNotes[measurement.id] || existingMeasurement?.notes || ''
        };
      });

      batchData[sample.id] = sampleMeasurements;
    });

    await onBatchComplete(step.id, batchData);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6">
                {step.title} (Tryb grupowy)
              </Typography>
              <Chip 
                label={`${getCompletedSamplesForStep()} / ${samples.length} próbek`}
                color={getCompletedSamplesForStep() === samples.length ? 'success' : 'primary'}
                size="small"
              />
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
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
                Wprowadź dane dla wszystkich próbek jednocześnie
              </Typography>
            </Box>
          </Box>
        }
      />

      <CardContent>
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
              <ol>
                {step.instructions.map((instruction, index) => (
                  <li key={index}>
                    <Typography variant="body2">{instruction}</Typography>
                  </li>
                ))}
              </ol>
            </AccordionDetails>
          </Accordion>
        )}

        {/* Batch measurements */}
        {step.measurements && step.measurements.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <MeasurementIcon color="primary" />
              <Typography variant="subtitle2">
                Pomiary grupowe
              </Typography>
            </Box>

            {step.measurements.map((measurement) => (
              <Card key={measurement.id} variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
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
                      {measurement.description && (
                        <Typography variant="body2" color="text.secondary">
                          {measurement.description}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {measurement.unit}
                    </Typography>
                  </Box>

                  {/* Zastosuj do wszystkich */}
                  <Box display="flex" gap={1} alignItems="center" mb={2} sx={{ p: 1, backgroundColor: 'grey.50', borderRadius: 1 }}>
                    <TextField
                      label="Wartość dla wszystkich próbek"
                      type={measurement.dataType === 'NUMBER' ? 'number' : 'text'}
                      value={applyToAllValue[measurement.id] || ''}
                      onChange={(e) => setApplyToAllValue(prev => ({
                        ...prev,
                        [measurement.id]: e.target.value
                      }))}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<ApplyIcon />}
                      onClick={() => handleApplyToAll(measurement.id)}
                      disabled={!applyToAllValue[measurement.id]}
                    >
                      Zastosuj
                    </Button>
                  </Box>

                  {/* Tabela z wartościami dla każdej próbki */}
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Próbka</TableCell>
                          <TableCell>Wartość</TableCell>
                          <TableCell>Oczekiwana</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {samples.map((sample) => {
                          const currentValue = batchValues[measurement.id]?.[sample.id] || '';
                          const existingMeasurement = sample.measurements.find(sm => 
                            sm.stepId === step.id && sm.measurementId === measurement.id
                          );
                          const displayValue = currentValue || existingMeasurement?.value || '';
                          
                          const isValid = measurement.expectedValue && displayValue ? 
                            (measurement.tolerance ? 
                              Math.abs(Number(displayValue) - Number(measurement.expectedValue)) <= Number(measurement.tolerance) :
                              displayValue === measurement.expectedValue
                            ) : true;

                          return (
                            <TableRow key={sample.id}>
                              <TableCell>{sample.name}</TableCell>
                              <TableCell>
                                <TextField
                                  type={measurement.dataType === 'NUMBER' ? 'number' : 'text'}
                                  value={displayValue}
                                  onChange={(e) => handleValueChange(measurement.id, sample.id, e.target.value)}
                                  size="small"
                                  fullWidth
                                  error={measurement.isRequired && !displayValue}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption">
                                  {measurement.expectedValue || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {displayValue ? (
                                  isValid ? (
                                    <Chip label="OK" color="success" size="small" />
                                  ) : (
                                    <Chip label="Poza tolerancją" color="warning" size="small" />
                                  )
                                ) : (
                                  measurement.isRequired ? (
                                    <Chip label="Wymagany" color="error" size="small" />
                                  ) : (
                                    <Chip label="Opcjonalny" color="default" size="small" />
                                  )
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Notatki dla pomiaru */}
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Notatki do pomiaru"
                      value={batchNotes[measurement.id] || ''}
                      onChange={(e) => setBatchNotes(prev => ({
                        ...prev,
                        [measurement.id]: e.target.value
                      }))}
                      multiline
                      rows={2}
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {/* Info message */}
        <Box display="flex" justifyContent="flex-start" alignItems="center">
          {!canCompleteStep() && (
            <Alert severity="info" sx={{ display: 'inline-flex' }}>
              <InfoIcon sx={{ mr: 1 }} />
              Uzupełnij wszystkie wymagane pomiary dla wszystkich próbek
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
