import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Refresh,
  Settings,
  Fullscreen,
  Home,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useDashboard } from './hooks/useDashboard';
import StatsOverview from './components/widgets/StatsOverview';
import ActiveStudies from './components/widgets/ActiveStudies';
import PerformanceChart from './components/charts/PerformanceChart';
import SystemAlerts from './components/widgets/SystemAlerts';
import RecentActivity from './components/widgets/RecentActivity';
import QuickActions from './components/widgets/QuickActions';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    stats,
    activeStudies,
    protocolUsage,
    alerts,
    performanceData,
    recentActivity,
    isLoading,
    error,
    markAlertAsRead,
    dismissAlert,
    refreshData
  } = useDashboard();

  const handleStudyClick = (studyId: string) => {
    navigate(`/studies/${studyId}/execute`);
  };

  const handlePauseStudy = (studyId: string) => {
    console.log('Pausing study:', studyId);
    // Here you would implement the pause functionality
  };

  const handleResumeStudy = (studyId: string) => {
    console.log('Resuming study:', studyId);
    // Here you would implement the resume functionality
  };

  const handleAlertAction = (alert: any) => {
    if (alert.actionUrl) {
      navigate(alert.actionUrl);
    }
  };

  const handleShowMoreActivity = () => {
    navigate('/activity');
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box mt={4}>
          <Alert severity="error" action={
            <Button color="inherit" size="small" onClick={refreshData}>
              Spróbuj ponownie
            </Button>
          }>
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 1 }}>
              <Link color="inherit" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                <Home sx={{ mr: 0.5 }} fontSize="inherit" />
                EDITH
              </Link>
              <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                <DashboardIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Dashboard
              </Typography>
            </Breadcrumbs>
            
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Przegląd systemu badań laboratoryjnych EDITH
            </Typography>
          </Box>

          <Box display="flex" gap={1}>
            <Tooltip title="Odśwież dane">
              <IconButton onClick={refreshData} disabled={isLoading}>
                <Refresh sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Ustawienia dashboardu">
              <IconButton onClick={() => navigate('/dashboard/settings')}>
                <Settings sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Pełny ekran">
              <IconButton onClick={() => document.documentElement.requestFullscreen()}>
                <Fullscreen sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {isLoading && (
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <CircularProgress size={20} />
            <Typography variant="body2" color="text.secondary">
              Ładowanie danych dashboardu...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Stats Overview - Full Width */}
        <Grid item xs={12}>
          <StatsOverview stats={stats} isLoading={isLoading} />
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6} lg={4}>
          <QuickActions
            onRefreshData={refreshData}
            pendingReports={Math.floor(Math.random() * 5)}
            activeStudies={activeStudies.length}
          />
        </Grid>

        {/* Active Studies */}
        <Grid item xs={12} md={6} lg={8}>
          <ActiveStudies
            studies={activeStudies}
            isLoading={isLoading}
            onStudyClick={handleStudyClick}
            onPauseStudy={handlePauseStudy}
            onResumeStudy={handleResumeStudy}
          />
        </Grid>

        {/* Performance Chart - Large */}
        <Grid item xs={12} lg={8}>
          <PerformanceChart
            data={performanceData}
            isLoading={isLoading}
          />
        </Grid>

        {/* System Alerts */}
        <Grid item xs={12} lg={4}>
          <SystemAlerts
            alerts={alerts}
            isLoading={isLoading}
            onMarkAsRead={markAlertAsRead}
            onDismiss={dismissAlert}
            onActionClick={handleAlertAction}
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={6}>
          <RecentActivity
            activities={recentActivity}
            isLoading={isLoading}
            onShowMore={handleShowMoreActivity}
          />
        </Grid>

        {/* Protocol Usage Stats */}
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Najpopularniejsze protokoły
            </Typography>
            {isLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                {protocolUsage.slice(0, 5).map((protocol, index) => (
                  <Box key={protocol.id} display="flex" justifyContent="space-between" alignItems="center" py={1}>
                    <Box>
                      <Typography variant="subtitle2">
                        {protocol.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {protocol.category}
                      </Typography>
                    </Box>
                    <Box textAlign="right">
                      <Typography variant="body2" fontWeight="bold">
                        {protocol.usageCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        użyć
                      </Typography>
                    </Box>
                  </Box>
                ))}
                <Button 
                  fullWidth 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => navigate('/protocols')}
                >
                  Zobacz wszystkie protokoły
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Footer */}
      <Box mt={6} py={3} borderTop={1} borderColor="divider">
        <Typography variant="body2" color="text.secondary" textAlign="center">
          EDITH Dashboard - System zarządzania badaniami laboratoryjnymi
        </Typography>
      </Box>
    </Container>
  );
};

export default Dashboard;