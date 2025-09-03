import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Grid,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { Add, Delete, ExpandMore } from '@mui/icons-material';
import { StudyFormData, StudyPhase, StudyMilestone, CreateStudyFormErrors } from '../types';

interface TimelineStepProps {
  studyData: StudyFormData;
  errors: CreateStudyFormErrors;
  onUpdate: (data: Partial<StudyFormData>) => void;
}

export const TimelineStep: React.FC<TimelineStepProps> = ({
  studyData,
  errors,
  onUpdate
}) => {
  const updateTimeline = (updates: Partial<typeof studyData.timeline>) => {
    onUpdate({
      timeline: {
        ...studyData.timeline,
        ...updates
      }
    });
  };

  const addPhase = () => {
    const newPhase: StudyPhase = {
      id: `phase_${Date.now()}`,
      name: '',
      description: '',
      duration: '',
      dependencies: [],
      tasks: []
    };
    
    updateTimeline({
      phases: [...studyData.timeline.phases, newPhase]
    });
  };

  const updatePhase = (phaseId: string, updates: Partial<StudyPhase>) => {
    const updatedPhases = studyData.timeline.phases.map(phase =>
      phase.id === phaseId ? { ...phase, ...updates } : phase
    );
    updateTimeline({ phases: updatedPhases });
  };

  const removePhase = (phaseId: string) => {
    const filteredPhases = studyData.timeline.phases.filter(phase => phase.id !== phaseId);
    updateTimeline({ phases: filteredPhases });
  };

  const addMilestone = () => {
    const newMilestone: StudyMilestone = {
      id: `milestone_${Date.now()}`,
      name: '',
      description: '',
      date: '',
      type: 'checkpoint'
    };
    
    updateTimeline({
      milestones: [...studyData.timeline.milestones, newMilestone]
    });
  };

  const updateMilestone = (milestoneId: string, updates: Partial<StudyMilestone>) => {
    const updatedMilestones = studyData.timeline.milestones.map(milestone =>
      milestone.id === milestoneId ? { ...milestone, ...updates } : milestone
    );
    updateTimeline({ milestones: updatedMilestones });
  };

  const removeMilestone = (milestoneId: string) => {
    const filteredMilestones = studyData.timeline.milestones.filter(milestone => milestone.id !== milestoneId);
    updateTimeline({ milestones: filteredMilestones });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Harmonogram badania
        </Typography>

        <Box display="flex" flexDirection="column" gap={3}>
          {/* Estimated Duration */}
          <TextField
            fullWidth
            label="Szacowany czas trwania"
            value={studyData.timeline.estimatedDuration}
            onChange={(e) => updateTimeline({ estimatedDuration: e.target.value })}
            error={!!errors.timeline}
            helperText={errors.timeline || 'Podaj orientacyjny czas trwania całego badania'}
            required
            placeholder="np. 2 tygodnie, 1 miesiąc, 3 dni"
          />

          {/* Phases */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Typography variant="h6">
                  Fazy badania ({studyData.timeline.phases.length})
                </Typography>
                <IconButton onClick={addPhase} color="primary" size="small">
                  <Add />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {studyData.timeline.phases.length === 0 ? (
                <Box textAlign="center" py={2}>
                  <Typography color="text.secondary">
                    Brak zdefiniowanych faz. Kliknij "+" aby dodać fazę.
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {studyData.timeline.phases.map((phase, index) => (
                    <Card key={phase.id} variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="subtitle1">
                            Faza {index + 1}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => removePhase(phase.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Nazwa fazy"
                              value={phase.name}
                              onChange={(e) => updatePhase(phase.id, { name: e.target.value })}
                              placeholder="np. Przygotowanie próbek"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Czas trwania"
                              value={phase.duration}
                              onChange={(e) => updatePhase(phase.id, { duration: e.target.value })}
                              placeholder="np. 3 dni"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Opis fazy"
                              value={phase.description}
                              onChange={(e) => updatePhase(phase.id, { description: e.target.value })}
                              multiline
                              rows={2}
                              placeholder="Opisz co będzie wykonywane w tej fazie"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Milestones */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                <Typography variant="h6">
                  Kamienie milowe ({studyData.timeline.milestones.length})
                </Typography>
                <IconButton onClick={addMilestone} color="primary" size="small">
                  <Add />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {studyData.timeline.milestones.length === 0 ? (
                <Box textAlign="center" py={2}>
                  <Typography color="text.secondary">
                    Brak zdefiniowanych kamieni milowych. Kliknij "+" aby dodać.
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {studyData.timeline.milestones.map((milestone, index) => (
                    <Card key={milestone.id} variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="subtitle1">
                              Kamień milowy {index + 1}
                            </Typography>
                            <Chip 
                              label={milestone.type} 
                              size="small" 
                              color={
                                milestone.type === 'start' ? 'success' :
                                milestone.type === 'end' ? 'error' : 'default'
                              }
                            />
                          </Box>
                          <IconButton
                            size="small"
                            onClick={() => removeMilestone(milestone.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Nazwa"
                              value={milestone.name}
                              onChange={(e) => updateMilestone(milestone.id, { name: e.target.value })}
                              placeholder="np. Zakończenie testów"
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Data"
                              type="date"
                              value={milestone.date}
                              onChange={(e) => updateMilestone(milestone.id, { date: e.target.value })}
                              InputLabelProps={{ shrink: true }}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              select
                              label="Typ"
                              value={milestone.type}
                              onChange={(e) => updateMilestone(milestone.id, { type: e.target.value as StudyMilestone['type'] })}
                              SelectProps={{ native: true }}
                            >
                              <option value="start">Start</option>
                              <option value="checkpoint">Punkt kontrolny</option>
                              <option value="deliverable">Dostarczenie</option>
                              <option value="end">Koniec</option>
                            </TextField>
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Opis"
                              value={milestone.description}
                              onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                              multiline
                              rows={2}
                              placeholder="Opisz co ma zostać osiągnięte"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      </CardContent>
    </Card>
  );
};
