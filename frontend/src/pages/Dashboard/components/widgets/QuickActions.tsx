import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  Add,
  PlayArrow,
  Description,
  Settings,
  People,
  Storage,
  Refresh,
  Download,
  Upload,
  Science
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onRefreshData?: () => void;
  pendingReports?: number;
  activeStudies?: number;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onRefreshData,
  pendingReports = 0,
  activeStudies = 0
}) => {
  const navigate = useNavigate();

  const primaryActions = [
    {
      title: 'Nowe badanie',
      description: 'Utwórz nowe badanie laboratoryjne',
      icon: <Add />,
      color: 'primary' as const,
      onClick: () => navigate('/studies/create'),
      featured: true
    },
    {
      title: 'Wykonaj badanie',
      description: 'Kontynuuj lub rozpocznij wykonywanie',
      icon: <PlayArrow />,
      color: 'success' as const,
      onClick: () => navigate('/studies'),
      badge: activeStudies,
      featured: true
    },
    {
      title: 'Nowy protokół',
      description: 'Dodaj protokół badawczy',
      icon: <Science />,
      color: 'info' as const,
      onClick: () => navigate('/protocols/create'),
      featured: true
    },
    {
      title: 'Generuj raport',
      description: 'Utwórz raport z badań',
      icon: <Description />,
      color: 'secondary' as const,
      onClick: () => navigate('/reports'),
      badge: pendingReports,
      featured: true
    }
  ];

  const secondaryActions = [
    {
      title: 'Ustawienia',
      icon: <Settings />,
      onClick: () => navigate('/settings'),
      tooltip: 'Konfiguracja systemu'
    },
    {
      title: 'Użytkownicy',
      icon: <People />,
      onClick: () => navigate('/users'),
      tooltip: 'Zarządzanie użytkownikami'
    },
    {
      title: 'Backup',
      icon: <Storage />,
      onClick: () => console.log('Backup'),
      tooltip: 'Kopia zapasowa danych'
    },
    {
      title: 'Export',
      icon: <Download />,
      onClick: () => console.log('Export'),
      tooltip: 'Eksport danych'
    },
    {
      title: 'Import',
      icon: <Upload />,
      onClick: () => console.log('Import'),
      tooltip: 'Import danych'
    },
    {
      title: 'Odśwież',
      icon: <Refresh />,
      onClick: onRefreshData,
      tooltip: 'Odśwież dane dashboardu'
    }
  ];

  return (
    <Card>
      <CardHeader title="Szybkie akcje" />
      <CardContent>
        {/* Primary Actions - Featured buttons */}
        <Grid container spacing={2} mb={3}>
          {primaryActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Button
                fullWidth
                variant="contained"
                color={action.color}
                size="large"
                startIcon={
                  action.badge ? (
                    <Badge badgeContent={action.badge} color="error">
                      {action.icon}
                    </Badge>
                  ) : (
                    action.icon
                  )
                }
                onClick={action.onClick}
                sx={{
                  height: 80,
                  flexDirection: 'column',
                  gap: 1,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 4
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Typography variant="subtitle2" fontWeight="bold">
                  {action.title}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {action.description}
                </Typography>
              </Button>
            </Grid>
          ))}
        </Grid>

        {/* Secondary Actions - Compact icon buttons */}
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Narzędzia administracyjne
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {secondaryActions.map((action, index) => (
              <Tooltip key={index} title={action.tooltip} arrow>
                <IconButton
                  onClick={action.onClick}
                  size="medium"
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  {action.icon}
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box mt={3} p={2} bgcolor="background.default" borderRadius={2}>
          <Typography variant="subtitle2" gutterBottom>
            Statystyki dzisiejszego dnia
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Typography variant="h6" color="primary.main">
                  {Math.floor(Math.random() * 10) + 1}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Nowe badania
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Typography variant="h6" color="success.main">
                  {Math.floor(Math.random() * 5) + 1}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Ukończone
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Box textAlign="center">
                <Typography variant="h6" color="info.main">
                  {Math.floor(Math.random() * 20) + 10}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Próbki
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
