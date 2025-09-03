import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { EditStudyFormData, EditStudyValidation } from '../types';

interface TeamStepProps {
  formData: EditStudyFormData;
  validation: EditStudyValidation;
  onUpdate: (field: keyof EditStudyFormData, value: any) => void;
  onAddCollaborator: (collaborator: string) => void;
  onRemoveCollaborator: (collaborator: string) => void;
}

const TeamStep: React.FC<TeamStepProps> = ({
  formData,
  validation,
  onUpdate,
  onAddCollaborator,
  onRemoveCollaborator,
}) => {
  const [newCollaborator, setNewCollaborator] = useState('');

  const handleAddCollaborator = () => {
    if (newCollaborator.trim()) {
      onAddCollaborator(newCollaborator.trim());
      setNewCollaborator('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleAddCollaborator();
    }
  };

  return (
    <Box>
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Główny badacz
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Podaj dane osoby odpowiedzialnej za przeprowadzenie badania.
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Imię i nazwisko badacza"
                value={formData.researcher}
                onChange={(e) => onUpdate('researcher', e.target.value)}
                error={!validation.researcher && formData.researcher.length > 0}
                helperText={
                  !validation.researcher && formData.researcher.length > 0
                    ? 'Wprowadź imię i nazwisko badacza'
                    : 'Osoba odpowiedzialna za badanie'
                }
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dział/Instytucja"
                value={formData.department}
                onChange={(e) => onUpdate('department', e.target.value)}
                error={!validation.department && formData.department.length > 0}
                helperText={
                  !validation.department && formData.department.length > 0
                    ? 'Wprowadź nazwę działu lub instytucji'
                    : 'Jednostka organizacyjna'
                }
                required
                placeholder="np. Wydział Inżynierii Materiałowej"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Współpracownicy
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Dodaj osoby, które będą uczestniczyć w badaniu lub mają dostęp do jego wyników.
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <TextField
              fullWidth
              label="Email współpracownika"
              value={newCollaborator}
              onChange={(e) => setNewCollaborator(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="np. jan.kowalski@uniwersytet.pl"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddCollaborator}
              disabled={!newCollaborator.trim()}
              startIcon={<AddIcon />}
              sx={{ minWidth: 'auto', px: 2 }}
            >
              Dodaj
            </Button>
          </Box>

          {formData.collaborators.length > 0 ? (
            <List>
              {formData.collaborators.map((collaborator, index) => (
                <ListItem
                  key={index}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={collaborator}
                    secondary="Współpracownik"
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => onRemoveCollaborator(collaborator)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          ) : (
            <Alert severity="info">
              Brak współpracowników. Możesz dodać ich później.
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Team preview */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Podsumowanie zespołu
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Główny badacz
                </Typography>
                <Typography variant="h6">
                  {formData.researcher || 'Nie określono'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formData.department || 'Brak jednostki'}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Współpracownicy
                </Typography>
                <Typography variant="h6">
                  {formData.collaborators.length} osób
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {formData.collaborators.slice(0, 3).map((collaborator, index) => (
                    <Chip
                      key={index}
                      label={collaborator.split('@')[0]}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {formData.collaborators.length > 3 && (
                    <Chip
                      label={`+${formData.collaborators.length - 3} więcej`}
                      size="small"
                      variant="outlined"
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {(!validation.researcher || !validation.department) && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Proszę uzupełnić dane głównego badacza aby kontynuować
        </Alert>
      )}
    </Box>
  );
};

export default TeamStep;
