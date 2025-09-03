import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert
} from '@mui/material';
import { ExecutionContext, ExecutionSession } from '../types';

interface ResultsPanelProps {
  session: ExecutionSession | null;
  context: ExecutionContext;
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({
  session,
  context
}) => {
  if (!session) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Brak danych sesji
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Wyniki badania
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Podsumowanie wyników
              </Typography>
              <Typography variant="body2">
                Funkcjonalność wyników w rozwoju...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ResultsPanel;
