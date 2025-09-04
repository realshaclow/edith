import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider
} from '@mui/material';
import {
  GetApp as ExportIcon,
  Save as SaveIcon,
  ArrowBack as BackIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { StudyExecution } from '../../types/professional';

interface ExportActionsProps {
  execution: StudyExecution;
  onExportReport: () => void;
  onSaveResults: () => void;
  onBackToStudies: () => void;
}

export const ExportActions: React.FC<ExportActionsProps> = ({
  execution,
  onExportReport,
  onSaveResults,
  onBackToStudies
}) => {
  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log('Eksport do PDF');
    onExportReport();
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log('Eksport do Excel');
  };

  const handlePrint = () => {
    // TODO: Implement print functionality
    window.print();
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Działania i Eksport
      </Typography>

      <Grid container spacing={2}>
        {/* Export Options */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Opcje eksportu
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={1}>
            <Button
              variant="contained"
              startIcon={<PdfIcon />}
              onClick={handleExportPDF}
              fullWidth
              size="large"
              sx={{ justifyContent: 'flex-start' }}
            >
              Eksportuj raport PDF
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<ExcelIcon />}
              onClick={handleExportExcel}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Eksportuj dane Excel
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Drukuj podsumowanie
            </Button>
          </Box>
        </Grid>

        {/* Save and Navigation */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Zarządzanie wynikami
          </Typography>
          
          <Box display="flex" flexDirection="column" gap={1}>
            <Button
              variant="contained"
              color="success"
              startIcon={<SaveIcon />}
              onClick={onSaveResults}
              fullWidth
              size="large"
              sx={{ justifyContent: 'flex-start' }}
            >
              Zapisz wyniki
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<BackIcon />}
              onClick={onBackToStudies}
              fullWidth
              sx={{ justifyContent: 'flex-start' }}
            >
              Powrót do listy badań
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Study Information Summary */}
      <Box 
        sx={{ 
          p: 2, 
          bgcolor: 'grey.50', 
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'grey.200'
        }}
      >
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Informacje o eksporcie
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>ID badania:</strong> {execution.id}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Data utworzenia:</strong> {new Date().toLocaleDateString('pl-PL')}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Liczba kroków:</strong> {execution.steps.length}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2">
              <strong>Status:</strong> {execution.status === 'COMPLETED' ? 'Ukończone' : 'W trakcie'}
            </Typography>
          </Grid>
        </Grid>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Wszystkie eksportowane dane będą zawierać pełne informacje o badaniu, 
          wynikach pomiarów, warunkach testowych oraz metadanych.
        </Typography>
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Szybkie działania
        </Typography>
        
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button 
            size="small" 
            variant="text"
            onClick={() => navigator.clipboard.writeText(execution.id)}
          >
            Kopiuj ID badania
          </Button>
          <Button 
            size="small" 
            variant="text"
            onClick={() => console.log('Udostępnij wyniki')}
          >
            Udostępnij wyniki
          </Button>
          <Button 
            size="small" 
            variant="text"
            onClick={() => console.log('Archiwizuj badanie')}
          >
            Archiwizuj badanie
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
