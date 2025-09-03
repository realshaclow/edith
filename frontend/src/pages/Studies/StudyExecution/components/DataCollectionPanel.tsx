import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Alert,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormHelperText,
  InputAdornment,
  Tooltip
} from '@mui/material';
import {
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Camera as CameraIcon,
  AttachFile as FileIcon,
  CheckCircle as ValidIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import { ExecutionDataPoint, ValidationRule } from '../types';

interface DataCollectionPanelProps {
  stepId: string;
  sampleId: string;
  dataPoints: ExecutionDataPoint[];
  currentData?: Record<string, any>;
  onDataChange: (dataPointId: string, value: any) => void;
  onSave?: () => void;
  onImageCapture?: (dataPointId: string) => void;
  onFileUpload?: (dataPointId: string, file: File) => void;
  readonly?: boolean;
  showValidation?: boolean;
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
  severity: 'error' | 'warning' | 'info';
}

const DataCollectionPanel: React.FC<DataCollectionPanelProps> = ({
  stepId,
  sampleId,
  dataPoints,
  currentData = {},
  onDataChange,
  onSave,
  onImageCapture,
  onFileUpload,
  readonly = false,
  showValidation = true
}) => {
  const [validationResults, setValidationResults] = useState<Record<string, ValidationResult>>({});
  const [calculationDialog, setCalculationDialog] = useState<{
    open: boolean;
    dataPoint?: ExecutionDataPoint;
  }>({ open: false });

  const validateValue = useCallback((dataPoint: ExecutionDataPoint, value: any): ValidationResult => {
    if (!dataPoint.validationRules || dataPoint.validationRules.length === 0) {
      return { isValid: true, severity: 'info' };
    }

    for (const rule of dataPoint.validationRules) {
      switch (rule.type) {
        case 'required':
          if (!value || value === '' || value === null || value === undefined) {
            return { isValid: false, message: rule.message, severity: 'error' };
          }
          break;
        
        case 'min':
          if (typeof value === 'number' && value < rule.value) {
            return { isValid: false, message: rule.message, severity: 'error' };
          }
          break;
        
        case 'max':
          if (typeof value === 'number' && value > rule.value) {
            return { isValid: false, message: rule.message, severity: 'error' };
          }
          break;
        
        case 'range':
          if (typeof value === 'number' && (value < rule.value.min || value > rule.value.max)) {
            return { isValid: false, message: rule.message, severity: 'error' };
          }
          break;
        
        case 'pattern':
          if (typeof value === 'string' && !new RegExp(rule.value).test(value)) {
            return { isValid: false, message: rule.message, severity: 'error' };
          }
          break;
        
        default:
          break;
      }
    }

    return { isValid: true, severity: 'info' };
  }, []);

  const handleValueChange = useCallback((dataPoint: ExecutionDataPoint, value: any) => {
    onDataChange(dataPoint.id, value);
    
    if (showValidation) {
      const result = validateValue(dataPoint, value);
      setValidationResults(prev => ({
        ...prev,
        [dataPoint.id]: result
      }));
    }
  }, [onDataChange, validateValue, showValidation]);

  const renderDataPointInput = (dataPoint: ExecutionDataPoint) => {
    const value = currentData[dataPoint.id] || dataPoint.defaultValue || '';
    const validation = validationResults[dataPoint.id];
    const hasError = validation && !validation.isValid;

    const commonProps = {
      fullWidth: true,
      disabled: readonly,
      error: hasError,
      helperText: validation?.message || dataPoint.description,
      required: dataPoint.required
    };

    switch (dataPoint.type) {
      case 'measurement':
        return (
          <TextField
            {...commonProps}
            type="number"
            label={dataPoint.name}
            value={value}
            onChange={(e) => handleValueChange(dataPoint, parseFloat(e.target.value) || 0)}
            InputProps={{
              endAdornment: dataPoint.unit && (
                <InputAdornment position="end">{dataPoint.unit}</InputAdornment>
              )
            }}
          />
        );

      case 'observation':
        return (
          <TextField
            {...commonProps}
            multiline
            rows={3}
            label={dataPoint.name}
            value={value}
            onChange={(e) => handleValueChange(dataPoint, e.target.value)}
            placeholder="Wprowadź obserwacje..."
          />
        );

      case 'calculation':
        return (
          <Box>
            <TextField
              {...commonProps}
              type="number"
              label={dataPoint.name}
              value={value}
              onChange={(e) => handleValueChange(dataPoint, parseFloat(e.target.value) || 0)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    {dataPoint.unit && <span style={{ marginRight: 8 }}>{dataPoint.unit}</span>}
                    <Tooltip title="Kalkulator">
                      <IconButton
                        size="small"
                        onClick={() => setCalculationDialog({ open: true, dataPoint })}
                        disabled={readonly}
                      >
                        <CalculateIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        );

      case 'image':
        return (
          <Box>
            <TextField
              {...commonProps}
              label={dataPoint.name}
              value={value || 'Nie dodano zdjęcia'}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Zrób zdjęcie">
                      <IconButton
                        onClick={() => onImageCapture?.(dataPoint.id)}
                        disabled={readonly}
                      >
                        <CameraIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
            {value && typeof value === 'string' && value.startsWith('blob:') && (
              <Box mt={1}>
                <img 
                  src={value} 
                  alt={dataPoint.name}
                  style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                />
              </Box>
            )}
          </Box>
        );

      case 'file':
        return (
          <Box>
            <TextField
              {...commonProps}
              label={dataPoint.name}
              value={value ? `Plik: ${value.name || value}` : 'Nie dodano pliku'}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title="Dodaj plik">
                      <IconButton
                        component="label"
                        disabled={readonly}
                      >
                        <FileIcon />
                        <input
                          type="file"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleValueChange(dataPoint, file);
                              onFileUpload?.(dataPoint.id, file);
                            }
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        );

      default:
        return (
          <TextField
            {...commonProps}
            label={dataPoint.name}
            value={value}
            onChange={(e) => handleValueChange(dataPoint, e.target.value)}
          />
        );
    }
  };

  const getValidationIcon = (dataPoint: ExecutionDataPoint) => {
    const validation = validationResults[dataPoint.id];
    const value = currentData[dataPoint.id];
    
    if (!validation && (!dataPoint.required || value)) {
      return <ValidIcon color="success" fontSize="small" />;
    }
    
    if (validation?.isValid) {
      return <ValidIcon color="success" fontSize="small" />;
    }
    
    if (validation && !validation.isValid) {
      return validation.severity === 'error' ? 
        <ErrorIcon color="error" fontSize="small" /> : 
        <WarningIcon color="warning" fontSize="small" />;
    }
    
    return null;
  };

  const isFormValid = () => {
    return dataPoints.every(dp => {
      const validation = validationResults[dp.id];
      const value = currentData[dp.id];
      
      if (dp.required && (!value || value === '' || value === null || value === undefined)) {
        return false;
      }
      
      return !validation || validation.isValid;
    });
  };

  const getCompletionStats = () => {
    const completed = dataPoints.filter(dp => {
      const value = currentData[dp.id];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    return {
      completed,
      total: dataPoints.length,
      percentage: Math.round((completed / dataPoints.length) * 100)
    };
  };

  const stats = getCompletionStats();

  return (
    <Card>
      <CardHeader
        title="Zbieranie danych"
        subheader={`Krok: ${stepId} | Próbka: ${sampleId}`}
        action={
          <Box display="flex" alignItems="center" gap={1}>
            <Chip 
              label={`${stats.completed}/${stats.total} (${stats.percentage}%)`}
              color={stats.percentage === 100 ? 'success' : 'default'}
              size="small"
            />
            {onSave && !readonly && (
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={onSave}
                disabled={!isFormValid()}
                size="small"
              >
                Zapisz
              </Button>
            )}
          </Box>
        }
      />
      <CardContent>
        {!isFormValid() && showValidation && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Uzupełnij wszystkie wymagane pola przed przejściem dalej.
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {dataPoints.map((dataPoint) => (
            <Grid item xs={12} md={6} key={dataPoint.id}>
              <Box position="relative">
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <Typography variant="subtitle2">
                    {dataPoint.name}
                    {dataPoint.required && <span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  {getValidationIcon(dataPoint)}
                </Box>
                {renderDataPointInput(dataPoint)}
              </Box>
            </Grid>
          ))}
        </Grid>

        {dataPoints.length === 0 && (
          <Alert severity="info">
            Brak zdefiniowanych punktów zbierania danych dla tego kroku.
          </Alert>
        )}
      </CardContent>

      {/* Calculation Dialog */}
      <Dialog
        open={calculationDialog.open}
        onClose={() => setCalculationDialog({ open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Kalkulator - {calculationDialog.dataPoint?.name}
        </DialogTitle>
        <DialogContent>
          <Alert severity="info" sx={{ mb: 2 }}>
            Funkcja kalkulatora będzie dostępna w przyszłych wersjach.
            Możesz wprowadzić wartość ręcznie.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCalculationDialog({ open: false })}>
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DataCollectionPanel;
