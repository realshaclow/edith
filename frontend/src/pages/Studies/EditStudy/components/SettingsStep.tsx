import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Chip,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Label as TagIcon,
} from '@mui/icons-material';
import { EditStudyFormData, EditStudyValidation } from '../types';
import { getPriorityLabel, getPriorityColor } from '../utils';

interface SettingsStepProps {
  formData: EditStudyFormData;
  validation: EditStudyValidation;
  onUpdate: (field: keyof EditStudyFormData, value: any) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

const SettingsStep: React.FC<SettingsStepProps> = ({
  formData,
  validation,
  onUpdate,
  onAddTag,
  onRemoveTag,
}) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddTag();
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Niski', color: 'success' },
    { value: 'medium', label: 'Średni', color: 'info' },
    { value: 'high', label: 'Wysoki', color: 'warning' },
    { value: 'critical', label: 'Krytyczny', color: 'error' },
  ];

  const suggestedTags = [
    'badania materiałowe',
    'testy mechaniczne',
    'kontrola jakości',
    'R&D',
    'certyfikacja',
    'normy ISO',
    'ASTM',
    'wytrzymałość',
    'termodynamika',
    'chemia',
  ];

  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Priorytet badania
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Określ priorytet badania, który pomoże w planowaniu i alokacji zasobów.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priorytet</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priorytet"
                  onChange={(e) => onUpdate('priority', e.target.value)}
                >
                  {priorityOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={option.label}
                          size="small"
                          color={option.color as any}
                        />
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                <Chip
                  label={`Aktualny priorytet: ${getPriorityLabel(formData.priority)}`}
                  color={getPriorityColor(formData.priority)}
                  size="medium"
                />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Widoczność i dostęp
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Określ, kto może przeglądać to badanie i jego wyniki.
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isPublic}
                onChange={(e) => onUpdate('isPublic', e.target.checked)}
              />
            }
            label="Publiczne badanie"
          />
          <Typography variant="caption" color="text.secondary" display="block">
            {formData.isPublic
              ? 'Badanie będzie widoczne dla wszystkich użytkowników systemu'
              : 'Badanie będzie widoczne tylko dla zespołu i współpracowników'
            }
          </Typography>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tagi
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Dodaj tagi, które pomogą w organizacji i wyszukiwaniu badań.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Nowy tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="np. badania materiałowe"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleAddTag}
              disabled={!newTag.trim()}
              startIcon={<AddIcon />}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Dodaj
            </Button>
          </Box>

          {/* Current tags */}
          {formData.tags.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Dodane tagi:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => onRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                    icon={<TagIcon />}
                  />
                ))}
              </Box>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Suggested tags */}
          <Typography variant="subtitle2" gutterBottom>
            Sugerowane tagi:
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {suggestedTags
              .filter(tag => !formData.tags.includes(tag))
              .map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onClick={() => onAddTag(tag)}
                  variant="outlined"
                  size="small"
                  sx={{ cursor: 'pointer' }}
                />
              ))}
          </Box>
        </CardContent>
      </Card>

      {/* Settings preview */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Podsumowanie ustawień
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Priorytet
                </Typography>
                <Chip
                  label={getPriorityLabel(formData.priority)}
                  color={getPriorityColor(formData.priority)}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Widoczność
                </Typography>
                <Chip
                  label={formData.isPublic ? 'Publiczne' : 'Prywatne'}
                  color={formData.isPublic ? 'success' : 'secondary'}
                />
              </Box>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Liczba tagów
                </Typography>
                <Typography variant="h6">
                  {formData.tags.length}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {formData.tags.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tagi:
              </Typography>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {formData.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      <Alert severity="info" sx={{ mt: 2 }}>
        Wszystkie ustawienia można zmienić później w panelu edycji badania.
      </Alert>
    </Box>
  );
};

export default SettingsStep;
