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
  LinearProgress,
  Alert,
  Chip
} from '@mui/material';
import { UncertaintyAnalysis } from '../types/analytics';

interface UncertaintyAnalysisChartProps {
  data: UncertaintyAnalysis;
  parameterName: string;
  unit?: string;
}

const UncertaintyAnalysisChart: React.FC<UncertaintyAnalysisChartProps> = ({
  data,
  parameterName,
  unit = ''
}) => {
  const formatValue = (value: number): string => {
    return `${value.toFixed(4)} ${unit}`.trim();
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  const getUncertaintyLevel = (expandedValue: number, referenceValue: number = 1): {
    level: 'low' | 'medium' | 'high';
    color: 'success' | 'warning' | 'error';
    description: string;
  } => {
    const percentage = (expandedValue / referenceValue) * 100;
    
    if (percentage < 2) {
      return {
        level: 'low',
        color: 'success',
        description: 'Niska niepewność - wyniki o wysokiej dokładności'
      };
    } else if (percentage < 5) {
      return {
        level: 'medium',
        color: 'warning',
        description: 'Umiarkowana niepewność - akceptowalna dokładność'
      };
    } else {
      return {
        level: 'high',
        color: 'error',
        description: 'Wysoka niepewność - wymaga poprawy dokładności'
      };
    }
  };

  const uncertaintyLevel = getUncertaintyLevel(data.expandedUncertainty.value);

  const renderUncertaintyBudget = () => {
    if (!data.uncertaintyBudget || data.uncertaintyBudget.length === 0) {
      return (
        <Alert severity="info">
          Brak dostępnych danych dla budżetu niepewności
        </Alert>
      );
    }

    const maxContribution = Math.max(...data.uncertaintyBudget.map(item => item.contribution));
    
    return (
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Składnik niepewności</strong></TableCell>
              <TableCell align="center"><strong>Wartość</strong></TableCell>
              <TableCell align="center"><strong>Udział (%)</strong></TableCell>
              <TableCell align="center"><strong>Wizualizacja</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.uncertaintyBudget.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.component}</TableCell>
                <TableCell align="center">{formatValue(item.value)}</TableCell>
                <TableCell align="center">
                  <strong>{formatPercentage(item.contribution)}</strong>
                </TableCell>
                <TableCell align="center">
                  <LinearProgress
                    variant="determinate"
                    value={(item.contribution / maxContribution) * 100}
                    color={item.contribution > 50 ? 'error' : item.contribution > 25 ? 'warning' : 'primary'}
                    sx={{ width: '100px', height: 8 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderComponentsBreakdown = () => {
    if (!data.typeB.components || data.typeB.components.length === 0) {
      return (
        <Alert severity="info">
          Brak dostępnych składników typu B
        </Alert>
      );
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Składniki niepewności typu B
        </Typography>
        {data.typeB.components.map((component, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.300', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2">
                <strong>{component.source}</strong>
              </Typography>
              <Chip 
                label={component.distribution} 
                size="small" 
                color="primary" 
                variant="outlined"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Wartość: {formatValue(component.value)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Dzielnik: {component.divisor.toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  const renderUncertaintyChart = () => {
    const budget = data.uncertaintyBudget || [];
    if (budget.length === 0) return null;

    const total = 100;
    let currentAngle = 0;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    
    const colors = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'];

    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {budget.map((component, index) => {
            const percentage = component.contribution;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            
            const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
            const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
            const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
            const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${startX} ${startY}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              'Z'
            ].join(' ');
            
            currentAngle += angle;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth="2"
              />
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
          Analiza niepewności pomiaru - {parameterName}
        </Typography>

        <Grid container spacing={3}>
          {/* Główne wyniki */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h4" color={uncertaintyLevel.color}>
                    {formatValue(data.expandedUncertainty.value)}
                  </Typography>
                  <Typography variant="body2">Niepewność rozszerzona (U)</Typography>
                  <Typography variant="caption" color="text.secondary">
                    k = {data.expandedUncertainty.coverageFactor}, poziom ufności {data.expandedUncertainty.confidenceLevel}%
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Niepewność typu A (statystyczna):</strong> {formatValue(data.typeA.standardUncertainty)}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Stopnie swobody:</strong> {data.typeA.degreesOfFreedom}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Rozkład:</strong> {data.typeA.distribution}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Niepewność typu B (łączna):</strong> {formatValue(data.typeB.combinedUncertainty)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Status niepewności */}
          <Grid item xs={12}>
            <Alert severity={uncertaintyLevel.color}>
              <Typography variant="body2">
                <strong>Status:</strong> {uncertaintyLevel.description}
              </Typography>
            </Alert>
          </Grid>

          {/* Budżet niepewności */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Budżet niepewności
            </Typography>
            {renderUncertaintyBudget()}
          </Grid>

          {/* Składniki typu B */}
          <Grid item xs={12}>
            {renderComponentsBreakdown()}
          </Grid>

          {/* Wykres kołowy */}
          {data.uncertaintyBudget && data.uncertaintyBudget.length > 0 && (
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Rozkład udziału składników
              </Typography>
              {renderUncertaintyChart()}
            </Grid>
          )}

          {/* Interpretacja i rekomendacje */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>
              Interpretacja wyników
            </Typography>
            
            <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mb: 2 }}>
              <Typography variant="body2" paragraph>
                <strong>Dominujący składnik:</strong> {
                  data.uncertaintyBudget && data.uncertaintyBudget.length > 0
                    ? data.uncertaintyBudget.reduce((prev, current) => 
                        prev.contribution > current.contribution ? prev : current
                      ).component
                    : 'Brak danych'
                }
              </Typography>
              
              <Typography variant="body2" paragraph>
                <strong>Zalecenia optymalizacji:</strong>
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                {data.uncertaintyBudget && data.uncertaintyBudget.map((component, index) => {
                  if (component.contribution > 30) {
                    return (
                      <Typography component="li" variant="body2" key={index} sx={{ mb: 1 }}>
                        Zmniejsz udział składnika: {component.component} ({formatPercentage(component.contribution)})
                      </Typography>
                    );
                  }
                  return null;
                })}
              </Box>
            </Box>
          </Grid>

          {/* Wzory i obliczenia */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>
              Wzory obliczeniowe
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Niepewność standardowa łączona:</strong>
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
                u<sub>c</sub> = √(u<sub>A</sub>² + u<sub>B</sub>²)
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.9em', mt: 1 }}>
                U = k × u<sub>c</sub> = {data.expandedUncertainty.coverageFactor} × u<sub>c</sub>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UncertaintyAnalysisChart;
