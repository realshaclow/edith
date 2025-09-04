import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Divider,
  Alert,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Science as ScienceIcon,
  Visibility as ObservationIcon,
  Calculate as CalculationIcon,
  Thermostat as ConditionIcon,
  AutoAwesome as SuggestedIcon,
} from '@mui/icons-material';
import { 
  CreateStudyStepProps, 
  MeasurementDefinition, 
  DataPointType, 
  DataType, 
  MeasurementCategory,
  StepMeasurementConfig 
} from '../types';

const dataPointTypeIcons = {
  [DataPointType.MEASUREMENT]: <ScienceIcon />,
  [DataPointType.OBSERVATION]: <ObservationIcon />,
  [DataPointType.CALCULATION]: <CalculationIcon />,
  [DataPointType.CONDITION]: <ConditionIcon />,
};

const dataPointTypeColors = {
  [DataPointType.MEASUREMENT]: 'primary',
  [DataPointType.OBSERVATION]: 'secondary',
  [DataPointType.CALCULATION]: 'success',
  [DataPointType.CONDITION]: 'warning',
} as const;

export const StepMeasurementsStep: React.FC<CreateStudyStepProps & {
  onAddMeasurement: (stepId: string, measurement: MeasurementDefinition) => void;
  onRemoveMeasurement: (stepId: string, measurementId: string) => void;
  onUpdateMeasurement: (stepId: string, measurementId: string, updates: Partial<MeasurementDefinition>) => void;
  onAddSuggestedMeasurements: (stepId: string) => void;
}> = ({ 
  studyData, 
  protocolData, 
  onAddMeasurement,
  onRemoveMeasurement,
  onUpdateMeasurement,
  onAddSuggestedMeasurements,
}) => {
  const theme = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMeasurement, setEditingMeasurement] = useState<MeasurementDefinition | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string>('');
  const [newMeasurement, setNewMeasurement] = useState<Partial<MeasurementDefinition>>({
    name: '',
    description: '',
    type: DataPointType.MEASUREMENT,
    dataType: DataType.NUMBER,
    unit: '',
    isRequired: false, // Pomiary domyślnie nie są wymagane
    category: MeasurementCategory.MECHANICAL,
  });

  const handleOpenDialog = (stepId: string, measurement?: MeasurementDefinition) => {
    setCurrentStepId(stepId);
    if (measurement) {
      setEditingMeasurement(measurement);
      setNewMeasurement(measurement);
    } else {
      setEditingMeasurement(null);
      setNewMeasurement({
        name: '',
        description: '',
        type: DataPointType.MEASUREMENT,
        dataType: DataType.NUMBER,
        unit: '',
        isRequired: false, // Pomiary domyślnie nie są wymagane
        category: MeasurementCategory.MECHANICAL,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingMeasurement(null);
    setCurrentStepId('');
  };

  const handleSaveMeasurement = () => {
    if (!newMeasurement.name?.trim()) return;

    const measurementData: MeasurementDefinition = {
      id: editingMeasurement?.id || `measurement-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newMeasurement.name!,
      description: newMeasurement.description,
      type: newMeasurement.type!,
      dataType: newMeasurement.dataType!,
      unit: newMeasurement.unit,
      isRequired: newMeasurement.isRequired!,
      validationRules: {
        min: newMeasurement.validationRules?.min,
        max: newMeasurement.validationRules?.max,
        pattern: newMeasurement.validationRules?.pattern,
        precision: newMeasurement.validationRules?.precision,
      },
      defaultValue: newMeasurement.defaultValue,
      formula: newMeasurement.formula,
      category: newMeasurement.category,
    };

    if (editingMeasurement) {
      onUpdateMeasurement(currentStepId, editingMeasurement.id, measurementData);
    } else {
      onAddMeasurement(currentStepId, measurementData);
    }

    handleCloseDialog();
  };

  const totalMeasurements = studyData.stepMeasurements.reduce(
    (total, step) => total + step.measurements.length, 
    0
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Konfiguracja Pomiarów dla Kroków
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Opcjonalnie zdefiniuj jakie pomiary będą zbierane podczas wykonywania każdego kroku protokołu w sesji badawczej. Pomiary nie są wymagane - możesz dodać je tylko dla kroków które Cię interesują.
      </Typography>

      {/* Statystyki */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Protokół:</strong> {protocolData?.title} • 
          <strong> Kroków:</strong> {studyData.stepMeasurements.length} • 
          <strong> Pomiarów:</strong> {totalMeasurements}
        </Typography>
      </Alert>

      {/* Lista kroków z pomiarami */}
      <Box sx={{ mb: 4 }}>
        {studyData.stepMeasurements.map((step, index) => (
          <Accordion 
            key={step.stepId}
            defaultExpanded={index === 0}
            sx={{ 
              mb: 2,
              '&:before': { display: 'none' },
              boxShadow: theme.palette.mode === 'dark' ? 1 : 2,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ mb: 0.5 }}>
                    {step.stepTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.estimatedDuration} • {step.measurements.length} pomiarów
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                  {step.isRequired && (
                    <Chip size="small" label="Wymagany" color="primary" />
                  )}
                  {step.measurements.length === 0 && step.isRequired && (
                    <Chip size="small" label="Brak pomiarów" color="error" />
                  )}
                </Box>
              </Box>
            </AccordionSummary>
            
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" paragraph>
                {step.stepDescription}
              </Typography>

              {/* Przyciski akcji */}
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  startIcon={<AddIcon />}
                  variant="contained"
                  size="small"
                  onClick={() => handleOpenDialog(step.stepId)}
                >
                  Dodaj Pomiar
                </Button>
                
                {protocolData?.suggestedMeasurements?.[step.stepId] && (
                  <Button
                    startIcon={<SuggestedIcon />}
                    variant="outlined"
                    size="small"
                    onClick={() => onAddSuggestedMeasurements(step.stepId)}
                  >
                    Sugerowane Pomiary
                  </Button>
                )}
              </Box>

              {/* Lista pomiarów */}
              {step.measurements.length === 0 ? (
                <Alert severity="info">
                  Ten krok nie ma jeszcze zdefiniowanych pomiarów. Możesz dodać pomiary jeśli chcesz zbierać dodatkowe dane podczas tego kroku.
                </Alert>
              ) : (
                <Grid container spacing={2}>
                  {step.measurements.map((measurement) => (
                    <Grid item xs={12} md={6} key={measurement.id}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ pb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {measurement.name}
                              </Typography>
                              {measurement.description && (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                  {measurement.description}
                                </Typography>
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <Tooltip title="Edytuj pomiar">
                                <IconButton 
                                  size="small"
                                  onClick={() => handleOpenDialog(step.stepId, measurement)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Usuń pomiar">
                                <IconButton 
                                  size="small"
                                  color="error"
                                  onClick={() => onRemoveMeasurement(step.stepId, measurement.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <Chip
                              size="small"
                              icon={dataPointTypeIcons[measurement.type]}
                              label={measurement.type}
                              color={dataPointTypeColors[measurement.type]}
                            />
                            <Chip
                              size="small"
                              label={measurement.dataType}
                              variant="outlined"
                            />
                            {measurement.unit && (
                              <Chip
                                size="small"
                                label={measurement.unit}
                                variant="outlined"
                              />
                            )}
                            {measurement.isRequired && (
                              <Chip
                                size="small"
                                label="Wymagany"
                                color="primary"
                                variant="outlined"
                              />
                            )}
                          </Box>

                          {measurement.formula && (
                            <Typography variant="caption" display="block" sx={{ mt: 1, fontFamily: 'monospace' }}>
                              <strong>Formuła:</strong> {measurement.formula}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Dialog dodawania/edycji pomiaru */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingMeasurement ? 'Edytuj Pomiar' : 'Dodaj Nowy Pomiar'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            {/* Podstawowe informacje */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nazwa pomiaru *"
                value={newMeasurement.name || ''}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, name: e.target.value }))}
                placeholder="np. Siła maksymalna, Temperatura, Uwagi wizualne"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Opis"
                multiline
                rows={2}
                value={newMeasurement.description || ''}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Opcjonalny opis pomiaru"
              />
            </Grid>

            {/* Typ pomiaru */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Typ pomiaru</InputLabel>
                <Select
                  value={newMeasurement.type || DataPointType.MEASUREMENT}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, type: e.target.value as DataPointType }))}
                >
                  <MenuItem value={DataPointType.MEASUREMENT}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScienceIcon fontSize="small" />
                      MEASUREMENT - Pomiar bezpośredni
                    </Box>
                  </MenuItem>
                  <MenuItem value={DataPointType.OBSERVATION}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ObservationIcon fontSize="small" />
                      OBSERVATION - Obserwacja
                    </Box>
                  </MenuItem>
                  <MenuItem value={DataPointType.CALCULATION}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CalculationIcon fontSize="small" />
                      CALCULATION - Obliczenie
                    </Box>
                  </MenuItem>
                  <MenuItem value={DataPointType.CONDITION}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ConditionIcon fontSize="small" />
                      CONDITION - Warunek
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Typ danych */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Typ danych</InputLabel>
                <Select
                  value={newMeasurement.dataType || DataType.NUMBER}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, dataType: e.target.value as DataType }))}
                >
                  <MenuItem value={DataType.NUMBER}>NUMBER - Liczba</MenuItem>
                  <MenuItem value={DataType.TEXT}>TEXT - Tekst</MenuItem>
                  <MenuItem value={DataType.BOOLEAN}>BOOLEAN - Tak/Nie</MenuItem>
                  <MenuItem value={DataType.DATE}>DATE - Data/Czas</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Jednostka */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Jednostka"
                value={newMeasurement.unit || ''}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, unit: e.target.value }))}
                placeholder="np. MPa, °C, mm, %"
              />
            </Grid>

            {/* Kategoria */}
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Kategoria</InputLabel>
                <Select
                  value={newMeasurement.category || MeasurementCategory.MECHANICAL}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, category: e.target.value as MeasurementCategory }))}
                >
                  {Object.values(MeasurementCategory).map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Walidacja - tylko dla NUMBER */}
            {newMeasurement.dataType === DataType.NUMBER && (
              <>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Wartość minimalna"
                    type="number"
                    value={newMeasurement.validationRules?.min || ''}
                    onChange={(e) => setNewMeasurement(prev => ({ 
                      ...prev, 
                      validationRules: { 
                        ...prev.validationRules, 
                        min: e.target.value ? parseFloat(e.target.value) : undefined 
                      }
                    }))}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Wartość maksymalna"
                    type="number"
                    value={newMeasurement.validationRules?.max || ''}
                    onChange={(e) => setNewMeasurement(prev => ({ 
                      ...prev, 
                      validationRules: { 
                        ...prev.validationRules, 
                        max: e.target.value ? parseFloat(e.target.value) : undefined 
                      }
                    }))}
                  />
                </Grid>
              </>
            )}

            {/* Formuła - tylko dla CALCULATION */}
            {newMeasurement.type === DataPointType.CALCULATION && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Formuła obliczeniowa"
                  value={newMeasurement.formula || ''}
                  onChange={(e) => setNewMeasurement(prev => ({ ...prev, formula: e.target.value }))}
                  placeholder="np. Siła / Powierzchnia"
                  helperText="Użyj nazw innych pomiarów jako zmiennych"
                />
              </Grid>
            )}

            {/* Wartość domyślna */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Wartość domyślna"
                value={newMeasurement.defaultValue || ''}
                onChange={(e) => setNewMeasurement(prev => ({ ...prev, defaultValue: e.target.value }))}
              />
            </Grid>

            {/* Czy wymagany */}
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={newMeasurement.isRequired || false}
                    onChange={(e) => setNewMeasurement(prev => ({ ...prev, isRequired: e.target.checked }))}
                  />
                }
                label="Pomiar obowiązkowy podczas sesji"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Anuluj
          </Button>
          <Button 
            onClick={handleSaveMeasurement}
            variant="contained"
            disabled={!newMeasurement.name?.trim()}
          >
            {editingMeasurement ? 'Zapisz Zmiany' : 'Dodaj Pomiar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
