import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { pl } from 'date-fns/locale';
import { EditStudyFormData, EditStudyValidation } from '../types';
import { formatDuration } from '../utils';

interface TimelineStepProps {
  formData: EditStudyFormData;
  validation: EditStudyValidation;
  onUpdate: (field: keyof EditStudyFormData, value: any) => void;
}

const TimelineStep: React.FC<TimelineStepProps> = ({
  formData,
  validation,
  onUpdate,
}) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
      <Box>
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Harmonogram badania
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Określ planowane daty rozpoczęcia i zakończenia badania. Daty są opcjonalne,
              ale pomogą w planowaniu i monitorowaniu postępu.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data rozpoczęcia"
                  value={formData.startDate}
                  onChange={(date) => onUpdate('startDate', date)}
                  minDate={today}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: validation.startDate || !formData.startDate
                        ? 'Planowana data rozpoczęcia badania'
                        : 'Data rozpoczęcia nie może być z przeszłości',
                      error: !validation.startDate && formData.startDate !== null,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data zakończenia"
                  value={formData.endDate}
                  onChange={(date) => onUpdate('endDate', date)}
                  minDate={formData.startDate || tomorrow}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      helperText: validation.endDate && validation.dateRange
                        ? 'Planowana data zakończenia badania'
                        : 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
                      error: (!validation.endDate || !validation.dateRange) && formData.endDate !== null,
                    },
                  }}
                />
              </Grid>
            </Grid>

            {!validation.dateRange && formData.startDate && formData.endDate && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Data zakończenia musi być późniejsza niż data rozpoczęcia
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Timeline preview */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Podsumowanie harmonogramu
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Data rozpoczęcia
                  </Typography>
                  <Typography variant="h6">
                    {formData.startDate ? formData.startDate.toLocaleDateString('pl-PL') : 'Nie określono'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Szacowany czas trwania
                  </Typography>
                  <Typography variant="h6">
                    {formatDuration(formData.startDate, formData.endDate)}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Box sx={{ textAlign: 'center', p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Data zakończenia
                  </Typography>
                  <Typography variant="h6">
                    {formData.endDate ? formData.endDate.toLocaleDateString('pl-PL') : 'Nie określono'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {formData.protocol?.estimatedDuration && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'background.default', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Sugerowany czas trwania protokołu:</strong> {formData.protocol.estimatedDuration}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ten czas może się różnić w zależności od specyfiki Twojego badania i dostępnych zasobów.
                </Typography>
              </Box>
            )}

            {formData.startDate && formData.endDate && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={`Czas trwania: ${formatDuration(formData.startDate, formData.endDate)}`}
                  color="primary"
                  variant="outlined"
                />
                {formData.startDate < today && (
                  <Chip 
                    label="Rozpoczęcie w przyszłości"
                    color="info"
                    variant="outlined"
                  />
                )}
                {formData.endDate && formData.endDate > today && (
                  <Chip 
                    label="Planowane zakończenie"
                    color="success"
                    variant="outlined"
                  />
                )}
              </Box>
            )}
          </CardContent>
        </Card>

        <Alert severity="info" sx={{ mt: 2 }}>
          Daty są opcjonalne i można je zmienić później. Pomagają one w planowaniu
          i monitorowaniu postępu badania.
        </Alert>
      </Box>
    </LocalizationProvider>
  );
};

export default TimelineStep;
