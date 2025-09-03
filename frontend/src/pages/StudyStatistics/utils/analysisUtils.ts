import { TrendAnalysis, StudyComparison, ExportOptions } from '../types/statistics';
import { StatisticalCalculator } from './statisticalCalculator';

/**
 * Klasa do analizy trendów w danych
 */
export class TrendAnalysisUtils {
  
  /**
   * Analizuje trend czasowy w danych
   */
  static analyzeTrend(
    data: { timestamp: Date; value: number }[],
    parameter: string = 'Analiza trendu'
  ): TrendAnalysis {
    
    if (data.length < 3) {
      throw new Error('Za mało danych do analizy trendu');
    }
    
    // Sortuj dane według czasu
    const sortedData = [...data].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    // Przygotuj dane do regresji
    const timeValues = sortedData.map((_, index) => index + 1);
    const values = sortedData.map(item => item.value);
    
    // Regresja liniowa
    const regression = StatisticalCalculator.linearRegression(timeValues, values);
    
    // Określ trend
    let trend: 'increasing' | 'decreasing' | 'stable' | 'cyclical';
    if (regression.rSquared > 0.3) {
      if (regression.slope > 0.01) trend = 'increasing';
      else if (regression.slope < -0.01) trend = 'decreasing';
      else trend = 'stable';
    } else {
      trend = 'cyclical';
    }
    
    return {
      parameter,
      timeSeriesData: sortedData.map((item, index) => ({
        timestamp: item.timestamp,
        value: item.value,
        session: `S${index + 1}`,
        sample: undefined
      })),
      trend,
      trendStrength: regression.rSquared,
      changePoints: []
    };
  }
}

/**
 * Klasa do porównywania badań
 */
export class StudyComparisonUtils {
  
  /**
   * Porównuje wyniki dwóch badań
   */
  static compareStudies(
    study1: { name: string; data: number[] },
    study2: { name: string; data: number[] },
    parameters: string[]
  ): StudyComparison {
    
    // Statystyki opisowe
    const stats1 = StatisticalCalculator.calculateDescriptiveStats(study1.data);
    const stats2 = StatisticalCalculator.calculateDescriptiveStats(study2.data);
    
    // Test t-Studenta
    const tTest = StatisticalCalculator.tTestTwoSample(study1.data, study2.data);
    
    return {
      studies: [study1.name, study2.name],
      parameters,
      comparisons: parameters.map(param => ({
        parameter: param,
        studies: [
          {
            studyId: 'study1',
            studyName: study1.name,
            summary: stats1,
            qualityMetrics: {
              completeness: 100,
              accuracy: 95,
              precision: 98,
              bias: 0.1,
              uncertainty: 2.5
            }
          },
          {
            studyId: 'study2',
            studyName: study2.name,
            summary: stats2,
            qualityMetrics: {
              completeness: 100,
              accuracy: 95,
              precision: 98,
              bias: 0.1,
              uncertainty: 2.5
            }
          }
        ],
        analysis: {
          testName: 'Test t-Studenta',
          groups: [study1.name, study2.name],
          testStatistic: tTest.tStatistic,
          pValue: tTest.pValue,
          effect: tTest.effectSize.toString(),
          significant: tTest.significant,
          interpretation: this.interpretTTest(tTest, study1.name, study2.name)
        },
        visualization: {
          type: 'boxplot',
          title: `Porównanie ${param}`,
          xAxis: { label: 'Badanie', scale: 'linear' },
          yAxis: { label: param, scale: 'linear' }
        }
      })),
      overall: {
        recommendation: this.generateOverallRecommendation(tTest),
        riskAssessment: {
          level: tTest.significant ? (tTest.effectSize > 0.8 ? 'high' : 'medium') : 'low',
          factors: [],
          mitigation: []
        },
        decisionMatrix: {
          criteria: [
            {
              name: 'Istotność statystyczna',
              weight: 0.4,
              description: 'Czy różnice są statystycznie istotne'
            },
            {
              name: 'Wielkość efektu',
              weight: 0.6,
              description: 'Praktyczna znaczność różnic'
            }
          ],
          studies: [
            {
              studyId: 'study1',
              studyName: study1.name,
              scores: [tTest.significant ? 1 : 0, Math.abs(tTest.effectSize)],
              totalScore: tTest.significant ? 1 + Math.abs(tTest.effectSize) : Math.abs(tTest.effectSize),
              rank: 1
            },
            {
              studyId: 'study2',
              studyName: study2.name,
              scores: [tTest.significant ? 1 : 0, Math.abs(tTest.effectSize)],
              totalScore: tTest.significant ? 1 + Math.abs(tTest.effectSize) : Math.abs(tTest.effectSize),
              rank: 2
            }
          ],
          recommendation: 'Porównanie badań wykazuje ' + (tTest.significant ? 'istotne różnice' : 'brak istotnych różnic')
        }
      }
    };
  }
  
  /**
   * Interpretuje test t-Studenta
   */
  private static interpretTTest(
    tTest: { significant: boolean; tStatistic: number; pValue: number },
    study1Name: string,
    study2Name: string
  ): string {
    if (tTest.significant) {
      const direction = tTest.tStatistic > 0 ? `${study1Name} ma istotnie wyższe` : `${study2Name} ma istotnie wyższe`;
      return `${direction} wartości (p = ${tTest.pValue.toFixed(3)})`;
    } else {
      return `Brak istotnych różnic między badaniami (p = ${tTest.pValue.toFixed(3)})`;
    }
  }

  /**
   * Generuje ogólne rekomendacje dla porównania
   */
  private static generateOverallRecommendation(
    tTest: { significant: boolean; pValue: number; effectSize: number }
  ): string {
    if (tTest.significant) {
      if (Math.abs(tTest.effectSize) > 0.8) {
        return 'Wykryto duże i istotne różnice między badaniami. Zalecana szczegółowa analiza przyczyn.';
      } else {
        return 'Wykryto istotne statystycznie różnice między badaniami. Wymaga dalszej analizy.';
      }
    } else {
      return 'Brak istotnych różnic między badaniami. Wyniki są porównywalne.';
    }
  }
}

/**
 * Klasa do generowania opcji eksportu
 */
export class ExportUtils {
  
  /**
   * Generuje opcje eksportu danych
   */
  static getExportOptions(): ExportOptions[] {
    return [
      {
        format: 'pdf',
        includeRawData: false,
        includeCharts: true,
        includeStatistics: true,
        includeQualityControl: true,
        compression: 'none'
      },
      {
        format: 'excel',
        includeRawData: true,
        includeCharts: true,
        includeStatistics: true,
        includeQualityControl: true,
        compression: 'none'
      },
      {
        format: 'csv',
        includeRawData: true,
        includeCharts: false,
        includeStatistics: false,
        includeQualityControl: false,
        compression: 'none'
      },
      {
        format: 'json',
        includeRawData: true,
        includeCharts: false,
        includeStatistics: true,
        includeQualityControl: true,
        compression: 'gzip'
      }
    ];
  }
}
