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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as PassIcon,
  Cancel as FailIcon,
  Warning as WarningIcon,
  Rule as CriteriaIcon,
  TrendingUp as PerformanceIcon,
  Security as QualityIcon,
  Assignment as RequirementIcon
} from '@mui/icons-material';

interface AcceptanceCriterion {
  id: string;
  name: string;
  description: string;
  parameter: string;
  operator: 'greater_than' | 'less_than' | 'equal' | 'greater_equal' | 'less_equal' | 'between' | 'not_equal';
  value: string;
  maxValue?: string; // dla operatora 'between'
  unit: string;
  category: 'performance' | 'quality' | 'safety' | 'dimensional' | 'statistical';
  severity: 'critical' | 'major' | 'minor';
  isRequired: boolean;
  notes?: string;
}

interface AcceptanceCriteriaEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const AcceptanceCriteriaEditor: React.FC<AcceptanceCriteriaEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  // Konwertuj acceptanceCriteria z różnych formatów na tablicę obiektów
  const rawCriteria = protocol.acceptanceCriteria || [];
  const criteria = Array.isArray(rawCriteria) 
    ? rawCriteria.map((item: any, index: number) => {
        if (typeof item === 'string') {
          // Konwertuj string na obiekt AcceptanceCriterion
          return {
            id: `criterion-${index}`,
            name: `Kryterium ${index + 1}`,
            description: item,
            parameter: '',
            minValue: '',
            maxValue: '',
            unit: '',
            type: 'qualitative' as const,
            required: true,
            priority: 'high' as const
          };
        }
        return item; // Już jest obiektem
      })
    : []; // Jeśli nie jest tablicą, zwróć pustą tablicę
    
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<AcceptanceCriterion | null>(null);
  
  const [formData, setFormData] = useState<AcceptanceCriterion>({
    id: '',
    name: '',
    description: '',
    parameter: '',
    operator: 'greater_than',
    value: '',
    maxValue: '',
    unit: '',
    category: 'performance',
    severity: 'major',
    isRequired: true,
    notes: ''
  });

  const categories = [
    { value: 'performance', label: 'Wydajność', icon: <PerformanceIcon />, color: 'primary' },
    { value: 'quality', label: 'Jakość', icon: <QualityIcon />, color: 'success' },
    { value: 'safety', label: 'Bezpieczeństwo', icon: <WarningIcon />, color: 'error' },
    { value: 'dimensional', label: 'Wymiary', icon: <CriteriaIcon />, color: 'info' },
    { value: 'statistical', label: 'Statystyczne', icon: <RequirementIcon />, color: 'secondary' }
  ];

  const operators = [
    { value: 'greater_than', label: '> większe niż', symbol: '>' },
    { value: 'greater_equal', label: '≥ większe lub równe', symbol: '≥' },
    { value: 'less_than', label: '< mniejsze niż', symbol: '<' },
    { value: 'less_equal', label: '≤ mniejsze lub równe', symbol: '≤' },
    { value: 'equal', label: '= równe', symbol: '=' },
    { value: 'not_equal', label: '≠ różne od', symbol: '≠' },
    { value: 'between', label: 'pomiędzy', symbol: '∈' }
  ];

  const severityLevels = [
    { value: 'critical', label: 'Krytyczne', color: 'error', description: 'Błąd krytyczny - badanie nie może być zaakceptowane' },
    { value: 'major', label: 'Poważne', color: 'warning', description: 'Poważny błąd - wymaga uwagi' },
    { value: 'minor', label: 'Drobne', color: 'info', description: 'Drobny błąd - do odnotowania' }
  ];

  const commonCriteria = {
    performance: [
      { name: 'Wytrzymałość na rozciąganie', parameter: 'tensile_strength', operator: 'greater_equal', value: '50', unit: 'MPa', description: 'Minimalna wytrzymałość na rozciąganie' },
      { name: 'Moduł sprężystości', parameter: 'elastic_modulus', operator: 'greater_equal', value: '2000', unit: 'MPa', description: 'Minimalny moduł sprężystości' },
      { name: 'Wydłużenie przy zerwaniu', parameter: 'elongation_at_break', operator: 'greater_equal', value: '5', unit: '%', description: 'Minimalne wydłużenie przy zerwaniu' }
    ],
    quality: [
      { name: 'Odchylenie standardowe', parameter: 'standard_deviation', operator: 'less_equal', value: '5', unit: '%', description: 'Maksymalne odchylenie standardowe' },
      { name: 'Współczynnik zmienności', parameter: 'coefficient_variation', operator: 'less_equal', value: '10', unit: '%', description: 'Maksymalny współczynnik zmienności' }
    ],
    safety: [
      { name: 'Maksymalne naprężenie', parameter: 'max_stress', operator: 'less_equal', value: '100', unit: 'MPa', description: 'Maksymalne dopuszczalne naprężenie' },
      { name: 'Temperatura pracy', parameter: 'operating_temperature', operator: 'between', value: '-20', maxValue: '80', unit: '°C', description: 'Bezpieczny zakres temperatur' }
    ],
    dimensional: [
      { name: 'Tolerancja wymiarowa', parameter: 'dimensional_tolerance', operator: 'less_equal', value: '0.1', unit: 'mm', description: 'Maksymalna tolerancja wymiarowa' },
      { name: 'Płaskość powierzchni', parameter: 'surface_flatness', operator: 'less_equal', value: '0.05', unit: 'mm', description: 'Maksymalne odchylenie płaskości' }
    ],
    statistical: [
      { name: 'Liczba próbek', parameter: 'sample_size', operator: 'greater_equal', value: '5', unit: 'szt', description: 'Minimalna liczba próbek' },
      { name: 'Poziom ufności', parameter: 'confidence_level', operator: 'greater_equal', value: '95', unit: '%', description: 'Minimalny poziom ufności' }
    ]
  };

  const handleAddCriterion = () => {
    setEditingCriterion(null);
    setFormData({
      id: `criterion-${Date.now()}`,
      name: '',
      description: '',
      parameter: '',
      operator: 'greater_than',
      value: '',
      maxValue: '',
      unit: '',
      category: 'performance',
      severity: 'major',
      isRequired: true,
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEditCriterion = (criterion: AcceptanceCriterion) => {
    setEditingCriterion(criterion);
    setFormData({ ...criterion });
    setDialogOpen(true);
  };

  const handleDeleteCriterion = (criterionId: string) => {
    const newCriteria = criteria.filter((c: AcceptanceCriterion) => c.id !== criterionId);
    updateProtocol({ acceptanceCriteria: newCriteria });
  };

  const handleSaveCriterion = () => {
    if (!formData.name || !formData.parameter || !formData.value) return;

    let newCriteria;
    if (editingCriterion) {
      newCriteria = criteria.map((c: AcceptanceCriterion) =>
        c.id === editingCriterion.id ? formData : c
      );
    } else {
      newCriteria = [...criteria, formData];
    }

    updateProtocol({ acceptanceCriteria: newCriteria });
    setDialogOpen(false);
    setEditingCriterion(null);
  };

  const handleQuickAdd = (category: string, criterion: any) => {
    const newCriterion: AcceptanceCriterion = {
      id: `criterion-${Date.now()}`,
      name: criterion.name,
      description: criterion.description,
      parameter: criterion.parameter,
      operator: criterion.operator as any,
      value: criterion.value,
      maxValue: criterion.maxValue,
      unit: criterion.unit,
      category: category as any,
      severity: 'major',
      isRequired: true,
      notes: ''
    };

    updateProtocol({ acceptanceCriteria: [...criteria, newCriterion] });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const getSeverityInfo = (severity: string) => {
    return severityLevels.find(s => s.value === severity) || severityLevels[1];
  };

  const formatCriterionExpression = (criterion: AcceptanceCriterion) => {
    const op = operators.find(o => o.value === criterion.operator);
    if (criterion.operator === 'between') {
      return `${criterion.value} ≤ ${criterion.parameter} ≤ ${criterion.maxValue} ${criterion.unit}`;
    }
    return `${criterion.parameter} ${op?.symbol} ${criterion.value} ${criterion.unit}`;
  };

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Kryteria akceptacji
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Zdefiniuj kryteria, które muszą być spełnione aby wyniki badania zostały zaakceptowane.
          Uwzględnij parametry wydajności, jakości, bezpieczeństwa i wymiarów.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Panel szablonów */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Szablony kryteriów"
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddCriterion}
                  variant="contained"
                  size="small"
                >
                  Nowe kryterium
                </Button>
              }
            />
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Kategorie kryteriów:
              </Typography>
              
              {categories.map((category) => (
                <Box key={category.value} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {category.icon}
                    <Typography variant="subtitle2" color={`${category.color}.main`}>
                      {category.label}
                    </Typography>
                  </Box>
                  
                  <List dense>
                    {commonCriteria[category.value as keyof typeof commonCriteria]?.map((criterion, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={criterion.name}
                          secondary={
                            <Box>
                              <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                                {criterion.parameter} {operators.find(o => o.value === criterion.operator)?.symbol} {criterion.value}
                                {(criterion as any).maxValue && ` - ${(criterion as any).maxValue}`} {criterion.unit}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {criterion.description}
                              </Typography>
                            </Box>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            size="small"
                            onClick={() => handleQuickAdd(category.value, criterion)}
                          >
                            <AddIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Lista kryteriów */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={`Kryteria akceptacji (${criteria.length})`}
              subheader="Wszystkie zdefiniowane kryteria"
            />
            <CardContent>
              {criteria.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CriteriaIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Brak zdefiniowanych kryteriów akceptacji
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddCriterion}
                    variant="outlined"
                  >
                    Dodaj pierwsze kryterium
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Kategoria</TableCell>
                        <TableCell>Kryterium</TableCell>
                        <TableCell>Warunek</TableCell>
                        <TableCell>Poziom</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Akcje</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {criteria.map((criterion: AcceptanceCriterion) => {
                        const categoryInfo = getCategoryInfo(criterion.category);
                        const severityInfo = getSeverityInfo(criterion.severity);
                        
                        return (
                          <TableRow key={criterion.id} hover>
                            <TableCell>
                              <Chip
                                icon={categoryInfo.icon}
                                label={categoryInfo.label}
                                size="small"
                                color={categoryInfo.color as any}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {criterion.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {criterion.description}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                {formatCriterionExpression(criterion)}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={severityInfo.label}
                                size="small"
                                color={severityInfo.color as any}
                                variant="filled"
                              />
                            </TableCell>
                            <TableCell>
                              {criterion.isRequired ? (
                                <Chip 
                                  icon={<RequirementIcon />}
                                  label="Wymagane" 
                                  size="small" 
                                  color="error" 
                                  variant="filled" 
                                />
                              ) : (
                                <Chip 
                                  label="Opcjonalne" 
                                  size="small" 
                                  color="default" 
                                  variant="outlined" 
                                />
                              )}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                size="small"
                                onClick={() => handleEditCriterion(criterion)}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteCriterion(criterion.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {errors.acceptanceCriteria && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errors.acceptanceCriteria}
                </Typography>
              )}

              {/* Podsumowanie kryteriów */}
              {criteria.length > 0 && (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Podsumowanie kryteriów:
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="error.main">
                        <strong>Krytyczne:</strong> {criteria.filter((c: AcceptanceCriterion) => c.severity === 'critical').length}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="warning.main">
                        <strong>Poważne:</strong> {criteria.filter((c: AcceptanceCriterion) => c.severity === 'major').length}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="info.main">
                        <strong>Drobne:</strong> {criteria.filter((c: AcceptanceCriterion) => c.severity === 'minor').length}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog dodawania/edycji kryterium */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCriterion ? 'Edytuj kryterium akceptacji' : 'Dodaj nowe kryterium akceptacji'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Nazwa kryterium"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                placeholder="np. Wytrzymałość na rozciąganie"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Kategoria</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  label="Kategoria"
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Opis kryterium"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                required
                multiline
                rows={2}
                placeholder="Opisz co sprawdza to kryterium"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Parametr"
                value={formData.parameter}
                onChange={(e) => setFormData({ ...formData, parameter: e.target.value })}
                fullWidth
                required
                placeholder="np. tensile_strength"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Operator</InputLabel>
                <Select
                  value={formData.operator}
                  onChange={(e) => setFormData({ ...formData, operator: e.target.value as any })}
                  label="Operator"
                >
                  {operators.map((operator) => (
                    <MenuItem key={operator.value} value={operator.value}>
                      {operator.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Jednostka"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                fullWidth
                placeholder="np. MPa"
              />
            </Grid>

            <Grid item xs={12} md={formData.operator === 'between' ? 6 : 12}>
              <TextField
                label={formData.operator === 'between' ? 'Wartość minimalna' : 'Wartość'}
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                fullWidth
                required
                placeholder="np. 50"
              />
            </Grid>

            {formData.operator === 'between' && (
              <Grid item xs={12} md={6}>
                <TextField
                  label="Wartość maksymalna"
                  value={formData.maxValue || ''}
                  onChange={(e) => setFormData({ ...formData, maxValue: e.target.value })}
                  fullWidth
                  required
                  placeholder="np. 100"
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Poziom ważności</InputLabel>
                <Select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  label="Poziom ważności"
                >
                  {severityLevels.map((level) => (
                    <MenuItem key={level.value} value={level.value}>
                      <Box>
                        <Typography variant="body2" color={`${level.color}.main`}>
                          {level.label}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {level.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                  />
                }
                label="Kryterium wymagane"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Uwagi (opcjonalne)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                fullWidth
                multiline
                rows={2}
                placeholder="Dodatkowe informacje o kryterium"
              />
            </Grid>

            {/* Podgląd kryterium */}
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Podgląd kryterium:
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                  {formatCriterionExpression(formData)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Anuluj</Button>
          <Button 
            onClick={handleSaveCriterion}
            variant="contained"
            disabled={!formData.name || !formData.parameter || !formData.value}
          >
            {editingCriterion ? 'Zapisz zmiany' : 'Dodaj kryterium'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AcceptanceCriteriaEditor;
