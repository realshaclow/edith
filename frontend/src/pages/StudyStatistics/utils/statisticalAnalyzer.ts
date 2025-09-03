import { StudySession, StudyResult } from '../../../types';
import {
  StatisticalSummary,
  QualityControl,
  TrendAnalysis,
  UncertaintyAnalysis,
  ReferenceComparison,
  AnovaAnalysis,
  RegressionAnalysis,
  ComprehensiveAnalysis,
  AnalysisConfig,
  CorrelationAnalysis
} from '../types/analytics';

/**
 * Zaawansowane narzędzia do analizy statystycznej danych badawczych
 */
export class StatisticalAnalyzer {
  
  /**
   * Oblicza podstawowe statystyki opisowe
   */
  static calculateDescriptiveStats(values: number[]): StatisticalSummary {
    if (values.length === 0) {
      throw new Error('Brak danych do analizy');
    }

    const sortedValues = [...values].sort((a, b) => a - b);
    const n = values.length;
    
    // Podstawowe statystyki
    const mean = values.reduce((sum, val) => sum + val, 0) / n;
    const median = n % 2 === 0 
      ? (sortedValues[n/2 - 1] + sortedValues[n/2]) / 2
      : sortedValues[Math.floor(n/2)];
    
    // Odchylenie standardowe i wariancja
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / (n - 1);
    const standardDeviation = Math.sqrt(variance);
    
    // Kwartyle
    const q1 = this.calculatePercentile(sortedValues, 25);
    const q3 = this.calculatePercentile(sortedValues, 75);
    const iqr = q3 - q1;
    
    // Wykrywanie outlierów metodą IQR
    const outliers = values.filter(val => 
      val < (q1 - 1.5 * iqr) || val > (q3 + 1.5 * iqr)
    );
    
    // Przedział ufności 95%
    const tValue = this.getTValue(n - 1, 0.05); // t-student dla α=0.05
    const marginOfError = tValue * (standardDeviation / Math.sqrt(n));
    
    // Skośność i kurtoza
    const skewness = this.calculateSkewness(values, mean, standardDeviation);
    const kurtosis = this.calculateKurtosis(values, mean, standardDeviation);
    
    // Moda (najczęściej występująca wartość)
    const mode = this.calculateMode(values);

    return {
      count: n,
      sampleSize: n,
      mean,
      median,
      mode,
      standardDeviation,
      variance,
      range: Math.max(...values) - Math.min(...values),
      min: Math.min(...values),
      max: Math.max(...values),
      quartiles: {
        q1,
        q2: median,
        q3
      },
      iqr,
      skewness,
      kurtosis,
      confidenceInterval: {
        level: 95,
        lower: mean - marginOfError,
        upper: mean + marginOfError
      },
      confidence95: {
        lower: mean - marginOfError,
        upper: mean + marginOfError
      },
      outliers
    };
  }

  /**
   * Kontrola jakości z kartami kontrolnymi SPC
   */
  static calculateQualityControl(values: number[], config: AnalysisConfig): QualityControl {
    const stats = this.calculateDescriptiveStats(values);
    const mean = stats.mean;
    const stdDev = stats.standardDeviation;
    
    // Limity kontrolne (3-sigma)
    const ucl = mean + 3 * stdDev;
    const lcl = mean - 3 * stdDev;
    
    // Punkty poza kontrolą
    const outOfControlPoints = values
      .map((val, index) => ({ value: val, index }))
      .filter(point => point.value > ucl || point.value < lcl)
      .map(point => point.index);
    
    // Wskaźniki zdolności procesu
    const usl = ucl; // Upper Specification Limit
    const lsl = lcl; // Lower Specification Limit
    const cp = (usl - lsl) / (6 * stdDev);
    const cpk = Math.min((usl - mean) / (3 * stdDev), (mean - lsl) / (3 * stdDev));
    
    // Performance indices
    const pp = cp; // Simplified
    const ppk = cpk; // Simplified
    
    return {
      spc: {
        ucl,
        lcl,
        centerLine: mean,
        outOfControlPoints,
        cpk,
        cp,
        pp,
        ppk
      },
      controlLimits: {
        ucl,
        lcl,
        centerLine: mean
      },
      outOfControlPoints,
      runs: {
        aboveCenterLine: values.filter(v => v > mean).length,
        belowCenterLine: values.filter(v => v < mean).length,
        trends: false // Simplified
      },
      isInControl: outOfControlPoints.length === 0,
      acceptance: {
        acceptanceRate: ((values.length - outOfControlPoints.length) / values.length) * 100,
        rejectionRate: (outOfControlPoints.length / values.length) * 100,
        acceptedSamples: values.length - outOfControlPoints.length,
        rejectedSamples: outOfControlPoints.length,
        criteriaMet: cp > 1.33 ? ['Proces zdolny'] : [],
        criteriaFailed: cp <= 1.33 ? ['Proces niezdolny'] : []
      }
    };
  }

