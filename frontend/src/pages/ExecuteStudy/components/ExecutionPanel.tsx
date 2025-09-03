import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Alert,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Divider,
  Paper,
  Chip
} from '@mui/material';
import {
  ArrowForward,
  ArrowBack,
  PlayArrow,
  CheckCircle,
  Warning,
  Timer
} from '@mui/icons-material';
import { ExecutionContext, ExecutionSession } from '../types';

interface ExecutionPanelProps {
  context: ExecutionContext;
  session: ExecutionSession | null;
  onNext: () => void;
  onPrevious: () => void;
  onUpdateMeasurement?: (measurementId: string, value: number) => void;
  onUpdateParameter?: (parameterId: string, value: any) => void;
  onUpdateCondition?: (conditionId: string, verified: boolean, notes?: string) => void;
  onCompleteStep?: () => void;
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({
  context,
  session,
  onNext,
  onPrevious,
  onUpdateMeasurement,
  onUpdateParameter,
  onUpdateCondition,
  onCompleteStep
}) => {
  const [stepStartTime, setStepStartTime] = useState<Date | null>(null);
  const [measurements, setMeasurements] = useState<{ [key: string]: number }>({});
  const [parameters, setParameters] = useState<{ [key: string]: any }>({});
  const [conditions, setConditions] = useState<{ [key: string]: boolean }>({});
  const [notes, setNotes] = useState('');

  const currentStep = context.protocol.steps?.[context.currentStepIndex];
  const currentSample = context.samples[context.currentSampleIndex];
  const currentStepResult = session?.stepResults.find(r => r.stepId === currentStep?.id);

  // Initialize step timer
  React.useEffect(() => {
    if (currentStep && !stepStartTime) {
      setStepStartTime(new Date());
    }
  }, [currentStep, stepStartTime]);

  const handleMeasurementChange = (measurementId: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setMeasurements(prev => ({ ...prev, [measurementId]: numValue }));
      onUpdateMeasurement?.(measurementId, numValue);
    }
  };

  const handleParameterChange = (parameterId: string, value: any) => {
    setParameters(prev => ({ ...prev, [parameterId]: value }));
    onUpdateParameter?.(parameterId, value);
  };

  const handleConditionChange = (conditionId: string, verified: boolean) => {
    setConditions(prev => ({ ...prev, [conditionId]: verified }));
    onUpdateCondition?.(conditionId, verified, notes);
  };

  const canCompleteStep = () => {
    if (!currentStep) return false;

    // Check required parameters
    const requiredParams = currentStep.parameters?.filter(p => p.required) || [];
    const hasAllParams = requiredParams.every(param => {
      const value = parameters[param.id];
      return value !== undefined && value !== null && value !== '';
    });

    // Check required measurements
    const requiredMeasurements = currentStep.measurements?.filter(m => m.required) || [];
    const hasAllMeasurements = requiredMeasurements.every(measurement => {
      const value = measurements[measurement.id];
      return value !== undefined && value !== null && !isNaN(Number(value));
    });

    // All conditions are considered required for safety
    const allConditions = currentStep.conditions || [];
    const hasAllConditions = allConditions.every(condition => 
      conditions[condition.id] === true
    );

    return hasAllParams && hasAllMeasurements && hasAllConditions;
  };

  const handleCompleteStep = () => {
    // Call the parent function to handle step completion
    onCompleteStep?.();
  };

  if (!session) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Sesja wykonywania nie została rozpoczęta
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Wykonywanie badania
      </Typography>

