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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Thermostat as TempIcon,
  Speed as SpeedIcon,
  Straighten as DimensionIcon,
  Science as ChemIcon,
  Timer as TimerIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

interface TestCondition {
  id: string;
  name: string;
  value: string;
  unit: string;
  tolerance: string;
  category: 'environmental' | 'mechanical' | 'chemical' | 'temporal' | 'dimensional';
  required: boolean;
  description?: string;
}

interface TestConditionsEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const TestConditionsEditor: React.FC<TestConditionsEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  // Normalize testConditions to always be an array
  const normalizeTestConditions = (conditions: any): TestCondition[] => {
    if (!conditions) return [];
    if (Array.isArray(conditions)) return conditions;
    
    // If it's an object (key-value pairs), convert to array
    if (typeof conditions === 'object') {
      return Object.entries(conditions).map(([key, value], index) => ({
        id: `tc-${index}`,
        name: key,
        value: String(value),
        unit: '',
        tolerance: '',
        notes: '',
        category: 'environmental',
        required: true
      }));
    }
    
    return [];
  };

  const conditions = normalizeTestConditions(protocol.testConditions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<TestCondition | null>(null);
  const [currentTab, setCurrentTab] = useState(0);
  
  const [formData, setFormData] = useState<TestCondition>({
    id: '',
    name: '',
    value: '',
    unit: '',
    tolerance: '',
    category: 'environmental',
    required: false,
    description: ''
  });

  const categories = [
    { value: 'environmental', label: 'Środowiskowe', icon: <TempIcon /> },
    { value: 'mechanical', label: 'Mechaniczne', icon: <SpeedIcon /> },
    { value: 'chemical', label: 'Chemiczne', icon: <ChemIcon /> },
    { value: 'temporal', label: 'Czasowe', icon: <TimerIcon /> },
    { value: 'dimensional', label: 'Wymiarowe', icon: <DimensionIcon /> }
  ];

  const commonConditions = {
    environmental: [
      { name: 'Temperatura', unit: '°C', value: '23', tolerance: '±2' },
      { name: 'Wilgotność względna', unit: '%', value: '50', tolerance: '±5' },
      { name: 'Ciśnienie atmosferyczne', unit: 'kPa', value: '101.3', tolerance: '±1' },
      { name: 'Prędkość powietrza', unit: 'm/s', value: '<0.2', tolerance: '' }
    ],
    mechanical: [
      { name: 'Prędkość rozciągania', unit: 'mm/min', value: '50', tolerance: '±5' },
      { name: 'Siła wstępnego obciążenia', unit: 'N', value: '1', tolerance: '±0.1' },
      { name: 'Sztywność uchwytu', unit: 'N/mm', value: '>1000', tolerance: '' }
    ],
    chemical: [
      { name: 'pH roztworu', unit: '', value: '7.0', tolerance: '±0.1' },
      { name: 'Stężenie roztworu', unit: 'mol/L', value: '0.1', tolerance: '±0.01' },
      { name: 'Czystość odczynnika', unit: '%', value: '>99', tolerance: '' }
    ],
    temporal: [
      { name: 'Czas kondycjonowania', unit: 'h', value: '24', tolerance: '±1' },
      { name: 'Czas badania', unit: 'min', value: '30', tolerance: '±2' },
      { name: 'Częstotliwość pomiarów', unit: 'Hz', value: '1', tolerance: '±0.1' }
    ],
    dimensional: [
      { name: 'Szerokość próbki', unit: 'mm', value: '10', tolerance: '±0.1' },
      { name: 'Grubość próbki', unit: 'mm', value: '2', tolerance: '±0.1' },
      { name: 'Długość pomiarowa', unit: 'mm', value: '50', tolerance: '±1' }
    ]
  };

  const handleAddCondition = () => {
    setEditingCondition(null);
    setFormData({
      id: `condition-${Date.now()}`,
      name: '',
      value: '',
      unit: '',
      tolerance: '',
      category: 'environmental',
      required: false,
      description: ''
    });
    setDialogOpen(true);
  };

  const handleEditCondition = (condition: TestCondition) => {
    setEditingCondition(condition);
    setFormData({ ...condition });
    setDialogOpen(true);
  };

  const handleDeleteCondition = (conditionId: string) => {
    const newConditions = conditions.filter((c: TestCondition) => c.id !== conditionId);
    updateProtocol({ testConditions: newConditions });
  };

  const handleSaveCondition = () => {
    if (!formData.name || !formData.value) return;

    let newConditions;
    if (editingCondition) {
      newConditions = conditions.map((c: TestCondition) =>
        c.id === editingCondition.id ? formData : c
      );
    } else {
      newConditions = [...conditions, formData];
    }

    updateProtocol({ testConditions: newConditions });
    setDialogOpen(false);
    setEditingCondition(null);
  };

  const handleQuickAdd = (category: string, condition: any) => {
    const newCondition: TestCondition = {
      id: `condition-${Date.now()}`,
      name: condition.name,
      value: condition.value,
      unit: condition.unit,
      tolerance: condition.tolerance,
      category: category as any,
      required: false,
      description: ''
    };

    updateProtocol({ testConditions: [...conditions, newCondition] });
  };

  const getConditionsByCategory = (category: string) => {
    return conditions.filter((c: TestCondition) => c.category === category);
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || <TempIcon />;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      environmental: 'primary',
      mechanical: 'secondary',
      chemical: 'success',
      temporal: 'warning',
      dimensional: 'info'
    };
    return colors[category] || 'default';
  };

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Warunki badania
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Zdefiniuj dokładne warunki w jakich ma być przeprowadzone badanie. 
          Uwzględnij parametry środowiskowe, mechaniczne, chemiczne i czasowe.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Panel dodawania warunków */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Dodaj warunki"
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddCondition}
                  variant="contained"
                  size="small"
                >
                  Nowy warunek
                </Button>
              }
            />
            <CardContent>
              <Tabs
                value={currentTab}
                onChange={(e, newValue) => setCurrentTab(newValue)}
                orientation="vertical"
                variant="scrollable"
                sx={{ borderRight: 1, borderColor: 'divider', minHeight: 200 }}
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
                  Szablony {categories[currentTab]?.label.toLowerCase()}:
                </Typography>
                <List dense>
                  {commonConditions[categories[currentTab]?.value as keyof typeof commonConditions]?.map((condition, index) => (
                    <ListItem key={index} divider>
                      <ListItemText
                        primary={condition.name}
                        secondary={`${condition.value} ${condition.unit} ${condition.tolerance}`}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          size="small"
                          onClick={() => handleQuickAdd(categories[currentTab].value, condition)}
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

        {/* Lista warunków */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={`Warunki badania (${conditions.length})`}
              subheader="Wszystkie zdefiniowane parametry"
            />
            <CardContent>
              {conditions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <TempIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Brak zdefiniowanych warunków badania
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddCondition}
                    variant="outlined"
                  >
                    Dodaj pierwszy warunek
                  </Button>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Kategoria</TableCell>
                        <TableCell>Parametr</TableCell>
                        <TableCell>Wartość</TableCell>
                        <TableCell>Jednostka</TableCell>
                        <TableCell>Tolerancja</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Akcje</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {conditions.map((condition: TestCondition) => (
                        <TableRow key={condition.id} hover>
                          <TableCell>
                            <Chip
                              icon={getCategoryIcon(condition.category)}
                              label={categories.find(c => c.value === condition.category)?.label}
                              size="small"
                              color={getCategoryColor(condition.category) as any}
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight="medium">
                                {condition.name}
                              </Typography>
                              {condition.description && (
                                <Typography variant="caption" color="text.secondary">
                                  {condition.description}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontFamily="monospace">
                              {condition.value}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {condition.unit}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color={condition.tolerance ? 'text.primary' : 'text.secondary'}>
                              {condition.tolerance || 'brak'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {condition.required ? (
                              <Chip label="Wymagany" size="small" color="error" variant="filled" />
                            ) : (
                              <Chip label="Opcjonalny" size="small" color="default" variant="outlined" />
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              size="small"
                              onClick={() => handleEditCondition(condition)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDeleteCondition(condition.id)}
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

              {errors.testConditions && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errors.testConditions}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog dodawania/edycji warunku */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCondition ? 'Edytuj warunek badania' : 'Dodaj nowy warunek badania'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Nazwa parametru"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                placeholder="np. Temperatura"
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

            <Grid item xs={12} md={4}>
              <TextField
                label="Wartość"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                fullWidth
                required
                placeholder="np. 23"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Jednostka"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                fullWidth
                placeholder="np. °C"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Tolerancja"
                value={formData.tolerance}
                onChange={(e) => setFormData({ ...formData, tolerance: e.target.value })}
                fullWidth
                placeholder="np. ±2"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Opis (opcjonalny)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={2}
                placeholder="Dodatkowe informacje o parametrze"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant={formData.required ? 'contained' : 'outlined'}
                  color={formData.required ? 'error' : 'primary'}
                  startIcon={formData.required ? <WarningIcon /> : undefined}
                  onClick={() => setFormData({ ...formData, required: !formData.required })}
                >
                  {formData.required ? 'Parametr wymagany' : 'Parametr opcjonalny'}
                </Button>
                <Typography variant="caption" color="text.secondary">
                  Parametry wymagane muszą być spełnione do przeprowadzenia badania
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Anuluj</Button>
          <Button 
            onClick={handleSaveCondition}
            variant="contained"
            disabled={!formData.name || !formData.value}
          >
            {editingCondition ? 'Zapisz zmiany' : 'Dodaj warunek'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TestConditionsEditor;
