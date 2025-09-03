import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { 
  CheckCircle, 
  Warning, 
  Error,
  TrendingUp,
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';
import { QualityControl } from '../types/analytics';

interface QualityControlChartProps {
  data: QualityControl;
  parameterName: string;
  unit?: string;
  values: number[];
}

const QualityControlChart: React.FC<QualityControlChartProps> = ({ 
  data, 
  parameterName, 
  unit = '',
  values 
}) => {
  const formatValue = (value: number): string => {
    return `${value.toFixed(3)} ${unit}`.trim();
  };

  const getCapabilityColor = (cpk: number): 'success' | 'warning' | 'error' => {
    if (cpk >= 1.33) return 'success';
    if (cpk >= 1.0) return 'warning';
    return 'error';
  };

  const getCapabilityText = (cpk: number): string => {
    if (cpk >= 1.33) return 'Proces zdolny';
    if (cpk >= 1.0) return 'Proces marginalnie zdolny';
    return 'Proces niezdolny';
  };

  const getCapabilityIcon = (cpk: number) => {
    if (cpk >= 1.33) return <CheckCircle color="success" />;
    if (cpk >= 1.0) return <Warning color="warning" />;
    return <Error color="error" />;
  };

  const renderControlChart = () => {
    const maxVal = Math.max(...values, data.spc.ucl);
    const minVal = Math.min(...values, data.spc.lcl);
    const range = maxVal - minVal;
    const padding = range * 0.1;

    return (
      <Box sx={{ position: 'relative', height: 300, mt: 2 }}>
        <svg width="100%" height="100%" viewBox="0 0 800 300">
          {/* Linie kontrolne */}
          <line
            x1="50"
            y1={50}
            x2="750"
            y2={50}
            stroke="red"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <text x="760" y="55" fontSize="12" fill="red">UCL</text>
          
          <line
            x1="50"
            y1={150}
            x2="750"
            y2={150}
            stroke="blue"
            strokeWidth="2"
          />
          <text x="760" y="155" fontSize="12" fill="blue">CL</text>
          
          <line
            x1="50"
            y1={250}
            x2="750"
            y2={250}
            stroke="red"
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <text x="760" y="255" fontSize="12" fill="red">LCL</text>

          {/* Punkty danych */}
          {values.map((value, index) => {
            const x = 50 + (index * (700 / (values.length - 1)));
            const normalizedValue = ((value - data.spc.lcl) / (data.spc.ucl - data.spc.lcl));
            const y = 250 - (normalizedValue * 200);
            const isOutOfControl = data.spc.outOfControlPoints.includes(index);
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill={isOutOfControl ? 'red' : 'blue'}
                  stroke="white"
                  strokeWidth="1"
                />
                {index > 0 && (
                  <line
                    x1={50 + ((index - 1) * (700 / (values.length - 1)))}
                    y1={250 - (((values[index - 1] - data.spc.lcl) / (data.spc.ucl - data.spc.lcl)) * 200)}
                    x2={x}
                    y2={y}
                    stroke="blue"
                    strokeWidth="1"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Kontrola jakości SPC - {parameterName}
        </Typography>

        <Grid container spacing={3}>
          {/* Wskaźniki zdolności procesu */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Wskaźniki zdolności procesu
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color={getCapabilityColor(data.spc.cpk || 0)}>
                      {(data.spc.cpk || 0).toFixed(3)}
                    </Typography>
                    <Typography variant="body2">Cpk</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                      {getCapabilityIcon(data.spc.cpk || 0)}
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {getCapabilityText(data.spc.cpk || 0)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4">
                      {(data.spc.cp || 0).toFixed(3)}
                    </Typography>
                    <Typography variant="body2">Cp</Typography>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Pp:</strong> {(data.spc.pp || 0).toFixed(3)}
                </Typography>
                <Typography variant="body2">
                  <strong>Ppk:</strong> {(data.spc.ppk || 0).toFixed(3)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Limity kontrolne */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Limity kontrolne (3σ)
              </Typography>
              
              <Typography variant="body2">
                <strong>UCL:</strong> {formatValue(data.spc.ucl)}
              </Typography>
              <Typography variant="body2">
                <strong>Linia centralna:</strong> {formatValue(data.spc.centerLine)}
              </Typography>
              <Typography variant="body2">
                <strong>LCL:</strong> {formatValue(data.spc.lcl)}
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">
                  <strong>Punkty poza kontrolą:</strong> {data.spc.outOfControlPoints.length}
                </Typography>
                {data.spc.outOfControlPoints.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    {data.spc.outOfControlPoints.map(pointIndex => (
                      <Chip
                        key={pointIndex}
                        label={`Punkt ${pointIndex + 1}: ${formatValue(values[pointIndex])}`}
                        size="small"
                        color="error"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Karta kontrolna */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Karta kontrolna
            </Typography>
            {renderControlChart()}
          </Grid>

          {/* Wskaźniki akceptacji */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Analiza akceptacji
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                      {(data.acceptance?.acceptanceRate || 0).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2">Wskaźnik akceptacji</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={data.acceptance?.acceptanceRate || 0} 
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="error.main">
                      {(data.acceptance?.rejectionRate || 0).toFixed(1)}%
                    </Typography>
                    <Typography variant="body2">Wskaźnik odrzuceń</Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={data.acceptance?.rejectionRate || 0} 
                      color="error"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5">
                      {data.acceptance?.acceptedSamples || 0}
                    </Typography>
                    <Typography variant="body2">Próbki zaakceptowane</Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5">
                      {data.acceptance?.rejectedSamples || 0}
                    </Typography>
                    <Typography variant="body2">Próbki odrzucone</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Kryteria */}
              <Box sx={{ mt: 2 }}>
                {data.acceptance?.criteriaMet && data.acceptance.criteriaMet.length > 0 && (
                  <Alert severity="success" sx={{ mb: 1 }}>
                    <strong>Spełnione kryteria:</strong> {data.acceptance.criteriaMet.join(', ')}
                  </Alert>
                )}
                
                {data.acceptance?.criteriaFailed && data.acceptance.criteriaFailed.length > 0 && (
                  <Alert severity="error">
                    <strong>Niespełnione kryteria:</strong> {data.acceptance.criteriaFailed.join(', ')}
                  </Alert>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QualityControlChart;
