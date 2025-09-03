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
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Build as TechnicalIcon,
  Psychology as InterpretationIcon,
  BugReport as IssueIcon
} from '@mui/icons-material';

interface CommonIssue {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'procedural' | 'interpretation' | 'equipment' | 'material' | 'safety';
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string[];
  causes: string[];
  solutions: string[];
  prevention: string[];
  isFrequent: boolean;
  notes?: string;
}

interface CommonIssuesEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const CommonIssuesEditor: React.FC<CommonIssuesEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  const issues = protocol.commonIssues || [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<CommonIssue | null>(null);
  const [expandedIssue, setExpandedIssue] = useState<string | false>(false);
  
  const [formData, setFormData] = useState<CommonIssue>({
    id: '',
    title: '',
    description: '',
    category: 'technical',
    severity: 'medium',
    symptoms: [],
    causes: [],
    solutions: [],
    prevention: [],
    isFrequent: false,
    notes: ''
  });

  const [newSymptom, setNewSymptom] = useState('');
  const [newCause, setNewCause] = useState('');
  const [newSolution, setNewSolution] = useState('');
  const [newPrevention, setNewPrevention] = useState('');

  const categories = [
    { value: 'technical', label: 'Techniczne', icon: <TechnicalIcon />, color: 'primary' },
    { value: 'procedural', label: 'Proceduralne', icon: <IssueIcon />, color: 'secondary' },
    { value: 'interpretation', label: 'Interpretacja wyników', icon: <InterpretationIcon />, color: 'info' },
    { value: 'equipment', label: 'Sprzęt', icon: <TechnicalIcon />, color: 'warning' },
    { value: 'material', label: 'Materiały', icon: <InfoIcon />, color: 'success' },
    { value: 'safety', label: 'Bezpieczeństwo', icon: <WarningIcon />, color: 'error' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Niski', color: 'success', icon: <InfoIcon /> },
    { value: 'medium', label: 'Średni', color: 'warning', icon: <WarningIcon /> },
    { value: 'high', label: 'Wysoki', color: 'error', icon: <ErrorIcon /> },
    { value: 'critical', label: 'Krytyczny', color: 'error', icon: <ErrorIcon /> }
  ];

  const handleAddIssue = () => {
    setEditingIssue(null);
    setFormData({
      id: `issue-${Date.now()}`,
      title: '',
      description: '',
      category: 'technical',
      severity: 'medium',
      symptoms: [],
      causes: [],
      solutions: [],
      prevention: [],
      isFrequent: false,
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEditIssue = (issue: CommonIssue) => {
    setEditingIssue(issue);
    setFormData({ ...issue });
    setDialogOpen(true);
  };

  const handleDeleteIssue = (issueId: string) => {
    const newIssues = issues.filter((i: CommonIssue) => i.id !== issueId);
    updateProtocol({ commonIssues: newIssues });
  };

  const handleSaveIssue = () => {
    if (!formData.title || !formData.description) return;

    let newIssues;
    if (editingIssue) {
      newIssues = issues.map((i: CommonIssue) =>
        i.id === editingIssue.id ? formData : i
      );
    } else {
      newIssues = [...issues, formData];
    }

    updateProtocol({ commonIssues: newIssues });
    setDialogOpen(false);
    setEditingIssue(null);
    
    // Reset inputs
    setNewSymptom('');
    setNewCause('');
    setNewSolution('');
    setNewPrevention('');
  };

  const handleAddArrayItem = (arrayField: 'symptoms' | 'causes' | 'solutions' | 'prevention', value: string, setValue: (val: string) => void) => {
    if (!value.trim()) return;
    
    setFormData({
      ...formData,
      [arrayField]: [...(formData[arrayField] || []), value.trim()]
    });
    setValue('');
  };

  const handleRemoveArrayItem = (arrayField: 'symptoms' | 'causes' | 'solutions' | 'prevention', index: number) => {
    const currentArray = [...(formData[arrayField] || [])];
    currentArray.splice(index, 1);
    setFormData({
      ...formData,
      [arrayField]: currentArray
    });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const getSeverityInfo = (severity: string) => {
    return severityLevels.find(s => s.value === severity) || severityLevels[1];
  };

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Typowe problemy i rozwiązania
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Zdefiniuj najczęstsze problemy które mogą wystąpić podczas badania oraz sposoby ich rozwiązywania.
          To pomoże użytkownikom protokołu w szybkim diagnozowaniu i naprawianiu problemów.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Panel dodawania */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={`Typowe problemy (${issues.length})`}
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddIssue}
                  variant="contained"
                  size="small"
                >
                  Dodaj problem
                </Button>
              }
            />
            <CardContent>
              {issues.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <IssueIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Brak zdefiniowanych problemów
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddIssue}
                    variant="outlined"
                  >
                    Dodaj pierwszy problem
                  </Button>
                </Box>
              ) : (
                <Box>
                  {/* Statystyki */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={3}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center', py: 1 }}>
                          <Typography variant="h6" color="error.main">
                            {issues.filter((i: CommonIssue) => i.severity === 'critical' || i.severity === 'high').length}
                          </Typography>
                          <Typography variant="caption">Wysokie</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={3}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center', py: 1 }}>
                          <Typography variant="h6" color="warning.main">
                            {issues.filter((i: CommonIssue) => i.severity === 'medium').length}
                          </Typography>
                          <Typography variant="caption">Średnie</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={3}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center', py: 1 }}>
                          <Typography variant="h6" color="success.main">
                            {issues.filter((i: CommonIssue) => i.severity === 'low').length}
                          </Typography>
                          <Typography variant="caption">Niskie</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={3}>
                      <Card variant="outlined">
                        <CardContent sx={{ textAlign: 'center', py: 1 }}>
                          <Typography variant="h6" color="primary.main">
                            {issues.filter((i: CommonIssue) => i.isFrequent).length}
                          </Typography>
                          <Typography variant="caption">Częste</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  {/* Lista problemów */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {issues.map((issue: CommonIssue) => {
                      const categoryInfo = getCategoryInfo(issue.category);
                      const severityInfo = getSeverityInfo(issue.severity);
                      
                      return (
                        <Accordion
                          key={issue.id}
                          expanded={expandedIssue === issue.id}
                          onChange={(e, isExpanded) => setExpandedIssue(isExpanded ? issue.id : false)}
                        >
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                              <Chip
                                icon={categoryInfo.icon}
                                label={categoryInfo.label}
                                size="small"
                                color={categoryInfo.color as any}
                                variant="outlined"
                              />
                              <Chip
                                icon={severityInfo.icon}
                                label={severityInfo.label}
                                size="small"
                                color={severityInfo.color as any}
                                variant="filled"
                              />
                              <Typography sx={{ fontWeight: 'medium', flexGrow: 1 }}>
                                {issue.title}
                              </Typography>
                              {issue.isFrequent && (
                                <Chip label="Częsty problem" size="small" color="warning" />
                              )}
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditIssue(issue);
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteIssue(issue.id);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Box>
                            </Box>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {issue.description}
                                </Typography>
                              </Grid>

                              {issue.symptoms && issue.symptoms.length > 0 && (
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'warning.main' }}>
                                    Objawy:
                                  </Typography>
                                  <List dense>
                                    {issue.symptoms.map((symptom: string, index: number) => (
                                      <ListItem key={index}>
                                        <ListItemIcon>
                                          <WarningIcon fontSize="small" color="warning" />
                                        </ListItemIcon>
                                        <ListItemText primary={symptom} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Grid>
                              )}

                              {issue.causes && issue.causes.length > 0 && (
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'error.main' }}>
                                    Przyczyny:
                                  </Typography>
                                  <List dense>
                                    {issue.causes.map((cause: string, index: number) => (
                                      <ListItem key={index}>
                                        <ListItemIcon>
                                          <ErrorIcon fontSize="small" color="error" />
                                        </ListItemIcon>
                                        <ListItemText primary={cause} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Grid>
                              )}

                              {issue.solutions && issue.solutions.length > 0 && (
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'success.main' }}>
                                    Rozwiązania:
                                  </Typography>
                                  <List dense>
                                    {issue.solutions.map((solution: string, index: number) => (
                                      <ListItem key={index}>
                                        <ListItemIcon>
                                          <InfoIcon fontSize="small" color="success" />
                                        </ListItemIcon>
                                        <ListItemText primary={solution} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Grid>
                              )}

                              {issue.prevention && issue.prevention.length > 0 && (
                                <Grid item xs={12} md={6}>
                                  <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
                                    Zapobieganie:
                                  </Typography>
                                  <List dense>
                                    {issue.prevention.map((prevention: string, index: number) => (
                                      <ListItem key={index}>
                                        <ListItemIcon>
                                          <InfoIcon fontSize="small" color="primary" />
                                        </ListItemIcon>
                                        <ListItemText primary={prevention} />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Grid>
                              )}

                              {issue.notes && (
                                <Grid item xs={12}>
                                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                      Dodatkowe uwagi:
                                    </Typography>
                                    <Typography variant="body2">
                                      {issue.notes}
                                    </Typography>
                                  </Box>
                                </Grid>
                              )}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      );
                    })}
                  </Box>
                </Box>
              )}

              {errors.commonIssues && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errors.commonIssues}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog dodawania/edycji problemu */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingIssue ? 'Edytuj problem' : 'Dodaj nowy problem'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Tytuł problemu"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                required
                placeholder="np. Nieprawidłowe wyniki pomiaru naprężenia"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFrequent}
                    onChange={(e) => setFormData({ ...formData, isFrequent: e.target.checked })}
                  />
                }
                label="Częsty problem"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Opis problemu"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                required
                multiline
                rows={3}
                placeholder="Szczegółowy opis problemu i jego wpływu na badanie"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Kategoria"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                fullWidth
                SelectProps={{ native: true }}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Poziom ważności"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                fullWidth
                SelectProps={{ native: true }}
              >
                {severityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </TextField>
            </Grid>

            {/* Sekcje z listami */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              
              {/* Objawy */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'warning.main' }}>
                  Objawy problemu
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Nowy objaw"
                    value={newSymptom}
                    onChange={(e) => setNewSymptom(e.target.value)}
                    fullWidth
                    placeholder="Opisz jak ten problem się objawia"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('symptoms', newSymptom, setNewSymptom);
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleAddArrayItem('symptoms', newSymptom, setNewSymptom)}
                    variant="outlined"
                    disabled={!newSymptom.trim()}
                  >
                    Dodaj
                  </Button>
                </Box>
                {formData.symptoms && formData.symptoms.length > 0 && (
                  <List dense>
                    {formData.symptoms.map((symptom: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <WarningIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={symptom} />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveArrayItem('symptoms', index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              {/* Przyczyny */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'error.main' }}>
                  Przyczyny problemu
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Nowa przyczyna"
                    value={newCause}
                    onChange={(e) => setNewCause(e.target.value)}
                    fullWidth
                    placeholder="Opisz co może powodować ten problem"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('causes', newCause, setNewCause);
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleAddArrayItem('causes', newCause, setNewCause)}
                    variant="outlined"
                    disabled={!newCause.trim()}
                  >
                    Dodaj
                  </Button>
                </Box>
                {formData.causes && formData.causes.length > 0 && (
                  <List dense>
                    {formData.causes.map((cause: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <ErrorIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary={cause} />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveArrayItem('causes', index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              {/* Rozwiązania */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                  Rozwiązania problemu
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Nowe rozwiązanie"
                    value={newSolution}
                    onChange={(e) => setNewSolution(e.target.value)}
                    fullWidth
                    placeholder="Opisz jak rozwiązać ten problem"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('solutions', newSolution, setNewSolution);
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleAddArrayItem('solutions', newSolution, setNewSolution)}
                    variant="outlined"
                    disabled={!newSolution.trim()}
                  >
                    Dodaj
                  </Button>
                </Box>
                {formData.solutions && formData.solutions.length > 0 && (
                  <List dense>
                    {formData.solutions.map((solution: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary={solution} />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveArrayItem('solutions', index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              {/* Zapobieganie */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                  Zapobieganie problemowi
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <TextField
                    label="Nowa metoda zapobiegania"
                    value={newPrevention}
                    onChange={(e) => setNewPrevention(e.target.value)}
                    fullWidth
                    placeholder="Opisz jak zapobiec temu problemowi"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddArrayItem('prevention', newPrevention, setNewPrevention);
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleAddArrayItem('prevention', newPrevention, setNewPrevention)}
                    variant="outlined"
                    disabled={!newPrevention.trim()}
                  >
                    Dodaj
                  </Button>
                </Box>
                {formData.prevention && formData.prevention.length > 0 && (
                  <List dense>
                    {formData.prevention.map((prevention: string, index: number) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <InfoIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={prevention} />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveArrayItem('prevention', index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>

              <TextField
                label="Dodatkowe uwagi (opcjonalne)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                fullWidth
                multiline
                rows={2}
                placeholder="Dodatkowe informacje o problemie"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Anuluj</Button>
          <Button 
            onClick={handleSaveIssue}
            variant="contained"
            disabled={!formData.title || !formData.description}
          >
            {editingIssue ? 'Zapisz zmiany' : 'Dodaj problem'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommonIssuesEditor;
