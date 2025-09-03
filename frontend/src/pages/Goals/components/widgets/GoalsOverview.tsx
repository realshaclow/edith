import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Typography,
  LinearProgress,
  Chip,
  Avatar,
  AvatarGroup,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Tooltip,
  Skeleton
} from '@mui/material';
import {
  MoreVert,
  PlayArrow,
  Pause,
  CheckCircle,
  Flag,
  Schedule,
  TrendingUp,
  TrendingDown,
  Assignment,
  Group
} from '@mui/icons-material';
import { Goal, GoalStatus, GoalPriority } from '../../types';

interface GoalsOverviewProps {
  goals: Goal[];
  isLoading: boolean;
  onGoalClick?: (goalId: string) => void;
  onEditGoal?: (goalId: string) => void;
  onDeleteGoal?: (goalId: string) => void;
  onUpdateStatus?: (goalId: string, status: GoalStatus) => void;
}

const getStatusColor = (status: GoalStatus) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'primary';
    case 'paused': return 'warning';
    case 'cancelled': return 'error';
    case 'not_started': return 'default';
    default: return 'default';
  }
};

const getStatusLabel = (status: GoalStatus) => {
  switch (status) {
    case 'completed': return 'Ukończony';
    case 'in_progress': return 'W trakcie';
    case 'paused': return 'Wstrzymany';
    case 'cancelled': return 'Anulowany';
    case 'not_started': return 'Nierozpoczęty';
    default: return status;
  }
};

const getPriorityColor = (priority: GoalPriority) => {
  switch (priority) {
    case 'critical': return 'error';
    case 'high': return 'warning';
    case 'medium': return 'info';
    case 'low': return 'success';
    default: return 'default';
  }
};

