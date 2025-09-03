import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { StudyFormData, CreateStudyFormErrors } from '../types';

interface SettingsStepProps {
  studyData: StudyFormData;
  errors: CreateStudyFormErrors;
  onUpdate: (data: Partial<StudyFormData>) => void;
}

export const SettingsStep: React.FC<SettingsStepProps> = ({
  studyData,
  errors,
  onUpdate
}) => {
  const updateSampleSettings = (updates: Partial<typeof studyData.settings.sampleSettings>) => {
    onUpdate({
      settings: {
        ...studyData.settings,
        sampleSettings: {
          ...studyData.settings.sampleSettings,
          ...updates
        }
      }
    });
  };

  const updateEnvironmentalSettings = (updates: Partial<typeof studyData.settings.environmentalSettings>) => {
    onUpdate({
      settings: {
        ...studyData.settings,
        environmentalSettings: {
          ...studyData.settings.environmentalSettings,
          ...updates
        }
      }
    });
  };

  const updateQualitySettings = (updates: Partial<typeof studyData.settings.qualitySettings>) => {
    onUpdate({
      settings: {
        ...studyData.settings,
        qualitySettings: {
          ...studyData.settings.qualitySettings,
          ...updates
        }
      }
    });
  };

  const addCondition = (type: 'preparation' | 'conditions') => {
    const newCondition = `Nowy warunek ${studyData.settings.sampleSettings[type].length + 1}`;
    updateSampleSettings({
      [type]: [...studyData.settings.sampleSettings[type], newCondition]
    });
  };

  const updateCondition = (type: 'preparation' | 'conditions', index: number, value: string) => {
    const updated = [...studyData.settings.sampleSettings[type]];
    updated[index] = value;
    updateSampleSettings({
      [type]: updated
    });
  };

  const removeCondition = (type: 'preparation' | 'conditions', index: number) => {
    const updated = studyData.settings.sampleSettings[type].filter((_, i) => i !== index);
    updateSampleSettings({
      [type]: updated
    });
  };

  const settingsErrors = errors.settings as { [key: string]: string } || {};

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Ustawienia badania
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          {/* Sample Settings */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="h6">Ustawienia próbek</Typography>
                <Chip label="Wymagane" size="small" color="primary" />
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Rozmiar próby"
                    type="number"
                    value={studyData.settings.sampleSettings.sampleSize}
                    onChange={(e) => updateSampleSettings({ sampleSize: Number(e.target.value) })}
                    error={!!settingsErrors.sampleSize}
                    helperText={settingsErrors.sampleSize || 'Liczba próbek do przebadania'}
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Typ próby"
                    value={studyData.settings.sampleSettings.sampleType}
                    onChange={(e) => updateSampleSettings({ sampleType: e.target.value })}
                    error={!!settingsErrors.sampleType}
                    helperText={settingsErrors.sampleType || 'Rodzaj badanego materiału'}
                    required
                    placeholder="np. polimer termoplastyczny, kompozyt"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Przygotowanie próbek
                  </Typography>
                  {studyData.settings.sampleSettings.preparation.map((prep, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                      <TextField
                        fullWidth
                        size="small"
                        value={prep}
                        onChange={(e) => updateCondition('preparation', index, e.target.value)}
                        placeholder={`Krok przygotowania ${index + 1}`}
                      />
                      <Chip
                        label="Usuń"
                        size="small"
                        onClick={() => removeCondition('preparation', index)}
                        onDelete={() => removeCondition('preparation', index)}
                      />
                    </Box>
                  ))}
                  <Chip
                    label="+ Dodaj krok"
                    onClick={() => addCondition('preparation')}
                    color="primary"
                    variant="outlined"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Environmental Settings */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Warunki środowiskowe</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Temperatura"
                    value={studyData.settings.environmentalSettings.temperature}
                    onChange={(e) => updateEnvironmentalSettings({ temperature: e.target.value })}
                    placeholder="np. 23±2°C"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Wilgotność"
                    value={studyData.settings.environmentalSettings.humidity}
                    onChange={(e) => updateEnvironmentalSettings({ humidity: e.target.value })}
                    placeholder="np. 50±5%RH"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ciśnienie"
                    value={studyData.settings.environmentalSettings.pressure}
                    onChange={(e) => updateEnvironmentalSettings({ pressure: e.target.value })}
                    placeholder="np. atmosferyczne"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Atmosfera"
                    value={studyData.settings.environmentalSettings.atmosphere}
                    onChange={(e) => updateEnvironmentalSettings({ atmosphere: e.target.value })}
                    placeholder="np. powietrze laboratoryjne"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Quality Settings */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">Ustawienia jakości</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Powtarzalność"
                    type="number"
                    value={studyData.settings.qualitySettings.repeatability}
                    onChange={(e) => updateQualitySettings({ repeatability: Number(e.target.value) })}
                    helperText="Liczba powtórzeń dla każdej próbki"
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Dokładność"
                    value={studyData.settings.qualitySettings.accuracy}
                    onChange={(e) => updateQualitySettings({ accuracy: e.target.value })}
                    placeholder="np. ±1%"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Precyzja"
                    value={studyData.settings.qualitySettings.precision}
                    onChange={(e) => updateQualitySettings({ precision: e.target.value })}
                    placeholder="np. ±0.5%"
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </Card>
  );
};