  /**
   * Analiza trendów czasowych
   */
  static analyzeTrend(values: number[], timePoints?: Date[]): TrendAnalysis {
    if (values.length < 3) {
      return {
        trend: 'stable',
        trendStrength: 0,
        correlation: 0,
        regression: {
          slope: 0,
          intercept: 0,
          rSquared: 0,
          equation: 'y = 0'
        }
      };
    }

    // Regresja liniowa dla trendu
    const x = Array.from({ length: values.length }, (_, i) => i);
    const regression = this.linearRegression(x, values);
    
    // Określenie trendu na podstawie nachylenia
    let trend: 'increasing' | 'decreasing' | 'stable' | 'cyclical';
    if (Math.abs(regression.slope) < 0.01) {
      trend = 'stable';
    } else if (regression.slope > 0) {
      trend = 'increasing';
    } else {
      trend = 'decreasing';
    }
    
    return {
      trend,
      trendStrength: Math.abs(regression.slope),
      correlation: regression.correlation,
      regression: {
        slope: regression.slope,
        intercept: regression.intercept,
        rSquared: regression.rSquared,
        equation: `y = ${regression.slope.toFixed(3)}x + ${regression.intercept.toFixed(3)}`
      },
      forecast: {
        nextValues: this.forecastNext(values, 3),
        confidence: regression.rSquared,
        timeHorizon: 3
      }
    };
  }

  /**
   * Analiza niepewności pomiarowej
   */
  static calculateUncertainty(
    values: number[],
    instrumentUncertainty: number = 0.1,
    environmentalFactors: number = 0.05
  ): UncertaintyAnalysis {
    const stats = this.calculateDescriptiveStats(values);
    
    // Niepewność typu A (statystyczna)
    const typeAUncertainty = stats.standardDeviation / Math.sqrt(values.length);
    
    // Niepewność typu B (instrumentalna i środowiskowa)
    const typeBUncertainty = Math.sqrt(
      Math.pow(instrumentUncertainty, 2) + 
      Math.pow(environmentalFactors, 2)
    );
    
    // Łączna niepewność standardowa
    const totalUncertainty = Math.sqrt(
      Math.pow(typeAUncertainty, 2) + 
      Math.pow(typeBUncertainty, 2)
    );
    
    // Współczynnik pokrycia (k=2 dla 95% poziomu ufności)
    const coverageFactor = 2;
    const expandedUncertainty = totalUncertainty * coverageFactor;
    
    return {
      typeA: {
        standardUncertainty: typeAUncertainty,
        degreesOfFreedom: values.length - 1,
        distribution: 't-distribution'
      },
      typeB: {
        components: [
          {
            source: 'Niepewność przyrządu',
            value: instrumentUncertainty,
            distribution: 'rectangular',
            divisor: Math.sqrt(3)
          },
          {
            source: 'Warunki środowiskowe',
            value: environmentalFactors,
            distribution: 'normal',
            divisor: 1
          }
        ],
        combinedUncertainty: Math.sqrt(Math.pow(instrumentUncertainty, 2) + Math.pow(environmentalFactors, 2))
      },
      expandedUncertainty: {
        value: expandedUncertainty,
        coverageFactor,
        confidenceLevel: 95
      },
      uncertaintyBudget: [
        {
          component: 'Typ A - statystyczna',
          value: typeAUncertainty,
          contribution: Math.pow(typeAUncertainty / totalUncertainty, 2) * 100
        },
        {
          component: 'Niepewność przyrządu',
          value: instrumentUncertainty,
          contribution: Math.pow(instrumentUncertainty / totalUncertainty, 2) * 100
        },
        {
          component: 'Warunki środowiskowe',
          value: environmentalFactors,
          contribution: Math.pow(environmentalFactors / totalUncertainty, 2) * 100
        }
      ]
    };
  }

