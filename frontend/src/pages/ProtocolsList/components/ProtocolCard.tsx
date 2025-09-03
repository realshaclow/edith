import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  Divider
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Science as ScienceIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { Protocol } from '../types';

interface ProtocolCardProps {
  protocol: Protocol;
  onView: (protocol: Protocol) => void;
  onEdit?: (protocol: Protocol) => void;
  onDelete?: (protocol: Protocol) => void;
  showActions?: boolean;
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({
  protocol,
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

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {getCategoryIcon(protocol.category)}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {protocol.title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {protocol.description}
            </Typography>
          </Box>
        </Box>

        {/* Tags */}
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
          <Chip
            icon={<CategoryIcon />}
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
            icon={<PersonIcon />}
            label={protocol.type}
            size="small"
            variant="outlined"
            color={protocol.type === 'PREDEFINED' ? 'success' : 'info'}
          />
        </Stack>

        <Divider sx={{ my: 1 }} />

        {/* Metadata */}
        <Stack spacing={1}>
          {protocol.estimatedDuration && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ScheduleIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDuration(protocol.estimatedDuration)}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScienceIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {protocol.steps?.length || 0} kroków
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary">
            Utworzono: {formatDate(protocol.createdAt)}
          </Typography>
        </Stack>

        {/* Overview snippet */}
        {protocol.overview?.purpose && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Cel:</strong> {protocol.overview.purpose.slice(0, 100)}
              {protocol.overview.purpose.length > 100 && '...'}
            </Typography>
          </Box>
        )}
      </CardContent>

      {showActions && (
        <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
          <Button
            startIcon={<ViewIcon />}
            onClick={() => onView(protocol)}
            variant="outlined"
            size="small"
            fullWidth
          >
            Zobacz szczegóły
          </Button>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {onEdit && (
              <Tooltip title="Edytuj protokół">
                <IconButton 
                  onClick={() => onEdit(protocol)}
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
                  onClick={() => onDelete(protocol)}
                  size="small"
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardActions>
      )}
    </Card>
  );
};

export default ProtocolCard;
