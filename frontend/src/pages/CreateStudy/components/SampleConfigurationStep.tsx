import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Divider,
  useTheme,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { 
  Science as ScienceIcon,
  FormatListNumbered as NumberIcon,
  Preview as PreviewIcon,
} from '@mui/icons-material';
import { CreateStudyStepProps } from '../types';

export const SampleConfigurationStep: React.FC<CreateStudyStepProps> = ({
  studyData,
  protocolData,
  errors,
  onUpdateStudyData,
}) => {
  const theme = useTheme();

  const handleSettingsChange = (field: keyof typeof studyData.settings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'number' 
      ? parseInt(event.target.value) || 0 
      : event.target.value;
    
    onUpdateStudyData({
      settings: {
        ...studyData.settings,
        [field]: value,
      },
    });
  };

  // Generowanie podglądu nazw próbek
  const generateSampleNames = (): string[] => {
    const { numberOfSamples, samplePrefix } = studyData.settings;
    const names: string[] = [];
    
    for (let i = 1; i <= Math.min(numberOfSamples, 10); i++) {
      names.push(`${samplePrefix}${i.toString().padStart(2, '0')}`);
    }
    
    if (numberOfSamples > 10) {
      names.push(`... (${numberOfSamples - 10} więcej)`);
    }
    
    return names;
  };

  const sampleNames = generateSampleNames();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        🧪 Konfiguracja Próbek
      </Typography>

      <Grid container spacing={3}>
        {/* Podstawowe ustawienia próbek */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ScienceIcon color="primary" sx={{ mr: 1 }} />
                Ustawienia Próbek
              </Typography>

              <TextField
                fullWidth
                type="number"
                label="Liczba Próbek *"
                value={studyData.settings.numberOfSamples}
                onChange={handleSettingsChange('numberOfSamples')}
                error={!!errors?.numberOfSamples}
                helperText={
                  errors?.numberOfSamples?.[0] || 
                  'Wprowadź liczbę próbek do badania (1-1000)'
                }
                inputProps={{ min: 1, max: 1000 }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Prefiks Nazw Próbek *"
                value={studyData.settings.samplePrefix}
                onChange={handleSettingsChange('samplePrefix')}
                error={!!errors?.samplePrefix}
                helperText={
                  errors?.samplePrefix?.[0] || 
                  'Prefiks dodawany do nazw próbek (np. "S", "SAMPLE")'
                }
                placeholder="np. S, SAMPLE, TEST"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Podgląd nazw próbek */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PreviewIcon color="secondary" sx={{ mr: 1 }} />
                Podgląd Nazw Próbek
              </Typography>

              <Box sx={{ 
                maxHeight: 200, 
                overflowY: 'auto',
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                borderRadius: 1,
                p: 1,
              }}>
                <List dense>
                  {sampleNames.map((name, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <NumberIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={name}
                        primaryTypographyProps={{ 
                          fontFamily: 'monospace',
                          fontSize: '0.9rem',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Łącznie: {studyData.settings.numberOfSamples} próbek
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Informacje o protokole */}
        {protocolData && (
          <Grid item xs={12}>
            <Card 
              variant="outlined" 
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
                border: `1px solid ${theme.palette.success.main}20`
              }}
            >
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom>
                  📋 Wymagania Protokołu
                </Typography>
                
                {protocolData.materials && protocolData.materials.length > 0 && (
                  <>
                    <Typography variant="body2" gutterBottom>
                      <strong>Wymagane materiały:</strong>
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      {protocolData.materials.slice(0, 5).map((material, index) => (
                        <Chip 
                          key={index}
                          label={material} 
                          size="small" 
                          variant="outlined" 
                          color="success"
                        />
                      ))}
                      {protocolData.materials.length > 5 && (
                        <Chip 
                          label={`+${protocolData.materials.length - 5} więcej`} 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                  </>
                )}

                {protocolData.equipment && protocolData.equipment.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" gutterBottom>
                      <strong>Wymagane wyposażenie:</strong>
                    </Typography>
                    <List dense>
                      {protocolData.equipment.slice(0, 3).map((equipment, index) => (
                        <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                          <ListItemText 
                            primary={equipment.name}
                            secondary={equipment.specification}
                          />
                        </ListItem>
                      ))}
                      {protocolData.equipment.length > 3 && (
                        <ListItem sx={{ py: 0.5, pl: 0 }}>
                          <ListItemText 
                            primary={`... i ${protocolData.equipment.length - 3} więcej`}
                            secondary="Zobacz pełną listę w szczegółach protokołu"
                          />
                        </ListItem>
                      )}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Wskazówki */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Wskazówka:</strong> Liczba próbek powinna być dostosowana do wymagań protokołu badawczego. 
              Większa liczba próbek zwiększa wiarygodność wyników, ale także czas trwania badania.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