  /**
   * ANOVA - analiza wariancji
   */
  static performANOVA(groups: number[][]): AnovaAnalysis {
    const allValues = groups.flat();
    const grandMean = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
    
    // Sumy kwadratów
    let ssBetween = 0;
    let ssWithin = 0;
    
    groups.forEach(group => {
      const groupMean = group.reduce((sum, val) => sum + val, 0) / group.length;
      ssBetween += group.length * Math.pow(groupMean - grandMean, 2);
      
      group.forEach(value => {
        ssWithin += Math.pow(value - groupMean, 2);
      });
    });
    
    const ssTotal = ssBetween + ssWithin;
    
    // Stopnie swobody
    const dfBetween = groups.length - 1;
    const dfWithin = allValues.length - groups.length;
    const dfTotal = allValues.length - 1;
    
    // Średnie kwadraty
    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / dfWithin;
    
    // Statystyka F
    const fStatistic = msBetween / msWithin;
    
    // Wartość p (uproszczenie - w rzeczywistości trzeba by użyć rozkładu F)
    const pValue = fStatistic > 4 ? 0.01 : 0.05; // Uproszczenie
    const alpha = 0.05;
    const criticalValue = 3.84; // Uproszczenie dla F(1, n-2)
    const isSignificant = pValue < alpha;
    
    return {
      fStatistic,
      pValue,
      criticalValue,
      isSignificant,
      alpha,
      degreesOfFreedom: {
        between: dfBetween,
        within: dfWithin,
        total: dfTotal
      },
      sumOfSquares: {
        between: ssBetween,
        within: ssWithin,
        total: ssTotal
      },
      meanSquares: {
        between: msBetween,
        within: msWithin
      },
      groups: groups.map((group, index) => ({
        name: `Grupa ${index + 1}`,
        count: group.length,
        mean: group.reduce((sum, val) => sum + val, 0) / group.length,
        variance: group.reduce((sum, val) => sum + Math.pow(val - (group.reduce((s, v) => s + v, 0) / group.length), 2), 0) / (group.length - 1)
      }))
    };
  }

