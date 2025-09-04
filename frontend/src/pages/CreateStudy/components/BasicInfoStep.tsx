import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Alert,
  useTheme,
} from '@mui/material';
import { Science as ScienceIcon } from '@mui/icons-material';
import { CreateStudyStepProps } from '../types';

export const BasicInfoStep: React.FC<CreateStudyStepProps> = ({
  studyData,
  protocolData,
  errors,
  onUpdateStudyData,
}) => {
  const theme = useTheme();

  const handleChange = (field: keyof typeof studyData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onUpdateStudyData({ [field]: event.target.value });
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        📝 Podstawowe Informacje Studium
      </Typography>

      <Grid container spacing={3}>
        {/* Wybrany Protokół - Read Only */}
        {protocolData && (
          <Grid item xs={12}>
            <Card 
              variant="outlined" 
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                border: `1px solid ${theme.palette.primary.main}20`
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScienceIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" color="primary">
                    Wybrany Protokół
                  </Typography>
                </Box>
                
                <Typography variant="h6" gutterBottom>
                  {protocolData.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {protocolData.description}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Chip 
                    label={protocolData.category || 'Brak kategorii'} 
                    color="primary" 
                    variant="outlined" 
                    size="small" 
                  />
                  <Chip 
                    label={protocolData.standard || 'Brak standardu'} 
                    color="secondary" 
                    variant="outlined" 
                    size="small" 
                  />
                  {protocolData.estimatedDuration && (
                    <Chip 
                      label={`⏱️ ${protocolData.estimatedDuration}`} 
                      variant="outlined" 
                      size="small" 
                    />
                  )}
                </Box>

                {protocolData.overview?.purpose && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Cel:</strong> {protocolData.overview.purpose}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Nazwa Studium */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nazwa Studium *"
            value={studyData.name}
            onChange={handleChange('name')}
            error={!!errors?.name}
            helperText={
              errors?.name?.[0] || 
              'Wprowadź unikalną nazwę dla tego studium badawczego (min. 3 znaki)'
            }
            placeholder="np. Test wytrzymałości materiału XYZ"
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>

        {/* Opis Studium */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Opis Studium (opcjonalnie)"
            value={studyData.description}
            onChange={handleChange('description')}
            error={!!errors?.description}
            helperText={
              errors?.description?.[0] || 
              'Dodatkowe informacje o studium, celach badania, oczekiwanych wynikach itp.'
            }
            placeholder="Opisz cel studium, badane materiały, spodziewane wyniki..."
            variant="outlined"
          />
        </Grid>

        {/* Informacje pomocnicze */}
        <Grid item xs={12}>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Wskazówka:</strong> Dobra nazwa i opis ułatwią późniejsze odnalezienie i analizę wyników. 
              Możesz również je edytować później w ustawieniach studium.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
