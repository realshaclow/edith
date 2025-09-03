export interface StatisticalData {
  id: string;
  name: string;
  value: number;
  unit?: string;
  category: 'mechanical' | 'thermal' | 'electrical' | 'chemical' | 'dimensional' | 'optical';
  type: 'continuous' | 'discrete' | 'categorical';
  sampleId?: string;
  sessionId: string;
  measuredAt: Date;
  measuredBy: string;
  uncertainty?: number;
  conditions?: Record<string, any>;
}

export interface StatisticalSummary {
  parameter: string;
  count: number;
  mean: number;
  median: number;
  mode?: number;
  standardDeviation: number;
  variance: number;
  range: {
    min: number;
    max: number;
  };
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
  };
  percentiles: {
    p5: number;
    p95: number;
    p99: number;
  };
  skewness: number;
  kurtosis: number;
  confidenceInterval95: {
    lower: number;
    upper: number;
  };
  outliers: number[];
  distribution?: DistributionTest;
}

export interface DistributionTest {
  name: string;
  testStatistic: number;
  pValue: number;
  isNormal: boolean;
  recommendation: string;
}

export interface CorrelationMatrix {
  parameters: string[];
  matrix: number[][];
  significance: number[][];
}

export interface RegressionAnalysis {
  dependent: string;
  independent: string[];
  coefficients: number[];
  rSquared: number;
  adjustedRSquared: number;
  fStatistic: number;
  pValue: number;
  residuals: number[];
  predictions: number[];
  standardErrors: number[];
}

export interface QualityControlChart {
  type: 'xbar-r' | 'x-mr' | 'p' | 'c' | 'u';
  centerLine: number;
  upperControlLimit: number;
  lowerControlLimit: number;
  upperSpecLimit?: number;
  lowerSpecLimit?: number;
  points: QualityControlPoint[];
  processCapability?: ProcessCapability;
}

export interface QualityControlPoint {
  sequence: number;
  value: number;
  subgroupSize?: number;
  outOfControl: boolean;
  rules: string[];
  sample?: string;
  timestamp: Date;
}

export interface ProcessCapability {
  cp: number;
  cpk: number;
  pp: number;
  ppk: number;
  sigma: number;
  interpretation: string;
  recommendation: string;
}

export interface ComparisonTest {
  testName: string;
  groups: string[];
  testStatistic: number;
  pValue: number;
  effect: string;
  significant: boolean;
  interpretation: string;
  postHoc?: PostHocTest[];
}

export interface PostHocTest {
  comparison: string;
  difference: number;
  pValue: number;
  significant: boolean;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

export interface TrendAnalysis {
  parameter: string;
  timeSeriesData: TimeSeriesPoint[];
  trend: 'increasing' | 'decreasing' | 'stable' | 'cyclical';
  trendStrength: number;
  seasonality?: SeasonalityInfo;
  forecast?: ForecastPoint[];
  changePoints: ChangePoint[];
}

export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
  session: string;
  sample?: string;
}

export interface SeasonalityInfo {
  present: boolean;
  period: number;
  strength: number;
}

export interface ForecastPoint {
  timestamp: Date;
  predicted: number;
  lower95: number;
  upper95: number;
  lower80: number;
  upper80: number;
}

export interface ChangePoint {
  timestamp: Date;
  significance: number;
  type: 'mean' | 'variance' | 'trend';
  description: string;
}

export interface StudyComparison {
  studies: string[];
  parameters: string[];
  comparisons: ParameterComparison[];
  overall: OverallComparison;
}

export interface ParameterComparison {
  parameter: string;
  studies: StudyParameterStats[];
  analysis: ComparisonTest;
  visualization: VisualizationConfig;
}

export interface StudyParameterStats {
  studyId: string;
  studyName: string;
  summary: StatisticalSummary;
  qualityMetrics: QualityMetrics;
}

export interface QualityMetrics {
  completeness: number; // % of data points collected
  accuracy: number; // based on control standards
  precision: number; // repeatability coefficient
  bias: number; // systematic error
  uncertainty: number; // measurement uncertainty
}

export interface OverallComparison {
  recommendation: string;
  riskAssessment: RiskAssessment;
  decisionMatrix: DecisionMatrix;
}

export interface RiskAssessment {
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: RiskFactor[];
  mitigation: string[];
}

export interface RiskFactor {
  factor: string;
  impact: number; // 1-5
  probability: number; // 1-5
  description: string;
}

export interface DecisionMatrix {
  criteria: DecisionCriterion[];
  studies: StudyScore[];
  recommendation: string;
}

export interface DecisionCriterion {
  name: string;
  weight: number;
  description: string;
}

export interface StudyScore {
  studyId: string;
  studyName: string;
  scores: number[];
  totalScore: number;
  rank: number;
}

export interface VisualizationConfig {
  type: 'histogram' | 'boxplot' | 'scatter' | 'line' | 'bar' | 'heatmap' | 'contour' | 'control-chart';
  title: string;
  xAxis: AxisConfig;
  yAxis: AxisConfig;
  colorBy?: string;
  groupBy?: string;
  annotations?: Annotation[];
  statistical?: StatisticalOverlay[];
}

export interface AxisConfig {
  label: string;
  unit?: string;
  scale: 'linear' | 'log' | 'sqrt';
  limits?: {
    min: number;
    max: number;
  };
}

export interface Annotation {
  type: 'line' | 'rectangle' | 'text' | 'arrow';
  position: {
    x: number;
    y: number;
  };
  text?: string;
  color: string;
  style?: 'solid' | 'dashed' | 'dotted';
}

export interface StatisticalOverlay {
  type: 'mean' | 'median' | 'std' | 'regression' | 'confidence-band' | 'prediction-band';
  color: string;
  confidence?: number;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: 'standard' | 'regulatory' | 'custom';
  sections: ReportSection[];
  metadata: ReportMetadata;
}

export interface ReportSection {
  id: string;
  title: string;
  type: 'summary' | 'chart' | 'table' | 'statistical-analysis' | 'conclusions' | 'custom';
  content: any;
  order: number;
  required: boolean;
}

export interface ReportMetadata {
  author: string;
  organization: string;
  standard?: string; // ISO, ASTM, etc.
  version: string;
  lastModified: Date;
  tags: string[];
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json' | 'html';
  includeCharts: boolean;
  includeRawData: boolean;
  includeStatistics: boolean;
  includeQualityControl: boolean;
  compression?: 'none' | 'zip' | 'gzip';
  resolution?: number; // for charts
  paperSize?: 'A4' | 'A3' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
}