  // Metody pomocnicze
  private static calculatePercentile(sortedValues: number[], percentile: number): number {
    const index = (percentile / 100) * (sortedValues.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (upper >= sortedValues.length) return sortedValues[sortedValues.length - 1];
    return sortedValues[lower] * (1 - weight) + sortedValues[upper] * weight;
  }

  private static getTValue(df: number, alpha: number): number {
    // Uproszczona tabela t-studenta
    const tTable: { [key: number]: number } = {
      1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
      10: 2.228, 20: 2.086, 30: 2.042, 60: 2.000, 120: 1.980
    };
    
    // Znajdź najbliższą wartość df
    const keys = Object.keys(tTable).map(Number).sort((a, b) => a - b);
    let closestDf = keys[0];
    
    for (const key of keys) {
      if (df >= key) closestDf = key;
    }
    
    return tTable[closestDf] || 2.0;
  }

  private static calculateSkewness(values: number[], mean: number, stdDev: number): number {
    const n = values.length;
    const skewness = values.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / stdDev, 3);
    }, 0) / n;
    
    return skewness;
  }

  private static calculateKurtosis(values: number[], mean: number, stdDev: number): number {
    const n = values.length;
    const kurtosis = values.reduce((sum, val) => {
      return sum + Math.pow((val - mean) / stdDev, 4);
    }, 0) / n - 3; // -3 for excess kurtosis
    
    return kurtosis;
  }

  private static calculateMode(values: number[]): number[] {
    const frequency: { [key: number]: number } = {};
    values.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    
    const maxFreq = Math.max(...Object.values(frequency));
    return Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq)
      .map(Number);
  }

  private static linearRegression(x: number[], y: number[]) {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Współczynnik korelacji
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return {
      slope,
      intercept,
      correlation,
      rSquared: correlation * correlation
    };
  }

  private static forecastNext(values: number[], periods: number): number[] {
    // Prosta prognoza na podstawie trendu liniowego
    const x = Array.from({ length: values.length }, (_, i) => i);
    const regression = this.linearRegression(x, values);
    
    const forecast = [];
    for (let i = 0; i < periods; i++) {
      const nextX = values.length + i;
      const nextY = regression.slope * nextX + regression.intercept;
      forecast.push(nextY);
    }
    
    return forecast;
  }

  // Analiza korelacji między parametrami
  static calculateCorrelations(
    data: { [parameterName: string]: number[] }
  ): Array<{
    parameter1: string;
    parameter2: string;
    correlation: number;
    pValue: number;
    isSignificant: boolean;
    n: number;
    confidenceInterval: { lower: number; upper: number };
  }> {
    const parameters = Object.keys(data);
    const correlations: Array<{
      parameter1: string;
      parameter2: string;
      correlation: number;
      pValue: number;
      isSignificant: boolean;
      n: number;
      confidenceInterval: { lower: number; upper: number };
    }> = [];

    for (let i = 0; i < parameters.length; i++) {
      for (let j = i + 1; j < parameters.length; j++) {
        const param1 = parameters[i];
        const param2 = parameters[j];
        const values1 = data[param1];
        const values2 = data[param2];

        // Upewnij się, że mamy te same długości
        const minLength = Math.min(values1.length, values2.length);
        const x = values1.slice(0, minLength);
        const y = values2.slice(0, minLength);

        if (minLength < 3) continue; // Potrzeba minimum 3 punktów

        // Oblicz korelację Pearsona
        const correlation = this.pearsonCorrelation(x, y);
        
        // Test istotności korelacji
        const n = minLength;
        const t = correlation * Math.sqrt((n - 2) / (1 - correlation * correlation));
        const df = n - 2;
        const pValue = 2 * (1 - this.tDistributionCDF(Math.abs(t), df));

        // Przedział ufności dla korelacji (Fisher transformation)
        const z = 0.5 * Math.log((1 + correlation) / (1 - correlation));
        const se = 1 / Math.sqrt(n - 3);
        const zCritical = 1.96; // dla 95% CI
        const zLower = z - zCritical * se;
        const zUpper = z + zCritical * se;
        
        const ciLower = (Math.exp(2 * zLower) - 1) / (Math.exp(2 * zLower) + 1);
        const ciUpper = (Math.exp(2 * zUpper) - 1) / (Math.exp(2 * zUpper) + 1);

        correlations.push({
          parameter1: param1,
          parameter2: param2,
          correlation,
          pValue,
          isSignificant: pValue < 0.05,
          n,
          confidenceInterval: {
            lower: ciLower,
            upper: ciUpper
          }
        });
      }
    }

    return correlations;
  }

  // Porównanie z wartościami referencyjnymi
  static compareWithReferences(
    parameterName: string,
    measuredValues: number[],
    referenceValues: Array<{
      source: string;
      standard: string;
      value: number;
      range?: { min: number; max: number };
      material: string;
      tolerance?: number;
    }>
  ): ReferenceComparison {
    const stats = this.calculateDescriptiveStats(measuredValues);
    const measuredMean = stats.mean;

    const compliance = referenceValues.map(ref => {
      const tolerance = ref.tolerance || (ref.range ? 
        (ref.range.max - ref.range.min) / 2 : 
        ref.value * 0.05); // Domyślnie 5% tolerancji

      const deviation = measuredMean - ref.value;
      const deviationPercent = (deviation / ref.value) * 100;
      const isCompliant = Math.abs(deviation) <= tolerance;

      return {
        standard: ref.standard,
        measured: measuredMean,
        reference: ref.value,
        tolerance,
        isCompliant,
        deviation,
        deviationPercent
      };
    });

    const overallComplianceBoolean = compliance.every(c => c.isCompliant);
    const averageDeviation = compliance.reduce((sum, c) => sum + Math.abs(c.deviationPercent), 0) / compliance.length;

    return {
      referenceValues: referenceValues.map(ref => ({
        source: ref.source,
        standard: ref.standard,
        value: ref.value,
        range: ref.range,
        material: ref.material,
        conditions: undefined
      })),
      compliance,
      overallCompliance: overallComplianceBoolean,
      averageDeviation
    };
  }

  // Pomocnicze funkcje matematyczne
  private static pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private static tDistributionCDF(t: number, df: number): number {
    // Uproszczona aproksymacja funkcji rozkładu t-Studenta
    // W rzeczywistym zastosowaniu należałoby użyć dokładniejszej implementacji
    if (df === 1) {
      return 0.5 + Math.atan(t) / Math.PI;
    }
    
    // Aproksymacja dla df > 1
    const a = df / (df + t * t);
    const beta = this.incompleteBeta(0.5, df / 2, 0.5, a);
    return t >= 0 ? 1 - 0.5 * beta : 0.5 * beta;
  }

  private static incompleteBeta(a: number, b: number, x: number, regularized: number): number {
    // Bardzo uproszczona implementacja funkcji beta niekompletnej
    // W produkcji należy użyć biblioteki matematycznej
    return Math.pow(regularized, a) * Math.pow(1 - regularized, b);
  }

  private static standardNormalCDF(z: number): number {
    return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
  }

  private static erf(x: number): number {
    // Aproksymacja funkcji błędu Gaussa
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
  }
}

