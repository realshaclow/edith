import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { EditStudyFormData, EditStudyValidation } from '../types';
import { StudyStatus } from '../../../../types';
import { getStatusLabel } from '../utils';

interface BasicInfoStepProps {
  formData: EditStudyFormData;
  validation: EditStudyValidation;
  onUpdate: (field: keyof EditStudyFormData, value: any) => void;
  onUpdateMultiple: (fields: Partial<EditStudyFormData>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  validation,
  onUpdate,
  onUpdateMultiple,
}) => {
  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Podstawowe informacje o badaniu
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nazwa badania"
                value={formData.title}
                onChange={(e) => onUpdate('title', e.target.value)}
                error={!validation.title && formData.title.length > 0}
                helperText={
                  !validation.title && formData.title.length > 0
                    ? 'Nazwa musi zawierać co najmniej 3 znaki'
                    : 'Wprowadź unikalną nazwę dla badania'
                }
                required
                placeholder="np. Badanie wytrzymałości na rozciąganie"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Opis badania"
                value={formData.description}
                onChange={(e) => onUpdate('description', e.target.value)}
                error={!validation.description && formData.description.length > 0}
                helperText={
                  !validation.description && formData.description.length > 0
                    ? 'Opis musi zawierać co najmniej 10 znaków'
                    : 'Opisz cel i zakres badania'
                }
                required
                placeholder="Opisz szczegółowo cel badania, metodologię i oczekiwane rezultaty..."
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status badania</InputLabel>
                <Select
                  value={formData.status}
                  label="Status badania"
                  onChange={(e) => onUpdate('status', e.target.value)}
                >
                  {Object.values(StudyStatus).map((status) => (
                    <MenuItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  Wybierz aktualny status badania
                </FormHelperText>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Notatki"
                value={formData.notes}
                onChange={(e) => onUpdate('notes', e.target.value)}
                placeholder="Dodatkowe uwagi i notatki..."
                helperText="Opcjonalne notatki dotyczące badania"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Podgląd
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>Nazwa:</strong> {formData.title || 'Nie określono'}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            <strong>Status:</strong> {getStatusLabel(formData.status)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Opis:</strong> {formData.description || 'Nie określono'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BasicInfoStep;
