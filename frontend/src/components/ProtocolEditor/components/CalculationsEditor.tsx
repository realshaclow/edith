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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tabs,
  Tab,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Functions as MathIcon,
  Calculate as CalcIcon,
  Science as FormulaIcon,
  Straighten as MeasureIcon,
  TrendingUp as StatIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';

interface Calculation {
  id: string;
  name: string;
  description: string;
  formula: string;
  variables: Variable[];
  unit: string;
  category: 'mechanical' | 'statistical' | 'dimensional' | 'chemical' | 'custom';
  isRequired: boolean;
  example?: string;
  notes?: string;
}

interface Variable {
  symbol: string;
  name: string;
  unit: string;
  description: string;
}

interface CalculationsEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const CalculationsEditor: React.FC<CalculationsEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  // Upewnij się, że calculations jest zawsze tablicą
  const calculations = Array.isArray(protocol.calculations) ? protocol.calculations : [];
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCalculation, setEditingCalculation] = useState<Calculation | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [expandedCalc, setExpandedCalc] = useState<string | false>(false);
  
  const [formData, setFormData] = useState<Calculation>({
    id: '',
    name: '',
    description: '',
    formula: '',
    variables: [],
    unit: '',
    category: 'mechanical',
    isRequired: false,
    example: '',
    notes: ''
  });

  const [newVariable, setNewVariable] = useState<Variable>({
    symbol: '',
    name: '',
    unit: '',
    description: ''
  });

  const categories = [
    { value: 'mechanical', label: 'Mechaniczne', icon: <MeasureIcon /> },
    { value: 'statistical', label: 'Statystyczne', icon: <StatIcon /> },
    { value: 'dimensional', label: 'Wymiarowe', icon: <MeasureIcon /> },
    { value: 'chemical', label: 'Chemiczne', icon: <FormulaIcon /> },
    { value: 'custom', label: 'Niestandardowe', icon: <CalcIcon /> }
  ];

  const commonCalculations = {
    mechanical: [
      {
        name: 'Naprężenie przy rozciąganiu',
        formula: 'σ = F / A',
        variables: [
          { symbol: 'σ', name: 'Naprężenie', unit: 'MPa', description: 'Naprężenie przy rozciąganiu' },
          { symbol: 'F', name: 'Siła', unit: 'N', description: 'Siła rozciągająca' },
          { symbol: 'A', name: 'Pole przekroju', unit: 'mm²', description: 'Pole przekroju poprzecznego próbki' }
        ],
        unit: 'MPa',
        description: 'Obliczenie naprężenia przy rozciąganiu'
      },
      {
        name: 'Odkształcenie względne',
        formula: 'ε = ΔL / L₀',
        variables: [
          { symbol: 'ε', name: 'Odkształcenie', unit: '%', description: 'Odkształcenie względne' },
          { symbol: 'ΔL', name: 'Wydłużenie', unit: 'mm', description: 'Zmiana długości' },
          { symbol: 'L₀', name: 'Długość początkowa', unit: 'mm', description: 'Długość pomiarowa próbki' }
        ],
        unit: '%',
        description: 'Obliczenie odkształcenia względnego'
      },
      {
        name: 'Moduł Younga',
        formula: 'E = σ / ε',
        variables: [
          { symbol: 'E', name: 'Moduł Younga', unit: 'GPa', description: 'Moduł sprężystości' },
          { symbol: 'σ', name: 'Naprężenie', unit: 'MPa', description: 'Naprężenie w zakresie sprężystym' },
          { symbol: 'ε', name: 'Odkształcenie', unit: '-', description: 'Odkształcenie w zakresie sprężystym' }
        ],
        unit: 'GPa',
        description: 'Obliczenie modułu sprężystości'
      }
    ],
    statistical: [
      {
        name: 'Średnia arytmetyczna',
        formula: 'x̄ = Σx / n',
        variables: [
          { symbol: 'x̄', name: 'Średnia', unit: '-', description: 'Średnia arytmetyczna' },
          { symbol: 'Σx', name: 'Suma wartości', unit: '-', description: 'Suma wszystkich wartości' },
          { symbol: 'n', name: 'Liczba pomiarów', unit: '-', description: 'Liczba obserwacji' }
        ],
        unit: '-',
        description: 'Obliczenie średniej arytmetycznej'
      },
      {
        name: 'Odchylenie standardowe',
        formula: 's = √(Σ(x - x̄)² / (n-1))',
        variables: [
          { symbol: 's', name: 'Odchylenie standardowe', unit: '-', description: 'Odchylenie standardowe próby' },
          { symbol: 'x', name: 'Wartość', unit: '-', description: 'Pojedyncza wartość' },
          { symbol: 'x̄', name: 'Średnia', unit: '-', description: 'Średnia arytmetyczna' },
          { symbol: 'n', name: 'Liczba pomiarów', unit: '-', description: 'Liczba obserwacji' }
        ],
        unit: '-',
        description: 'Obliczenie odchylenia standardowego'
      }
    ],
    dimensional: [
      {
        name: 'Pole przekroju prostokąta',
        formula: 'A = w × t',
        variables: [
          { symbol: 'A', name: 'Pole przekroju', unit: 'mm²', description: 'Pole przekroju poprzecznego' },
          { symbol: 'w', name: 'Szerokość', unit: 'mm', description: 'Szerokość próbki' },
          { symbol: 't', name: 'Grubość', unit: 'mm', description: 'Grubość próbki' }
        ],
        unit: 'mm²',
        description: 'Obliczenie pola przekroju prostokątnego'
      }
    ],
    chemical: [
      {
        name: 'Stężenie molowe',
        formula: 'C = n / V',
        variables: [
          { symbol: 'C', name: 'Stężenie molowe', unit: 'mol/L', description: 'Stężenie molowe roztworu' },
          { symbol: 'n', name: 'Liczba moli', unit: 'mol', description: 'Liczba moli substancji' },
          { symbol: 'V', name: 'Objętość', unit: 'L', description: 'Objętość roztworu' }
        ],
        unit: 'mol/L',
        description: 'Obliczenie stężenia molowego'
      }
    ]
  };

  const handleAddCalculation = () => {
    setEditingCalculation(null);
    setFormData({
      id: `calc-${Date.now()}`,
      name: '',
      description: '',
      formula: '',
      variables: [],
      unit: '',
      category: 'mechanical',
      isRequired: false,
      example: '',
      notes: ''
    });
    setDialogOpen(true);
  };

  const handleEditCalculation = (calculation: Calculation) => {
    setEditingCalculation(calculation);
    setFormData({ ...calculation });
    setDialogOpen(true);
  };

  const handleDeleteCalculation = (calcId: string) => {
    const newCalculations = calculations.filter((c: Calculation) => c.id !== calcId);
    updateProtocol({ calculations: newCalculations });
  };

  const handleSaveCalculation = () => {
    if (!formData.name || !formData.formula) return;

    let newCalculations;
    if (editingCalculation) {
      newCalculations = calculations.map((c: Calculation) =>
        c.id === editingCalculation.id ? formData : c
      );
    } else {
      newCalculations = [...calculations, formData];
    }

    updateProtocol({ calculations: newCalculations });
    setDialogOpen(false);
    setEditingCalculation(null);
  };

  const handleQuickAdd = (category: string, calculation: any) => {
    const newCalculation: Calculation = {
      id: `calc-${Date.now()}`,
      name: calculation.name,
      description: calculation.description,
      formula: calculation.formula,
      variables: calculation.variables,
      unit: calculation.unit,
      category: category as any,
      isRequired: false,
      example: '',
      notes: ''
    };

    updateProtocol({ calculations: [...calculations, newCalculation] });
  };

  const handleAddVariable = () => {
    if (!newVariable.symbol || !newVariable.name) return;

    setFormData({
      ...formData,
      variables: [...formData.variables, { ...newVariable }]
    });

    setNewVariable({
      symbol: '',
      name: '',
      unit: '',
      description: ''
    });
  };

  const handleRemoveVariable = (index: number) => {
    const newVariables = [...formData.variables];
    newVariables.splice(index, 1);
    setFormData({ ...formData, variables: newVariables });
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || <CalcIcon />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      mechanical: 'primary',
      statistical: 'secondary',
      dimensional: 'info',
      chemical: 'success',
      custom: 'warning'
    };
    return colors[category] || 'default';
  };

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Obliczenia i wzory
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Zdefiniuj wszystkie obliczenia i wzory matematyczne potrzebne do analizy wyników badania.
          Uwzględnij parametry mechaniczne, statystyczne i inne.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Panel szablonów */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Szablony obliczeń"
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddCalculation}
                  variant="contained"
                  size="small"
                >
                  Nowe obliczenie
                </Button>
              }
            />
            <CardContent>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                orientation="vertical"
                variant="scrollable"
                sx={{ borderRight: 1, borderColor: 'divider', minHeight: 300 }}
              >
                {categories.map((category, index) => (
                  <Tab
                    key={category.value}
                    label={category.label}
                    icon={category.icon}
                    iconPosition="start"
                    sx={{ minHeight: 48, justifyContent: 'flex-start' }}
                  />
                ))}
              </Tabs>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Wzory {categories[currentTab]?.label.toLowerCase()}:
                </Typography>
                <List dense>
                  {commonCalculations[categories[currentTab]?.value as keyof typeof commonCalculations]?.map((calc, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={calc.name}
                        secondary={
                          <Box>
                            <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace' }}>
                              {calc.formula}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {calc.description}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => handleQuickAdd(categories[currentTab].value, calc)}
                        >
                          <AddIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista obliczeń */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={`Obliczenia (${calculations.length})`}
              subheader="Wszystkie zdefiniowane wzory i obliczenia"
            />
            <CardContent>
              {calculations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CalcIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Brak zdefiniowanych obliczeń
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddCalculation}
                    variant="outlined"
                  >
                    Dodaj pierwsze obliczenie
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {calculations.map((calculation: Calculation) => (
                    <Accordion
                      key={calculation.id}
                      expanded={expandedCalc === calculation.id}
                      onChange={(e, isExpanded) => setExpandedCalc(isExpanded ? calculation.id : false)}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                          <Chip
                            icon={getCategoryIcon(calculation.category)}
                            label={categories.find(c => c.value === calculation.category)?.label}
                            size="small"
                            color={getCategoryColor(calculation.category) as any}
                            variant="outlined"
                          />
                          <Typography sx={{ fontWeight: 'medium', flexGrow: 1 }}>
                            {calculation.name}
                          </Typography>
                          {calculation.isRequired && (
                            <Chip label="Wymagane" size="small" color="error" />
                          )}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCalculation(calculation);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCalculation(calculation.id);
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
                              {calculation.description}
                            </Typography>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                Wzór:
                              </Typography>
                              <Typography variant="h6" sx={{ fontFamily: 'monospace', color: 'primary.main' }}>
                                {calculation.formula}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Jednostka: {calculation.unit}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>
                              Zmienne:
                            </Typography>
                            <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 200 }}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Symbol</TableCell>
                                    <TableCell>Nazwa</TableCell>
                                    <TableCell>Jednostka</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {calculation.variables.map((variable, index) => (
                                    <TableRow key={index}>
                                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                        {variable.symbol}
                                      </TableCell>
                                      <TableCell>{variable.name}</TableCell>
                                      <TableCell>{variable.unit}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Grid>

                          {calculation.example && (
                            <Grid item xs={12}>
                              <Box sx={{ p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Przykład:
                                </Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                  {calculation.example}
                                </Typography>
                              </Box>
                            </Grid>
                          )}

                          {calculation.notes && (
                            <Grid item xs={12}>
                              <Box sx={{ p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
                                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                                  Uwagi:
                                </Typography>
                                <Typography variant="body2">
                                  {calculation.notes}
                                </Typography>
                              </Box>
                            </Grid>
                          )}
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}

              {errors.calculations && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errors.calculations}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog dodawania/edycji obliczenia */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {editingCalculation ? 'Edytuj obliczenie' : 'Dodaj nowe obliczenie'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Nazwa obliczenia"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                placeholder="np. Naprężenie przy rozciąganiu"
              />
            </Grid>
            <Grid item xs={12} md={4}>
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

            <Grid item xs={12}>
              <TextField
                label="Opis obliczenia"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                required
                multiline
                rows={2}
                placeholder="Opisz co oblicza ten wzór i kiedy go używać"
              />
            </Grid>

            <Grid item xs={12} md={8}>
              <TextField
                label="Wzór matematyczny"
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                fullWidth
                required
                placeholder="np. σ = F / A"
                sx={{ fontFamily: 'monospace' }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Jednostka wyniku"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                fullWidth
                placeholder="np. MPa"
              />
            </Grid>

            {/* Zmienne */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Zmienne we wzorze
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={3}>
                  <TextField
                    label="Symbol"
                    value={newVariable.symbol}
                    onChange={(e) => setNewVariable({ ...newVariable, symbol: e.target.value })}
                    fullWidth
                    size="small"
                    placeholder="σ"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Nazwa"
                    value={newVariable.name}
                    onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                    fullWidth
                    size="small"
                    placeholder="Naprężenie"
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    label="Jednostka"
                    value={newVariable.unit}
                    onChange={(e) => setNewVariable({ ...newVariable, unit: e.target.value })}
                    fullWidth
                    size="small"
                    placeholder="MPa"
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    onClick={handleAddVariable}
                    variant="outlined"
                    disabled={!newVariable.symbol || !newVariable.name}
                    fullWidth
                  >
                    Dodaj
                  </Button>
                </Grid>
              </Grid>

              {formData.variables.length > 0 && (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Nazwa</TableCell>
                        <TableCell>Jednostka</TableCell>
                        <TableCell>Opis</TableCell>
                        <TableCell align="center">Akcje</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.variables.map((variable, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {variable.symbol}
                          </TableCell>
                          <TableCell>{variable.name}</TableCell>
                          <TableCell>{variable.unit}</TableCell>
                          <TableCell>{variable.description}</TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRemoveVariable(index)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Przykład obliczenia (opcjonalny)"
                value={formData.example}
                onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                fullWidth
                multiline
                rows={2}
                placeholder="np. σ = 1000 N / 100 mm² = 10 MPa"
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
                placeholder="Dodatkowe informacje o obliczeniu"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRequired}
                    onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                  />
                }
                label="Obliczenie wymagane"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Anuluj</Button>
          <Button 
            onClick={handleSaveCalculation}
            variant="contained"
            disabled={!formData.name || !formData.formula || !formData.description}
          >
            {editingCalculation ? 'Zapisz zmiany' : 'Dodaj obliczenie'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalculationsEditor;
