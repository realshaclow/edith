import React from 'react';
import {
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Chip,
  Button,
  LinearProgress,
  Alert,
  IconButton,
  Divider
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Group as GroupIcon,
  Timer as TimerIcon,
  Person as PersonIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { StudyExecution } from '../types/professional';

interface SessionPanelProps {
  execution: StudyExecution;
  onStartSession: (sessionIndex: number) => void;
  onCompleteSession: (sessionIndex: number) => void;
}

export const SessionPanel: React.FC<SessionPanelProps> = ({
  execution,
  onStartSession,
  onCompleteSession
}) => {
  const currentSession = execution.sessions[execution.currentSessionIndex];
  const hasMultipleSessions = execution.sessions.length > 1;

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'COMPLETED': return 'primary';
      case 'PAUSED': return 'warning';
      case 'PLANNED': return 'default';
      default: return 'default';
    }
  };

  const getSessionStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Aktywna';
      case 'COMPLETED': return 'Zakończona';
      case 'PAUSED': return 'Wstrzymana';
      case 'PLANNED': return 'Zaplanowana';
      default: return 'Nieznany';
    }
  };

  const getSessionProgress = (session: any) => {
    if (!session.samplesAssigned || session.samplesAssigned.length === 0) return 0;
    
    const completedSamples = execution.samples.filter(sample => 
      session.samplesAssigned.includes(sample.id) && 
      ['COMPLETED', 'PASSED', 'FAILED'].includes(sample.status)
    ).length;
    
    return (completedSamples / session.samplesAssigned.length) * 100;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <GroupIcon sx={{ mr: 1, color: 'text.secondary' }} />
        <Typography variant="h6">
          {hasMultipleSessions ? 'Sesje pomiarowe' : 'Sesja pomiarowa'}
        </Typography>
      </Box>

      {hasMultipleSessions && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Sesja {execution.currentSessionIndex + 1} z {execution.sessions.length}
          </Typography>
          
          <List dense>
            {execution.sessions.map((session, index) => {
              const progress = getSessionProgress(session);
              const isActive = index === execution.currentSessionIndex;
              
              return (
                <ListItem key={session.id} disablePadding>
                  <ListItemButton 
                    selected={isActive}
                    onClick={() => onStartSession(index)}
                    disabled={session.status === 'COMPLETED'}
                  >
                    <ListItemIcon>
                      {session.status === 'COMPLETED' ? (
                        <CheckIcon color="success" />
                      ) : session.status === 'ACTIVE' ? (
                        <PlayIcon color="primary" />
                      ) : (
                        <TimerIcon color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={session.name}
                      secondary={
                        <Box>
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Chip 
                              size="small" 
                              label={getSessionStatusText(session.status)}
                              color={getSessionStatusColor(session.status) as any}
                              variant="outlined"
                            />
                            <Typography variant="caption">
                              {session.samplesAssigned?.length || 0} próbek
                            </Typography>
                          </Box>
                          <Box sx={{ width: '100%', mt: 0.5 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={progress} 
                              sx={{ height: 4, borderRadius: 2 }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              {Math.round(progress)}%
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Current session details */}
      {currentSession && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Aktualna sesja: {currentSession.name}
          </Typography>
          
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="body2">
              {currentSession.operator || 'Nieznany operator'}
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={getSessionProgress(currentSession)} 
              sx={{ mb: 0.5 }}
            />
            <Typography variant="caption" color="text.secondary">
              {currentSession.samplesAssigned?.length || 0} próbek przypisanych
            </Typography>
          </Box>

          {currentSession.status === 'PLANNED' && (
            <Button
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={() => onStartSession(execution.currentSessionIndex)}
              fullWidth
              size="small"
            >
              Rozpocznij sesję
            </Button>
          )}

          {currentSession.status === 'ACTIVE' && getSessionProgress(currentSession) === 100 && (
            <Button
              variant="outlined"
              startIcon={<CheckIcon />}
              onClick={() => onCompleteSession(execution.currentSessionIndex)}
              fullWidth
              size="small"
            >
              Zakończ sesję
            </Button>
          )}

          {execution.settings.sessionTimeout && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="caption">
                Limit czasu sesji: {execution.settings.sessionTimeout} min
              </Typography>
            </Alert>
          )}
        </Box>
      )}
    </Paper>
  );
};
