import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Lightbulb as IdeaIcon,
  TrendingUp as ImprovementIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { StudyExecution } from '../../types/professional';

interface RecommendationsPanelProps {
  execution: StudyExecution;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  execution
}) => {
  const completedSteps = execution.steps.filter(step => step.isCompleted).length;
  const totalSteps = execution.steps.length;
  const successRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  const failedSteps = execution.steps.filter(step => !step.isCompleted).length;

  const generateRecommendations = () => {
    const recommendations = [];

    // Success rate analysis
    if (successRate >= 95) {
      recommendations.push({
        type: 'success' as const,
        icon: <SuccessIcon />,
        title: 'Doskonała wydajność',
        description: 'Badanie przebiegło bez większych problemów. Wszystkie próbki zostały przetestowane pomyślnie.',
        priority: 'low' as const
      });
    } else if (successRate >= 85) {
      recommendations.push({
        type: 'info' as const,
        icon: <InfoIcon />,
        title: 'Dobra wydajność',
        description: 'Badanie przebiegło w większości pomyślnie. Niewielka liczba próbek wymagała dodatkowej uwagi.',
        priority: 'low' as const
      });
    } else if (failedSteps > 0) {
      recommendations.push({
        type: 'warning' as const,
        icon: <WarningIcon />,
        title: 'Problemy z niektórymi krokami',
        description: `${failedSteps} kroków nie zostało ukończonych pomyślnie. Zaleca się sprawdzenie warunków testowych i procedur badania.`,
        priority: 'high' as const
      });
    }

    // Environmental conditions analysis
    const temp = execution.environment.temperature;
    const humidity = execution.environment.humidity;
    
    if (temp && (temp < 18 || temp > 25)) {
      recommendations.push({
        type: 'info' as const,
        icon: <IdeaIcon />,
        title: 'Temperatura poza standardem',
        description: `Temperatura ${temp}°C jest poza standardowym zakresem 18-25°C. Może to wpłynąć na wyniki badania.`,
        priority: 'medium' as const
      });
    }

    if (humidity && (humidity < 40 || humidity > 65)) {
      recommendations.push({
        type: 'info' as const,
        icon: <IdeaIcon />,
        title: 'Wilgotność poza standardem',
        description: `Wilgotność ${humidity}% RH jest poza standardowym zakresem 40-65% RH. Może to wpłynąć na wyniki badania.`,
        priority: 'medium' as const
      });
    }

    // Quality improvements
    recommendations.push({
      type: 'info' as const,
      icon: <ImprovementIcon />,
      title: 'Możliwości usprawnienia',
      description: 'Rozważ dokumentację dodatkowych obserwacji podczas przyszłych badań dla lepszej analizy wyników.',
      priority: 'low' as const
    });

    // Data archival
    recommendations.push({
      type: 'info' as const,
      icon: <InfoIcon />,
      title: 'Archiwizacja danych',
      description: 'Zaleca się eksport wyników do pliku oraz archiwizację danych badania zgodnie z procedurami laboratoryjnymi.',
      priority: 'medium' as const
    });

    return recommendations;
  };

  const recommendations = generateRecommendations();
  const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
  const sortedRecommendations = recommendations.sort((a, b) => 
    priorityOrder[b.priority] - priorityOrder[a.priority]
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'primary';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Wysokiy';
      case 'medium': return 'Średni';
      default: return 'Niski';
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <IdeaIcon color="primary" />
        <Typography variant="h6" fontWeight="bold">
          Rekomendacje i Analiza
        </Typography>
      </Box>

      {/* Overall Assessment */}
      <Alert 
        severity={successRate >= 90 ? 'success' : successRate >= 70 ? 'info' : 'warning'}
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle2" fontWeight="bold">
          Ogólna ocena badania: {successRate >= 90 ? 'Doskonała' : successRate >= 70 ? 'Dobra' : 'Wymaga uwagi'}
        </Typography>
        <Typography variant="body2">
          {successRate >= 90 
            ? 'Badanie przebiegło zgodnie z oczekiwaniami. Wszystkie główne cele zostały osiągnięte.'
            : successRate >= 70
            ? 'Badanie przebiegło w większości pomyślnie, z niewielkimi odchyleniami od normy.'
            : 'Badanie wykazało niektóre problemy, które wymagają analizy i ewentualnych działań korygujących.'
          }
        </Typography>
      </Alert>

      {/* Recommendations List */}
      <List>
        {sortedRecommendations.map((recommendation, index) => (
          <ListItem key={index} sx={{ px: 0, alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ mt: 0.5 }}>
              {recommendation.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {recommendation.title}
                  </Typography>
                  <Chip 
                    label={getPriorityLabel(recommendation.priority)}
                    color={getPriorityColor(recommendation.priority) as any}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {recommendation.description}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>

      {/* Next Steps */}
      <Box 
        sx={{ 
          mt: 3, 
          p: 2, 
          bgcolor: 'primary.light', 
          color: 'primary.contrastText',
          borderRadius: 1 
        }}
      >
        <Typography variant="subtitle2" fontWeight="bold" mb={1}>
          Następne kroki:
        </Typography>
        <Typography variant="body2">
          1. Przejrzyj wszystkie wyniki i notatki z badania<br/>
          2. Eksportuj raport w formacie PDF lub Excel<br/>
          3. Zachowaj kopię zapasową danych<br/>
          4. Udokumentuj wnioski w systemie laboratoryjnym
        </Typography>
      </Box>
    </Paper>
  );
};
