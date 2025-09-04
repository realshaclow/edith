import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Menu,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  FileDownload as FileDownloadIcon,
  PictureAsPdf as PdfIcon,
  TableChart as ExcelIcon,
  GetApp as GetAppIcon,
  Description as TemplateIcon,
  CloudDownload as CloudDownloadIcon
} from '@mui/icons-material';
import { StudyExecution } from '../../types/professional';
import { exportService } from '../../../../services/export';

interface ExportActionsProps {
  execution: StudyExecution;
}

const ExportActions: React.FC<ExportActionsProps> = ({ execution }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const showStatus = (message: string, severity: 'success' | 'error') => {
    setExportStatus({ open: true, message, severity });
  };

  const hideStatus = () => {
    setExportStatus({ open: false, message: '', severity: 'success' });
  };

  const handleExport = async (exportType: string) => {
    setIsExporting(true);
    handleClose();

    try {
      // Walidacja danych
      exportService.validateExportData(execution);

      switch (exportType) {
        case 'pdf-complete':
          await exportService.exportStudyToPDF(execution);
          showStatus('Raport PDF został wygenerowany pomyślnie', 'success');
          break;

        case 'pdf-samples':
          await exportService.exportSampleResultsToPDF(execution);
          showStatus('Wyniki próbek PDF zostały wygenerowane pomyślnie', 'success');
          break;

        case 'excel-complete':
          await exportService.exportStudyToExcel(execution);
          showStatus('Raport Excel został wygenerowany pomyślnie', 'success');
          break;

        case 'excel-samples':
          await exportService.exportSampleResultsToExcel(execution);
          showStatus('Wyniki próbek Excel zostały wygenerowane pomyślnie', 'success');
          break;

        case 'template':
          await exportService.exportSampleTemplate();
          showStatus('Szablon próbek został wygenerowany pomyślnie', 'success');
          break;

        case 'all-formats':
          await exportService.exportStudyToAllFormats(execution);
          showStatus('Wszystkie raporty zostały wygenerowane pomyślnie', 'success');
          break;

        default:
          throw new Error('Nieznany typ eksportu');
      }
    } catch (error) {
      console.error('Błąd eksportu:', error);
      showStatus(
        error instanceof Error ? error.message : 'Wystąpił błąd podczas eksportu',
        'error'
      );
    } finally {
      setIsExporting(false);
    }
  };

  const isMenuOpen = Boolean(anchorEl);
  const completedSamples = execution.samples.filter(s => s.status === 'COMPLETED').length;
  const hasMeasurements = execution.samples.some(s => s.measurements && s.measurements.length > 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FileDownloadIcon />
        Eksport Danych
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Wygeneruj profesjonalne raporty w formatach PDF i Excel
      </Typography>

      {!hasMeasurements && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Brak danych pomiarowych. Raporty będą zawierały tylko podstawowe informacje.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={isExporting ? <CircularProgress size={20} /> : <GetAppIcon />}
          onClick={handleClick}
          disabled={isExporting}
          sx={{
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            minWidth: 180
          }}
        >
          {isExporting ? 'Generowanie...' : 'Pobierz Raporty'}
        </Button>

        <Button
          variant="outlined"
          startIcon={<TemplateIcon />}
          onClick={() => handleExport('template')}
          disabled={isExporting}
        >
          Szablon Próbek
        </Button>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        PaperProps={{
          sx: { minWidth: 250 }
        }}
      >
        <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
          <Typography variant="subtitle2" color="primary">
            Eksport PDF
          </Typography>
        </MenuItem>
        
        <MenuItem onClick={() => handleExport('pdf-complete')}>
          <ListItemIcon>
            <PdfIcon color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Kompletny Raport PDF"
            secondary="Wszystkie dane z wykresami"
          />
        </MenuItem>

        <MenuItem onClick={() => handleExport('pdf-samples')}>
          <ListItemIcon>
            <PdfIcon color="error" />
          </ListItemIcon>
          <ListItemText
            primary="Wyniki Próbek PDF"
            secondary="Szczegółowe pomiary próbek"
          />
        </MenuItem>

        <Divider />

        <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
          <Typography variant="subtitle2" color="primary">
            Eksport Excel
          </Typography>
        </MenuItem>

        <MenuItem onClick={() => handleExport('excel-complete')}>
          <ListItemIcon>
            <ExcelIcon color="success" />
          </ListItemIcon>
          <ListItemText
            primary="Kompletne Dane Excel"
            secondary="Wszystkie arkusze z danymi"
          />
        </MenuItem>

        <MenuItem onClick={() => handleExport('excel-samples')}>
          <ListItemIcon>
            <ExcelIcon color="success" />
          </ListItemIcon>
          <ListItemText
            primary="Wyniki Próbek Excel"
            secondary="Szczegółowe dane próbek"
          />
        </MenuItem>

        <Divider />

        <MenuItem onClick={() => handleExport('all-formats')}>
          <ListItemIcon>
            <CloudDownloadIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Wszystkie Formaty"
            secondary="PDF + Excel jednocześnie"
          />
        </MenuItem>
      </Menu>

      <Snackbar
        open={exportStatus.open}
        autoHideDuration={6000}
        onClose={hideStatus}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={hideStatus} severity={exportStatus.severity}>
          {exportStatus.message}
        </Alert>
      </Snackbar>

      {/* Informacje o danych */}
      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" display="block" gutterBottom>
          <strong>Statystyki eksportu:</strong>
        </Typography>
        <Typography variant="caption" display="block">
          • {execution.samples.length} próbek (ukończone: {completedSamples})
        </Typography>
        <Typography variant="caption" display="block">
          • {execution.samples.reduce((sum, s) => sum + (s.measurements?.length || 0), 0)} pomiarów
        </Typography>
        <Typography variant="caption" display="block">
          • Status: {execution.status === 'COMPLETED' ? 'Ukończone' : 'W trakcie'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ExportActions;
