import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  DragIndicator as DragIcon,
  Timer as TimerIcon,
  Assignment as InstructionIcon,
  Lightbulb as TipIcon,
  Warning as SafetyIcon,
  ContentCopy as CopyIcon,
  ListAlt as AssignmentIcon
} from '@mui/icons-material';
import { createEmptyStep } from '../utils/helpers';

interface StepsEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const StepsEditor: React.FC<StepsEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  const steps = protocol.steps || [];
  const [expandedStep, setExpandedStep] = useState<string | false>(false);
  const [newInstruction, setNewInstruction] = useState<Record<number, string>>({});
  const [newTip, setNewTip] = useState<Record<number, string>>({});
  const [newSafety, setNewSafety] = useState<Record<number, string>>({});

  const handleStepAdd = () => {
    const newStep = createEmptyStep(steps.length);
    updateProtocol({
      steps: [...steps, newStep]
    });
    setExpandedStep(newStep.id);
  };

  const handleStepRemove = (index: number) => {
    const newSteps = [...steps];
    newSteps.splice(index, 1);
    updateProtocol({ steps: newSteps });
  };

  const handleStepChange = (index: number, field: string, value: any) => {
    const newSteps = [...steps];
    newSteps[index] = {
      ...newSteps[index],
      [field]: value
    };
    updateProtocol({ steps: newSteps });
  };

  const handleArrayItemAdd = (stepIndex: number, arrayField: 'instructions' | 'tips' | 'safety', value: string) => {
    if (!value.trim()) return;
    
    const newSteps = [...steps];
    const currentArray = newSteps[stepIndex][arrayField] || [];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      [arrayField]: [...currentArray, value.trim()]
    };
    updateProtocol({ steps: newSteps });

    // Clear input
    if (arrayField === 'instructions') setNewInstruction({ ...newInstruction, [stepIndex]: '' });
    if (arrayField === 'tips') setNewTip({ ...newTip, [stepIndex]: '' });
    if (arrayField === 'safety') setNewSafety({ ...newSafety, [stepIndex]: '' });
  };

  const handleArrayItemRemove = (stepIndex: number, arrayField: 'instructions' | 'tips' | 'safety', itemIndex: number) => {
    const newSteps = [...steps];
    const currentArray = [...(newSteps[stepIndex][arrayField] || [])];
    currentArray.splice(itemIndex, 1);
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      [arrayField]: currentArray
    };
    updateProtocol({ steps: newSteps });
  };

  const handleCopyStep = (index: number) => {
    const stepToCopy = { ...steps[index] };
    stepToCopy.id = `step-${steps.length + 1}`;
    stepToCopy.title = `${stepToCopy.title} (kopia)`;
    updateProtocol({
      steps: [...steps, stepToCopy]
    });
  };

  const getStepError = (index: number, field: string) => {
    return errors[`step-${index}-${field}`];
  };

  const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedStep(isExpanded ? panel : false);
  };

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Kroki procedury badawczej
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Zdefiniuj szczegółowe kroki procedury. Każdy krok powinien zawierać jasne instrukcje, 
          czas trwania, wskazówki i środki bezpieczeństwa.
        </Typography>
      </Alert>

      <Card>
        <CardHeader
          title="Sekwencja kroków badania"
          action={
            <Button
              startIcon={<AddIcon />}
              onClick={handleStepAdd}
              variant="contained"
              size="small"
            >
              Dodaj krok
            </Button>
          }
        />
        <CardContent>
          {steps.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Brak zdefiniowanych kroków procedury
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleStepAdd}
                variant="outlined"
              >
                Dodaj pierwszy krok
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {steps.map((step: any, index: number) => (
                <Accordion
                  key={step.id}
                  expanded={expandedStep === step.id}
                  onChange={handleAccordionChange(step.id)}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      backgroundColor: expandedStep === step.id ? 'primary.50' : 'grey.50',
                      '&:hover': { backgroundColor: 'primary.100' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <DragIcon color="action" />
                      <Chip
                        label={`Krok ${index + 1}`}
                        color="primary"
                        size="small"
                      />
                      <Typography sx={{ fontWeight: 'medium', flexGrow: 1 }}>
                        {step.title || `Krok ${index + 1} - bez tytułu`}
                      </Typography>
                      {step.duration && (
                        <Chip
                          icon={<TimerIcon />}
                          label={step.duration}
                          size="small"
                          variant="outlined"
                        />
                      )}
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyStep(index);
                          }}
                        >
                          <CopyIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStepRemove(index);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Podstawowe informacje o kroku */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                          <TextField
                            label="Tytuł kroku"
                            value={step.title || ''}
                            onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                            error={!!getStepError(index, 'title')}
                            helperText={getStepError(index, 'title') || 'Krótki, opisowy tytuł kroku'}
                            fullWidth
                            required
                          />
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <TextField
                            label="Czas trwania"
                            value={step.duration || ''}
                            onChange={(e) => handleStepChange(index, 'duration', e.target.value)}
                            error={!!getStepError(index, 'duration')}
                            helperText={getStepError(index, 'duration') || 'np. 15 minut'}
                            fullWidth
                            required
                            placeholder="15 minut"
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        label="Opis kroku"
                        value={step.description || ''}
                        onChange={(e) => handleStepChange(index, 'description', e.target.value)}
                        error={!!getStepError(index, 'description')}
                        helperText={getStepError(index, 'description') || 'Szczegółowy opis tego co się robi w tym kroku'}
                        fullWidth
                        required
                        multiline
                        rows={2}
                      />

                      <Divider />

                      {/* Instrukcje */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InstructionIcon color="primary" />
                          Instrukcje krok po kroku
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <TextField
                            label="Nowa instrukcja"
                            value={newInstruction[index] || ''}
                            onChange={(e) => setNewInstruction({ ...newInstruction, [index]: e.target.value })}
                            fullWidth
                            placeholder="Opisz konkretną czynność do wykonania"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleArrayItemAdd(index, 'instructions', newInstruction[index] || '');
                              }
                            }}
                          />
                          <Button
                            onClick={() => handleArrayItemAdd(index, 'instructions', newInstruction[index] || '')}
                            variant="outlined"
                            disabled={!newInstruction[index]?.trim()}
                          >
                            Dodaj
                          </Button>
                        </Box>

                        {step.instructions && step.instructions.length > 0 ? (
                          <List dense>
                            {step.instructions.map((instruction: string, instrIndex: number) => (
                              <ListItem key={instrIndex} divider>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                      <Chip label={instrIndex + 1} size="small" color="primary" sx={{ minWidth: 24 }} />
                                      {instruction}
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleArrayItemRemove(index, 'instructions', instrIndex)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        ) : (
                          <Typography color="text.secondary" sx={{ fontStyle: 'italic', py: 1 }}>
                            Brak instrukcji. Dodaj pierwszą instrukcję powyżej.
                          </Typography>
                        )}

                        {getStepError(index, 'instructions') && (
                          <Typography color="error" variant="caption">
                            {getStepError(index, 'instructions')}
                          </Typography>
                        )}
                      </Box>

                      <Divider />

                      {/* Wskazówki */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TipIcon color="warning" />
                          Wskazówki i porady
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <TextField
                            label="Nowa wskazówka"
                            value={newTip[index] || ''}
                            onChange={(e) => setNewTip({ ...newTip, [index]: e.target.value })}
                            fullWidth
                            placeholder="Praktyczna rada lub wskazówka"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleArrayItemAdd(index, 'tips', newTip[index] || '');
                              }
                            }}
                          />
                          <Button
                            onClick={() => handleArrayItemAdd(index, 'tips', newTip[index] || '')}
                            variant="outlined"
                            disabled={!newTip[index]?.trim()}
                          >
                            Dodaj
                          </Button>
                        </Box>

                        {step.tips && step.tips.length > 0 && (
                          <List dense>
                            {step.tips.map((tip: string, tipIndex: number) => (
                              <ListItem key={tipIndex}>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                      <TipIcon sx={{ color: 'warning.main', fontSize: 16, mt: 0.5 }} />
                                      {tip}
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleArrayItemRemove(index, 'tips', tipIndex)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>

                      <Divider />

                      {/* Bezpieczeństwo */}
                      <Box>
                        <Typography variant="subtitle2" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SafetyIcon color="error" />
                          Środki bezpieczeństwa
                        </Typography>
                        
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                          <TextField
                            label="Nowa zasada bezpieczeństwa"
                            value={newSafety[index] || ''}
                            onChange={(e) => setNewSafety({ ...newSafety, [index]: e.target.value })}
                            fullWidth
                            placeholder="Zasada bezpieczeństwa dla tego kroku"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleArrayItemAdd(index, 'safety', newSafety[index] || '');
                              }
                            }}
                          />
                          <Button
                            onClick={() => handleArrayItemAdd(index, 'safety', newSafety[index] || '')}
                            variant="outlined"
                            disabled={!newSafety[index]?.trim()}
                          >
                            Dodaj
                          </Button>
                        </Box>

                        {step.safety && step.safety.length > 0 && (
                          <List dense>
                            {step.safety.map((safety: string, safetyIndex: number) => (
                              <ListItem key={safetyIndex}>
                                <ListItemText
                                  primary={
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                      <SafetyIcon sx={{ color: 'error.main', fontSize: 16, mt: 0.5 }} />
                                      {safety}
                                    </Box>
                                  }
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    size="small"
                                    color="error"
                                    onClick={() => handleArrayItemRemove(index, 'safety', safetyIndex)}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            ))}
                          </List>
                        )}
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {/* Ogólny błąd kroków */}
          {errors.steps && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errors.steps}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default StepsEditor;
