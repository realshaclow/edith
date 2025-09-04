import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Thermostat as ThermostatIcon,
  Speed as PressureIcon,
  Straighten as DimensionIcon,
  Schedule as TimeIcon,
  Science as ConditionIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { CreateStudyStepProps } from '../types';

export const TestConditionsStep: React.FC<CreateStudyStepProps> = ({
  studyData,
  protocolData,
  errors,
  onUpdateStudyData,
}) => {
  const theme = useTheme();

  const handleConditionChange = (conditionId: string, field: string, value: string) => {
    const updatedConditions = {
      ...studyData.settings.testConditions,
      [conditionId]: {
        ...studyData.settings.testConditions[conditionId],
        [field]: value,
      },
    };

    onUpdateStudyData({
      settings: {
        ...studyData.settings,
        testConditions: updatedConditions,
      },
    });
  };

  const getConditionIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'temperature':
        return <ThermostatIcon color="primary" />;
      case 'pressure':
        return <PressureIcon color="secondary" />;
      case 'dimension':
        return <DimensionIcon color="info" />;
      case 'time':
        return <TimeIcon color="warning" />;
      default:
        return <ConditionIcon color="action" />;
    }
  };

  const getConditionColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'temperature': return 'primary';
      case 'pressure': return 'secondary';
      case 'dimension': return 'info';
      case 'time': return 'warning';
      default: return 'default';
    }
  };

  const protocolConditions = protocolData?.testConditions || [];

  // Grupowanie warunków po kategoriach
  const groupedConditions = protocolConditions.reduce((groups, condition) => {
    const category = condition.category || 'other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(condition);
    return groups;
  }, {} as Record<string, typeof protocolConditions>);

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        🌡️ Warunki Testowe
      </Typography>

      {protocolConditions.length === 0 ? (
        <Alert severity="info">
          <Typography variant="body2">
            Ten protokół nie definiuje specjalnych warunków testowych. 
            Możesz przejść do następnego kroku.
          </Typography>
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* Informacje ogólne */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Instrukcje:</strong> Poniżej znajdują się warunki testowe zdefiniowane w protokole {protocolData?.title}. 
                Możesz dostosować wartości według swoich wymagań, zachowując tolerancje określone w standardzie.
              </Typography>
            </Alert>
          </Grid>

          {/* Grupy warunków */}
          {Object.entries(groupedConditions).map(([category, conditions]) => (
            <Grid item xs={12} key={category}>
              <Card variant="outlined">
                <CardContent>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2,
                      textTransform: 'capitalize'
                    }}
                  >
                    {getConditionIcon(category)}
                    <Box sx={{ ml: 1 }}>
                      {category === 'other' ? 'Inne warunki' : category}
                    </Box>
                    <Chip 
                      label={`${conditions.length} warunków`} 
                      size="small" 
                      color={getConditionColor(category) as any}
                      variant="outlined"
                      sx={{ ml: 2 }}
                    />
                  </Typography>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Parametr</TableCell>
                          <TableCell>Wartość</TableCell>
                          <TableCell>Jednostka</TableCell>
                          <TableCell>Tolerancja</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {conditions.map((condition) => {
                          const currentValue = studyData.settings.testConditions[condition.id];
                          const displayValue = currentValue?.value || condition.value;
                          
                          return (
                            <TableRow key={condition.id}>
                              <TableCell>
                                <Typography variant="body2" fontWeight={500}>
                                  {condition.name}
                                </Typography>
                                {condition.description && (
                                  <Typography variant="caption" color="text.secondary">
                                    {condition.description}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                <TextField
                                  size="small"
                                  value={displayValue}
                                  onChange={(e) => handleConditionChange(condition.id, 'value', e.target.value)}
                                  error={!!errors?.[`testCondition_${condition.id}`]}
                                  sx={{ width: 120 }}
                                />
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  {condition.unit}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography variant="body2" color="text.secondary">
                                  ±{condition.tolerance}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                {condition.required ? (
                                  <Chip 
                                    label="Wymagany" 
                                    size="small" 
                                    color="error" 
                                    variant="outlined"
                                  />
                                ) : (
                                  <Chip 
                                    label="Opcjonalny" 
                                    size="small" 
                                    color="success" 
                                    variant="outlined"
                                  />
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Wymagania środowiskowe */}
          {protocolData?.safetyGuidelines && protocolData.safetyGuidelines.length > 0 && (
            <Grid item xs={12}>
              <Card 
                variant="outlined"
                sx={{ 
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)',
                  border: `1px solid ${theme.palette.warning.main}20`
                }}
              >
                <CardContent>
                  <Typography variant="h6" color="warning.main" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <WarningIcon sx={{ mr: 1 }} />
                    Wymagania Środowiskowe i Bezpieczeństwa
                  </Typography>
                  
                  <List dense>
                    {protocolData.safetyGuidelines.slice(0, 5).map((guideline, index) => (
                      <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <WarningIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={guideline}
                          primaryTypographyProps={{ fontSize: '0.9rem' }}
                        />
                      </ListItem>
                    ))}
                    {protocolData.safetyGuidelines.length > 5 && (
                      <ListItem sx={{ py: 0.5, pl: 0 }}>
                        <ListItemText 
                          primary={`... i ${protocolData.safetyGuidelines.length - 5} więcej wymagań`}
                          secondary="Zobacz pełną listę w dokumentacji protokołu"
                        />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Podsumowanie */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Podsumowanie Warunków
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Warunków łącznie
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {protocolConditions.length}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Wymaganych
                    </Typography>
                    <Typography variant="h6" color="error">
                      {protocolConditions.filter(c => c.required).length}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Opcjonalnych
                    </Typography>
                    <Typography variant="h6" color="success">
                      {protocolConditions.filter(c => !c.required).length}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Kategorii
                    </Typography>
                    <Typography variant="h6" color="info">
                      {Object.keys(groupedConditions).length}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Wskazówki */}
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Wskazówka:</strong> Upewnij się, że wszystkie wymagane warunki są odpowiednio skonfigurowane. 
                Wartości spoza tolerancji mogą wpłynąć na ważność wyników badania.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
