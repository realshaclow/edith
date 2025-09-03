import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  Typography,
  Stack,
  Avatar,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Science as ScienceIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import { Protocol } from '../types';

interface ProtocolListViewProps {
  protocols: Protocol[];
  onView: (protocol: Protocol) => void;
  onEdit?: (protocol: Protocol) => void;
  onDelete?: (protocol: Protocol) => void;
  showActions?: boolean;
}

const ProtocolListView: React.FC<ProtocolListViewProps> = ({
  protocols,
  onView,
  onEdit,
  onDelete,
  showActions = true
}) => {
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
      case 'easy':
        return 'success';
      case 'intermediate':
      case 'medium':
        return 'warning';
      case 'advanced':
      case 'hard':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('mechanical')) return '⚙️';
    if (categoryLower.includes('thermal')) return '🌡️';
    if (categoryLower.includes('chemical')) return '⚗️';
    if (categoryLower.includes('electrical')) return '⚡';
    if (categoryLower.includes('optical')) return '🔬';
    return '🧪';
  };

  const formatDuration = (duration?: string) => {
    if (!duration) return 'N/A';
    return duration.replace(/minut/g, 'min').replace(/godzin/g, 'h');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (protocols.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ScienceIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Nie znaleziono protokołów
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Spróbuj dostosować filtry lub kryteria wyszukiwania
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {protocols.map((protocol, index) => (
        <React.Fragment key={protocol.id}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => onView(protocol)}
              sx={{ 
                py: 2,
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
            >
              <ListItemIcon>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {getCategoryIcon(protocol.category)}
                </Avatar>
              </ListItemIcon>

              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" component="span">
                      {protocol.title}
                    </Typography>
                    <Stack direction="row" spacing={0.5}>
                      <Chip
                        label={protocol.category}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                      {protocol.difficulty && (
                        <Chip
                          label={protocol.difficulty}
                          size="small"
                          color={getDifficultyColor(protocol.difficulty) as any}
                          variant="filled"
                        />
                      )}
                      <Chip
                        label={protocol.type}
                        size="small"
                        variant="outlined"
                        color={protocol.type === 'PREDEFINED' ? 'success' : 'info'}
                      />
                    </Stack>
                  </Box>
                }
                secondary={
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 1 }}
                    >
                      {protocol.description}
                    </Typography>
                    
                    <Stack direction="row" spacing={2} alignItems="center">
                      {protocol.estimatedDuration && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <ScheduleIcon fontSize="small" />
                          <Typography variant="caption">
                            {formatDuration(protocol.estimatedDuration)}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ScienceIcon fontSize="small" />
                        <Typography variant="caption">
                          {protocol.steps?.length || 0} kroków
                        </Typography>
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary">
                        Utworzono: {formatDate(protocol.createdAt)}
                      </Typography>
                    </Stack>
                  </Box>
                }
              />

              {showActions && (
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Zobacz szczegóły">
                      <IconButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(protocol);
                        }}
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    
                    {onEdit && (
                      <Tooltip title="Edytuj protokół">
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(protocol);
                          }}
                          size="small"
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {onDelete && protocol.type === 'USER' && (
                      <Tooltip title="Usuń protokół">
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(protocol);
                          }}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Stack>
                </ListItemSecondaryAction>
              )}
            </ListItemButton>
          </ListItem>
          {index < protocols.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

export default ProtocolListView;
