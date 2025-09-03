import React from 'react';
import {
  Box,
  TextField,
  Typography,
  FormHelperText,
  Card,
  CardContent
} from '@mui/material';
import { StudyFormData, CreateStudyFormErrors } from '../types';

interface BasicInfoStepProps {
  studyData: StudyFormData;
  errors: CreateStudyFormErrors;
  onUpdate: (data: Partial<StudyFormData>) => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  studyData,
  errors,
  onUpdate
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Podstawowe informacje o badaniu
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <TextField
            fullWidth
            label="Nazwa badania"
            value={studyData.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            error={!!errors.name}
            helperText={errors.name || 'Wprowadź krótką, opisową nazwę badania'}
            required
            placeholder="np. Badanie właściwości mechanicznych kompozytów"
          />

          <Box>
            <TextField
              fullWidth
              label="Opis badania"
              value={studyData.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              error={!!errors.description}
              multiline
              rows={4}
              required
              placeholder="Opisz cel badania, jego zakres i oczekiwane rezultaty..."
            />
            {errors.description && (
              <FormHelperText error>{errors.description}</FormHelperText>
            )}
            {!errors.description && (
              <FormHelperText>
                Podaj szczegółowy opis badania, jego celów i zakresu
              </FormHelperText>
            )}
          </Box>

          <TextField
            fullWidth
            label="Cele badania (opcjonalne)"
            value={studyData.objectives.join('\n')}
            onChange={(e) => onUpdate({ 
              objectives: e.target.value.split('\n').filter(obj => obj.trim() !== '') 
            })}
            multiline
            rows={3}
            placeholder="Wpisz cele badania, jeden w każdej linii"
            helperText="Określ konkretne cele, które chcesz osiągnąć w tym badaniu"
          />

          <TextField
            fullWidth
            label="Oczekiwane wyniki (opcjonalne)"
            value={studyData.expectedOutcomes.join('\n')}
            onChange={(e) => onUpdate({ 
              expectedOutcomes: e.target.value.split('\n').filter(outcome => outcome.trim() !== '') 
            })}
            multiline
            rows={3}
            placeholder="Opisz oczekiwane wyniki, jeden w każdej linii"
            helperText="Jakie wyniki spodziewasz się uzyskać z tego badania?"
          />
        </Box>
      </CardContent>
    </Card>
  );
};
