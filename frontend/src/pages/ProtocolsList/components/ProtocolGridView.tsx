import React from 'react';
import {
  Grid,
  Box,
  Typography
} from '@mui/material';
import {
  Science as ScienceIcon
} from '@mui/icons-material';
import { Protocol } from '../types';
import ProtocolCard from './ProtocolCard';

interface ProtocolGridViewProps {
  protocols: Protocol[];
  onView: (protocol: Protocol) => void;
  onEdit?: (protocol: Protocol) => void;
  onDelete?: (protocol: Protocol) => void;
  showActions?: boolean;
}

const ProtocolGridView: React.FC<ProtocolGridViewProps> = ({
  protocols,
  onView,
  onEdit,
  onDelete,
  showActions = true
}) => {
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
    <Grid container spacing={3}>
      {protocols.map((protocol) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={4} 
          lg={3} 
          key={protocol.id}
        >
          <ProtocolCard
            protocol={protocol}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            showActions={showActions}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ProtocolGridView;
