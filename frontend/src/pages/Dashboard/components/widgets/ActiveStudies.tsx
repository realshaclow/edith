import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip,
  Skeleton,
  Divider
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  MoreVert,
  Person,
  Schedule,
  Flag
} from '@mui/icons-material';
import { StudyProgress } from '../../types';

interface ActiveStudiesProps {
  studies: StudyProgress[];
  isLoading: boolean;
  onStudyClick?: (studyId: string) => void;
  onPauseStudy?: (studyId: string) => void;
  onResumeStudy?: (studyId: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'default';
    default: return 'default';
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'critical': return '🔥';
    case 'high': return '⚡';
    case 'medium': return '📋';
    case 'low': return '📝';
    default: return '📋';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Przed chwilą';
  if (diffInHours < 24) return `${diffInHours}h temu`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} dni temu`;
  
  return date.toLocaleDateString('pl-PL');
};

const ActiveStudies: React.FC<ActiveStudiesProps> = ({ 
  studies, 
  isLoading, 
  onStudyClick,
  onPauseStudy,
  onResumeStudy 
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Aktywne badania" />
        <CardContent>
          {[...Array(3)].map((_, index) => (
            <Box key={index} mb={2}>
              <Box display="flex" alignItems="center" mb={1}>
                <Skeleton variant="rectangular" width={40} height={40} sx={{ mr: 2, borderRadius: 1 }} />
                <Box flex={1}>
                  <Skeleton variant="text" width="70%" height={24} />
                  <Skeleton variant="text" width="50%" height={20} />
                </Box>
              </Box>
              <Skeleton variant="rectangular" height={6} sx={{ mb: 1, borderRadius: 3 }} />
              <Box display="flex" gap={1}>
                <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 12 }} />
                <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
              </Box>
              {index < 2 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (studies.length === 0) {
    return (
      <Card>
        <CardHeader title="Aktywne badania" />
        <CardContent>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            py={4}
            color="text.secondary"
          >
            <PlayArrow sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              Brak aktywnych badań
            </Typography>
            <Typography variant="body2" textAlign="center">
              Wszystkie badania zostały zakończone lub są wstrzymane
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title="Aktywne badania"
        action={
          <Chip 
            label={studies.length} 
            color="primary" 
            size="small"
          />
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <List disablePadding>
          {studies.map((study, index) => (
            <Box key={study.id}>
              <ListItem
                disablePadding
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => onStudyClick?.(study.id)}
              >
                <ListItemAvatar>
                  <Avatar 
                    sx={{ 
                      bgcolor: study.status === 'active' ? 'success.light' : 'warning.light',
                      color: study.status === 'active' ? 'success.dark' : 'warning.dark'
                    }}
                  >
                    {study.status === 'active' ? <PlayArrow /> : <Pause />}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  sx={{ flex: 1 }}
                  primary={
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Typography variant="subtitle1" fontWeight="medium" noWrap>
                        {study.name}
                      </Typography>
                      <Box display="flex" gap={1}>
                        <Tooltip title={study.status === 'active' ? 'Wstrzymaj' : 'Wznów'}>
                          <IconButton 
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (study.status === 'active') {
                                onPauseStudy?.(study.id);
                              } else {
                                onResumeStudy?.(study.id);
                              }
                            }}
                          >
                            {study.status === 'active' ? <Pause /> : <PlayArrow />}
                          </IconButton>
                        </Tooltip>
                        <IconButton size="small">
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box mt={1}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {study.protocol}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Box display="flex" alignItems="center">
                          <Person sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {study.operator}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center">
                          <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(study.startDate)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="caption" color="text.secondary">
                          Postęp: {Math.round(study.progress)}%
                        </Typography>
                        {study.estimatedCompletion && (
                          <Typography variant="caption" color="text.secondary">
                            Szacowany koniec: {formatDate(study.estimatedCompletion)}
                          </Typography>
                        )}
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={study.progress}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          mb: 1,
                          backgroundColor: 'action.hover',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            backgroundColor: study.status === 'active' ? 'success.main' : 'warning.main'
                          }
                        }}
                      />

                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" gap={1}>
                          <Chip
                            label={study.status === 'active' ? 'Aktywne' : 'Wstrzymane'}
                            size="small"
                            color={study.status === 'active' ? 'success' : 'warning'}
                            variant="outlined"
                          />
                          <Chip
                            icon={<Flag sx={{ fontSize: 14 }} />}
                            label={
                              <Box display="flex" alignItems="center">
                                <span style={{ marginRight: 4 }}>{getPriorityIcon(study.priority)}</span>
                                {study.priority}
                              </Box>
                            }
                            size="small"
                            color={getPriorityColor(study.priority) as any}
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              {index < studies.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default ActiveStudies;
