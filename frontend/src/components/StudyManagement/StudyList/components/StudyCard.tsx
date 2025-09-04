import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Box,
  LinearProgress,
  Tooltip,
  Checkbox,
  Avatar,
  Stack
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  PlayArrow as PlayArrowIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  GetApp as GetAppIcon,
  Assessment as AssessmentIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { StudyCardProps, StudyQuickAction, StudyStatus, StudyPriority } from '../types';

// Status colors
const statusColors: Record<StudyStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  [StudyStatus.DRAFT]: 'default',
  [StudyStatus.ACTIVE]: 'primary',
  [StudyStatus.COMPLETED]: 'success',
  [StudyStatus.PAUSED]: 'warning',
  [StudyStatus.ARCHIVED]: 'info',
  [StudyStatus.DELETED]: 'error'
};

// Priority colors
const priorityColors: Record<StudyPriority, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  [StudyPriority.LOW]: 'info',
  [StudyPriority.MEDIUM]: 'default',
  [StudyPriority.HIGH]: 'warning',
  [StudyPriority.CRITICAL]: 'error'
};

export const StudyCard: React.FC<StudyCardProps> = ({
  study,
  viewMode,
  isSelected,
  onSelect,
  onQuickAction
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleQuickAction = (action: StudyQuickAction) => {
    handleMenuClose();
    onQuickAction(action, study);
  };

  const handleCardClick = () => {
    onQuickAction('view_stats', study);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onSelect(study.id, event.target.checked);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'primary';
    if (progress >= 20) return 'warning';
    return 'error';
  };

  if (viewMode === 'list') {
    return (
      <Card 
        variant="outlined" 
        sx={{ 
          mb: 1, 
          cursor: 'pointer',
          '&:hover': { 
            boxShadow: 2,
            backgroundColor: 'action.hover'
          },
          ...(isSelected && {
            backgroundColor: 'action.selected',
            borderColor: 'primary.main'
          })
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ py: 1.5 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Checkbox
              checked={isSelected}
              onChange={handleSelectChange}
              onClick={(e) => e.stopPropagation()}
            />
            
            <Box flex={1}>
              <Typography variant="subtitle1" fontWeight="medium">
                {study.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {study.description || 'No description'}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Chip 
                label={study.status} 
                size="small" 
                color={statusColors[study.status]}
                variant="outlined"
              />
              <Chip 
                label={study.priority} 
                size="small" 
                color={priorityColors[study.priority]}
              />
            </Box>
            
            <Box width={100}>
              <LinearProgress 
                variant="determinate" 
                value={study.progressPercentage}
                color={getProgressColor(study.progressPercentage)}
              />
              <Typography variant="caption" color="text.secondary">
                {study.progressPercentage}%
              </Typography>
            </Box>
            
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 80 }}>
              {formatDate(study.updatedAt)}
            </Typography>
            
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      variant="outlined"
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': { 
          boxShadow: 4,
          transform: 'translateY(-2px)'
        },
        ...(isSelected && {
          backgroundColor: 'action.selected',
          borderColor: 'primary.main',
          borderWidth: 2
        })
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header with checkbox and menu */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Checkbox
            checked={isSelected}
            onChange={handleSelectChange}
            onClick={(e) => e.stopPropagation()}
            size="small"
          />
          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
        </Box>

        {/* Title and description */}
        <Typography variant="h6" fontWeight="medium" gutterBottom noWrap>
          {study.title}
        </Typography>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5em'
          }}
        >
          {study.description || 'No description available'}
        </Typography>

        {/* Protocol info */}
        {study.protocolName && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <AssessmentIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" noWrap>
              {study.protocolName}
            </Typography>
          </Box>
        )}

        {/* Status and priority */}
        <Stack direction="row" spacing={1} mb={2}>
          <Chip 
            label={study.status} 
            size="small" 
            color={statusColors[study.status]}
            variant="outlined"
          />
          <Chip 
            label={study.priority} 
            size="small" 
            color={priorityColors[study.priority]}
          />
        </Stack>

        {/* Progress */}
        <Box mb={2}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
            <Typography variant="caption" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="caption" fontWeight="medium">
              {study.progressPercentage}%
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={study.progressPercentage}
            color={getProgressColor(study.progressPercentage)}
            sx={{ height: 6, borderRadius: 3 }}
          />
        </Box>

        {/* Statistics */}
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              {study.sessionsCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sessions
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              {study.samplesCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Samples
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h6" fontWeight="bold">
              {study.completedSessionsCount}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Completed
            </Typography>
          </Box>
        </Box>

        {/* Footer info */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={0.5}>
            <PersonIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {study.createdBy}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={0.5}>
            <ScheduleIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary">
              {formatDate(study.updatedAt)}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        {study.tags.length > 0 && (
          <Box mt={1} display="flex" flexWrap="wrap" gap={0.5}>
            {study.tags.slice(0, 3).map((tag, index) => (
              <Chip 
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
            {study.tags.length > 3 && (
              <Chip 
                label={`+${study.tags.length - 3}`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ pt: 0, justifyContent: 'space-between' }}>
        <Tooltip title="Execute Study">
          <IconButton 
            size="small" 
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAction('execute');
            }}
          >
            <PlayArrowIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Edit Study">
          <IconButton 
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAction('edit');
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </CardActions>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem onClick={() => handleQuickAction('execute')}>
          <PlayArrowIcon fontSize="small" sx={{ mr: 1 }} />
          Execute Study
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('edit')}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('duplicate')}>
          <FileCopyIcon fontSize="small" sx={{ mr: 1 }} />
          Duplicate
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('view_stats')}>
          <AssessmentIcon fontSize="small" sx={{ mr: 1 }} />
          View Statistics
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('export')}>
          <GetAppIcon fontSize="small" sx={{ mr: 1 }} />
          Export
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('archive')}>
          <ArchiveIcon fontSize="small" sx={{ mr: 1 }} />
          Archive
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('delete')} sx={{ color: 'error.main' }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Card>
  );
};
