import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert
} from '@mui/material';
import {
  ArrowForward,
  Science,
  CheckCircle
} from '@mui/icons-material';
import { StudySample } from '../types';

interface SamplePreparationPanelProps {
  samples: StudySample[];
  onNext: () => void;
}

const SamplePreparationPanel: React.FC<SamplePreparationPanelProps> = ({
  samples,
  onNext
}) => {
  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Przygotowanie próbek
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Science sx={{ mr: 1, verticalAlign: 'middle' }} />
                Lista próbek ({samples.length})
              </Typography>
              
              {samples.length > 0 ? (
                <List>
                  {samples.map((sample, index) => (
                    <ListItem key={sample.id}>
                      <ListItemText
                        primary={sample.name}
                        secondary={`Typ: ${sample.type} - ${sample.description}`}
                      />
                      <Chip
                        label={sample.status}
                        color={sample.status === 'completed' ? 'success' : 'default'}
                        size="small"
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Alert severity="warning">
                  Brak zdefiniowanych próbek
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              onClick={onNext}
            >
              Rozpocznij wykonywanie
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SamplePreparationPanel;
