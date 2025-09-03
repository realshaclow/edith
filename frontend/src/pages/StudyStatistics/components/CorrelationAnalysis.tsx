import React, { useMemo } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';

interface CorrelationData {
  parameter1: string;
  parameter2: string;
  correlation: number;
  pValue: number;
  isSignificant: boolean;
  n?: number;
  confidenceInterval?: {
    lower: number;
    upper: number;
  };
}

interface CorrelationAnalysisProps {
  data: CorrelationData[];
  parameters: string[];
  onParameterChange?: (param1: string, param2: string) => void;
}

const CorrelationAnalysis: React.FC<CorrelationAnalysisProps> = ({
  data,
  parameters,
  onParameterChange
}) => {
  const [selectedParam1, setSelectedParam1] = React.useState<string>(parameters[0] || '');
  const [selectedParam2, setSelectedParam2] = React.useState<string>(parameters[1] || '');
  const [showOnlySignificant, setShowOnlySignificant] = React.useState<boolean>(false);

  const correlationMatrix = useMemo(() => {
    const matrix: { [key: string]: { [key: string]: CorrelationData | null } } = {};
    
    parameters.forEach(param1 => {
      matrix[param1] = {};
      parameters.forEach(param2 => {
        if (param1 === param2) {
          matrix[param1][param2] = {
            parameter1: param1,
            parameter2: param2,
            correlation: 1.0,
            pValue: 0,
            isSignificant: true,
            n: data.length > 0 ? data[0].n : 0
          };
        } else {
          const found = data.find(d => 
            (d.parameter1 === param1 && d.parameter2 === param2) ||
            (d.parameter1 === param2 && d.parameter2 === param1)
          );
          matrix[param1][param2] = found || null;
        }
      });
    });
    
    return matrix;
  }, [data, parameters]);

  const filteredData = useMemo(() => {
    return showOnlySignificant ? data.filter(d => d.isSignificant) : data;
  }, [data, showOnlySignificant]);

  const getCorrelationStrength = (correlation: number): string => {
    const abs = Math.abs(correlation);
    if (abs >= 0.9) return 'Bardzo silna';
    if (abs >= 0.7) return 'Silna';
    if (abs >= 0.5) return 'Średnia';
    if (abs >= 0.3) return 'Słaba';
    return 'Bardzo słaba';
  };

  const getCorrelationColor = (correlation: number, isSignificant: boolean): string => {
    if (!isSignificant) return '#666';
    
    const abs = Math.abs(correlation);
    if (abs >= 0.7) return correlation > 0 ? '#4CAF50' : '#F44336';
    if (abs >= 0.5) return correlation > 0 ? '#8BC34A' : '#FF7043';
    if (abs >= 0.3) return correlation > 0 ? '#CDDC39' : '#FFB74D';
    return '#9E9E9E';
  };

  const renderCorrelationMatrix = () => {
    if (parameters.length < 2) {
      return (
        <Alert severity="info">
          Potrzeba przynajmniej 2 parametrów do analizy korelacji
        </Alert>
      );
    }

    return (
      <Box sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Parametr</strong></TableCell>
              {parameters.map(param => (
                <TableCell key={param} align="center" sx={{ minWidth: 100 }}>
                  <strong>{param}</strong>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.map(param1 => (
              <TableRow key={param1}>
                <TableCell component="th" scope="row">
                  <strong>{param1}</strong>
                </TableCell>
                {parameters.map(param2 => {
                  const correlation = correlationMatrix[param1][param2];
                  if (!correlation) {
                    return <TableCell key={param2} align="center">-</TableCell>;
                  }
                  
                  return (
                    <TableCell 
                      key={param2} 
                      align="center"
                      sx={{
                        bgcolor: param1 === param2 ? '#f5f5f5' : 'transparent',
                        color: getCorrelationColor(correlation.correlation, correlation.isSignificant),
                        fontWeight: correlation.isSignificant ? 'bold' : 'normal'
                      }}
                    >
                      {correlation.correlation.toFixed(3)}
                      {correlation.isSignificant && param1 !== param2 && (
                        <Typography variant="caption" display="block">
                          *
                        </Typography>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          * p &lt; 0.05 (statystycznie istotne)
        </Typography>
      </Box>
    );
  };

  const renderDetailedAnalysis = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Parametr 1</strong></TableCell>
              <TableCell><strong>Parametr 2</strong></TableCell>
              <TableCell align="center"><strong>Korelacja</strong></TableCell>
              <TableCell align="center"><strong>Siła związku</strong></TableCell>
              <TableCell align="center"><strong>p-wartość</strong></TableCell>
              <TableCell align="center"><strong>Istotność</strong></TableCell>
              <TableCell align="center"><strong>Przedział ufności</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((corr, index) => (
              <TableRow key={index}>
                <TableCell>{corr.parameter1}</TableCell>
                <TableCell>{corr.parameter2}</TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    color: getCorrelationColor(corr.correlation, corr.isSignificant),
                    fontWeight: 'bold'
                  }}
                >
                  {corr.correlation.toFixed(4)}
                </TableCell>
                <TableCell align="center">
                  <Chip 
                    label={getCorrelationStrength(corr.correlation)}
                    size="small"
                    color={Math.abs(corr.correlation) >= 0.5 ? 'primary' : 'default'}
                  />
                </TableCell>
                <TableCell align="center">
                  {corr.pValue < 0.001 ? '<0.001' : corr.pValue.toFixed(4)}
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={corr.isSignificant ? 'Tak' : 'Nie'}
                    size="small"
                    color={corr.isSignificant ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="center">
                  {corr.confidenceInterval ? 
                    `[${corr.confidenceInterval.lower.toFixed(3)}, ${corr.confidenceInterval.upper.toFixed(3)}]` : 
                    'Brak danych'
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderScatterPlot = () => {
    if (!selectedParam1 || !selectedParam2 || selectedParam1 === selectedParam2) {
      return (
        <Alert severity="info">
          Wybierz różne parametry aby zobaczyć wykres korelacji
        </Alert>
      );
    }

    const correlation = correlationMatrix[selectedParam1][selectedParam2];
    if (!correlation) {
      return (
        <Alert severity="warning">
          Brak danych korelacji dla wybranych parametrów
        </Alert>
      );
    }

    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Korelacja między {selectedParam1} a {selectedParam2}
        </Typography>
        
        <Box sx={{ 
          p: 2, 
          bgcolor: 'grey.50', 
          borderRadius: 1,
          textAlign: 'center'
        }}>
          <Typography variant="h4" color={getCorrelationColor(correlation.correlation, correlation.isSignificant)}>
            r = {correlation.correlation.toFixed(4)}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            {getCorrelationStrength(correlation.correlation)} korelacja 
            {correlation.correlation > 0 ? ' dodatnia' : ' ujemna'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary">
            p = {correlation.pValue < 0.001 ? '<0.001' : correlation.pValue.toFixed(4)}
            {correlation.isSignificant && ' (statystycznie istotna)'}
          </Typography>

          {correlation.confidenceInterval && (
            <Typography variant="body2" color="text.secondary">
              95% CI: [{correlation.confidenceInterval.lower.toFixed(3)}, {correlation.confidenceInterval.upper.toFixed(3)}]
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>Interpretacja:</strong>
          </Typography>
          <Typography variant="body2">
            {correlation.correlation > 0 ? 
              `Wraz ze wzrostem ${selectedParam1} wzrasta również ${selectedParam2}.` :
              `Wraz ze wzrostem ${selectedParam1} maleje ${selectedParam2}.`
            }
            {' '}
            Siła tego związku jest {getCorrelationStrength(correlation.correlation).toLowerCase()}.
            {!correlation.isSignificant && ' Jednak związek ten nie jest statystycznie istotny.'}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Analiza korelacji
        </Typography>

        <Grid container spacing={3}>
          {/* Kontrolki */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Parametr 1</InputLabel>
                <Select
                  value={selectedParam1}
                  label="Parametr 1"
                  onChange={(e) => {
                    setSelectedParam1(e.target.value);
                    onParameterChange?.(e.target.value, selectedParam2);
                  }}
                >
                  {parameters.map(param => (
                    <MenuItem key={param} value={param}>{param}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Parametr 2</InputLabel>
                <Select
                  value={selectedParam2}
                  label="Parametr 2"
                  onChange={(e) => {
                    setSelectedParam2(e.target.value);
                    onParameterChange?.(selectedParam1, e.target.value);
                  }}
                >
                  {parameters.map(param => (
                    <MenuItem key={param} value={param}>{param}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlySignificant}
                    onChange={(e) => setShowOnlySignificant(e.target.checked)}
                  />
                }
                label="Tylko istotne"
              />
            </Box>
          </Grid>

          {/* Macierz korelacji */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Macierz korelacji
            </Typography>
            {renderCorrelationMatrix()}
          </Grid>

          {/* Szczegółowa analiza */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Szczegółowa analiza korelacji
            </Typography>
            {renderDetailedAnalysis()}
          </Grid>

          {/* Wykres punktowy */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Analiza wybranej pary parametrów
            </Typography>
            {renderScatterPlot()}
          </Grid>

          {/* Legenda interpretacji */}
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Interpretacja siły korelacji
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>0.9-1.0:</strong> Bardzo silna korelacja<br/>
                    <strong>0.7-0.9:</strong> Silna korelacja<br/>
                    <strong>0.5-0.7:</strong> Średnia korelacja
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2">
                    <strong>0.3-0.5:</strong> Słaba korelacja<br/>
                    <strong>0.0-0.3:</strong> Bardzo słaba korelacja<br/>
                    <strong>p &lt; 0.05:</strong> Statystycznie istotna
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CorrelationAnalysis;
