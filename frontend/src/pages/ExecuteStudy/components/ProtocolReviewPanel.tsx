import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert
} from '@mui/material';
import {
  ExpandMore,
  Science,
  Build,
  Warning,
  Schedule,
  Assignment,
  ArrowForward,
  Info
} from '@mui/icons-material';
import { ProtocolForExecution } from '../types';

interface ProtocolReviewPanelProps {
  protocol: ProtocolForExecution;
  onNext: () => void;
}

const ProtocolReviewPanel: React.FC<ProtocolReviewPanelProps> = ({
  protocol,
  onNext
}) => {
  if (!protocol.id) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Protokół nie został załadowany
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Przegląd protokołu badawczego
      </Typography>

      <Grid container spacing={3}>
        {/* Protocol Header */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {protocol.title}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {protocol.description}
              </Typography>
              
              <Box display="flex" gap={1} mb={2}>
                <Chip label={protocol.category} color="primary" variant="outlined" />
                <Chip label={protocol.difficulty} color="secondary" variant="outlined" />
                {protocol.estimatedDuration && (
                  <Chip 
                    icon={<Schedule />} 
                    label={protocol.estimatedDuration} 
                    variant="outlined" 
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Overview */}
        {protocol.overview && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Przegląd
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Cel:
                </Typography>
                <Typography variant="body2" paragraph>
                  {protocol.overview.purpose}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Zakres:
                </Typography>
                <Typography variant="body2" paragraph>
                  {protocol.overview.scope}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Zasady:
                </Typography>
                <Typography variant="body2" paragraph>
                  {protocol.overview.principles}
                </Typography>
                
                {protocol.overview.standards && protocol.overview.standards.length > 0 && (
                  <>
                    <Typography variant="subtitle2" gutterBottom>
                      Standardy:
                    </Typography>
                    <List dense>
                      {protocol.overview.standards.map((standard, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={standard} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Equipment */}
        {protocol.equipment && protocol.equipment.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Build sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Wymagane wyposażenie
                </Typography>
                
                <List dense>
                  {protocol.equipment.map((item, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={item.name}
                          secondary={item.specification}
                        />
                      </ListItem>
                      {index < protocol.equipment.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Materials */}
        {protocol.materials && protocol.materials.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Materiały
                </Typography>
                
                <List dense>
                  {protocol.materials.map((material, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText primary={material} />
                      </ListItem>
                      {index < protocol.materials.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Safety Guidelines */}
        {protocol.safetyGuidelines && protocol.safetyGuidelines.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom color="warning.main">
                  <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Zasady bezpieczeństwa
                </Typography>
                
                <List dense>
                  {protocol.safetyGuidelines.map((guideline, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemIcon>
                          <Warning color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={guideline} />
                      </ListItem>
                      {index < protocol.safetyGuidelines.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Test Conditions */}
        {protocol.testConditions && protocol.testConditions.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Warunki badania
                </Typography>
                
                <Grid container spacing={2}>
                  {protocol.testConditions.map((condition, index) => (
                    <Grid item xs={12} sm={6} md={4} key={condition.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            {condition.name}
                          </Typography>
                          <Typography variant="h6">
                            {condition.value} {condition.unit}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Tolerancja: {condition.tolerance}
                          </Typography>
                          <Box mt={1}>
                            <Chip
                              size="small"
                              label={condition.category}
                              color="primary"
                              variant="outlined"
                            />
                            {condition.required && (
                              <Chip
                                size="small"
                                label="Wymagane"
                                color="error"
                                variant="outlined"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Protocol Steps */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Kroki protokołu ({protocol.steps?.length || 0})
              </Typography>
              
              {protocol.steps && protocol.steps.length > 0 ? (
                <Box>
                  {protocol.steps.map((step, index) => (
                    <Accordion key={step.id}>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls={`step-${step.id}-content`}
                        id={`step-${step.id}-header`}
                      >
                        <Box display="flex" alignItems="center" gap={2}>
                          <Chip label={index + 1} size="small" color="primary" />
                          <Typography variant="subtitle1">
                            {step.title}
                          </Typography>
                          <Chip
                            icon={<Schedule />}
                            label={step.duration}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box>
                          <Typography variant="body2" paragraph>
                            {step.description}
                          </Typography>
                          
                          {step.instructions && step.instructions.length > 0 && (
                            <>
                              <Typography variant="subtitle2" gutterBottom>
                                Instrukcje:
                              </Typography>
                              <List dense>
                                {step.instructions.map((instruction, idx) => (
                                  <ListItem key={idx}>
                                    <ListItemText 
                                      primary={`${idx + 1}. ${instruction}`}
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          )}
                          
                          {step.tips && step.tips.length > 0 && (
                            <>
                              <Typography variant="subtitle2" gutterBottom color="primary">
                                Wskazówki:
                              </Typography>
                              <List dense>
                                {step.tips.map((tip, idx) => (
                                  <ListItem key={idx}>
                                    <ListItemIcon>
                                      <Info color="primary" />
                                    </ListItemIcon>
                                    <ListItemText primary={tip} />
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          )}
                          
                          {step.safety && step.safety.length > 0 && (
                            <>
                              <Typography variant="subtitle2" gutterBottom color="warning.main">
                                Bezpieczeństwo:
                              </Typography>
                              <List dense>
                                {step.safety.map((safety, idx) => (
                                  <ListItem key={idx}>
                                    <ListItemIcon>
                                      <Warning color="warning" />
                                    </ListItemIcon>
                                    <ListItemText primary={safety} />
                                  </ListItem>
                                ))}
                              </List>
                            </>
                          )}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              ) : (
                <Alert severity="warning">
                  Brak zdefiniowanych kroków w protokole
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={onNext}
            >
              Przejdź do przygotowania próbek
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProtocolReviewPanel;