      <Grid container spacing={3}>
        {/* Current Sample Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Aktualna próbka: {currentSample?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {currentSample?.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Protocol Steps */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Kroki protokołu
              </Typography>
              
              {context.protocol.steps && (
                <Stepper activeStep={context.currentStepIndex} orientation="vertical">
                  {context.protocol.steps.map((step, index) => (
                    <Step key={step.id}>
                      <StepLabel>
                        {step.title}
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Current Step Details */}
        {currentStep && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Typography variant="h6">
                    Krok {context.currentStepIndex + 1}: {currentStep.title}
                  </Typography>
                  <Chip
                    icon={<Timer />}
                    label={currentStep.duration}
                    variant="outlined"
                    color="primary"
                  />
                </Box>
                
                <Typography variant="body1" paragraph>
                  {currentStep.description}
                </Typography>
                
                {currentStep.instructions && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Instrukcje:
                    </Typography>
                    <List dense>
                      {currentStep.instructions.map((instruction, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`${index + 1}. ${instruction}`} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {currentStep.safety && currentStep.safety.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom color="warning.main">
                      <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Zasady bezpieczeństwa:
                    </Typography>
                    <List dense>
                      {currentStep.safety.map((safety, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={safety} 
                            sx={{ color: 'warning.main' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                {currentStep.tips && currentStep.tips.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom color="info.main">
                      Wskazówki:
                    </Typography>
                    <List dense>
                      {currentStep.tips.map((tip, index) => (
                        <ListItem key={index}>
                          <ListItemText 
                            primary={tip}
                            sx={{ color: 'info.main' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Parameters Input */}
        {currentStep?.parameters && currentStep.parameters.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Parametry kroku
                </Typography>
                <Grid container spacing={2}>
                  {currentStep.parameters.map((param) => (
                    <Grid item xs={12} sm={6} md={4} key={param.id}>
                      {param.type === 'number' && (
                        <TextField
                          fullWidth
                          label={param.name}
                          type="number"
                          value={parameters[param.id] || ''}
                          onChange={(e) => handleParameterChange(param.id, e.target.value)}
                          helperText={param.description}
                          required={param.required}
                          InputProps={{
                            endAdornment: param.unit
                          }}
                        />
                      )}
                      {param.type === 'text' && (
                        <TextField
                          fullWidth
                          label={param.name}
                          value={parameters[param.id] || ''}
                          onChange={(e) => handleParameterChange(param.id, e.target.value)}
                          helperText={param.description}
                          required={param.required}
                        />
                      )}
                      {param.type === 'boolean' && (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={parameters[param.id] || false}
                              onChange={(e) => handleParameterChange(param.id, e.target.checked)}
                            />
                          }
                          label={param.name}
                        />
                      )}
                      {param.type === 'select' && param.constraints?.options && (
                        <FormControl fullWidth>
                          <InputLabel>{param.name}</InputLabel>
                          <Select
                            value={parameters[param.id] || ''}
                            onChange={(e) => handleParameterChange(param.id, e.target.value)}
                            required={param.required}
                          >
                            {param.constraints.options.map((option) => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Measurements Input */}
        {currentStep?.measurements && currentStep.measurements.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pomiary
                </Typography>
                <Grid container spacing={2}>
                  {currentStep.measurements.map((measurement) => (
                    <Grid item xs={12} sm={6} md={4} key={measurement.id}>
                      <TextField
                        fullWidth
                        label={measurement.name}
                        type="number"
                        value={measurements[measurement.id] || ''}
                        onChange={(e) => handleMeasurementChange(measurement.id, e.target.value)}
                        helperText={`${measurement.description || ''} ${measurement.equipment ? `(${measurement.equipment})` : ''}`}
                        required={measurement.required}
                        InputProps={{
                          endAdornment: measurement.unit
                        }}
                        inputProps={{
                          step: measurement.precision || 0.1
                        }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Conditions Verification */}
        {currentStep?.conditions && currentStep.conditions.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weryfikacja warunków
                </Typography>
                <List>
                  {currentStep.conditions.map((condition) => (
                    <ListItem key={condition.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={conditions[condition.id] || false}
                            onChange={(e) => handleConditionChange(condition.id, e.target.checked)}
                            color="success"
                          />
                        }
                        label={`${condition.name}: ${condition.value} ${condition.unit} (±${condition.tolerance})`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Notes */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Notatki
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Dodaj notatki do tego kroku..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Uwagi, obserwacje, problemy..."
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Step Completion Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Zakończenie kroku
              </Typography>
              
              <Box display="flex" gap={2} justifyContent="center" mt={2}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={handleCompleteStep}
                  disabled={!canCompleteStep()}
                  size="large"
                >
                  Zakończ krok {context.currentStepIndex + 1}
                </Button>
              </Box>

              {!canCompleteStep() && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Uzupełnij wszystkie wymagane pola przed zakończeniem kroku
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Navigation */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" gap={2} mt={3}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={onPrevious}
              disabled={context.currentStepIndex === 0}
            >
              Poprzedni krok
            </Button>
            
            <Button
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={onNext}
              disabled={context.currentStepIndex >= (context.protocol.steps?.length || 0) - 1}
            >
              Następny krok
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExecutionPanel;