const getPriorityIcon = (priority: GoalPriority) => {
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
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const calculateDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diffTime = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const GoalCard: React.FC<{
  goal: Goal;
  onGoalClick?: (goalId: string) => void;
  onEditGoal?: (goalId: string) => void;
  onDeleteGoal?: (goalId: string) => void;
  onUpdateStatus?: (goalId: string, status: GoalStatus) => void;
}> = ({ goal, onGoalClick, onEditGoal, onDeleteGoal, onUpdateStatus }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const daysRemaining = calculateDaysRemaining(goal.endDate);
  const isOverdue = daysRemaining < 0 && goal.status !== 'completed';

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleStatusChange = (status: GoalStatus) => {
    onUpdateStatus?.(goal.id, status);
    handleMenuClose();
  };

  return (
    <Card
      sx={{
        height: '100%',
        cursor: 'pointer',
        position: 'relative',
        border: isOverdue ? '2px solid' : '1px solid',
        borderColor: isOverdue ? 'error.main' : 'divider',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={() => onGoalClick?.(goal.id)}
    >
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" component="div" noWrap sx={{ flex: 1 }}>
              {goal.title}
            </Typography>
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              sx={{ ml: 1 }}
            >
              <MoreVert />
            </IconButton>
          </Box>
        }
        subheader={
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {goal.description}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label={getStatusLabel(goal.status)}
                color={getStatusColor(goal.status) as any}
                size="small"
                icon={
                  goal.status === 'completed' ? <CheckCircle /> :
                  goal.status === 'in_progress' ? <PlayArrow /> :
                  goal.status === 'paused' ? <Pause /> : undefined
                }
              />
              <Chip
                label={
                  <Box display="flex" alignItems="center">
                    <span style={{ marginRight: 4 }}>{getPriorityIcon(goal.priority)}</span>
                    {goal.priority}
                  </Box>
                }
                color={getPriorityColor(goal.priority) as any}
                size="small"
                variant="outlined"
              />
              <Chip
                label={goal.category}
                size="small"
                variant="outlined"
              />
            </Box>
          </Box>
        }
        sx={{ pb: 1 }}
      />

      <CardContent sx={{ pt: 0 }}>
        {/* Progress */}
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="medium">
              Postęp
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="primary.main">
              {Math.round(goal.progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={goal.progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'action.hover',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: goal.status === 'completed' ? 'success.main' : 'primary.main'
              }
            }}
          />
        </Box>

        {/* Target vs Current */}
        <Box mb={2}>
          <Typography variant="body2" fontWeight="medium" gutterBottom>
            Cel: {goal.target.value} {goal.target.unit}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="body2" color="text.secondary">
              Aktualnie: {goal.current.value} {goal.target.unit}
            </Typography>
            {goal.current.value >= goal.target.value ? (
              <TrendingUp color="success" sx={{ fontSize: 16 }} />
            ) : (
              <TrendingDown color="warning" sx={{ fontSize: 16 }} />
            )}
          </Box>
        </Box>

        {/* Timeline */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {formatDate(goal.startDate)} - {formatDate(goal.endDate)}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <Flag sx={{ fontSize: 16, color: isOverdue ? 'error.main' : 'text.secondary' }} />
            <Typography 
              variant="caption" 
              color={isOverdue ? 'error.main' : 'text.secondary'}
              fontWeight={isOverdue ? 'bold' : 'normal'}
            >
              {isOverdue 
                ? `Przekroczony o ${Math.abs(daysRemaining)} dni`
                : daysRemaining === 0 
                  ? 'Dziś jest termin'
                  : `${daysRemaining} dni pozostało`
              }
            </Typography>
          </Box>
        </Box>

        {/* Assigned Team */}
        {goal.assignedTo.length > 0 && (
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Group sx={{ fontSize: 16, color: 'text.secondary' }} />
            <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: 12 } }}>
              {goal.assignedTo.map((person, index) => (
                <Avatar key={index}>
                  {person.split(' ').map(n => n[0]).join('')}
                </Avatar>
              ))}
            </AvatarGroup>
          </Box>
        )}

        {/* Tasks and Milestones Count */}
        <Box display="flex" gap={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Assignment sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {goal.tasks.length} zadań
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Flag sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              {goal.milestones.length} kamieni milowych
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        {goal.tags.length > 0 && (
          <Box mt={2}>
            <Box display="flex" gap={0.5} flexWrap="wrap">
              {goal.tags.slice(0, 3).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              ))}
              {goal.tags.length > 3 && (
                <Chip
                  label={`+${goal.tags.length - 3}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.7rem', height: 20 }}
                />
              )}
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => onEditGoal?.(goal.id)}>
          Edytuj
        </MenuItem>
        {goal.status !== 'in_progress' && (
          <MenuItem onClick={() => handleStatusChange('in_progress')}>
            Rozpocznij
          </MenuItem>
        )}
        {goal.status === 'in_progress' && (
          <MenuItem onClick={() => handleStatusChange('paused')}>
            Wstrzymaj
          </MenuItem>
        )}
        {goal.status !== 'completed' && (
          <MenuItem onClick={() => handleStatusChange('completed')}>
            Oznacz jako ukończony
          </MenuItem>
        )}
        <MenuItem onClick={() => onDeleteGoal?.(goal.id)} sx={{ color: 'error.main' }}>
          Usuń
        </MenuItem>
      </Menu>
    </Card>
  );
};

const GoalsOverview: React.FC<GoalsOverviewProps> = ({
  goals,
  isLoading,
  onGoalClick,
  onEditGoal,
  onDeleteGoal,
  onUpdateStatus
}) => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card>
              <CardHeader
                title={<Skeleton variant="text" width="80%" height={32} />}
                subheader={
                  <Box>
                    <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
                    <Box display="flex" gap={1}>
                      <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
                      <Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: 12 }} />
                    </Box>
                  </Box>
                }
              />
              <CardContent>
                <Skeleton variant="rectangular" height={8} sx={{ mb: 2, borderRadius: 4 }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="40%" height={20} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Flag sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Brak celów
          </Typography>
          <Typography color="text.secondary" paragraph>
            Nie masz jeszcze żadnych celów. Utwórz swój pierwszy cel, aby rozpocząć śledzenie postępów.
          </Typography>
          <Button variant="contained" startIcon={<Flag />}>
            Utwórz pierwszy cel
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={3}>
      {goals.map((goal) => (
        <Grid item xs={12} md={6} lg={4} key={goal.id}>
          <GoalCard
            goal={goal}
            onGoalClick={onGoalClick}
            onEditGoal={onEditGoal}
            onDeleteGoal={onDeleteGoal}
            onUpdateStatus={onUpdateStatus}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default GoalsOverview;
