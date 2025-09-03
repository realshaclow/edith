import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  Tooltip
} from '@mui/material';
import { CorrelationAnalysis } from '../types/analytics';

interface CorrelationAnalysisChartProps {
  data: CorrelationAnalysis;
}

const CorrelationAnalysisChart: React.FC<CorrelationAnalysisChartProps> = ({ data }) => {
  const getCorrelationStrength = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (abs >= 0.9) return 'Bardzo silna';
    if (abs >= 0.7) return 'Silna';
    if (abs >= 0.5) return 'Umiarkowana';
    if (abs >= 0.3) return 'Słaba';
    return 'Bardzo słaba';
  };

  const getCorrelationColor = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (abs >= 0.9) return '#d32f2f'; // czerwony
    if (abs >= 0.7) return '#f57c00'; // pomarańczowy
    if (abs >= 0.5) return '#fbc02d'; // żółty
    if (abs >= 0.3) return '#689f38'; // zielony
    return '#757575'; // szary
  };

  const getCorrelationChip = (correlation: number, pValue: number) => {
    const strength = getCorrelationStrength(correlation);
    const isSignificant = pValue < 0.05;
    const color = isSignificant ? 'primary' : 'default';
    const variant = isSignificant ? 'filled' : 'outlined';
    
    return (
      <Chip
        label={`${strength} (r=${correlation.toFixed(3)})`}
        color={color}
        variant={variant}
        size="small"
      />
    );
  };

  const renderHeatmap = () => {
    const { heatmapData, parameters } = data;
    const cellSize = 60;
    const margin = 80;
    const width = parameters.length * cellSize + 2 * margin;
    const height = parameters.length * cellSize + 2 * margin;

    return (
      <Box sx={{ textAlign: 'center', overflow: 'auto' }}>
        <svg width={width} height={height} style={{ maxWidth: '100%' }}>
          {/* Etykiety osi X */}
          {parameters.map((param, i) => (
            <text
              key={`x-${i}`}
              x={margin + i * cellSize + cellSize / 2}
              y={margin - 10}
              textAnchor="middle"
              fontSize="10"
              transform={`rotate(-45, ${margin + i * cellSize + cellSize / 2}, ${margin - 10})`}
            >
              {param.length > 10 ? `${param.substring(0, 10)}...` : param}
            </text>
          ))}

          {/* Etykiety osi Y */}
          {parameters.map((param, i) => (
            <text
              key={`y-${i}`}
              x={margin - 10}
              y={margin + i * cellSize + cellSize / 2}
              textAnchor="end"
              fontSize="10"
              dominantBaseline="middle"
            >
              {param.length > 10 ? `${param.substring(0, 10)}...` : param}
            </text>
          ))}

          {/* Macierz korelacji */}
          {heatmapData.map((row, i) =>
            row.map((correlation, j) => {
              const x = margin + j * cellSize;
              const y = margin + i * cellSize;
              const intensity = Math.abs(correlation);
              const color = correlation > 0 ? '#1976d2' : '#d32f2f';
              
              return (
                <g key={`cell-${i}-${j}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    fill={color}
                    opacity={intensity}
                    stroke="#fff"
                    strokeWidth="1"
                  />
                  <text
                    x={x + cellSize / 2}
                    y={y + cellSize / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10"
                    fill={intensity > 0.5 ? 'white' : 'black'}
                    fontWeight="bold"
                  >
                    {correlation.toFixed(2)}
                  </text>
                </g>
              );
            })
          )}

          {/* Skala kolorów */}
          <g>
            <text x={width - 50} y={margin - 30} fontSize="12" fontWeight="bold">Skala</text>
            
            {/* Pozytywna korelacja */}
            <rect x={width - 80} y={margin - 10} width={20} height={10} fill="#1976d2" opacity="1" />
            <text x={width - 55} y={margin - 2} fontSize="10">+1</text>
            
            <rect x={width - 80} y={margin + 5} width={20} height={10} fill="#1976d2" opacity="0.5" />
            <text x={width - 55} y={margin + 13} fontSize="10">+0.5</text>
            
            {/* Brak korelacji */}
            <rect x={width - 80} y={margin + 20} width={20} height={10} fill="#fff" stroke="#000" />
            <text x={width - 55} y={margin + 28} fontSize="10">0</text>
            
            {/* Negatywna korelacja */}
            <rect x={width - 80} y={margin + 35} width={20} height={10} fill="#d32f2f" opacity="0.5" />
            <text x={width - 55} y={margin + 43} fontSize="10">-0.5</text>
            
            <rect x={width - 80} y={margin + 50} width={20} height={10} fill="#d32f2f" opacity="1" />
            <text x={width - 55} y={margin + 58} fontSize="10">-1</text>
          </g>
        </svg>
      </Box>
    );
  };

  const renderCorrelationMatrix = () => {
    if (data.correlationMatrix.length === 0) {
      return (
        <Alert severity="info">
          Brak danych do analizy korelacji. Potrzeba co najmniej 2 parametrów z danymi liczbowymi.
        </Alert>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Parametr 1</strong></TableCell>
              <TableCell><strong>Parametr 2</strong></TableCell>
              <TableCell align="center"><strong>Korelacja (r)</strong></TableCell>
              <TableCell align="center"><strong>Siła korelacji</strong></TableCell>
              <TableCell align="center"><strong>p-value</strong></TableCell>
              <TableCell align="center"><strong>Istotność</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.correlationMatrix.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.parameter1}</TableCell>
                <TableCell>{item.parameter2}</TableCell>
                <TableCell align="center">
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'bold',
                      color: item.correlation > 0 ? '#1976d2' : '#d32f2f'
                    }}
                  >
                    {item.correlation.toFixed(3)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  {getCorrelationChip(item.correlation, item.pValue)}
                </TableCell>
                <TableCell align="center">
                  <Typography variant="body2">
                    {item.pValue.toFixed(4)}
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={item.isSignificant ? 'Istotna' : 'Nieistotna'}
                    color={item.isSignificant ? 'success' : 'default'}
                    variant={item.isSignificant ? 'filled' : 'outlined'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderStrongCorrelations = () => {
    if (data.strongCorrelations.length === 0) {
      return (
        <Alert severity="info">
          Nie znaleziono silnych korelacji (|r| ≥ 0.7) między parametrami.
        </Alert>
      );
    }

    return (
      <Grid container spacing={2}>
        {data.strongCorrelations.map((correlation, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="subtitle2">
                    {correlation.parameter1} ↔ {correlation.parameter2}
                  </Typography>
                  <Chip
                    label={`r = ${correlation.correlation.toFixed(3)}`}
                    size="small"
                    sx={{
                      bgcolor: getCorrelationColor(correlation.correlation),
                      color: 'white'
                    }}
                  />
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  {correlation.interpretation}
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Siła korelacji: {getCorrelationStrength(correlation.correlation)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  const renderSummary = () => {
    const totalPairs = data.correlationMatrix.length;
    const significantPairs = data.correlationMatrix.filter(item => item.isSignificant).length;
    const strongPairs = data.strongCorrelations.length;
    
    const averageCorrelation = totalPairs > 0 
      ? data.correlationMatrix.reduce((sum, item) => sum + Math.abs(item.correlation), 0) / totalPairs
      : 0;

    return (
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Podsumowanie analizy korelacji
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography variant="body2">
              <strong>Liczba par:</strong> {totalPairs}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2">
              <strong>Istotne korelacje:</strong> {significantPairs} ({((significantPairs/totalPairs)*100).toFixed(1)}%)
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2">
              <strong>Silne korelacje:</strong> {strongPairs}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2">
              <strong>Średnia siła:</strong> {averageCorrelation.toFixed(3)}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Interpretacja: r &gt; 0.7 (silna), 0.5-0.7 (umiarkowana), 0.3-0.5 (słaba), &lt; 0.3 (bardzo słaba)
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Analiza korelacji między parametrami
        </Typography>

        <Grid container spacing={3}>
          {/* Macierz korelacji */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Macierz korelacji
            </Typography>
            {renderCorrelationMatrix()}
          </Grid>

          {/* Mapa cieplna */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Mapa cieplna korelacji
            </Typography>
            <Box sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2, bgcolor: 'background.paper' }}>
              {renderHeatmap()}
            </Box>
          </Grid>

          {/* Silne korelacje */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Silne korelacje (|r| ≥ 0.7)
            </Typography>
            {renderStrongCorrelations()}
          </Grid>

          {/* Podsumowanie */}
          <Grid item xs={12}>
            {renderSummary()}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysisChart;