/**
 * Generator raportów analitycznych
 */
export class AnalyticsReportGenerator {
  
  static generateComprehensiveAnalysis(
    sessions: StudySession[],
    config: AnalysisConfig = {
      confidenceLevel: 95,
      significanceLevel: 0.05,
      outlierDetectionMethod: 'iqr',
      testType: 'auto',
      controlLimits: 'sigma3',
      controlLimitSigma: 3,
      outlierMethod: 'iqr',
      trendMethod: 'linear'
    }
  ): ComprehensiveAnalysis {
    
    if (!sessions || sessions.length === 0) {
      throw new Error('Brak danych do analizy');
    }

    // Ekstraktuj parametry z sesji
    const parameterNames = this.extractParameterNames(sessions);
    const parameters: { [key: string]: any } = {};
    
    // Analiza dla każdego parametru
    parameterNames.forEach(paramName => {
      const values = this.extractParameterValues(sessions, paramName);
      
      if (values.length > 0) {
        parameters[paramName] = {
          descriptiveStats: StatisticalAnalyzer.calculateDescriptiveStats(values),
          qualityControl: StatisticalAnalyzer.calculateQualityControl(values, config),
          trendAnalysis: StatisticalAnalyzer.analyzeTrend(values),
          uncertainty: StatisticalAnalyzer.calculateUncertainty(values),
          referenceComparison: this.generateReferenceComparison(paramName, values)
        };
      }
    });

    // Analiza porównawcza
    const groupedData = this.groupDataForANOVA(sessions);
    const anovaResults = groupedData.length > 1 
      ? StatisticalAnalyzer.performANOVA(groupedData)
      : null;

    // Korelacje między parametrami
    const correlations = this.calculateCorrelations(sessions, parameterNames);

    // Ocena ogólnej jakości
    const overallQuality = this.assessOverallQuality(parameters, sessions);

    const firstSession = sessions[0];
    const sampleValues = firstSession ? Object.values(firstSession.data) : [];
    const defaultConfig: AnalysisConfig = {
      confidenceLevel: 95,
      significanceLevel: 0.05,
      outlierDetectionMethod: 'iqr',
      testType: 'auto',
      controlLimits: 'sigma3',
      controlLimitSigma: 3,
      outlierMethod: 'iqr',
      trendMethod: 'linear'
    };
    
    return {
      studyId: sessions[0]?.studyId || '',
      parameterId: 'comprehensive',
      parameterName: 'Analiza kompleksowa',
      unit: 'różne',
      descriptiveStats: StatisticalAnalyzer.calculateDescriptiveStats(sampleValues),
      qualityControl: StatisticalAnalyzer.calculateQualityControl(sampleValues, defaultConfig),
      trendAnalysis: StatisticalAnalyzer.analyzeTrend(sampleValues),
      uncertaintyAnalysis: StatisticalAnalyzer.calculateUncertainty(sampleValues),
      timestamp: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      parameters,
      comparativeAnalysis: {
        anova: anovaResults!,
        correlations: {
          correlationMatrix: correlations.map(corr => ({
            parameter1: corr.parameter1,
            parameter2: corr.parameter2,
            correlation: corr.correlation,
            pValue: Math.abs(corr.correlation) > 0.5 ? 0.01 : 0.1, // Uproszczenie
            isSignificant: Math.abs(corr.correlation) > 0.5
          })),
          strongCorrelations: correlations
            .filter(corr => Math.abs(corr.correlation) > 0.7)
            .map(corr => ({
              parameter1: corr.parameter1,
              parameter2: corr.parameter2,
              correlation: corr.correlation,
              interpretation: Math.abs(corr.correlation) > 0.9 ? 'Bardzo silna korelacja' : 'Silna korelacja'
            })),
          heatmapData: [correlations.map(corr => corr.correlation)], // Uproszczenie - normalnie byłaby to macierz
          parameters: parameterNames
        }
      },
      overallQuality
    };
  }

