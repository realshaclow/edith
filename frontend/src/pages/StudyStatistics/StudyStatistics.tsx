import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useStudies } from '../../hooks/useStudies';
import { StudyDto, StudySessionDto } from '../../services/studiesApi';
import { StudySession } from '../../types';
import { ComprehensiveAnalysis, AnalysisConfig } from './types/analytics';
import { StatisticalAnalyzer, AnalyticsReportGenerator } from './utils/statisticalAnalyzer';

// Converter function to convert StudySessionDto to StudySession
const convertSessionDtoToSession = (sessionDto: StudySessionDto): StudySession => ({
  id: sessionDto.id,
  studyId: sessionDto.studyId,
  operator: sessionDto.operatorName || sessionDto.operatorId,
  startTime: new Date(sessionDto.startTime || Date.now()),
  endTime: sessionDto.endTime ? new Date(sessionDto.endTime) : undefined,
  data: Array.isArray(sessionDto.data) 
    ? sessionDto.data.reduce((acc: Record<string, number>, item: any) => {
        if (item && typeof item === 'object') {
          Object.keys(item).forEach(key => {
            if (typeof item[key] === 'number') {
              acc[key] = item[key];
            }
          });
        }
        return acc;
      }, {})
    : {},
  conditions: sessionDto.conditions,
  notes: sessionDto.notes,
  status: sessionDto.status,
  progress: { completed: sessionDto.completedSteps, total: sessionDto.totalSteps, percentage: sessionDto.progress },
  createdAt: sessionDto.createdAt,
  updatedAt: sessionDto.updatedAt,
});

