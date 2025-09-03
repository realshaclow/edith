import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  Tooltip,
  Checkbox,
  Badge,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as DuplicateIcon,
  Assessment as StatsIcon,
  MoreVert as MoreIcon,
  CheckCircle as ActivateIcon,
  Pause as PauseIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  Category as CategoryIcon,
  Science as ScienceIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Study, StudyStatus } from '../../../../types';
import { StudyCardProps } from '../types';
import { getStatusColor, getStatusLabel, formatRelativeTime, getCategoryColor } from '../utils';

const StudyCard: React.FC<StudyCardProps> = ({
  study,
  viewMode,
  onExecute,
  onEdit,
  onDelete,
  onDuplicate,
  onStatusChange,
  onViewStatistics,
  isSelected = false,
  onSelect
}) => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(study, !isSelected);
    }
  };

  const handleAction = (action: () => void) => {
    return (event: React.MouseEvent) => {
      event.stopPropagation();
      action();
      handleMenuClose();
    };
  };

  const getExecuteButtonText = () => {
    switch (study.status) {
      case StudyStatus.DRAFT:
        return 'Aktywuj i wykonaj';
      case StudyStatus.ACTIVE:
        return 'Wykonaj';
      case StudyStatus.PAUSED:
        return 'Wznów i wykonaj';
      case StudyStatus.COMPLETED:
        return 'Zobacz wyniki';
      default:
        return 'Wykonaj';
    }
  };

  const canExecute = study.status !== StudyStatus.COMPLETED;

  const progressValue = (() => {
    switch (study.status) {
      case StudyStatus.DRAFT: return 0;
      case StudyStatus.ACTIVE: return 50;
      case StudyStatus.PAUSED: return 30;
      case StudyStatus.COMPLETED: return 100;
      default: return 0;
    }
  })();

  if (viewMode === 'list') {
    return (
      <Card 
        sx={{ 
          mb: 1, 
          cursor: onSelect ? 'pointer' : 'default',
          border: isSelected ? 2 : 1,
          borderColor: isSelected ? 'primary.main' : 'divider',
          '&:hover': {
            boxShadow: 2,
            borderColor: 'primary.light'
          }
        }}
        onClick={handleCardClick}
      >
        <CardContent sx={{ py: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            {onSelect && (
              <Checkbox
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onSelect(study, e.target.checked);
                }}
                size="small"
              />
            )}
            
            <Avatar 
              sx={{ 
                bgcolor: getCategoryColor(study.category || 'default'),
                width: 40,
                height: 40
              }}
            >
              <ScienceIcon />
            </Avatar>

            <Box flex={1} minWidth={0}>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {study.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {study.protocolName || study.protocolId}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={getStatusLabel(study.status)}
                color={getStatusColor(study.status)}
                size="small"
              />
              
              {study.category && (
                <Chip
                  label={study.category}
                  variant="outlined"
                  size="small"
                  icon={<CategoryIcon />}
                />
              )}
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="caption" color="text.secondary">
                {formatRelativeTime(new Date(study.updatedAt))}
              </Typography>
              
              <IconButton size="small" onClick={handleMenuOpen}>
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>

          {progressValue > 0 && (
            <Box mt={2}>
              <LinearProgress 
                variant="determinate" 
                value={progressValue} 
                color={getStatusColor(study.status) as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
                sx={{ height: 4, borderRadius: 2 }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  // Grid/Card view
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: onSelect ? 'pointer' : 'default',
        border: isSelected ? 2 : 1,
        borderColor: isSelected ? 'primary.main' : 'divider',
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
      onClick={handleCardClick}
    >
      {onSelect && (
        <Checkbox
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(study, e.target.checked);
          }}
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            bgcolor: 'background.paper',
            borderRadius: 1
          }}
          size="small"
        />
      )}

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1} mr={1}>
            <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
              {study.name}
            </Typography>
            
            <Chip
              label={getStatusLabel(study.status)}
              color={getStatusColor(study.status)}
              size="small"
              sx={{ mb: 1 }}
            />
          </Box>

          <IconButton size="small" onClick={handleMenuOpen}>
            <MoreIcon />
          </IconButton>
        </Box>

        {study.description && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {study.description}
          </Typography>
        )}

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <ScienceIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" noWrap>
            {study.protocolName || study.protocolId}
          </Typography>
        </Box>

        {study.category && (
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <CategoryIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary" noWrap>
              {study.category}
            </Typography>
          </Box>
        )}

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary" noWrap>
            {study.createdBy || 'Nieznany'}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1}>
          <ScheduleIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            Utworzono: {formatRelativeTime(new Date(study.createdAt))}
          </Typography>
        </Box>

        {progressValue > 0 && (
          <Box mt={2}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Postęp: {progressValue}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={progressValue} 
              color={getStatusColor(study.status) as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </CardContent>

      <Divider />

      <CardActions sx={{ p: 2, pt: 1 }}>
        <Button
          size="small"
          startIcon={<PlayIcon />}
          onClick={handleAction(() => onExecute(study))}
          disabled={!canExecute}
          variant={study.status === StudyStatus.ACTIVE ? 'contained' : 'outlined'}
          color="primary"
          fullWidth
        >
          {getExecuteButtonText()}
        </Button>
      </CardActions>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleAction(() => onEdit(study))}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edytuj</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleAction(() => onDuplicate(study))}>
          <ListItemIcon>
            <DuplicateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Duplikuj</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleAction(() => onViewStatistics(study))}>
          <ListItemIcon>
            <StatsIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Statystyki</ListItemText>
        </MenuItem>

        <Divider />

        {study.status === StudyStatus.DRAFT && (
          <MenuItem 
            onClick={handleAction(() => onStatusChange(study, StudyStatus.ACTIVE))}
            sx={{ color: 'success.main' }}
          >
            <ListItemIcon>
              <ActivateIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Aktywuj</ListItemText>
          </MenuItem>
        )}

        {study.status === StudyStatus.ACTIVE && (
          <MenuItem 
            onClick={handleAction(() => onStatusChange(study, StudyStatus.PAUSED))}
            sx={{ color: 'warning.main' }}
          >
            <ListItemIcon>
              <PauseIcon fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Wstrzymaj</ListItemText>
          </MenuItem>
        )}

        {study.status === StudyStatus.PAUSED && (
          <MenuItem 
            onClick={handleAction(() => onStatusChange(study, StudyStatus.ACTIVE))}
            sx={{ color: 'success.main' }}
          >
            <ListItemIcon>
              <PlayIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Wznów</ListItemText>
          </MenuItem>
        )}

        <Divider />

        <MenuItem 
          onClick={handleAction(() => onDelete(study))}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Usuń</ListItemText>
        </MenuItem>
      </Menu>
    </Card>
  );
};

export default StudyCard;
