import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  TablePagination
} from '@mui/material';
import {
  CheckCircle as CompleteIcon,
  Cancel as ErrorIcon,
  Schedule as PendingIcon,
  ExpandMore as ExpandIcon,
  ExpandLess as CollapseIcon,
  Visibility as ViewIcon,
  PlayArrow as InProgressIcon
} from '@mui/icons-material';
import { StudyExecution } from '../../types/professional';

interface SampleResultsTableProps {
  execution: StudyExecution;
}

export const SampleResultsTable: React.FC<SampleResultsTableProps> = ({
  execution
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleExpandRow = (sampleId: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(sampleId)) {
      newExpanded.delete(sampleId);
    } else {
      newExpanded.add(sampleId);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CompleteIcon color="success" fontSize="small" />;
      case 'FAILED':
        return <ErrorIcon color="error" fontSize="small" />;
      case 'IN_PROGRESS':
        return <InProgressIcon color="primary" fontSize="small" />;
      default:
        return <PendingIcon color="warning" fontSize="small" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Ukończone';
      case 'FAILED': return 'Błąd';
      case 'IN_PROGRESS': return 'W trakcie';
      case 'SKIPPED': return 'Pominięte';
      case 'PENDING': return 'Oczekuje';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'success' as const;
      case 'FAILED': return 'error' as const;
      case 'IN_PROGRESS': return 'primary' as const;
      case 'SKIPPED': return 'warning' as const;
      default: return 'default' as const;
    }
  };

  const formatDuration = (sample: any) => {
    if (!sample.startedAt || !sample.completedAt) return '-';
    const duration = new Date(sample.completedAt).getTime() - new Date(sample.startedAt).getTime();
    const minutes = Math.floor(duration / (1000 * 60));
    const seconds = Math.floor((duration % (1000 * 60)) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const paginatedSamples = execution.samples.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Wyniki Próbek
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {execution.samples.length} próbek w sumie
        </Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell><strong>Próbka</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Czas wykonania</strong></TableCell>
              <TableCell><strong>Liczba pomiarów</strong></TableCell>
              <TableCell><strong>Materiał</strong></TableCell>
              <TableCell><strong>Akcje</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSamples.map((sample: any, index: number) => (
              <React.Fragment key={sample.id}>
                <TableRow hover>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleExpandRow(sample.id)}
                    >
                      {expandedRows.has(sample.id) ? <CollapseIcon /> : <ExpandIcon />}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      {getStatusIcon(sample.status)}
                      <Typography variant="body2" fontWeight="medium">
                        {sample.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(sample.status)}
                      color={getStatusColor(sample.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDuration(sample)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {sample.measurements ? sample.measurements.length : 0}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {sample.material || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
                
                {/* Expanded Row Content */}
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 0 }}>
                    <Collapse in={expandedRows.has(sample.id)}>
                      <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Szczegóły próbki
                        </Typography>
                        
                        {sample.description && (
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            <strong>Opis:</strong> {sample.description}
                          </Typography>
                        )}
                        
                        {sample.dimensions && (
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            <strong>Wymiary:</strong> {sample.dimensions}
                          </Typography>
                        )}
                        
                        {sample.weight && (
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            <strong>Waga:</strong> {sample.weight}g
                          </Typography>
                        )}
                        
                        {sample.measurements && sample.measurements.length > 0 ? (
                          <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              Pomiary:
                            </Typography>
                            {sample.measurements.map((measurement: any, idx: number) => (
                              <Box key={idx} display="flex" justifyContent="space-between" py={0.5}>
                                <Typography variant="body2">
                                  Krok {measurement.stepId}:
                                </Typography>
                                <Typography variant="body2" fontWeight="medium">
                                  {measurement.value} 
                                  {measurement.notes && ` (${measurement.notes})`}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Brak pomiarów dla tej próbki
                          </Typography>
                        )}
                        
                        {sample.notes && (
                          <Box mt={2}>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                              Notatki:
                            </Typography>
                            <Typography variant="body2">
                              {sample.notes}
                            </Typography>
                          </Box>
                        )}
                        
                        {sample.operator && (
                          <Box mt={2}>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Operator:</strong> {sample.operator}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={execution.samples.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Wierszy na stronę:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}–${to} z ${count !== -1 ? count : `więcej niż ${to}`}`
        }
      />
    </Paper>
  );
};