// Import komponentów analitycznych
import DescriptiveStats from './components/DescriptiveStats';
import QualityControlChart from './components/QualityControlChart';
import TrendAnalysisChart from './components/TrendAnalysisChart';
import UncertaintyAnalysisChart from './components/UncertaintyAnalysisChart';
import CorrelationAnalysis from './components/CorrelationAnalysis';
import ReferenceComparisonChart from './components/ReferenceComparisonChart';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const StudyStatistics: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    studies, 
    study,
    sessions,
    isLoading, 
    error, 
    fetchStudies, 
    fetchStudy,
    fetchSessions
  } = useStudies();
  
  const [analysis, setAnalysis] = useState<ComprehensiveAnalysis | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedParameter, setSelectedParameter] = useState<string>('');
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig>({
    confidenceLevel: 95,
    significanceLevel: 0.05,
    outlierDetectionMethod: 'iqr',
    testType: 'auto',
    controlLimits: 'sigma3',
    controlLimitSigma: 3,
    outlierMethod: 'iqr',
    trendMethod: 'linear'
  });

  // Use the current study from the hook or find it from studies
  const currentStudy = study || studies.find(s => s.id === id);
  
  // Dostępne parametry dla analizy
  const availableParameters = analysis && analysis.parameters ? Object.keys(analysis.parameters) : [];

  useEffect(() => {
    if (id) {
      // Fetch the specific study and its sessions
      fetchStudy(id);
      fetchSessions(id);
    }
  }, [id, fetchStudy, fetchSessions]);

  useEffect(() => {
    if (sessions && sessions.length > 0) {
      performAnalysis();
    }
  }, [sessions, analysisConfig]);

  const performAnalysis = async () => {
    if (!sessions || sessions.length === 0) {
      setAnalysisError('Brak danych do analizy');
      return;
    }

    setAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const convertedSessions = sessions.map(convertSessionDtoToSession);
      const comprehensiveAnalysis = AnalyticsReportGenerator.generateComprehensiveAnalysis(
        convertedSessions,
        analysisConfig
      );
      
      setAnalysis(comprehensiveAnalysis);
      
      // Ustaw pierwszy dostępny parametr jako domyślny
      const parameterNames = comprehensiveAnalysis.parameters ? Object.keys(comprehensiveAnalysis.parameters) : [];
      if (parameterNames.length > 0 && !selectedParameter) {
        setSelectedParameter(parameterNames[0]);
      }
      
    } catch (error) {
      console.error('Błąd podczas analizy:', error);
      setAnalysisError(error instanceof Error ? error.message : 'Nieznany błąd analizy');
    } finally {
      setAnalysisLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getParameterValues = (paramName: string): number[] => {
    if (!sessions) return [];
    
    return sessions
      .map((session: StudySessionDto) => session.data && (session.data as any)[paramName])
      .filter((value: any) => typeof value === 'number' && !isNaN(value)) as number[];
  };

  const getParameterUnit = (paramName: string): string => {
    // Mapowanie jednostek na podstawie nazwy parametru
    const unitMap: { [key: string]: string } = {
      'tensileStrength': 'MPa',
      'yieldStrength': 'MPa',
      'modulusOfElasticity': 'GPa',
      'elongation': '%',
      'density': 'g/cm³',
      'temperature': '°C',
      'force': 'N',
      'displacement': 'mm',
      'stress': 'MPa',
      'strain': '%'
    };
    
    return unitMap[paramName] || '';
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!currentStudy) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Nie znaleziono badania o ID: {id}</Alert>
      </Container>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          Brak danych pomiarowych do analizy. Wykonaj najpierw pomiary w ramach tego badania.
        </Alert>
      </Container>
    );
  }

  if (analysisLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Box textAlign="center">
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Generowanie analizy statystycznej...
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  if (analysisError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={performAnalysis}>
            Spróbuj ponownie
          </Button>
        }>
          {analysisError}
        </Alert>
      </Container>
    );
  }

  if (!analysis) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">
          Nie udało się wygenerować analizy. 
          <Button onClick={performAnalysis} sx={{ ml: 2 }}>
            Wygeneruj analizę
          </Button>
        </Alert>
      </Container>
    );
  }

  const parameterNames = analysis.parameters ? Object.keys(analysis.parameters) : [];
  const selectedParameterData = selectedParameter && analysis.parameters ? analysis.parameters[selectedParameter] : null;
  const selectedParameterValues = selectedParameter ? getParameterValues(selectedParameter) : [];
  const selectedParameterUnit = selectedParameter ? getParameterUnit(selectedParameter) : '';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Nagłówek */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Analiza statystyczna
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {currentStudy?.title || 'Badanie'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Wygenerowano: {analysis.generatedAt ? new Date(analysis.generatedAt).toLocaleString('pl-PL') : 'Brak danych'}
        </Typography>
      </Box>

      {/* Podsumowanie badania */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>Liczba sesji pomiarowych:</strong> {sessions?.length || 0}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>Parametry analizowane:</strong> {parameterNames.length}
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>Ocena ogólna:</strong> {analysis.overallQuality?.overallScore?.toFixed(1) || 'N/A'}/100
              </Typography>
            </Grid>
          </Grid>
          
          {/* Parametry dostępne */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Dostępne parametry:</strong>
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {parameterNames.map(paramName => (
                <Chip
                  key={paramName}
                  label={paramName}
                  variant={paramName === selectedParameter ? 'filled' : 'outlined'}
                  color={paramName === selectedParameter ? 'primary' : 'default'}
                  onClick={() => setSelectedParameter(paramName)}
                  clickable
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Selektor parametru */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Wybierz parametr do analizy</InputLabel>
                <Select
                  value={selectedParameter}
                  label="Wybierz parametr do analizy"
                  onChange={(e) => setSelectedParameter(e.target.value)}
                >
                  {parameterNames.map(paramName => (
                    <MenuItem key={paramName} value={paramName}>
                      {paramName} ({getParameterValues(paramName).length} pomiarów)
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button 
                variant="outlined" 
                onClick={performAnalysis}
                disabled={analysisLoading}
              >
                Odśwież analizę
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Analiza dla wybranego parametru */}
      {selectedParameterData && selectedParameter && (
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={activeTab} onChange={handleTabChange} aria-label="analysis tabs">
              <Tab label="Statystyki opisowe" />
              <Tab label="Kontrola jakości (SPC)" />
              <Tab label="Analiza trendów" />
              <Tab label="Analiza niepewności" />
              <Tab label="Analiza korelacji" />
              <Tab label="Porównanie referencyjne" />
            </Tabs>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <DescriptiveStats
              data={selectedParameterData.descriptiveStats}
              parameterName={selectedParameter}
              unit={selectedParameterUnit}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <QualityControlChart
              data={selectedParameterData.qualityControl}
              parameterName={selectedParameter}
              unit={selectedParameterUnit}
              values={selectedParameterValues}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <TrendAnalysisChart
              data={selectedParameterData.trendAnalysis}
              parameterName={selectedParameter}
              unit={selectedParameterUnit}
              values={selectedParameterValues}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <UncertaintyAnalysisChart
              data={selectedParameterData.uncertainty}
              parameterName={selectedParameter}
              unit={selectedParameterUnit}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <CorrelationAnalysis
              data={analysis?.comparativeAnalysis?.correlations?.correlationMatrix || []}
              parameters={availableParameters}
            />
          </TabPanel>

          <TabPanel value={activeTab} index={5}>
            {selectedParameterData.referenceComparison ? (
              <ReferenceComparisonChart
                data={selectedParameterData.referenceComparison}
                parameterName={selectedParameter}
                unit={selectedParameterUnit}
                measuredValue={selectedParameterData.descriptiveStats.mean}
              />
            ) : (
              <Alert severity="info">
                Brak dostępnych wartości referencyjnych dla parametru {selectedParameter}
              </Alert>
            )}
          </TabPanel>
        </Box>
      )}

      {/* Podsumowanie jakości */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Ogólna ocena jakości danych
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>Ocena ogólna:</strong> {analysis.overallQuality?.overallScore?.toFixed(1) || 'N/A'}/100
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>Kompletność danych:</strong> {analysis.overallQuality?.dataIntegrity?.completeness?.toFixed(1) || 'N/A'}%
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2">
                <strong>Dokładność:</strong> {analysis.overallQuality?.dataIntegrity?.accuracy?.toFixed(1) || 'N/A'}%
              </Typography>
            </Grid>
          </Grid>

          {/* Rekomendacje */}
          {analysis.overallQuality?.recommendations && analysis.overallQuality.recommendations.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Rekomendacje:
              </Typography>
              {analysis.overallQuality?.recommendations?.map((rec: string, index: number) => (
                <Alert key={index} severity="info" sx={{ mb: 1 }}>
                  {rec}
                </Alert>
              ))}
            </Box>
          )}

          {/* Krytyczne obserwacje */}
          {analysis.overallQuality?.criticalFindings && analysis.overallQuality.criticalFindings.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Krytyczne obserwacje:
              </Typography>
              {analysis.overallQuality?.criticalFindings?.map((finding, index) => (
                <Alert key={index} severity="warning" sx={{ mb: 1 }}>
                  {finding}
                </Alert>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudyStatistics;
