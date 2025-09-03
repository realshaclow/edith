import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import { EditStudyFormData, EditStudyValidation } from '../types';
import { Protocol } from '../../../../hooks/useProtocols';
import { usePredefinedProtocols } from '../../../../hooks/usePredefinedProtocols';

interface ProtocolSelectionStepProps {
  formData: EditStudyFormData;
  validation: EditStudyValidation;
  onUpdate: (field: keyof EditStudyFormData, value: any) => void;
}

const ProtocolSelectionStep: React.FC<ProtocolSelectionStepProps> = ({
  formData,
  validation,
  onUpdate,
}) => {
  const { protocols, isLoading, error } = usePredefinedProtocols();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filteredProtocols, setFilteredProtocols] = useState<Protocol[]>([]);

  useEffect(() => {
    if (!protocols) return;

    let filtered = protocols;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(protocol => protocol.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(protocol =>
        protocol.title.toLowerCase().includes(term) ||
        protocol.description?.toLowerCase().includes(term) ||
        protocol.overview?.purpose.toLowerCase().includes(term)
      );
    }

    setFilteredProtocols(filtered);
  }, [protocols, searchTerm, selectedCategory]);

  const categories = [
    { value: 'all', label: 'Wszystkie kategorie' },
    { value: 'mechanical', label: 'Mechaniczne' },
    { value: 'chemical', label: 'Chemiczne' },
    { value: 'physical', label: 'Fizyczne' },
    { value: 'thermal', label: 'Termiczne' },
    { value: 'electrical', label: 'Elektryczne' },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'basic': return 'Podstawowy';
      case 'intermediate': return 'Średni';
      case 'advanced': return 'Zaawansowany';
      default: return difficulty;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'mechanical': return 'Mechaniczne';
      case 'chemical': return 'Chemiczne';
      case 'physical': return 'Fizyczne';
      case 'thermal': return 'Termiczne';
      case 'electrical': return 'Elektryczne';
      default: return category;
    }
  };

  const handleProtocolSelect = (protocol: Protocol) => {
    onUpdate('protocol', protocol);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        Błąd podczas ładowania protokołów: {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Search and filters */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Wyszukaj protokół badawczy
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder="Wyszukaj protokół po nazwie lub opisie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Kategoria</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Kategoria"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {formData.protocol && (
            <Alert severity="success" icon={<CheckIcon />}>
              Wybrany protokół: <strong>{formData.protocol.title}</strong>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Protocol list */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Dostępne protokoły ({filteredProtocols.length})
          </Typography>

          {filteredProtocols.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              Nie znaleziono protokołów spełniających kryteria wyszukiwania
            </Typography>
          ) : (
            <List>
              {filteredProtocols.map((protocol) => (
                <ListItem
                  key={protocol.id}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 2,
                    backgroundColor: formData.protocol?.id === protocol.id ? 'action.selected' : 'background.paper',
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="h6">
                          {protocol.title}
                        </Typography>
                        <Chip
                          label={getCategoryLabel(protocol.category)}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={getDifficultyLabel(protocol.difficulty)}
                          size="small"
                          color={getDifficultyColor(protocol.difficulty) as any}
                        />
                        {protocol.estimatedDuration && (
                          <Chip
                            label={protocol.estimatedDuration}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {protocol.description}
                        </Typography>
                        {protocol.overview && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Cel:</strong> {protocol.overview.purpose}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Button
                        variant={formData.protocol?.id === protocol.id ? "contained" : "outlined"}
                        size="small"
                        onClick={() => handleProtocolSelect(protocol)}
                        startIcon={formData.protocol?.id === protocol.id ? <CheckIcon /> : undefined}
                      >
                        {formData.protocol?.id === protocol.id ? 'Wybrany' : 'Wybierz'}
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        startIcon={<InfoIcon />}
                        href={`/protocols/${protocol.id}`}
                        target="_blank"
                      >
                        Szczegóły
                      </Button>
                    </Box>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Selected protocol preview */}
      {formData.protocol && (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Wybrany protokół
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6">{formData.protocol.title}</Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {formData.protocol.description}
                </Typography>
                {formData.protocol.overview && (
                  <Typography variant="body2">
                    <strong>Cel:</strong> {formData.protocol.overview.purpose}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Chip
                    label={getCategoryLabel(formData.protocol.category)}
                    variant="outlined"
                  />
                  <Chip
                    label={getDifficultyLabel(formData.protocol.difficulty)}
                    color={getDifficultyColor(formData.protocol.difficulty) as any}
                  />
                  {formData.protocol.estimatedDuration && (
                    <Chip
                      label={formData.protocol.estimatedDuration}
                      variant="outlined"
                    />
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {!validation.protocol && formData.protocol === null && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Proszę wybrać protokół badawczy aby kontynuować
        </Alert>
      )}
    </Box>
  );
};

export default ProtocolSelectionStep;
