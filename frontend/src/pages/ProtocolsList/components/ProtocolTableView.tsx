import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Typography,
  Avatar,
  Stack
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import { Protocol } from '../types';

interface ProtocolTableViewProps {
  protocols: Protocol[];
  onView: (protocol: Protocol) => void;
  onEdit?: (protocol: Protocol) => void;
  onDelete?: (protocol: Protocol) => void;
  showActions?: boolean;
}

const ProtocolTableView: React.FC<ProtocolTableViewProps> = ({
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
    <TableContainer component={Paper} elevation={1}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'grey.50' }}>
            <TableCell>Protokół</TableCell>
            <TableCell>Kategoria</TableCell>
            <TableCell>Typ</TableCell>
            <TableCell>Poziom</TableCell>
            <TableCell>Czas trwania</TableCell>
            <TableCell>Kroki</TableCell>
            <TableCell>Utworzono</TableCell>
            {showActions && <TableCell align="right">Akcje</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {protocols.map((protocol) => (
            <TableRow
              key={protocol.id}
              hover
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'action.hover'
                }
              }}
              onClick={() => onView(protocol)}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    {getCategoryIcon(protocol.category)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" component="div">
                      {protocol.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {protocol.description}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              
              <TableCell>
                <Chip
                  label={protocol.category}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              </TableCell>
              
              <TableCell>
                <Chip
                  label={protocol.type}
                  size="small"
                  variant="outlined"
                  color={protocol.type === 'PREDEFINED' ? 'success' : 'info'}
                />
              </TableCell>
              
              <TableCell>
                {protocol.difficulty ? (
                  <Chip
                    label={protocol.difficulty}
                    size="small"
                    color={getDifficultyColor(protocol.difficulty) as any}
                    variant="filled"
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    N/A
                  </Typography>
                )}
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {formatDuration(protocol.estimatedDuration)}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2">
                  {protocol.steps?.length || 0}
                </Typography>
              </TableCell>
              
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(protocol.createdAt)}
                </Typography>
              </TableCell>
              
              {showActions && (
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
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
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProtocolTableView;
