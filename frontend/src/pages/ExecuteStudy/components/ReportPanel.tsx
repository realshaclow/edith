import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';
import { Assessment, GetApp } from '@mui/icons-material';
import { ExecutionContext, ExecutionSession } from '../types';

interface ReportPanelProps {
  session: ExecutionSession | null;
  context: ExecutionContext;
  onGenerateReport: () => Promise<boolean>;
}

const ReportPanel: React.FC<ReportPanelProps> = ({
  session,
  context,
  onGenerateReport
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
        Raport z badania
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Assessment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Generowanie raportu
              </Typography>
              <Typography variant="body2" paragraph>
                Funkcjonalność raportów w rozwoju...
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<GetApp />}
                onClick={onGenerateReport}
              >
                Generuj raport
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportPanel;
