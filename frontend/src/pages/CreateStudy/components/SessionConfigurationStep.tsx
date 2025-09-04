import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Switch,
  FormControlLabel,
  Divider,
  useTheme,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Timer as TimerIcon,
  Groups as SessionIcon,
  PlayArrow as AutoStartIcon,
  Settings as SettingsIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { CreateStudyStepProps } from '../types';

export const SessionConfigurationStep: React.FC<CreateStudyStepProps> = ({
  studyData,
  protocolData,
  errors,
  onUpdateStudyData,
}) => {
  const theme = useTheme();

  const handleSessionSettingsChange = (field: keyof typeof studyData.settings.sessionSettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'number' 
      ? parseInt(event.target.value) || 0 
      : event.target.type === 'checkbox'
      ? event.target.checked
      : event.target.value;
    
    onUpdateStudyData({
      settings: {
        ...studyData.settings,
        sessionSettings: {
          ...studyData.settings.sessionSettings,
          [field]: value,
        },
      },
    });
  };

  const calculateSessionInfo = () => {
    const { numberOfSamples } = studyData.settings;
    const { maxSamplesPerSession } = studyData.settings.sessionSettings;
    
    if (maxSamplesPerSession === 0) return { sessions: 0, distribution: [] };
    
    const totalSessions = Math.ceil(numberOfSamples / maxSamplesPerSession);
    const distribution = [];
    
    for (let i = 0; i < totalSessions; i++) {
      const samplesInSession = Math.min(
        maxSamplesPerSession, 
        numberOfSamples - (i * maxSamplesPerSession)
      );
      distribution.push({
        sessionNumber: i + 1,
        samples: samplesInSession,
        estimatedTime: protocolData?.estimatedDuration || 'Nieznany'
      });
    }
    
    return { sessions: totalSessions, distribution };
  };

  const sessionInfo = calculateSessionInfo();

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        ⏱️ Konfiguracja Sesji
      </Typography>

      <Grid container spacing={3}>
        {/* Podstawowe ustawienia sesji */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon color="primary" sx={{ mr: 1 }} />
                Ustawienia Sesji
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={studyData.settings.sessionSettings.allowMultipleSessions}
                    onChange={handleSessionSettingsChange('allowMultipleSessions')}
                    color="primary"
                  />
                }
                label="Pozwól na wiele sesji"
                sx={{ mb: 2, display: 'block' }}
              />

              {studyData.settings.sessionSettings.allowMultipleSessions && (
                <>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maksymalna liczba próbek na sesję *"
                    value={studyData.settings.sessionSettings.maxSamplesPerSession}
                    onChange={handleSessionSettingsChange('maxSamplesPerSession')}
                    error={!!errors?.maxSamplesPerSession}
                    helperText={
                      errors?.maxSamplesPerSession?.[0] || 
                      'Ile próbek maksymalnie można wykonać w jednej sesji'
                    }
                    inputProps={{ min: 1, max: studyData.settings.numberOfSamples }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    type="number"
                    label="Timeout sesji (minuty) *"
                    value={studyData.settings.sessionSettings.sessionTimeout}
                    onChange={handleSessionSettingsChange('sessionTimeout')}
                    error={!!errors?.sessionTimeout}
                    helperText={
                      errors?.sessionTimeout?.[0] || 
                      'Po ilu minutach nieaktywności sesja zostanie zamknięta'
                    }
                    inputProps={{ min: 5, max: 1440 }}
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={studyData.settings.sessionSettings.autoStartNextSession}
                        onChange={handleSessionSettingsChange('autoStartNextSession')}
                        color="secondary"
                      />
                    }
                    label="Automatyczne rozpoczęcie następnej sesji"
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Podgląd sesji */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SessionIcon color="secondary" sx={{ mr: 1 }} />
                Podgląd Sesji
              </Typography>

              {studyData.settings.sessionSettings.allowMultipleSessions ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`${sessionInfo.sessions} sesji`} 
                      color="primary" 
                      sx={{ mr: 1 }} 
                    />
                    <Chip 
                      label={`${studyData.settings.numberOfSamples} próbek łącznie`} 
                      variant="outlined" 
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ 
                    maxHeight: 200, 
                    overflowY: 'auto',
                    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderRadius: 1,
                    p: 1,
                  }}>
                    <List dense>
                      {sessionInfo.distribution.map((session, index) => (
                        <ListItem key={index} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <TimerIcon fontSize="small" color="action" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={`Sesja ${session.sessionNumber}`}
                            secondary={`${session.samples} próbek • ${session.estimatedTime}`}
                            primaryTypographyProps={{ 
                              fontWeight: 500,
                              fontSize: '0.9rem',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </>
              ) : (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Jedna sesja:</strong> Wszystkie {studyData.settings.numberOfSamples} próbek będą wykonane w jednej sesji.
                  </Typography>
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Informacje o protokole */}
        {protocolData && (
          <Grid item xs={12}>
            <Card 
              variant="outlined" 
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)',
                border: `1px solid ${theme.palette.warning.main}20`
              }}
            >
              <CardContent>
                <Typography variant="h6" color="warning.main" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <InfoIcon sx={{ mr: 1 }} />
                  Informacje o Protokole
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Szacowany czas na próbkę:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {protocolData.estimatedDuration || 'Nieznany'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Poziom trudności:</strong>
                    </Typography>
                    <Chip 
                      label={protocolData.difficulty || 'Nieznany'} 
                      size="small" 
                      color={
                        protocolData.difficulty === 'basic' ? 'success' :
                        protocolData.difficulty === 'intermediate' ? 'warning' : 'error'
                      }
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Liczba kroków:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {protocolData.steps?.length || 0} kroków
                    </Typography>
                  </Grid>
                </Grid>

                {protocolData.safetyGuidelines && protocolData.safetyGuidelines.length > 0 && (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" gutterBottom>
                      <strong>⚠️ Ważne wytyczne bezpieczeństwa:</strong>
                    </Typography>
                    <List dense>
                      {protocolData.safetyGuidelines.slice(0, 3).map((guideline, index) => (
                        <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                          <ListItemText 
                            primary={guideline}
                            primaryTypographyProps={{ fontSize: '0.875rem' }}
                          />
                        </ListItem>
                      ))}
                      {protocolData.safetyGuidelines.length > 3 && (
                        <ListItem sx={{ py: 0.5, pl: 0 }}>
                          <ListItemText 
                            primary={`... i ${protocolData.safetyGuidelines.length - 3} więcej`}
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
              <strong>Wskazówka:</strong> Podział na sesje pozwala na lepsze zarządzanie czasem i zasobami. 
              Krótsze sesje są łatwiejsze do zarządzania, ale mogą wymagać więcej przygotowań.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
