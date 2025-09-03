// Interfejsy dla analizy statystycznej

export interface StatisticalSummary {
  count: number;
  sampleSize: number;
  mean: number;
  median: number;
  mode: number[];
  standardDeviation: number;
  variance: number;
  min: number;
  max: number;
  range: number;
  quartiles: {
    q1: number;
    q2: number;
    q3: number;
  };
  iqr: number;
  skewness: number;
  kurtosis: number;
  confidenceInterval: {
    level: number;
    lower: number;
    upper: number;
  };
  confidence95?: {
    lower: number;
    upper: number;
  };
  outliers: number[];
}

export interface QualityControl {
  spc: {
    ucl: number; // Upper Control Limit
    lcl: number; // Lower Control Limit
    centerLine: number;
    outOfControlPoints: number[];
    cpk?: number;
    cp?: number;
    pp?: number;
    ppk?: number;
  };
  controlLimits: {
    ucl: number; // Upper Control Limit
    lcl: number; // Lower Control Limit
    centerLine: number;
  };
  specificationLimits?: {
    usl: number; // Upper Specification Limit
    lsl: number; // Lower Specification Limit
  };
  processCapability?: {
    cp: number;
    cpk: number;
    pp: number;
    ppk: number;
  };
  outOfControlPoints: number[];
  runs: {
    aboveCenterLine: number;
    belowCenterLine: number;
    trends: boolean;
  };
  isInControl: boolean;
  acceptance?: {
    acceptanceRate: number;
    rejectionRate: number;
    acceptedSamples: number;
    rejectedSamples: number;
    criteriaMet: string[];
    criteriaFailed: string[];
  };
}

export interface TrendAnalysis {
  trend: 'increasing' | 'decreasing' | 'stable';
  trendStrength: number; // 0-1
  correlation: number; // -1 to 1
  regression: {
    slope: number;
    intercept: number;
    rSquared: number;
    equation: string;
  };
  forecast?: {
    nextValues: number[];
    confidence: number;
    timeHorizon: number;
  };
  seasonality?: {
    detected: boolean;
    period: number;
  };
}

export interface UncertaintyAnalysis {
  typeA: {
    standardUncertainty: number;
    degreesOfFreedom: number;
    distribution: string;
  };
  typeB: {
    components: Array<{
      source: string;
      value: number;
      distribution: string;
      divisor: number;
    }>;
    combinedUncertainty: number;
  };
  expandedUncertainty: {
    value: number;
    coverageFactor: number;
    confidenceLevel: number;
  };
  uncertaintyBudget: Array<{
    component: string;
    value: number;
    contribution: number; // percentage
  }>;
}

export interface AnovaAnalysis {
  fStatistic: number;
  pValue: number;
  criticalValue: number;
  degreesOfFreedom: {
    between: number;
    within: number;
    total: number;
  };
  sumOfSquares: {
    between: number;
    within: number;
    total: number;
  };
  meanSquares: {
    between: number;
    within: number;
  };
  isSignificant: boolean;
  alpha: number;
  groups: Array<{
    name: string;
    count: number;
    mean: number;
    variance: number;
  }>;
}

export interface RegressionAnalysis {
  type: 'linear' | 'polynomial' | 'exponential' | 'logarithmic';
  coefficients: number[];
  rSquared: number;
  adjustedRSquared: number;
  standardError: number;
  fStatistic: number;
  pValue: number;
  equation: string;
  residuals: number[];
  predictions: Array<{
    x: number;
    y: number;
    prediction: number;
    residual: number;
  }>;
}

export interface CorrelationAnalysis {
  correlationMatrix: Array<{
    parameter1: string;
    parameter2: string;
    correlation: number;
    pValue: number;
    isSignificant: boolean;
  }>;
  strongCorrelations: Array<{
    parameter1: string;
    parameter2: string;
    correlation: number;
    interpretation: string;
  }>;
  heatmapData: Array<Array<number>>;
  parameters: string[];
}

export interface ReferenceValue {
  source: string;
  standard: string;
  value: number;
  range?: {
    min: number;
    max: number;
  };
  material: string;
  conditions?: string;
  parameter?: string;
}

export interface ComplianceCheck {
  measured: number;
  reference: number;
  tolerance: number;
  deviation: number;
  deviationPercent: number;
  isCompliant: boolean;
  parameter?: string;
}

export interface ReferenceComparison {
  parameterName?: string;
  referenceValues: ReferenceValue[];
  compliance: ComplianceCheck[];
  overallCompliance: boolean;
  averageDeviation: number;
}

export interface ComprehensiveAnalysis {
  studyId?: string;
  parameterId: string;
  parameterName: string;
  unit: string;
  descriptiveStats: StatisticalSummary;
  qualityControl: QualityControl;
  trendAnalysis: TrendAnalysis;
  uncertaintyAnalysis: UncertaintyAnalysis;
  referenceComparison?: ReferenceComparison;
  timestamp: string;
  generatedAt?: string;
  parameters?: Record<string, any>;
  comparativeAnalysis?: {
    anova: AnovaAnalysis;
    correlations: CorrelationAnalysis;
  };
  overallQuality?: {
    overallScore: number;
    dataIntegrity: {
      completeness: number;
      accuracy: number;
    };
    recommendations: string[];
    criticalFindings: string[];
  };
}

export interface AnalysisRequest {
  studyId: string;
  parameterId: string;
  analysisTypes: ('descriptive' | 'quality' | 'trend' | 'uncertainty' | 'reference')[];
  confidenceLevel?: number;
  controlLimitSigma?: number;
}

export interface AnalysisConfig {
  confidenceLevel: number;
  controlLimitSigma: number;
  outlierMethod: 'iqr' | 'zscore';
  trendMethod: 'linear' | 'polynomial';
  significanceLevel?: number;
  outlierDetectionMethod?: 'iqr' | 'zscore';
  testType?: 'auto' | 'manual';
  controlLimits?: 'sigma3' | 'sigma2';
}

export interface AnalysisResponse {
  success: boolean;
  data?: ComprehensiveAnalysis;
  error?: string;
}
