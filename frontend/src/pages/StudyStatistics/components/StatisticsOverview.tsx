import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  CompareArrows as CompareIcon,
  FileDownload as DownloadIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import { StatisticalCalculator, StatisticalDataManager } from '../utils/statisticalCalculator';
import { QualityControlUtils } from '../utils/qualityControl';
import { StatisticalData, StatisticalSummary, QualityControlChart } from '../types/statistics';

interface StatisticsOverviewProps {
  studyId: string;
  studyName: string;
  data: any[];
}

const StatisticsOverview: React.FC<StatisticsOverviewProps> = ({ 
  studyId, 
  studyName, 
  data = [] 
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedParameter, setSelectedParameter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [statisticalData, setStatisticalData] = useState<StatisticalData[]>([]);
  const [summaries, setSummaries] = useState<{ [key: string]: StatisticalSummary }>({});
  const [qualityCharts, setQualityCharts] = useState<{ [key: string]: any }>({});

  // Konwertuj dane badania do formatu statystycznego
  const convertToStatisticalData = (rawData: any[]): StatisticalData[] => {
    if (!rawData || rawData.length === 0) return [];
    
    const converted: StatisticalData[] = [];
    
    rawData.forEach((session, sessionIndex) => {
      // Sprawdź czy session ma właściwość data lub results
      const sessionData = session.data || session.results;
      if (sessionData) {
        Object.entries(sessionData).forEach(([parameter, value]) => {
          if (typeof value === 'number' && !isNaN(value)) {
            converted.push({
              id: `${sessionIndex}-${parameter}`,
              name: parameter,
              value: value,
              unit: '',
              category: 'mechanical',
              sessionId: `Sesja ${sessionIndex + 1}`,
              sampleId: session.sampleId || `Próbka ${sessionIndex + 1}`,
              type: 'continuous',
              measuredAt: new Date(),
              measuredBy: session.operator || 'System'
            });
          }
        });
      }
    });
    
    return converted;
  };

  // Pobierz dostępne parametry
  const getAvailableParameters = (): string[] => {
    const parameters = new Set<string>();
    statisticalData.forEach(item => parameters.add(item.name));
    return Array.from(parameters);
  };

  // Oblicz statystyki podstawowe
  const calculateStatistics = () => {
    console.log('StatisticsOverview: rozpoczęcie obliczania statystyk');
    setLoading(true);
    
    try {
      const converted = convertToStatisticalData(data);
      console.log('StatisticsOverview: przekonwertowane dane:', converted);
      setStatisticalData(converted);
      
      // Pobierz parametry z przekonwertowanych danych
      const parameters = new Set<string>();
      converted.forEach(item => parameters.add(item.name));
      const parameterArray = Array.from(parameters);
      
      const newSummaries: { [key: string]: StatisticalSummary } = {};
      const newQualityCharts: { [key: string]: any } = {};
      
      parameterArray.forEach(param => {
        const values = converted.filter(item => item.name === param).map(item => item.value);
        const paramData = StatisticalDataManager.filterByCategory(converted, 'mechanical')
          .filter(item => item.name === param);
        
        if (paramData.length > 0) {
          const values = StatisticalDataManager.extractValues(paramData);
          
          if (values.length >= 3) {
            // Statystyki opisowe
            newSummaries[param] = StatisticalCalculator.calculateDescriptiveStats(values);
            
            // Wykres kontrolny (jeśli wystarczająco danych)
            if (values.length >= 5) {
              try {
                // Pogrupuj dane w podgrupy po 5
                const subgroups: number[][] = [];
                for (let i = 0; i < values.length; i += 5) {
                  const subgroup = values.slice(i, i + 5);
                  if (subgroup.length >= 3) {
                    subgroups.push(subgroup);
                  }
                }
                
                if (subgroups.length >= 2) {
                  newQualityCharts[param] = QualityControlUtils.createXBarRChart(subgroups);
                }
              } catch (error) {
                console.warn(`Nie można utworzyć wykresu kontrolnego dla ${param}:`, error);
              }
            }
          }
        }
      });
      
      setSummaries(newSummaries);
      setQualityCharts(newQualityCharts);
      
      // Ustaw pierwszy dostępny parametr jako wybrany
      if (parameterArray.length > 0 && !selectedParameter) {
        setSelectedParameter(parameterArray[0]);
      }
      
    } catch (error) {
      console.error('Błąd podczas obliczania statystyk:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('StatisticsOverview: otrzymane dane:', data);
    if (data && data.length > 0) {
      calculateStatistics();
    }
  }, [data]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleParameterChange = (event: any) => {
    setSelectedParameter(event.target.value);
  };

  const handleExport = (format: string) => {
    console.log(`Eksportowanie w formacie: ${format}`);
    // Implementacja eksportu
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Obliczanie statystyk...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="info">
          Brak danych do analizy statystycznej. Przeprowadź badanie aby zobaczyć wyniki.
        </Alert>
      </Box>
    );
  }

  const parameters = getAvailableParameters();
  const selectedSummary = selectedParameter ? summaries[selectedParameter] : null;
  const selectedQualityChart = selectedParameter ? qualityCharts[selectedParameter] : null;

  return (
    <Box sx={{ p: 3 }}>
      {/* Nagłówek */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Statystyki Badania
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {studyName}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Parametr</InputLabel>
            <Select
              value={selectedParameter}
              onChange={handleParameterChange}
              label="Parametr"
            >
              {parameters.map(param => (
                <MenuItem key={param} value={param}>{param}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => handleExport('pdf')}
          >
            Eksportuj
          </Button>
        </Box>
      </Box>

      {/* Podsumowanie ogólne */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Liczba sesji
              </Typography>
              <Typography variant="h4">
                {data.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Parametry
              </Typography>
              <Typography variant="h4">
                {parameters.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Całkowite pomiary
              </Typography>
              <Typography variant="h4">
                {statisticalData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Status jakości
              </Typography>
              <Chip 
                label={selectedQualityChart ? "Pod kontrolą" : "Brak danych"} 
                color={selectedQualityChart ? "success" : "default"}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Zakładki analizy */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={selectedTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<AssessmentIcon />} label="Statystyki opisowe" />
          <Tab icon={<TimelineIcon />} label="Kontrola jakości" />
          <Tab icon={<CompareIcon />} label="Analiza trendów" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Zakładka 1: Statystyki opisowe */}
          {selectedTab === 0 && (
            <Box>
              {selectedSummary ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Miary centralne
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell><strong>Średnia</strong></TableCell>
                            <TableCell>{selectedSummary.mean.toFixed(4)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Mediana</strong></TableCell>
                            <TableCell>{selectedSummary.median.toFixed(4)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Dominanta</strong></TableCell>
                            <TableCell>
                              {selectedSummary.mode ? selectedSummary.mode.toFixed(4) : 'Brak'}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Liczba pomiarów</strong></TableCell>
                            <TableCell>{selectedSummary.count}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Miary rozproszenia
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell><strong>Odch. standardowe</strong></TableCell>
                            <TableCell>{selectedSummary.standardDeviation.toFixed(4)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Wariancja</strong></TableCell>
                            <TableCell>{selectedSummary.variance.toFixed(4)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Minimum</strong></TableCell>
                            <TableCell>{selectedSummary.range.min.toFixed(4)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Maksimum</strong></TableCell>
                            <TableCell>{selectedSummary.range.max.toFixed(4)}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell><strong>Rozstęp</strong></TableCell>
                            <TableCell>
                              {(selectedSummary.range.max - selectedSummary.range.min).toFixed(4)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Kwartyle i percentyle
                    </Typography>
                    <TableContainer component={Paper} variant="outlined">
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Q1 (25%)</TableCell>
                            <TableCell>Q2 (50%)</TableCell>
                            <TableCell>Q3 (75%)</TableCell>
                            <TableCell>P5</TableCell>
                            <TableCell>P95</TableCell>
                            <TableCell>P99</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>{selectedSummary.quartiles.q1.toFixed(4)}</TableCell>
                            <TableCell>{selectedSummary.quartiles.q2.toFixed(4)}</TableCell>
                            <TableCell>{selectedSummary.quartiles.q3.toFixed(4)}</TableCell>
                            <TableCell>{selectedSummary.percentiles.p5.toFixed(4)}</TableCell>
                            <TableCell>{selectedSummary.percentiles.p95.toFixed(4)}</TableCell>
                            <TableCell>{selectedSummary.percentiles.p99.toFixed(4)}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  {selectedSummary.outliers.length > 0 && (
                    <Grid item xs={12}>
                      <Alert severity="warning">
                        <Typography variant="h6">Wartości odstające</Typography>
                        <Typography>
                          Wykryto {selectedSummary.outliers.length} wartości odstających: {' '}
                          {selectedSummary.outliers.map(val => val.toFixed(4)).join(', ')}
                        </Typography>
                      </Alert>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Alert severity="info">
                      <Typography variant="h6">Test normalności</Typography>
                      <Typography>
                        {selectedSummary.distribution?.name}: {selectedSummary.distribution?.recommendation}
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">
                  Wybierz parametr aby zobaczyć statystyki opisowe
                </Alert>
              )}
            </Box>
          )}

          {/* Zakładka 2: Kontrola jakości */}
          {selectedTab === 1 && (
            <Box>
              {selectedQualityChart ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Wykres kontrolny X-bar & R
                    </Typography>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Wykres kontrolny dla parametru: {selectedParameter}
                      </Typography>
                      
                      {/* Informacje o wykresie X-bar */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Wykres średnich (X-bar):</Typography>
                        <Typography variant="body2">
                          Linia centralna: {selectedQualityChart.xBarChart.centerLine.toFixed(4)}
                        </Typography>
                        <Typography variant="body2">
                          UCL: {selectedQualityChart.xBarChart.upperControlLimit.toFixed(4)}
                        </Typography>
                        <Typography variant="body2">
                          LCL: {selectedQualityChart.xBarChart.lowerControlLimit.toFixed(4)}
                        </Typography>
                        <Typography variant="body2">
                          Punkty poza kontrolą: {selectedQualityChart.xBarChart.points.filter((p: any) => p.outOfControl).length}
                        </Typography>
                      </Box>
                      
                      {/* Informacje o wykresie R */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1">Wykres rozstępów (R):</Typography>
                        <Typography variant="body2">
                          Linia centralna: {selectedQualityChart.rChart.centerLine.toFixed(4)}
                        </Typography>
                        <Typography variant="body2">
                          UCL: {selectedQualityChart.rChart.upperControlLimit.toFixed(4)}
                        </Typography>
                        <Typography variant="body2">
                          LCL: {selectedQualityChart.rChart.lowerControlLimit.toFixed(4)}
                        </Typography>
                        <Typography variant="body2">
                          Punkty poza kontrolą: {selectedQualityChart.rChart.points.filter((p: any) => p.outOfControl).length}
                        </Typography>
                      </Box>
                      
                      {/* Zdolność procesu */}
                      {selectedQualityChart.capability && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1">Zdolność procesu:</Typography>
                          <Typography variant="body2">
                            Cp: {selectedQualityChart.capability.cp.toFixed(3)}
                          </Typography>
                          <Typography variant="body2">
                            Cpk: {selectedQualityChart.capability.cpk.toFixed(3)}
                          </Typography>
                          <Typography variant="body2">
                            Interpretacja: {selectedQualityChart.capability.interpretation}
                          </Typography>
                        </Box>
                      )}
                      
                      {/* Rekomendacje */}
                      {selectedQualityChart.recommendations && selectedQualityChart.recommendations.length > 0 && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="subtitle1">Rekomendacje:</Typography>
                          {selectedQualityChart.recommendations.map((rec: string, index: number) => (
                            <Typography key={index} variant="body2">
                              • {rec}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info">
                  Za mało danych do utworzenia wykresu kontrolnego. Wymagane minimum 10 pomiarów.
                </Alert>
              )}
            </Box>
          )}

          {/* Zakładka 3: Analiza trendów */}
          {selectedTab === 2 && (
            <Box>
              <Alert severity="info">
                Analiza trendów będzie dostępna po zebraniu danych z więcej sesji pomiarowych.
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default StatisticsOverview;
