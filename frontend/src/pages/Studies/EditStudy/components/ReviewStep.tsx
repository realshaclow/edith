import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Cancel as ErrorIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Label as TagIcon,
  Science as ProtocolIcon,
  Assignment as StudyIcon,
} from '@mui/icons-material';
import { EditStudyFormData, EditStudyValidation, EditStudyMode } from '../types';
import { Study } from '../../../../types';
import { 
  getStatusLabel, 
  getStatusColor, 
  getPriorityLabel, 
  getPriorityColor,
  formatDuration 
} from '../utils';

interface ReviewStepProps {
  formData: EditStudyFormData;
  validation: EditStudyValidation;
  originalStudy: Study | null;
  mode: EditStudyMode;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  validation,
  originalStudy,
  mode,
}) => {
  const validationItems = [
    { field: 'title', label: 'Nazwa badania', valid: validation.title },
    { field: 'description', label: 'Opis badania', valid: validation.description },
    { field: 'protocol', label: 'Protokół badawczy', valid: validation.protocol },
    { field: 'researcher', label: 'Główny badacz', valid: validation.researcher },
    { field: 'department', label: 'Dział/Instytucja', valid: validation.department },
    { field: 'dateRange', label: 'Harmonogram', valid: validation.dateRange },
  ];

  const requiredFields = validationItems.filter(item => 
    ['title', 'description', 'protocol', 'researcher', 'department'].includes(item.field)
  );
  
  const optionalFields = validationItems.filter(item => 
    !['title', 'description', 'protocol', 'researcher', 'department'].includes(item.field)
  );

  const allRequiredValid = requiredFields.every(item => item.valid);
  const completionPercentage = Math.round(
    (validationItems.filter(item => item.valid).length / validationItems.length) * 100
  );

  return (
    <Box>
      {/* Validation status */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Status walidacji
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h4" color={allRequiredValid ? 'success.main' : 'warning.main'}>
              {completionPercentage}%
            </Typography>
            <Box>
              <Typography variant="body1">
                Postęp wypełnienia formularza
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {allRequiredValid ? 'Wszystkie wymagane pola wypełnione' : 'Niektóre wymagane pola wymagają uwagi'}
              </Typography>
            </Box>
          </Box>

          <Alert 
            severity={allRequiredValid ? 'success' : 'warning'}
            icon={allRequiredValid ? <CheckIcon /> : <ErrorIcon />}
          >
            {allRequiredValid 
              ? 'Formularz jest gotowy do zapisania'
              : 'Proszę uzupełnić wszystkie wymagane pola przed zapisaniem'
            }
          </Alert>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Wymagane pola:
            </Typography>
            <List dense>
              {requiredFields.map((item) => (
                <ListItem key={item.field}>
                  <ListItemIcon>
                    {item.valid ? (
                      <CheckIcon color="success" />
                    ) : (
                      <ErrorIcon color="error" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    secondary={item.valid ? 'Wypełnione' : 'Wymaga uzupełnienia'}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </CardContent>
      </Card>

      {/* Study summary */}
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Podsumowanie badania
          </Typography>
          
          <Grid container spacing={3}>
            {/* Basic info */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <StudyIcon color="primary" />
                  <Typography variant="h6">Podstawowe informacje</Typography>
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Nazwa:</strong> {formData.title || 'Nie określono'}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  <strong>Opis:</strong> {formData.description || 'Nie określono'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip
                    label={getStatusLabel(formData.status)}
                    color={getStatusColor(formData.status)}
                    size="small"
                  />
                  <Chip
                    label={getPriorityLabel(formData.priority)}
                    color={getPriorityColor(formData.priority)}
                    size="small"
                  />
                  {formData.isPublic && (
                    <Chip label="Publiczne" color="info" size="small" />
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Protocol */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ProtocolIcon color="primary" />
                  <Typography variant="h6">Protokół</Typography>
                </Box>
                
                {formData.protocol ? (
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      {formData.protocol.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {formData.protocol.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label={formData.protocol.category} size="small" variant="outlined" />
                      <Chip label={formData.protocol.difficulty} size="small" variant="outlined" />
                    </Box>
                  </Box>
                ) : (
                  <Typography color="error">Nie wybrano protokołu</Typography>
                )}
              </Paper>
            </Grid>

            {/* Team */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PersonIcon color="primary" />
                  <Typography variant="h6">Zespół</Typography>
                </Box>
                
                <Typography variant="body1" gutterBottom>
                  <strong>Badacz:</strong> {formData.researcher || 'Nie określono'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>Dział:</strong> {formData.department || 'Nie określono'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Współpracownicy:</strong> {formData.collaborators.length} osób
                </Typography>
              </Paper>
            </Grid>

            {/* Timeline */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <ScheduleIcon color="primary" />
                  <Typography variant="h6">Harmonogram</Typography>
                </Box>
                
                <Typography variant="body2" gutterBottom>
                  <strong>Rozpoczęcie:</strong> {
                    formData.startDate 
                      ? formData.startDate.toLocaleDateString('pl-PL')
                      : 'Nie określono'
                  }
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Zakończenie:</strong> {
                    formData.endDate 
                      ? formData.endDate.toLocaleDateString('pl-PL')
                      : 'Nie określono'
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Czas trwania:</strong> {formatDuration(formData.startDate, formData.endDate)}
                </Typography>
              </Paper>
            </Grid>

            {/* Tags */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TagIcon color="primary" />
                  <Typography variant="h6">Tagi</Typography>
                </Box>
                
                {formData.tags.length > 0 ? (
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
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Brak tagów
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Changes summary (for edit mode) */}
      {mode === 'edit' && originalStudy && (
        <Card variant="outlined" sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Podsumowanie zmian
            </Typography>
            
            <Alert severity="info" icon={<InfoIcon />}>
              {mode === 'edit' 
                ? 'Edytujesz istniejące badanie. Zmiany zostaną zapisane po kliknięciu "Zapisz zmiany".'
                : 'Tworzysz nowe badanie. Po zapisaniu badanie zostanie dodane do systemu.'
              }
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Action confirmation */}
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Gotowy do zapisania?
          </Typography>
          
          {allRequiredValid ? (
            <Alert severity="success">
              Wszystkie wymagane dane zostały wypełnione. Możesz teraz zapisać badanie.
            </Alert>
          ) : (
            <Alert severity="warning">
              Niektóre wymagane pola nie zostały wypełnione. Uzupełnij je aby móc zapisać badanie.
            </Alert>
          )}

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Po zapisaniu badania będziesz mógł:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="• Edytować dane badania" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Rozpocząć zbieranie danych" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Monitorować postęp" />
              </ListItem>
              <ListItem>
                <ListItemText primary="• Generować raporty" />
              </ListItem>
            </List>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReviewStep;
