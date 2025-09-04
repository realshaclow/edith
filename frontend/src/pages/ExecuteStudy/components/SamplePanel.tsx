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
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Alert
} from '@mui/material';
import {
  Science as SampleIcon,
  CheckCircle as CompleteIcon,
  Cancel as CancelIcon,
  MoreVert as MoreIcon,
  PlayArrow as StartIcon,
  SkipNext as SkipIcon,
  Assignment as TestIcon
} from '@mui/icons-material';
import { StudyExecution, StudySample, SampleStatus } from '../types/professional';

interface SamplePanelProps {
  execution: StudyExecution;
  onSampleSelect: (sampleIndex: number) => void;
  onCompleteSample: (sampleId: string) => void;
  onSkipSample: (sampleId: string, reason: string) => void;
}

export const SamplePanel: React.FC<SamplePanelProps> = ({
  execution,
  onSampleSelect,
  onCompleteSample,
  onSkipSample
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedSample, setSelectedSample] = React.useState<StudySample | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, sample: StudySample) => {
    setAnchorEl(event.currentTarget);
    setSelectedSample(sample);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSample(null);
  };

  const getSampleStatusColor = (status: SampleStatus) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'primary';
      case 'FAILED': return 'error';
      case 'SKIPPED': return 'warning';
      case 'PENDING': return 'default';
      default: return 'default';
    }
  };

  const getSampleStatusText = (status: SampleStatus) => {
    switch (status) {
      case 'COMPLETED': return 'Zakończona';
      case 'IN_PROGRESS': return 'W trakcie';
      case 'FAILED': return 'Nieudana';
      case 'SKIPPED': return 'Pominięta';
      case 'PENDING': return 'Oczekuje';
      default: return 'Nieznany';
    }
  };

  const getSampleProgress = (sample: StudySample) => {
    if (execution.steps.length === 0) return 0;
    return (sample.completedSteps.length / execution.steps.length) * 100;
  };

  const getCurrentSessionSamples = () => {
    const currentSession = execution.sessions[execution.currentSessionIndex];
    if (!currentSession) return execution.samples;
    
    return execution.samples.filter(sample => 
      currentSession.samplesAssigned.includes(sample.id)
    );
  };

  const currentSample = execution.samples[execution.currentSampleIndex];
  const sessionSamples = getCurrentSessionSamples();

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center">
          <SampleIcon sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="h6">
            Próbki
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {execution.currentSampleIndex + 1} z {sessionSamples.length}
        </Typography>
      </Box>

      {/* Current sample info */}
      {currentSample && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
          icon={<TestIcon />}
        >
          <Typography variant="subtitle2">
            Aktualna próbka: {currentSample.name}
          </Typography>
          <Typography variant="caption">
            Status: {getSampleStatusText(currentSample.status)}
          </Typography>
        </Alert>
      )}

      {/* Sample list */}
      <List dense>
        {sessionSamples.map((sample, index) => {
          const globalIndex = execution.samples.findIndex(s => s.id === sample.id);
          const isActive = globalIndex === execution.currentSampleIndex;
          const progress = getSampleProgress(sample);
          
          return (
            <ListItem key={sample.id} disablePadding>
              <ListItemButton 
                selected={isActive}
                onClick={() => onSampleSelect(globalIndex)}
                disabled={sample.status === 'SKIPPED'}
              >
                <ListItemIcon>
                  {sample.status === 'COMPLETED' ? (
                    <CompleteIcon color="success" />
                  ) : sample.status === 'FAILED' ? (
                    <CancelIcon color="error" />
                  ) : sample.status === 'IN_PROGRESS' ? (
                    <StartIcon color="primary" />
                  ) : sample.status === 'SKIPPED' ? (
                    <SkipIcon color="warning" />
                  ) : (
                    <SampleIcon color="disabled" />
                  )}
                </ListItemIcon>
                
                <ListItemText
                  primary={sample.name}
                  secondary={
                    <Box>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Chip 
                          size="small" 
                          label={getSampleStatusText(sample.status)}
                          color={getSampleStatusColor(sample.status) as any}
                          variant="outlined"
                        />
                        {sample.measurements.length > 0 && (
                          <Typography variant="caption">
                            {sample.measurements.length} pomiarów
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ width: '100%', mt: 0.5 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={progress} 
                          sx={{ height: 4, borderRadius: 2 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {sample.completedSteps.length}/{execution.steps.length} kroków
                        </Typography>
                      </Box>
                      {sample.notes && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {sample.notes}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                
                <IconButton 
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, sample);
                  }}
                >
                  <MoreIcon />
                </IconButton>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Sample actions menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedSample?.status === 'IN_PROGRESS' && (
          <MenuItem onClick={() => {
            if (selectedSample) {
              onCompleteSample(selectedSample.id);
            }
            handleMenuClose();
          }}>
            <CompleteIcon sx={{ mr: 1 }} />
            Zakończ próbkę
          </MenuItem>
        )}
        
        {selectedSample?.status !== 'COMPLETED' && selectedSample?.status !== 'SKIPPED' && (
          <MenuItem onClick={() => {
            if (selectedSample) {
              onSkipSample(selectedSample.id, 'Pominięto przez operatora');
            }
            handleMenuClose();
          }}>
            <SkipIcon sx={{ mr: 1 }} />
            Pomiń próbkę
          </MenuItem>
        )}
      </Menu>

      {/* Summary */}
      <Divider sx={{ my: 2 }} />
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Podsumowanie sesji
        </Typography>
        <Box display="flex" gap={1} flexWrap="wrap">
          <Chip 
            size="small" 
            label={`${sessionSamples.filter(s => s.status === 'COMPLETED').length} zakończone`}
            color="success"
            variant="outlined"
          />
          <Chip 
            size="small" 
            label={`${sessionSamples.filter(s => s.status === 'IN_PROGRESS').length} w trakcie`}
            color="primary"
            variant="outlined"
          />
          <Chip 
            size="small" 
            label={`${sessionSamples.filter(s => s.status === 'PENDING').length} oczekuje`}
            color="default"
            variant="outlined"
          />
          {sessionSamples.some(s => s.status === 'SKIPPED') && (
            <Chip 
              size="small" 
              label={`${sessionSamples.filter(s => s.status === 'SKIPPED').length} pominięte`}
              color="warning"
              variant="outlined"
            />
          )}
        </Box>
      </Box>
    </Paper>
  );
};
