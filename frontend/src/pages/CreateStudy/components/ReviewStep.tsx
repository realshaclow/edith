import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  Science as ProtocolIcon,
  Person as OperatorIcon,
  Engineering as EquipmentIcon,
  Assignment as TaskIcon,
  Timer as SessionIcon,
  Tune as SettingsIcon,
} from '@mui/icons-material';
import { CreateStudyStepProps } from '../types';

export const ReviewStep: React.FC<CreateStudyStepProps> = ({
  studyData,
  protocolData,
  errors,
  isValid,
}) => {
  const theme = useTheme();

  const getValidationSummary = () => {
    const warnings: string[] = [];
    
    if (!studyData.operatorInfo.name) {
      warnings.push('Nie podano nazwiska operatora');
    }
    
    if (studyData.equipmentList.length === 0) {
      warnings.push('Nie dodano żadnego wyposażenia');
    }
    
    if (studyData.stepMeasurements.length === 0) {
      warnings.push('Nie skonfigurowano żadnych pomiarów');
    }
    
    const totalMeasurements = studyData.stepMeasurements.reduce(
      (sum, step) => sum + step.measurements.length, 0
    );
    
    if (totalMeasurements === 0) {
      warnings.push('Nie zdefiniowano żadnych pomiarów w krokach');
    }

    return warnings;
  };

  const warnings = getValidationSummary();

  const calculateSessionInfo = () => {
    const { numberOfSamples } = studyData.settings;
    const { allowMultipleSessions, maxSamplesPerSession } = studyData.settings.sessionSettings;
    
    if (!allowMultipleSessions) {
      return { sessions: 1, samplesPerSession: numberOfSamples };
    }
    
    const totalSessions = Math.ceil(numberOfSamples / maxSamplesPerSession);
    return { sessions: totalSessions, samplesPerSession: maxSamplesPerSession };
  };

  const sessionInfo = calculateSessionInfo();

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        📋 Przegląd i Potwierdzenie
      </Typography>

      {/* Status walidacji */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {isValid ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                ✅ Badanie gotowe do utworzenia
              </Typography>
              <Typography variant="body2">
                Wszystkie wymagane informacje zostały podane. Możesz teraz utworzyć badanie.
              </Typography>
            </Alert>
          ) : (
            <Alert severity="error" sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                ❌ Wymagane uzupełnienie danych
              </Typography>
              <Typography variant="body2">
                Sprawdź poprzednie kroki i uzupełnij brakujące informacje.
              </Typography>
            </Alert>
          )}

          {warnings.length > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                ⚠️ Ostrzeżenia:
              </Typography>
              <List dense>
                {warnings.map((warning, index) => (
                  <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 20 }}>
                      <WarningIcon fontSize="small" color="warning" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={warning}
                      primaryTypographyProps={{ fontSize: '0.875rem' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Alert>
          )}
        </Grid>

        {/* Podstawowe informacje */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ProtocolIcon color="primary" sx={{ mr: 1 }} />
                Podstawowe Informacje
              </Typography>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Nazwa badania"
                    secondary={studyData.name || 'Nie podano'}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Protokół"
                    secondary={studyData.protocolName || 'Nie wybrano'}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Kategoria"
                    secondary={studyData.category || 'Nie podano'}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Opis"
                    secondary={studyData.description || 'Brak opisu'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Konfiguracja próbek i sesji */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SessionIcon color="secondary" sx={{ mr: 1 }} />
                Próbki i Sesje
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Liczba próbek
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {studyData.settings.numberOfSamples}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Prefiks próbek
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {studyData.settings.samplePrefix}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Liczba sesji
                  </Typography>
                  <Typography variant="h6" color="secondary">
                    {sessionInfo.sessions}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Próbek na sesję
                  </Typography>
                  <Typography variant="h6" color="secondary">
                    {sessionInfo.samplesPerSession}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Operator */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <OperatorIcon color="success" sx={{ mr: 1 }} />
                Operator
              </Typography>
              
              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Imię i nazwisko"
                    secondary={studyData.operatorInfo.name || 'Nie podano'}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText 
                    primary="Stanowisko"
                    secondary={studyData.operatorInfo.position || 'Nie podano'}
                  />
                </ListItem>
                {studyData.operatorInfo.operatorId && (
                  <ListItem sx={{ px: 0 }}>
                    <ListItemText 
                      primary="ID operatora"
                      secondary={studyData.operatorInfo.operatorId}
                    />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Wyposażenie */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <EquipmentIcon color="warning" sx={{ mr: 1 }} />
                Wyposażenie ({studyData.equipmentList.length})
              </Typography>
              
              {studyData.equipmentList.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Nie dodano wyposażenia
                </Typography>
              ) : (
                <List dense>
                  {studyData.equipmentList.slice(0, 3).map((equipment, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText 
                        primary={equipment.name || `Sprzęt #${index + 1}`}
                        secondary={equipment.model || 'Brak modelu'}
                      />
                    </ListItem>
                  ))}
                  {studyData.equipmentList.length > 3 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary={`... i ${studyData.equipmentList.length - 3} więcej`}
                        secondary="Zobacz pełną listę w poprzednim kroku"
                      />
                    </ListItem>
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pomiary per krok */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TaskIcon color="info" sx={{ mr: 1 }} />
                Konfiguracja Pomiarów
              </Typography>
              
              {studyData.stepMeasurements.length === 0 ? (
                <Alert severity="warning">
                  <Typography variant="body2">
                    Nie skonfigurowano żadnych pomiarów. Przejdź do kroku "Pomiary per Krok" aby dodać pomiary.
                  </Typography>
                </Alert>
              ) : (
                <Box>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={`${studyData.stepMeasurements.length} kroków`} 
                      color="primary" 
                      sx={{ mr: 1 }}
                    />
                    <Chip 
                      label={`${studyData.stepMeasurements.reduce((sum, step) => sum + step.measurements.length, 0)} pomiarów łącznie`} 
                      variant="outlined"
                    />
                  </Box>

                  <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                    {studyData.stepMeasurements.map((step, index) => (
                      <Accordion key={step.stepId} defaultExpanded={index === 0}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                              {step.stepTitle}
                            </Typography>
                            <Chip 
                              label={`${step.measurements.length} pomiarów`} 
                              size="small" 
                              color={step.measurements.length > 0 ? 'success' : 'default'}
                            />
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                          {step.measurements.length === 0 ? (
                            <Typography variant="body2" color="text.secondary">
                              Brak skonfigurowanych pomiarów
                            </Typography>
                          ) : (
                            <TableContainer component={Paper} variant="outlined">
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Pomiar</TableCell>
                                    <TableCell>Typ</TableCell>
                                    <TableCell>Jednostka</TableCell>
                                    <TableCell>Wymagany</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {step.measurements.map((measurement) => (
                                    <TableRow key={measurement.id}>
                                      <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                          {measurement.name}
                                        </Typography>
                                        {measurement.description && (
                                          <Typography variant="caption" color="text.secondary">
                                            {measurement.description}
                                          </Typography>
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        <Chip 
                                          label={measurement.type} 
                                          size="small" 
                                          variant="outlined"
                                        />
                                      </TableCell>
                                      <TableCell>
                                        {measurement.unit || '-'}
                                      </TableCell>
                                      <TableCell>
                                        {measurement.isRequired ? (
                                          <CompleteIcon color="success" fontSize="small" />
                                        ) : (
                                          <Typography variant="body2" color="text.secondary">
                                            Opcjonalny
                                          </Typography>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Podsumowanie protokołu */}
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
                <Typography variant="h6" color="primary" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SettingsIcon sx={{ mr: 1 }} />
                  Szczegóły Protokołu
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Standard:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {protocolData.standard || 'Nieznany'}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
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
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Szacowany czas:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {protocolData.estimatedDuration}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Liczba kroków:</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {protocolData.steps?.length || 0}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Ostatnie ostrzeżenie */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Ważne:</strong> Po utworzeniu badania nie będzie można zmienić podstawowych ustawień protokołu i próbek. 
              Upewnij się, że wszystkie informacje są poprawne.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
