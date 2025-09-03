import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { StatisticalSummary } from '../types/analytics';

interface DescriptiveStatsProps {
  data: StatisticalSummary;
  parameterName: string;
  unit?: string;
}

const DescriptiveStats: React.FC<DescriptiveStatsProps> = ({ 
  data, 
  parameterName, 
  unit = '' 
}) => {
  const formatValue = (value: number): string => {
    return `${value.toFixed(3)} ${unit}`.trim();
  };

  const getSkewnessInterpretation = (skewness: number): string => {
    if (Math.abs(skewness) < 0.5) return 'Rozkład symetryczny';
    if (skewness > 0.5) return 'Rozkład prawostronnie skośny';
    return 'Rozkład lewostronnie skośny';
  };

  const getKurtosisInterpretation = (kurtosis: number): string => {
    if (Math.abs(kurtosis) < 0.5) return 'Rozkład normalny (mezokurtyczny)';
    if (kurtosis > 0.5) return 'Rozkład leptokurtyczny (spiczasty)';
    return 'Rozkład platykurtyczny (spłaszczony)';
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Statystyki opisowe - {parameterName}
        </Typography>
        
        <Grid container spacing={2}>
          {/* Miary tendencji centralnej */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="primary.contrastText">
                Miary tendencji centralnej
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Średnia:</strong> {formatValue(data.mean)}
                </Typography>
                <Typography variant="body2">
                  <strong>Mediana:</strong> {formatValue(data.median)}
                </Typography>
                <Typography variant="body2">
                  <strong>Moda:</strong> {data.mode.map(m => formatValue(m)).join(', ')}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Miary rozproszenia */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, bgcolor: 'secondary.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="secondary.contrastText">
                Miary rozproszenia
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Odch. standardowe:</strong> {formatValue(data.standardDeviation)}
                </Typography>
                <Typography variant="body2">
                  <strong>Wariancja:</strong> {formatValue(data.variance)}
                </Typography>
                <Typography variant="body2">
                  <strong>Rozstęp:</strong> {formatValue(data.range)}
                </Typography>
                <Typography variant="body2">
                  <strong>Min:</strong> {formatValue(data.min)}
                </Typography>
                <Typography variant="body2">
                  <strong>Max:</strong> {formatValue(data.max)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Kwartyle */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="info.contrastText">
                Kwartyle
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Q1:</strong> {formatValue(data.quartiles.q1)}
                </Typography>
                <Typography variant="body2">
                  <strong>Q2 (Mediana):</strong> {formatValue(data.quartiles.q2)}
                </Typography>
                <Typography variant="body2">
                  <strong>Q3:</strong> {formatValue(data.quartiles.q3)}
                </Typography>
                <Typography variant="body2">
                  <strong>IQR:</strong> {formatValue(data.quartiles.q3 - data.quartiles.q1)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Przedział ufności */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="success.contrastText">
                Przedział ufności 95%
              </Typography>
              <Box sx={{ mt: 1 }}>
                {data.confidence95 ? (
                  <>
                    <Typography variant="body2">
                      <strong>Dolna granica:</strong> {formatValue(data.confidence95.lower)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Górna granica:</strong> {formatValue(data.confidence95.upper)}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Szerokość:</strong> {formatValue(data.confidence95.upper - data.confidence95.lower)}
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Brak danych
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Kształt rozkładu */}
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
              <Typography variant="subtitle2" color="warning.contrastText">
                Kształt rozkładu
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  <strong>Skośność:</strong> {data.skewness.toFixed(3)}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8em' }}>
                  {getSkewnessInterpretation(data.skewness)}
                </Typography>
                <Typography variant="body2">
                  <strong>Kurtoza:</strong> {data.kurtosis.toFixed(3)}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.8em' }}>
                  {getKurtosisInterpretation(data.kurtosis)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Wartości odstające */}
          {data.outliers.length > 0 && (
            <Grid item xs={12}>
              <Box sx={{ p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="error.contrastText">
                  Wartości odstające ({data.outliers.length})
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {data.outliers.map((outlier, index) => (
                    <Chip
                      key={index}
                      label={formatValue(outlier)}
                      size="small"
                      color="error"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Informacje dodatkowe */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="subtitle2">
                Informacje dodatkowe
              </Typography>
              <Typography variant="body2">
                <strong>Liczba obserwacji:</strong> {data.sampleSize}
              </Typography>
              <Typography variant="body2">
                <strong>Współczynnik zmienności:</strong> {((data.standardDeviation / data.mean) * 100).toFixed(2)}%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DescriptiveStats;
