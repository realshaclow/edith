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
  LinearProgress
} from '@mui/material';
import { ReferenceComparison, ComplianceCheck, ReferenceValue } from '../types/analytics';

interface ReferenceComparisonChartProps {
  data: ReferenceComparison;
  parameterName: string;
  unit?: string;
  measuredValue: number;
}

const ReferenceComparisonChart: React.FC<ReferenceComparisonChartProps> = ({
  data,
  parameterName,
  unit = '',
  measuredValue
}) => {
  const formatValue = (value: number): string => {
    return `${value.toFixed(3)} ${unit}`.trim();
  };

  const getComplianceColor = (isCompliant: boolean): 'success' | 'error' => {
    return isCompliant ? 'success' : 'error';
  };

  const getComplianceIcon = (isCompliant: boolean) => {
    return isCompliant ? '✓' : '✗';
  };

  const renderReferenceValues = () => {
    if (data.referenceValues.length === 0) {
      return (
        <Alert severity="info">
          Brak dostępnych wartości referencyjnych dla parametru {parameterName}
        </Alert>
      );
    }

    return (
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Źródło</strong></TableCell>
              <TableCell><strong>Standard/Norma</strong></TableCell>
              <TableCell align="center"><strong>Wartość referencyjna</strong></TableCell>
              <TableCell align="center"><strong>Zakres tolerancji</strong></TableCell>
              <TableCell align="center"><strong>Materiał</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.referenceValues.map((ref, index) => (
              <TableRow key={index}>
                <TableCell>{ref.source}</TableCell>
                <TableCell>
                  <Chip label={ref.standard} size="small" color="primary" variant="outlined" />
                </TableCell>
                <TableCell align="center">{formatValue(ref.value)}</TableCell>
                <TableCell align="center">
                  {ref.range ? `${formatValue(ref.range.min)} - ${formatValue(ref.range.max)}` : 'Nie określono'}
                </TableCell>
                <TableCell align="center">{ref.material}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderComplianceAnalysis = () => {
    if (data.compliance.length === 0) {
      return (
        <Alert severity="info">
          Brak analizy zgodności dla parametru {parameterName}
        </Alert>
      );
    }

    return (
      <Box>
        {data.compliance.map((compliance, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={2}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" color={getComplianceColor(compliance.isCompliant)}>
                      {getComplianceIcon(compliance.isCompliant)}
                    </Typography>
                    <Typography variant="body2">
                      {compliance.isCompliant ? 'Zgodny' : 'Niezgodny'}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={10}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2">
                        <strong>Zmierzono:</strong> {formatValue(compliance.measured)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2">
                        <strong>Referencja:</strong> {formatValue(compliance.reference)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2">
                        <strong>Tolerancja:</strong> ±{formatValue(compliance.tolerance)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2">
                        <strong>Odchylenie:</strong> 
                        <span style={{ color: compliance.deviation >= 0 ? 'green' : 'red' }}>
                          {compliance.deviation >= 0 ? '+' : ''}{formatValue(compliance.deviation)}
                        </span>
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Odchylenie procentowe:</strong> {compliance.deviationPercent.toFixed(2)}%
                    </Typography>
                    
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(Math.abs(compliance.deviationPercent), 100)}
                      color={Math.abs(compliance.deviationPercent) <= 5 ? 'success' : 
                             Math.abs(compliance.deviationPercent) <= 15 ? 'warning' : 'error'}
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    
                    <Typography variant="caption" color="text.secondary">
                      Dopuszczalne odchylenie: ±5% (doskonałe), ±15% (akceptowalne)
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  const renderVisualComparison = () => {
    const references = data.referenceValues;
    if (references.length === 0) return null;

    const allValues = [
      measuredValue,
      ...references.map(ref => ref.value),
      ...references.flatMap(ref => ref.range ? [ref.range.min, ref.range.max] : [])
    ];
    
    const minVal = Math.min(...allValues);
    const maxVal = Math.max(...allValues);
    const range = maxVal - minVal || 1;

    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Porównanie wizualne
        </Typography>
        
        <Box sx={{ position: 'relative', height: 200, bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
          <svg width="100%" height="100%" viewBox="0 0 800 160">
            {/* Oś */}
            <line x1="50" y1="80" x2="750" y2="80" stroke="#ccc" strokeWidth="2" />
            
            {/* Wartości referencyjne */}
            {references.map((ref, index) => {
              const x = 50 + ((ref.value - minVal) / range) * 700;
              const color = index === 0 ? '#2196F3' : '#4CAF50';
              
              return (
                <g key={index}>
                  {/* Zakres tolerancji */}
                  {ref.range && (
                    <rect
                      x={50 + ((ref.range.min - minVal) / range) * 700}
                      y="70"
                      width={((ref.range.max - ref.range.min) / range) * 700}
                      height="20"
                      fill={color}
                      opacity="0.2"
                    />
                  )}
                  
                  {/* Wartość referencyjna */}
                  <line x1={x} y1="60" x2={x} y2="100" stroke={color} strokeWidth="3" />
                  <text x={x} y="55" textAnchor="middle" fontSize="10" fill={color}>
                    {ref.standard}
                  </text>
                  <text x={x} y="115" textAnchor="middle" fontSize="10" fill={color}>
                    {formatValue(ref.value)}
                  </text>
                </g>
              );
            })}
            
            {/* Wartość zmierzona */}
            <g>
              <circle
                cx={50 + ((measuredValue - minVal) / range) * 700}
                cy="80"
                r="6"
                fill="red"
                stroke="white"
                strokeWidth="2"
              />
              <text 
                x={50 + ((measuredValue - minVal) / range) * 700} 
                y="45" 
                textAnchor="middle" 
                fontSize="12" 
                fontWeight="bold"
                fill="red"
              >
                ZMIERZONE
              </text>
              <text 
                x={50 + ((measuredValue - minVal) / range) * 700} 
                y="125" 
                textAnchor="middle" 
                fontSize="10" 
                fill="red"
              >
                {formatValue(measuredValue)}
              </text>
            </g>
            
            {/* Etykiety osi */}
            <text x="25" y="85" textAnchor="middle" fontSize="12" fill="#666">
              {formatValue(minVal)}
            </text>
            <text x="775" y="85" textAnchor="middle" fontSize="12" fill="#666">
              {formatValue(maxVal)}
            </text>
          </svg>
        </Box>
        
        {/* Legenda */}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: 'red', borderRadius: '50%' }} />
            <Typography variant="body2">Wartość zmierzona</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 3, bgcolor: '#2196F3' }} />
            <Typography variant="body2">Wartość referencyjna</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: '#2196F3', opacity: 0.2 }} />
            <Typography variant="body2">Zakres tolerancji</Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Porównanie z wartościami referencyjnymi - {parameterName}
        </Typography>

        <Grid container spacing={3}>
          {/* Wartości referencyjne */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Wartości referencyjne
            </Typography>
            {renderReferenceValues()}
          </Grid>

          {/* Analiza zgodności */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Analiza zgodności
            </Typography>
            {renderComplianceAnalysis()}
          </Grid>

          {/* Porównanie wizualne */}
          <Grid item xs={12}>
            {renderVisualComparison()}
          </Grid>

          {/* Podsumowanie */}
          {data.compliance.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Podsumowanie
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">
                      <strong>Zgodność ogólna:</strong> {
                        data.compliance.every(c => c.isCompliant) ? '✓ Zgodny' : '✗ Niezgodny'
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">
                      <strong>Średnie odchylenie:</strong> {
                        (data.compliance.reduce((sum, c) => sum + Math.abs(c.deviationPercent), 0) / data.compliance.length).toFixed(2)
                      }%
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="body2">
                      <strong>Liczba norm:</strong> {data.referenceValues.length}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReferenceComparisonChart;
