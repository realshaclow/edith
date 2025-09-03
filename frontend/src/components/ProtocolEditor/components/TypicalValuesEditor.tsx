import React, { useState } from 'react';
import { TypicalValue } from '../types/protocol';
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
  Science as ParameterIcon,
  TrendingUp as ValueIcon,
  DataUsage as RangeIcon,
  Assignment as MaterialIcon,
  Category as CategoryIcon
} from '@mui/icons-material';

interface TypicalValuesEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const TypicalValuesEditor: React.FC<TypicalValuesEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  // Normalize typicalValues to always be an array
  const normalizeTypicalValues = (values: any): TypicalValue[] => {
    if (!values) return [];
    if (Array.isArray(values)) return values;
    
    // If it's an object (key-value pairs), convert to array
    if (typeof values === 'object') {
      return Object.entries(values).map(([key, value], index) => ({
        id: `tv-${index}`,
        parameter: key,
        material: '',
        value: String(value),
        unit: '',
        range: { min: '', max: '' },
        conditions: '',
        category: 'mechanical',
        source: '',
        notes: '',
        isReference: false
      }));
    }
    
    return [];
  };

  const typicalValues = normalizeTypicalValues(protocol.typicalValues);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingValue, setEditingValue] = useState<TypicalValue | null>(null);
  const [currentCategory, setCurrentCategory] = useState('mechanical');
  
  const [formData, setFormData] = useState<TypicalValue>({
    id: '',
    parameter: '',
    material: '',
    value: '',
    unit: '',
    range: {
      min: '',
      max: ''
    },
    conditions: '',
    category: 'mechanical',
    source: '',
    notes: '',
    isReference: false
  });

  const categories = [
    { value: 'mechanical', label: 'Właściwości mechaniczne', icon: <ParameterIcon />, color: 'primary' },
    { value: 'thermal', label: 'Właściwości termiczne', icon: <ValueIcon />, color: 'error' },
    { value: 'electrical', label: 'Właściwości elektryczne', icon: <RangeIcon />, color: 'warning' },
    { value: 'chemical', label: 'Właściwości chemiczne', icon: <MaterialIcon />, color: 'success' },
    { value: 'dimensional', label: 'Właściwości wymiarowe', icon: <CategoryIcon />, color: 'info' },
    { value: 'optical', label: 'Właściwości optyczne', icon: <ValueIcon />, color: 'secondary' }
  ];

  const commonValues = {
    mechanical: [
      { parameter: 'Wytrzymałość na rozciąganie', value: '25', unit: 'MPa', range: { min: '20', max: '30' }, material: 'PE-HD', conditions: '23°C, 50mm/min' },
      { parameter: 'Moduł sprężystości', value: '1000', unit: 'MPa', range: { min: '800', max: '1200' }, material: 'PE-HD', conditions: '23°C' },
      { parameter: 'Wydłużenie przy zerwaniu', value: '600', unit: '%', range: { min: '500', max: '800' }, material: 'PE-HD', conditions: '23°C, 50mm/min' },
      { parameter: 'Twardość Shore D', value: '60', unit: '-', range: { min: '55', max: '65' }, material: 'PE-HD', conditions: '23°C' }
    ],
    thermal: [
      { parameter: 'Temperatura topnienia', value: '130', unit: '°C', range: { min: '125', max: '135' }, material: 'PE-HD', conditions: 'DSC, 10°C/min' },
      { parameter: 'Temperatura zeszklenia', value: '-120', unit: '°C', range: { min: '-125', max: '-115' }, material: 'PE-HD', conditions: 'DSC' },
      { parameter: 'Współczynnik rozszerzalności', value: '200', unit: '10⁻⁶/K', range: { min: '180', max: '220' }, material: 'PE-HD', conditions: '20-100°C' }
    ],
    electrical: [
      { parameter: 'Rezystywność', value: '10¹⁶', unit: 'Ω·cm', range: { min: '10¹⁵', max: '10¹⁷' }, material: 'PE-HD', conditions: '23°C, 50% RH' },
      { parameter: 'Stała dielektryczna', value: '2.3', unit: '-', range: { min: '2.2', max: '2.4' }, material: 'PE-HD', conditions: '1 kHz, 23°C' }
    ],
    chemical: [
      { parameter: 'Gęstość', value: '0.95', unit: 'g/cm³', range: { min: '0.93', max: '0.97' }, material: 'PE-HD', conditions: '23°C' },
      { parameter: 'Wskaźnik płynięcia', value: '0.3', unit: 'g/10min', range: { min: '0.2', max: '0.4' }, material: 'PE-HD', conditions: '190°C, 2.16kg' },
      { parameter: 'Zawartość wody', value: '0.01', unit: '%', range: { min: '0.005', max: '0.02' }, material: 'PE-HD', conditions: 'Karl Fischer' }
    ],
    dimensional: [
      { parameter: 'Skurcz objętościowy', value: '2.0', unit: '%', range: { min: '1.5', max: '2.5' }, material: 'PE-HD', conditions: 'Wtrysk, 23°C' },
      { parameter: 'Tolerancja wymiarowa', value: '±0.1', unit: 'mm', range: { min: '±0.05', max: '±0.2' }, material: 'PE-HD', conditions: 'Wtrysk' }
    ],
    optical: [
      { parameter: 'Współczynnik załamania', value: '1.54', unit: '-', range: { min: '1.53', max: '1.55' }, material: 'PE-HD', conditions: '589 nm, 23°C' },
      { parameter: 'Przepuszczalność światła', value: '85', unit: '%', range: { min: '80', max: '90' }, material: 'PE-HD', conditions: 'Grubość 2mm' }
    ]
  };

  const handleAddValue = () => {
    setEditingValue(null);
    setFormData({
      id: `value-${Date.now()}`,
      parameter: '',
      material: '',
      value: '',
      unit: '',
      range: {
        min: '',
        max: ''
      },
      conditions: '',
      category: 'mechanical',
      source: '',
      notes: '',
      isReference: false
    });
    setDialogOpen(true);
  };

  const handleEditValue = (value: TypicalValue) => {
    setEditingValue(value);
    setFormData({ ...value });
    setDialogOpen(true);
  };

  const handleDeleteValue = (valueId: string) => {
    const newValues = typicalValues.filter((v: TypicalValue) => v.id !== valueId);
    updateProtocol({ typicalValues: newValues });
  };

  const handleSaveValue = () => {
    if (!formData.parameter || !formData.value || !formData.unit) return;

    let newValues;
    if (editingValue) {
      newValues = typicalValues.map((v: TypicalValue) =>
        v.id === editingValue.id ? formData : v
      );
    } else {
      newValues = [...typicalValues, formData];
    }

    updateProtocol({ typicalValues: newValues });
    setDialogOpen(false);
    setEditingValue(null);
  };

  const handleQuickAdd = (category: string, value: any) => {
    const newValue: TypicalValue = {
      id: `value-${Date.now()}`,
      parameter: value.parameter,
      material: value.material,
      value: value.value,
      unit: value.unit,
      range: value.range,
      conditions: value.conditions,
      category: category as any,
      source: 'Szablon',
      notes: '',
      isReference: true
    };

    updateProtocol({ typicalValues: [...typicalValues, newValue] });
  };

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.value === category) || categories[0];
  };

  const getValuesByCategory = (category: string) => {
    return typicalValues.filter((v: TypicalValue) => v.category === category);
  };

  const formatRange = (range: { min: string; max: string }) => {
    if (!range.min && !range.max) return '-';
    if (!range.min) return `≤ ${range.max}`;
    if (!range.max) return `≥ ${range.min}`;
    return `${range.min} - ${range.max}`;
  };

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Typowe wartości i zakresy
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Zdefiniuj typowe wartości parametrów dla różnych materiałów i warunków badania.
          To pomoże użytkownikom w ocenie wyników i porównaniu z wartościami referencyjnymi.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Panel szablonów */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader
              title="Szablony wartości"
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddValue}
                  variant="contained"
                  size="small"
                >
                  Nowa wartość
                </Button>
              }
            />
            <CardContent>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Kategoria</InputLabel>
                <Select
                  value={currentCategory}
                  onChange={(e) => setCurrentCategory(e.target.value)}
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

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Typowe wartości:
              </Typography>
              
              <List dense>
                {commonValues[currentCategory as keyof typeof commonValues]?.map((value, index) => (
                  <ListItem key={index} divider>
                    <ListItemText
                      primary={value.parameter}
                      secondary={
                        <Box>
                          <Typography variant="caption" component="div">
                            {value.value} {value.unit} ({formatRange(value.range)} {value.unit})
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {value.material} | {value.conditions}
                          </Typography>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        size="small"
                        onClick={() => handleQuickAdd(currentCategory, value)}
                      >
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista wartości */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader
              title={`Wartości referencyjne (${typicalValues.length})`}
              subheader="Wszystkie zdefiniowane wartości typowe"
            />
            <CardContent>
              {typicalValues.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ValueIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Brak zdefiniowanych wartości typowych
                  </Typography>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddValue}
                    variant="outlined"
                  >
                    Dodaj pierwszą wartość
                  </Button>
                </Box>
              ) : (
                <Box>
                  {/* Kategorie jako taby */}
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={1}>
                      {categories.map((category) => {
                        const count = getValuesByCategory(category.value).length;
                        return (
                          <Grid item key={category.value}>
                            <Chip
                              icon={category.icon}
                              label={`${category.label} (${count})`}
                              color={count > 0 ? category.color as any : 'default'}
                              variant={count > 0 ? 'filled' : 'outlined'}
                              size="small"
                            />
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Kategoria</TableCell>
                          <TableCell>Parametr</TableCell>
                          <TableCell>Materiał</TableCell>
                          <TableCell>Wartość</TableCell>
                          <TableCell>Zakres</TableCell>
                          <TableCell>Warunki</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell align="center">Akcje</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {typicalValues.map((value: TypicalValue) => {
                          const categoryInfo = getCategoryInfo(value.category);
                          
                          return (
                            <TableRow key={value.id} hover>
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
                                <Typography variant="body2" fontWeight="medium">
                                  {value.parameter}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2">
                                  {value.material}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                                  {value.value} {value.unit}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {formatRange(value.range)} {value.unit}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="caption" color="text.secondary">
                                  {value.conditions || '-'}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {value.isReference ? (
                                  <Chip label="Referencyjne" size="small" color="primary" variant="filled" />
                                ) : (
                                  <Chip label="Użytkownik" size="small" color="default" variant="outlined" />
                                )}
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  onClick={() => handleEditValue(value)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeleteValue(value.id)}
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
                </Box>
              )}

              {errors.typicalValues && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errors.typicalValues}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Dialog dodawania/edycji wartości */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingValue ? 'Edytuj wartość typową' : 'Dodaj nową wartość typową'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <TextField
                label="Parametr"
                value={formData.parameter}
                onChange={(e) => setFormData({ ...formData, parameter: e.target.value })}
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

            <Grid item xs={12} md={6}>
              <TextField
                label="Materiał"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                fullWidth
                placeholder="np. PE-HD"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Źródło danych"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                fullWidth
                placeholder="np. ISO 527-1:2012"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                label="Wartość typowa"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                fullWidth
                required
                placeholder="25"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                label="Jednostka"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                fullWidth
                required
                placeholder="MPa"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isReference}
                    onChange={(e) => setFormData({ ...formData, isReference: e.target.checked })}
                  />
                }
                label="Wartość referencyjna"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Zakres minimum"
                value={formData.range.min}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  range: { ...formData.range, min: e.target.value }
                })}
                fullWidth
                placeholder="20"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Zakres maksimum"
                value={formData.range.max}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  range: { ...formData.range, max: e.target.value }
                })}
                fullWidth
                placeholder="30"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Warunki badania"
                value={formData.conditions}
                onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                fullWidth
                placeholder="np. 23°C, 50mm/min, próbka standardowa"
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
                placeholder="Dodatkowe informacje o wartości"
              />
            </Grid>

            {/* Podgląd */}
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Podgląd wartości:
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  <strong>{formData.parameter}:</strong> {formData.value} {formData.unit}
                  {(formData.range.min || formData.range.max) && (
                    <span> (zakres: {formatRange(formData.range)} {formData.unit})</span>
                  )}
                </Typography>
                {formData.material && (
                  <Typography variant="body2" color="text.secondary">
                    Materiał: {formData.material}
                  </Typography>
                )}
                {formData.conditions && (
                  <Typography variant="body2" color="text.secondary">
                    Warunki: {formData.conditions}
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Anuluj</Button>
          <Button 
            onClick={handleSaveValue}
            variant="contained"
            disabled={!formData.parameter || !formData.value || !formData.unit}
          >
            {editingValue ? 'Zapisz zmiany' : 'Dodaj wartość'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TypicalValuesEditor;
