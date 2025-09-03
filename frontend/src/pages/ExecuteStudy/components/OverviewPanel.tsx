import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  PlayArrow,
  Science,
  Schedule,
  Person,
  Assessment,
  Warning,
  CheckCircle,
  Timer,
  Tune
} from '@mui/icons-material';
import { ExecutionContext, ExecutionSession, ExecutionProgress } from '../types';

interface OverviewPanelProps {
  context: ExecutionContext;
  session: ExecutionSession | null;
  progress: ExecutionProgress;
  onStartExecution: (studyId: string, operator: string) => Promise<boolean>;
}

const OverviewPanel: React.FC<OverviewPanelProps> = ({
  context,
  session,
  progress,
  onStartExecution
}) => {
  const handleStart = () => {
    const operator = 'Current User'; // Should come from auth context
    onStartExecution(context.studyId, operator);
  };

  const getSessionStatusColor = () => {
    if (!session) return 'default';
    switch (session.status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'completed': return 'primary';
      case 'aborted': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Przegląd wykonywania badania
      </Typography>

      <Grid container spacing={3}>
        {/* Study Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
                Informacje o badaniu
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Nazwa badania"
                    secondary={context.studyName || 'Nie określono'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Protokół"
                    secondary={context.protocol.title || 'Nie załadowano'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Kategoria"
                    secondary={context.protocol.category || 'Nie określono'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Poziom trudności"
                    secondary={context.protocol.difficulty || 'Nie określono'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Szacowany czas"
                    secondary={context.protocol.estimatedDuration || 'Nie określono'}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Session Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Status sesji
              </Typography>
              
              {session ? (
                <>
                  <Box mb={2}>
                    <Chip
                      label={session.status.toUpperCase()}
                      color={getSessionStatusColor()}
                      variant="outlined"
                      size="small"
                    />
                  </Box>
                  
                  <List dense>
                    <ListItem>
                      <ListItemIcon>
                        <Person />
                      </ListItemIcon>
                      <ListItemText
                        primary="Operator"
                        secondary={session.operator}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon>
                        <Schedule />
                      </ListItemIcon>
                      <ListItemText
                        primary="Rozpoczęto"
                        secondary={session.startTime.toLocaleString()}
                      />
                    </ListItem>
                    {session.endTime && (
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircle />
                        </ListItemIcon>
                        <ListItemText
                          primary="Zakończono"
                          secondary={session.endTime.toLocaleString()}
                        />
                      </ListItem>
                    )}
                  </List>
                </>
              ) : (
                <Alert severity="info">
                  Sesja nie została jeszcze rozpoczęta
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Progress Overview */}
        {session && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <Timer sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Postęp wykonywania
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Próbki
                      </Typography>
                      <Typography variant="h4">
                        {progress.completedSamples}/{progress.totalSamples}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(progress.completedSamples / progress.totalSamples) * 100}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Kroki ogółem
                      </Typography>
                      <Typography variant="h4">
                        {progress.completedSteps}/{progress.totalSteps * progress.totalSamples}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={(progress.completedSteps / (progress.totalSteps * progress.totalSamples)) * 100}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Czas rzeczywisty
                      </Typography>
                      <Typography variant="h4">
                        {progress.actualDuration}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Pozostały czas
                      </Typography>
                      <Typography variant="h4">
                        {progress.estimatedTimeRemaining}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box mt={3}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Efektywność: {Math.round(progress.efficiency)}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={Math.min(100, progress.efficiency)}
                    color={progress.efficiency > 80 ? 'success' : progress.efficiency > 60 ? 'warning' : 'error'}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Samples Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Tune sx={{ mr: 1, verticalAlign: 'middle' }} />
                Próbki
              </Typography>
              
              {context.samples.length > 0 ? (
                <List dense>
                  {context.samples.map((sample, index) => (
                    <React.Fragment key={sample.id}>
                      <ListItem>
                        <ListItemText
                          primary={sample.name}
                          secondary={`Status: ${sample.status}`}
                        />
                        <Chip
                          size="small"
                          label={sample.status}
                          color={
                            sample.status === 'completed' ? 'success' :
                            sample.status === 'in-progress' ? 'warning' :
                            sample.status === 'failed' ? 'error' : 'default'
                          }
                        />
                      </ListItem>
                      {index < context.samples.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="warning">
                  Brak zdefiniowanych próbek
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Protocol Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
                Protokół - przegląd
              </Typography>
              
              {context.protocol.steps && context.protocol.steps.length > 0 ? (
                <>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Liczba kroków: {context.protocol.steps.length}
                  </Typography>
                  
                  <List dense>
                    {context.protocol.steps.slice(0, 3).map((step, index) => (
                      <ListItem key={step.id}>
                        <ListItemText
                          primary={`${index + 1}. ${step.title}`}
                          secondary={step.description}
                        />
                      </ListItem>
                    ))}
                    {context.protocol.steps.length > 3 && (
                      <ListItem>
                        <ListItemText
                          primary={`... i ${context.protocol.steps.length - 3} więcej kroków`}
                          secondary="Pełny protokół dostępny w zakładce 'Protokół'"
                        />
                      </ListItem>
                    )}
                  </List>
                </>
              ) : (
                <Alert severity="warning">
                  Protokół nie został załadowany lub nie zawiera kroków
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" gap={2}>
            {!session && (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                onClick={handleStart}
                disabled={!context.studyId || !context.protocol.id}
              >
                Rozpocznij wykonywanie
              </Button>
            )}
            
            {session && session.status === 'paused' && (
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                color="success"
              >
                Wznów wykonywanie
              </Button>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewPanel;