  private static extractParameterNames(sessions: StudySession[]): string[] {
    const allKeys = new Set<string>();
    sessions.forEach(session => {
      if (session.data) {
        Object.keys(session.data).forEach(key => allKeys.add(key));
      }
    });
    return Array.from(allKeys);
  }

  private static extractParameterValues(sessions: StudySession[], paramName: string): number[] {
    return sessions
      .map(session => session.data?.[paramName])
      .filter(value => typeof value === 'number' && !isNaN(value)) as number[];
  }

  private static groupDataForANOVA(sessions: StudySession[]): number[][] {
    // Grupowanie danych według operatora (przykład)
    const groups: { [operator: string]: number[] } = {};
    
    sessions.forEach(session => {
      const operator = session.operator || 'Unknown';
      if (!groups[operator]) groups[operator] = [];
      
      // Weź pierwszy parametr numeryczny jako przykład
      const firstNumericValue = Object.values(session.data || {})
        .find(val => typeof val === 'number') as number;
      
      if (firstNumericValue !== undefined) {
        groups[operator].push(firstNumericValue);
      }
    });

    return Object.values(groups).filter(group => group.length > 0);
  }

  private static calculateCorrelations(sessions: StudySession[], paramNames: string[]) {
    const correlations: any[] = [];
    
    for (let i = 0; i < paramNames.length; i++) {
      for (let j = i + 1; j < paramNames.length; j++) {
        const param1 = paramNames[i];
        const param2 = paramNames[j];
        
        const values1 = this.extractParameterValues(sessions, param1);
        const values2 = this.extractParameterValues(sessions, param2);
        
        if (values1.length === values2.length && values1.length > 1) {
          const correlation = this.calculatePearsonCorrelation(values1, values2);
          
          correlations.push({
            parameter1: param1,
            parameter2: param2,
            correlation,
            pValue: Math.abs(correlation) > 0.5 ? 0.01 : 0.1, // Uproszczenie
            isSignificant: Math.abs(correlation) > 0.5
          });
        }
      }
    }
    
    return correlations;
  }

