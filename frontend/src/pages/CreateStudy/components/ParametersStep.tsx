import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid
} from '@mui/material';
import { Add, Delete, ExpandMore } from '@mui/icons-material';
import { StudyFormData, StudyParameter, CreateStudyFormErrors } from '../types';

interface ParametersStepProps {
  studyData: StudyFormData;
  errors: CreateStudyFormErrors;
  onUpdate: (data: Partial<StudyFormData>) => void;
}

export const ParametersStep: React.FC<ParametersStepProps> = ({
  studyData,
  errors,
  onUpdate
}) => {
  const isGlobalMode = studyData.parametrizationMode === 'global';

  const toggleParametersMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newMode = event.target.checked ? 'global' : 'per-step';
    onUpdate({
      parametrizationMode: newMode,
      // Resetuj parametry przy zmianie trybu
      parameters: [],
      stepParameters: {}
    });
  };

  const addGlobalParameter = () => {
    const newParameter: StudyParameter = {
      id: `param_${Date.now()}`,
      name: '',
      type: 'text',
      value: '',
      unit: '',
      required: false,
      description: ''
    };
    
    onUpdate({
      parameters: [...studyData.parameters, newParameter]
    });
  };

  const updateGlobalParameter = (paramId: string, updates: Partial<StudyParameter>) => {
    const updatedParameters = studyData.parameters.map(param =>
      param.id === paramId ? { ...param, ...updates } : param
    );
    onUpdate({ parameters: updatedParameters });
  };

  const removeGlobalParameter = (paramId: string) => {
    const filteredParameters = studyData.parameters.filter(param => param.id !== paramId);
    onUpdate({ parameters: filteredParameters });
  };

  const addStepParameter = (stepId: string) => {
    const newParameter: StudyParameter = {
      id: `param_${Date.now()}`,
      name: '',
      type: 'text',
      value: '',
      unit: '',
      required: false,
      description: ''
    };

    const currentStepParams = studyData.stepParameters[stepId] || [];
    onUpdate({
      stepParameters: {
        ...studyData.stepParameters,
        [stepId]: [...currentStepParams, newParameter]
      }
    });
  };

  const updateStepParameter = (stepId: string, paramId: string, updates: Partial<StudyParameter>) => {
    const stepParams = studyData.stepParameters[stepId] || [];
    const updatedStepParams = stepParams.map(param =>
      param.id === paramId ? { ...param, ...updates } : param
    );
    
    onUpdate({
      stepParameters: {
        ...studyData.stepParameters,
        [stepId]: updatedStepParams
      }
    });
  };

  const removeStepParameter = (stepId: string, paramId: string) => {
    const stepParams = studyData.stepParameters[stepId] || [];
    const filteredStepParams = stepParams.filter(param => param.id !== paramId);
    
    onUpdate({
      stepParameters: {
        ...studyData.stepParameters,
        [stepId]: filteredStepParams
      }
    });
  };

  const renderParameterForm = (
    parameter: StudyParameter,
    onUpdate: (updates: Partial<StudyParameter>) => void,
    onRemove: () => void,
    index: number
  ) => {
    const parameterErrors = errors.parameters as { [key: string]: string } || {};
    
    return (
      <Card key={parameter.id} variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1">
              Parametr #{index + 1}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              {parameter.required && (
                <Chip 
                  label="Wymagany" 
                  size="small" 
                  color="primary" 
                />
              )}
              <Tooltip title="Usuń parametr">
                <IconButton
                  size="small"
                  onClick={onRemove}
                  color="error"
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nazwa parametru"
                value={parameter.name}
                onChange={(e) => onUpdate({ name: e.target.value })}
                error={!!parameterErrors[parameter.id]}
                helperText={parameterErrors[parameter.id]}
                required={parameter.required}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Typ parametru</InputLabel>
                <Select
                  value={parameter.type}
                  label="Typ parametru"
                  onChange={(e) => onUpdate({ type: e.target.value as StudyParameter['type'] })}
                >
                  <MenuItem value="text">Tekst</MenuItem>
                  <MenuItem value="number">Liczba</MenuItem>
                  <MenuItem value="boolean">Tak/Nie</MenuItem>
                  <MenuItem value="select">Lista wyboru</MenuItem>
                  <MenuItem value="date">Data</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Wartość"
                value={parameter.value}
                onChange={(e) => onUpdate({ value: e.target.value })}
                type={parameter.type === 'number' ? 'number' : 'text'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Jednostka (opcjonalna)"
                value={parameter.unit}
                onChange={(e) => onUpdate({ unit: e.target.value })}
                placeholder="np. °C, mm, kg"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Opis parametru (opcjonalny)"
                value={parameter.description}
                onChange={(e) => onUpdate({ description: e.target.value })}
                multiline
                rows={2}
                placeholder="Opisz cel i znaczenie tego parametru"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={parameter.required}
                    onChange={(e) => onUpdate({ required: e.target.checked })}
                  />
                }
                label="Parametr wymagany"
              />
            </Grid>

            {parameter.type === 'number' && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Wartość minimalna"
                    type="number"
                    value={parameter.constraints?.min || ''}
                    onChange={(e) => onUpdate({
                      constraints: {
                        ...parameter.constraints,
                        min: e.target.value ? Number(e.target.value) : undefined
                      }
                    })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Wartość maksymalna"
                    type="number"
                    value={parameter.constraints?.max || ''}
                    onChange={(e) => onUpdate({
                      constraints: {
                        ...parameter.constraints,
                        max: e.target.value ? Number(e.target.value) : undefined
                      }
                    })}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">
            Parametry badania
          </Typography>
          
          <FormControlLabel
            control={
              <Switch
                checked={isGlobalMode}
                onChange={toggleParametersMode}
                color="primary"
              />
            }
            label={isGlobalMode ? "Parametry globalne" : "Parametry per krok"}
          />
        </Box>

        {/* Wyjaśnienie trybu */}
        <Box mb={3} p={2} bgcolor="grey.50" borderRadius={1}>
          <Typography variant="body2" color="text.secondary">
            {isGlobalMode ? (
              <>
                <strong>Parametry globalne:</strong> Jeden zestaw parametrów dla całego badania.
                Wszystkie kroki protokołu będą używać tych samych parametrów.
              </>
            ) : (
              <>
                <strong>Parametry per krok:</strong> Różne parametry dla każdego kroku protokołu.
                Pozwala na precyzyjne dostosowanie parametrów do specyfiki każdego kroku.
              </>
            )}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {isGlobalMode ? (
          // Tryb globalny
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Parametry globalne ({studyData.parameters.length})
              </Typography>
              <Tooltip title="Dodaj nowy parametr">
                <IconButton onClick={addGlobalParameter} color="primary">
                  <Add />
                </IconButton>
              </Tooltip>
            </Box>

            {studyData.parameters.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  Brak zdefiniowanych parametrów. Kliknij przycisk "+" aby dodać parametr.
                </Typography>
              </Box>
            ) : (
              studyData.parameters.map((parameter, index) =>
                renderParameterForm(
                  parameter,
                  (updates) => updateGlobalParameter(parameter.id, updates),
                  () => removeGlobalParameter(parameter.id),
                  index
                )
              )
            )}
          </Box>
        ) : (
          // Tryb per krok
          <Box>
            {studyData.selectedProtocol?.steps && studyData.selectedProtocol.steps.length > 0 ? (
              studyData.selectedProtocol.steps.map((step, stepIndex) => {
                const stepParams = studyData.stepParameters[step.id] || [];
                
                return (
                  <Accordion key={step.id} sx={{ mb: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                        <Typography variant="h6">
                          Krok {stepIndex + 1}: {step.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={`${stepParams.length} parametrów`} 
                            size="small" 
                            color={stepParams.length > 0 ? 'primary' : 'default'}
                          />
                          <Tooltip title="Dodaj parametr do kroku">
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                addStepParameter(step.id);
                              }}
                              color="primary"
                            >
                              <Add />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {step.description}
                      </Typography>
                      
                      {stepParams.length === 0 ? (
                        <Box textAlign="center" py={2}>
                          <Typography color="text.secondary">
                            Brak parametrów dla tego kroku. Kliknij "+" aby dodać parametr.
                          </Typography>
                        </Box>
                      ) : (
                        stepParams.map((parameter, paramIndex) =>
                          renderParameterForm(
                            parameter,
                            (updates) => updateStepParameter(step.id, parameter.id, updates),
                            () => removeStepParameter(step.id, parameter.id),
                            paramIndex
                          )
                        )
                      )}
                    </AccordionDetails>
                  </Accordion>
                );
              })
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">
                  Wybierz protokół w poprzednim kroku, aby móc przypisać parametry do kroków.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
