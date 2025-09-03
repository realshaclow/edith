import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ShowChart
} from '@mui/icons-material';
import { TrendAnalysis } from '../types/analytics';

interface TrendAnalysisChartProps {
  data: TrendAnalysis;
  parameterName: string;
  unit?: string;
  values: number[];
  timePoints?: Date[];
}

const TrendAnalysisChart: React.FC<TrendAnalysisChartProps> = ({
  data,
  parameterName,
  unit = '',
  values,
  timePoints
}) => {
  const formatValue = (value: number): string => {
    return `${value.toFixed(3)} ${unit}`.trim();
  };

  const getTrendIcon = () => {
    switch (data.trend) {
      case 'increasing':
        return <TrendingUp color="success" />;
      case 'decreasing':
        return <TrendingDown color="error" />;
      case 'stable':
        return <TrendingFlat color="info" />;
      default:
        return <TrendingFlat />;
    }
  };

  const getTrendColor = (): 'success' | 'error' | 'info' | 'warning' => {
    switch (data.trend) {
      case 'increasing':
        return 'success';
      case 'decreasing':
        return 'error';
      case 'stable':
        return 'info';
      default:
        return 'info';
    }
  };

  const getTrendDescription = (): string => {
    switch (data.trend) {
      case 'increasing':
        return 'Trend rosnący - wartości mają tendencję wzrostową';
      case 'decreasing':
        return 'Trend malejący - wartości mają tendencję spadkową';
      case 'stable':
        return 'Trend stabilny - wartości pozostają na stałym poziomie';
      default:
        return 'Trend nieokreślony';
    }
  };

  const getCorrelationStrength = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (abs >= 0.9) return 'Bardzo silna';
    if (abs >= 0.7) return 'Silna';
    if (abs >= 0.5) return 'Umiarkowana';
    if (abs >= 0.3) return 'Słaba';
    return 'Bardzo słaba';
  };

  const renderTrendChart = () => {
    if (values.length < 2) return null;

    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const range = maxVal - minVal || 1;

    return (
      <Box sx={{ position: 'relative', height: 250, mt: 2 }}>
        <svg width="100%" height="100%" viewBox="0 0 800 250">
          {/* Osie */}
          <line x1="50" y1="200" x2="750" y2="200" stroke="#ccc" strokeWidth="1" />
          <line x1="50" y1="20" x2="50" y2="200" stroke="#ccc" strokeWidth="1" />

          {/* Linia trendu */}
          {values.map((value, index) => {
            if (index === 0) return null;
            
            const x1 = 50 + ((index - 1) * (700 / (values.length - 1)));
            const x2 = 50 + (index * (700 / (values.length - 1)));
            const y1 = 200 - (((values[index - 1] - minVal) / range) * 180);
            const y2 = 200 - (((value - minVal) / range) * 180);
            
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#2196f3"
                strokeWidth="2"
              />
            );
          })}

          {/* Punkty danych */}
          {values.map((value, index) => {
            const x = 50 + (index * (700 / (values.length - 1)));
            const y = 200 - (((value - minVal) / range) * 180);
            
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill="#2196f3"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* Linia regresji (jeśli dostępna) */}
          {data.trendStrength > 0 && (
            <>
              <line
                x1="50"
                y1={200 - (data.trendStrength > 0 ? 20 : 160)}
                x2="750"
                y2={200 - (data.trendStrength > 0 ? 160 : 20)}
                stroke="red"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.7"
              />
              <text x="400" y="15" textAnchor="middle" fontSize="12" fill="red">
                Linia trendu
              </text>
            </>
          )}

          {/* Etykiety osi */}
          <text x="400" y="235" textAnchor="middle" fontSize="12" fill="#666">
            Pomiar
          </text>
          <text x="25" y="15" textAnchor="middle" fontSize="12" fill="#666">
            {unit}
          </text>
        </svg>
      </Box>
    );
  };

  const renderForecast = () => {
    if (!data.forecast || data.forecast.nextValues.length === 0) return null;

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Prognoza ({data.forecast.timeHorizon} następnych pomiarów)
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {data.forecast.nextValues.map((value, index) => (
            <Chip
              key={index}
              label={`${index + 1}: ${formatValue(value)}`}
              color="primary"
              variant="outlined"
              size="small"
            />
          ))}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Wiarygodność prognozy: {(data.forecast.confidence * 100).toFixed(1)}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={data.forecast.confidence * 100}
          sx={{ mt: 1 }}
        />
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Analiza trendów - {parameterName}
        </Typography>

        <Grid container spacing={3}>
          {/* Identyfikacja trendu */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Identyfikacja trendu
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {getTrendIcon()}
                <Box sx={{ ml: 2 }}>
                  <Typography variant="h6" color={getTrendColor()}>
                    {data.trend.toUpperCase()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getTrendDescription()}
                  </Typography>
                </Box>
              </Box>

              <Typography variant="body2">
                <strong>Siła trendu:</strong> {data.trendStrength.toFixed(4)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={Math.min(data.trendStrength * 100, 100)}
                color={getTrendColor()}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>

          {/* Korelacja */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Analiza korelacji
              </Typography>
              
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="h4" color={data.correlation >= 0 ? 'success.main' : 'error.main'}>
                  {data.correlation.toFixed(3)}
                </Typography>
                <Typography variant="body2">Współczynnik korelacji</Typography>
              </Box>

              <Typography variant="body2">
                <strong>Siła korelacji:</strong> {getCorrelationStrength(data.correlation)}
              </Typography>
              <Typography variant="body2">
                <strong>Kierunek:</strong> {data.correlation >= 0 ? 'Pozytywny' : 'Negatywny'}
              </Typography>
              
              <LinearProgress
                variant="determinate"
                value={Math.abs(data.correlation) * 100}
                color={Math.abs(data.correlation) >= 0.7 ? 'success' : 'warning'}
                sx={{ mt: 1 }}
              />
            </Box>
          </Grid>

          {/* Wykres trendu */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Wykres trendu
            </Typography>
            {renderTrendChart()}
          </Grid>

          {/* Prognoza */}
          {data.forecast && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Prognoza wartości
                </Typography>
                {renderForecast()}
              </Box>
            </Grid>
          )}

          {/* Ostrzeżenia i rekomendacje */}
          <Grid item xs={12}>
            {data.trendStrength > 0.1 && data.trend !== 'stable' && (
              <Alert 
                severity={data.trend === 'decreasing' ? 'warning' : 'info'}
                sx={{ mb: 1 }}
              >
                <strong>Wykryto znaczący trend {data.trend}.</strong> 
                {data.trend === 'decreasing' 
                  ? ' Zaleca się monitorowanie procesu i identyfikację przyczyn spadku.'
                  : ' Proces wykazuje stabilny kierunek zmian.'
                }
              </Alert>
            )}
            
            {Math.abs(data.correlation) >= 0.7 && (
              <Alert severity="success">
                <strong>Silna korelacja czasowa.</strong> 
                Trend jest dobrze zdefiniowany i nadaje się do prognozowania.
              </Alert>
            )}
            
            {Math.abs(data.correlation) < 0.3 && (
              <Alert severity="info">
                <strong>Słaba korelacja czasowa.</strong> 
                Dane mogą być losowe lub zawierać szum. Prognozowanie może być nieścisłe.
              </Alert>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default TrendAnalysisChart;
