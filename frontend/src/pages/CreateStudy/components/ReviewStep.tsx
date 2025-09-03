import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  Grid,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ExpandMore,
  CheckCircle,
  Warning,
  Info,
  Person,
  Build,
  Inventory,
  Schedule,
  Assignment
} from '@mui/icons-material';
import { StudyFormData, ProtocolForStudy } from '../types';

interface ReviewStepProps {
  studyData: StudyFormData;
  selectedProtocol: ProtocolForStudy | null;
  isStepValid: (step: string) => boolean;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  studyData,
  selectedProtocol,
  isStepValid
}) => {
  const getValidationIcon = (stepName: string) => {
    return isStepValid(stepName) ? (
      <CheckCircle color="success" />
    ) : (
      <Warning color="warning" />
    );
  };

  const getValidationColor = (stepName: string) => {
    return isStepValid(stepName) ? 'success' : 'warning';
  };

  const calculateTotalBudget = () => {
    const breakdown = studyData.resources.budget.breakdown;
    return breakdown.personnel + breakdown.equipment + breakdown.materials + breakdown.overhead + breakdown.contingency;
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Przegląd i potwierdzenie badania
        </Typography>

        <Alert severity="info" sx={{ mb: 3 }}>
          Sprawdź wszystkie dane przed utworzeniem badania. Po utworzeniu niektóre informacje mogą być trudne do zmiany.
        </Alert>

        <Box display="flex" flexDirection="column" gap={2}>
          {/* Validation Status */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status walidacji
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getValidationIcon('basic-info')}
                    <Typography>Podstawowe informacje</Typography>
                    <Chip 
                      label={isStepValid('basic-info') ? 'Kompletne' : 'Niekompletne'} 
                      size="small" 
                      color={getValidationColor('basic-info')}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getValidationIcon('protocol-selection')}
                    <Typography>Wybór protokołu</Typography>
                    <Chip 
                      label={isStepValid('protocol-selection') ? 'Wybrany' : 'Brak wyboru'} 
                      size="small" 
                      color={getValidationColor('protocol-selection')}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getValidationIcon('parameters')}
                    <Typography>Parametry</Typography>
                    <Chip 
                      label={isStepValid('parameters') ? 'Ustawione' : 'Wymagane'} 
                      size="small" 
                      color={getValidationColor('parameters')}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getValidationIcon('settings')}
                    <Typography>Ustawienia</Typography>
                    <Chip 
                      label={isStepValid('settings') ? 'Skonfigurowane' : 'Niekompletne'} 
                      size="small" 
                      color={getValidationColor('settings')}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getValidationIcon('timeline')}
                    <Typography>Harmonogram</Typography>
                    <Chip 
                      label={isStepValid('timeline') ? 'Zaplanowany' : 'Wymagany'} 
                      size="small" 
                      color={getValidationColor('timeline')}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getValidationIcon('resources')}
                    <Typography>Zasoby</Typography>
                    <Chip 
                      label={isStepValid('resources') ? 'Zdefiniowane' : 'Opcjonalne'} 
                      size="small" 
                      color={getValidationColor('resources')}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Assignment />
                <Typography variant="h6">Podstawowe informacje</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Nazwa badania</Typography>
                  <Typography variant="body1">{studyData.name || 'Nie podano'}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Opis</Typography>
                  <Typography variant="body1">{studyData.description || 'Nie podano'}</Typography>
                </Grid>
                {studyData.objectives.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Cele badania</Typography>
                    <List dense>
                      {studyData.objectives.map((objective, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Info fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={objective} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Protocol Information */}
          {selectedProtocol && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Assignment />
                  <Typography variant="h6">Wybrany protokół</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Nazwa protokołu</Typography>
                    <Typography variant="body1">{selectedProtocol.title}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">Kategoria</Typography>
                    <Typography variant="body1">{selectedProtocol.category}</Typography>
                  </Grid>
                  {selectedProtocol.description && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Opis protokołu</Typography>
                      <Typography variant="body1">{selectedProtocol.description}</Typography>
                    </Grid>
                  )}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Parameters */}
          {studyData.parameters.length > 0 && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Assignment />
                  <Typography variant="h6">Parametry ({studyData.parameters.length})</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  {studyData.parameters.map((param, index) => (
                    <Grid item xs={12} md={6} key={param.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2">{param.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Typ: {param.type} | Wartość: {param.value || 'Nie ustawiono'}
                            {param.unit && ` ${param.unit}`}
                          </Typography>
                          {param.description && (
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {param.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}

          {/* Timeline */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Schedule />
                <Typography variant="h6">Harmonogram</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">Szacowany czas trwania</Typography>
                  <Typography variant="body1">{studyData.timeline.estimatedDuration || 'Nie podano'}</Typography>
                </Grid>
                {studyData.timeline.phases.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Fazy ({studyData.timeline.phases.length})</Typography>
                    <List dense>
                      {studyData.timeline.phases.map((phase) => (
                        <ListItem key={phase.id}>
                          <ListItemText 
                            primary={phase.name} 
                            secondary={`${phase.duration} - ${phase.description}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
                {studyData.timeline.milestones.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Kamienie milowe ({studyData.timeline.milestones.length})</Typography>
                    <List dense>
                      {studyData.timeline.milestones.map((milestone) => (
                        <ListItem key={milestone.id}>
                          <ListItemText 
                            primary={milestone.name} 
                            secondary={`${milestone.date} (${milestone.type}) - ${milestone.description}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Resources Summary */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Person />
                <Typography variant="h6">Zasoby</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Person fontSize="small" />
                    <Typography variant="subtitle2">Personel: {studyData.resources.personnel.length}</Typography>
                  </Box>
                  {studyData.resources.personnel.map((person) => (
                    <Typography key={person.id} variant="body2" color="text.secondary">
                      • {person.name} ({person.role})
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Build fontSize="small" />
                    <Typography variant="subtitle2">Sprzęt: {studyData.resources.equipment.length}</Typography>
                  </Box>
                  {studyData.resources.equipment.map((equipment) => (
                    <Typography key={equipment.id} variant="body2" color="text.secondary">
                      • {equipment.name}
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Inventory fontSize="small" />
                    <Typography variant="subtitle2">Materiały: {studyData.resources.materials.length}</Typography>
                  </Box>
                  {studyData.resources.materials.map((material) => (
                    <Typography key={material.id} variant="body2" color="text.secondary">
                      • {material.name} ({material.quantity})
                    </Typography>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="h6" color="primary">
                    Budżet całkowity: {calculateTotalBudget().toLocaleString()} {studyData.resources.budget.currency}
                  </Typography>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </Card>
  );
};