  private static calculatePearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);
    
    const correlation = (n * sumXY - sumX * sumY) / 
      Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));
    
    return isNaN(correlation) ? 0 : correlation;
  }

  private static generateReferenceComparison(paramName: string, values: number[]): ReferenceComparison {
    // Przykładowe wartości referencyjne (w rzeczywistej aplikacji z bazy danych)
    const referenceData: { [key: string]: any } = {
      'tensileStrength': { value: 250, range: { min: 230, max: 270 }, standard: 'ASTM D638' },
      'yieldStrength': { value: 200, range: { min: 180, max: 220 }, standard: 'ASTM D638' },
      'modulusOfElasticity': { value: 70000, range: { min: 65000, max: 75000 }, standard: 'ASTM D638' }
    };

    const reference = referenceData[paramName];
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    
    if (!reference) {
      return {
        referenceValues: [],
        compliance: [],
        overallCompliance: false,
        averageDeviation: 0
      };
    }

    const tolerance = (reference.range.max - reference.range.min) / 2;
    const isCompliant = mean >= reference.range.min && mean <= reference.range.max;
    const deviation = mean - reference.value;
    const deviationPercent = ((mean - reference.value) / reference.value) * 100;
    
    return {
      referenceValues: [{
        source: 'Literatura techniczna',
        material: 'Materiał standardowy',
        parameter: paramName,
        value: reference.value,
        range: reference.range,
        standard: reference.standard
      }],
      compliance: [{
        parameter: paramName,
        measured: mean,
        reference: reference.value,
        tolerance,
        isCompliant,
        deviation,
        deviationPercent
      }],
      overallCompliance: isCompliant,
      averageDeviation: Math.abs(deviationPercent)
    };
  }

  private static assessOverallQuality(parameters: any, sessions: StudySession[]) {
    let totalScore = 0;
    let paramCount = 0;
    const recommendations: string[] = [];
    const criticalFindings: string[] = [];

    // Ocena każdego parametru
    Object.entries(parameters).forEach(([name, data]: [string, any]) => {
      paramCount++;
      
      // Ocena na podstawie Cpk
      const cpk = data.qualityControl.spc.cpk;
      if (cpk > 1.33) {
        totalScore += 100;
        recommendations.push(`${name}: Proces w kontroli statystycznej`);
      } else if (cpk > 1.0) {
        totalScore += 75;
        recommendations.push(`${name}: Proces akceptowalny, ale wymaga monitorowania`);
      } else {
        totalScore += 50;
        criticalFindings.push(`${name}: Proces niezdolny (Cpk = ${cpk.toFixed(2)})`);
      }

      // Sprawdź outliery
      const outliersCount = data.descriptiveStats.outliers.length;
      if (outliersCount > 0) {
        criticalFindings.push(`${name}: Wykryto ${outliersCount} wartości odstających`);
      }
    });

    const overallScore = paramCount > 0 ? totalScore / paramCount : 0;

    return {
      overallScore,
      recommendations,
      criticalFindings,
      dataIntegrity: {
        completeness: (sessions.filter(s => s.data && Object.keys(s.data).length > 0).length / sessions.length) * 100,
        consistency: 95, // Uproszczenie
        accuracy: overallScore > 80 ? 95 : 75
      }
    };
  }
}
