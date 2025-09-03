import { QualityControlChart, ProcessCapability, QualityControlPoint } from '../types/statistics';
import { StatisticalCalculator } from './statisticalCalculator';

/**
 * Klasa do tworzenia wykresów kontrolnych jakości
 */
export class QualityControlUtils {
  
  /**
   * Tworzy wykres X-bar i R (średnie i rozstępy)
   */
  static createXBarRChart(
    data: number[][],
    subgroupSize: number = 5,
    specifications?: { lsl?: number; usl?: number }
  ): {
    xBarChart: QualityControlChart;
    rChart: QualityControlChart;
    capability?: ProcessCapability;
    recommendations: string[];
  } {
    
    if (data.length === 0) {
      throw new Error('Brak danych do analizy');
    }
    
    // Oblicz średnie i rozstępy dla każdej podgrupy
    const subgroupMeans = data.map(subgroup => StatisticalCalculator.mean(subgroup));
    const subgroupRanges = data.map(subgroup => {
      const sorted = [...subgroup].sort((a, b) => a - b);
      return sorted[sorted.length - 1] - sorted[0];
    });
    
    // Linia centralna i granice kontrolne dla wykres X-bar
    const grandMean = StatisticalCalculator.mean(subgroupMeans);
    const meanRange = StatisticalCalculator.mean(subgroupRanges);
    
    // Współczynniki dla wykresów kontrolnych
    const factors = this.getControlChartFactors(subgroupSize);
    
    const xBarChart: QualityControlChart = {
      type: 'xbar-r',
      centerLine: grandMean,
      upperControlLimit: grandMean + factors.A2 * meanRange,
      lowerControlLimit: grandMean - factors.A2 * meanRange,
      upperSpecLimit: specifications?.usl,
      lowerSpecLimit: specifications?.lsl,
      points: subgroupMeans.map((mean, index) => ({
        sequence: index + 1,
        value: mean,
        outOfControl: mean > (grandMean + factors.A2 * meanRange) || 
                     mean < (grandMean - factors.A2 * meanRange),
        rules: [],
        timestamp: new Date()
      }))
    };
    
    // Wykres R (rozstępów)
    const rChart: QualityControlChart = {
      type: 'xbar-r',
      centerLine: meanRange,
      upperControlLimit: factors.D4 * meanRange,
      lowerControlLimit: factors.D3 * meanRange,
      points: subgroupRanges.map((range, index) => ({
        sequence: index + 1,
        value: range,
        outOfControl: range > (factors.D4 * meanRange) || 
                     range < (factors.D3 * meanRange),
        rules: [],
        timestamp: new Date()
      }))
    };
    
    // Zdolność procesu
    const capability = specifications ? 
      this.calculateProcessCapability(data.flat(), grandMean, meanRange / factors.d2, specifications) : 
      undefined;
    
    return {
      xBarChart,
      rChart,
      capability,
      recommendations: this.generateRecommendations(xBarChart, rChart, capability)
    };
  }
  
  /**
   * Tworzy wykres dla pomiarów indywidualnych (I-MR)
   */
  static createIndividualsChart(
    data: number[],
    specifications?: { lsl?: number; usl?: number }
  ): {
    individualsChart: QualityControlChart;
    movingRangeChart: QualityControlChart;
    capability?: ProcessCapability;
    recommendations: string[];
  } {
    
    if (data.length < 2) {
      throw new Error('Za mało danych - wymagane minimum 2 pomiary');
    }
    
    // Oblicz ruchome rozstępy
    const movingRanges = [];
    for (let i = 1; i < data.length; i++) {
      movingRanges.push(Math.abs(data[i] - data[i - 1]));
    }
    
    const meanValue = StatisticalCalculator.mean(data);
    const meanMovingRange = StatisticalCalculator.mean(movingRanges);
    
    // Wykres pomiarów indywidualnych
    const individualsChart: QualityControlChart = {
      type: 'x-mr',
      centerLine: meanValue,
      upperControlLimit: meanValue + 2.66 * meanMovingRange,
      lowerControlLimit: meanValue - 2.66 * meanMovingRange,
      upperSpecLimit: specifications?.usl,
      lowerSpecLimit: specifications?.lsl,
      points: data.map((value, index) => ({
        sequence: index + 1,
        value: value,
        outOfControl: value > (meanValue + 2.66 * meanMovingRange) || 
                     value < (meanValue - 2.66 * meanMovingRange),
        rules: [],
        timestamp: new Date()
      }))
    };
    
    // Wykres ruchomych rozstępów
    const movingRangeChart: QualityControlChart = {
      type: 'x-mr',
      centerLine: meanMovingRange,
      upperControlLimit: 3.267 * meanMovingRange,
      lowerControlLimit: 0,
      points: movingRanges.map((range, index) => ({
        sequence: index + 2,
        value: range,
        outOfControl: range > (3.267 * meanMovingRange),
        rules: [],
        timestamp: new Date()
      }))
    };
    
    const capability = specifications ? 
      this.calculateProcessCapability(data, meanValue, meanMovingRange / 1.128, specifications) : 
      undefined;
    
    return {
      individualsChart,
      movingRangeChart,
      capability,
      recommendations: this.generateRecommendations(individualsChart, movingRangeChart, capability)
    };
  }
  
  /**
   * Oblicza zdolność procesu
   */
  static calculateProcessCapability(
    data: number[],
    mean: number,
    stdDev: number,
    specifications: { lsl?: number; usl?: number }
  ): ProcessCapability {
    
    const { lsl, usl } = specifications;
    
    let cp = 0;
    let cpk = 0;
    let pp = 0;
    let ppk = 0;
    
    // Cp - potencjalna zdolność procesu
    if (lsl !== undefined && usl !== undefined) {
      cp = (usl - lsl) / (6 * stdDev);
    }
    
    // Cpk - rzeczywista zdolność procesu
    if (lsl !== undefined && usl !== undefined) {
      const cpkLower = (mean - lsl) / (3 * stdDev);
      const cpkUpper = (usl - mean) / (3 * stdDev);
      cpk = Math.min(cpkLower, cpkUpper);
    } else if (lsl !== undefined) {
      cpk = (mean - lsl) / (3 * stdDev);
    } else if (usl !== undefined) {
      cpk = (usl - mean) / (3 * stdDev);
    }
    
    // Pp i Ppk - wskaźniki wydajności procesu
    const actualStdDev = Math.sqrt(StatisticalCalculator.variance(data));
    
    if (lsl !== undefined && usl !== undefined) {
      pp = (usl - lsl) / (6 * actualStdDev);
      const ppkLower = (mean - lsl) / (3 * actualStdDev);
      const ppkUpper = (usl - mean) / (3 * actualStdDev);
      ppk = Math.min(ppkLower, ppkUpper);
    }
    
    // Sigma level
    const sigma = cpk * 3;
    
    return {
      cp,
      cpk,
      pp,
      ppk,
      sigma,
      interpretation: this.interpretCapability(cp, cpk, pp, ppk),
      recommendation: this.generateCapabilityRecommendations(cp, cpk, pp, ppk).join('; ')
    };
  }
  
  /**
   * Analizuje trend w danych
   */
  static analyzeTrend(data: number[]): {
    hasIncreasingTrend: boolean;
    hasDecreasingTrend: boolean;
    slope: number;
    significance: number;
  } {
    if (data.length < 7) {
      return {
        hasIncreasingTrend: false,
        hasDecreasingTrend: false,
        slope: 0,
        significance: 0
      };
    }
    
    // Test trendu - 7 kolejnych punktów rosnących lub malejących
    let increasingCount = 0;
    let decreasingCount = 0;
    let maxIncreasing = 0;
    let maxDecreasing = 0;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i] > data[i - 1]) {
        increasingCount++;
        decreasingCount = 0;
      } else if (data[i] < data[i - 1]) {
        decreasingCount++;
        increasingCount = 0;
      } else {
        increasingCount = 0;
        decreasingCount = 0;
      }
      
      maxIncreasing = Math.max(maxIncreasing, increasingCount);
      maxDecreasing = Math.max(maxDecreasing, decreasingCount);
    }
    
    // Regresja liniowa dla określenia nachylenia trendu
    const xValues = data.map((_, index) => index + 1);
    const regression = StatisticalCalculator.linearRegression(xValues, data);
    
    return {
      hasIncreasingTrend: maxIncreasing >= 6,
      hasDecreasingTrend: maxDecreasing >= 6,
      slope: regression.slope,
      significance: Math.abs(regression.rSquared)
    };
  }
  
  /**
   * Pobiera współczynniki dla wykresów kontrolnych
   */
  private static getControlChartFactors(n: number): {
    A2: number; A3: number; d2: number; D3: number; D4: number; B3: number; B4: number;
  } {
    const factors: { [key: number]: any } = {
      2: { A2: 1.880, A3: 2.659, d2: 1.128, D3: 0, D4: 3.267, B3: 0, B4: 3.267 },
      3: { A2: 1.023, A3: 1.954, d2: 1.693, D3: 0, D4: 2.574, B3: 0, B4: 2.568 },
      4: { A2: 0.729, A3: 1.628, d2: 2.059, D3: 0, D4: 2.282, B3: 0, B4: 2.266 },
      5: { A2: 0.577, A3: 1.427, d2: 2.326, D3: 0, D4: 2.114, B3: 0, B4: 2.089 },
      6: { A2: 0.483, A3: 1.287, d2: 2.534, D3: 0, D4: 2.004, B3: 0.030, B4: 1.970 },
      7: { A2: 0.419, A3: 1.182, d2: 2.704, D3: 0.076, D4: 1.924, B3: 0.118, B4: 1.882 },
      8: { A2: 0.373, A3: 1.099, d2: 2.847, D3: 0.136, D4: 1.864, B3: 0.185, B4: 1.815 },
      9: { A2: 0.337, A3: 1.032, d2: 2.970, D3: 0.184, D4: 1.816, B3: 0.239, B4: 1.761 },
      10: { A2: 0.308, A3: 0.975, d2: 3.078, D3: 0.223, D4: 1.777, B3: 0.284, B4: 1.716 }
    };
    
    return factors[Math.min(n, 10)] || factors[10];
  }
  
  /**
   * Interpretuje wskaźniki zdolności procesu
   */
  private static interpretCapability(
    cp?: number,
    cpk?: number,
    pp?: number,
    ppk?: number
  ): string {
    if (!cpk) return 'Brak wystarczających danych do oceny zdolności procesu';
    
    if (cpk >= 2.0) {
      return 'Proces ma znakomitą zdolność (6 sigma)';
    } else if (cpk >= 1.67) {
      return 'Proces ma bardzo dobrą zdolność (5 sigma)';
    } else if (cpk >= 1.33) {
      return 'Proces ma dobrą zdolność (4 sigma)';
    } else if (cpk >= 1.0) {
      return 'Proces ma akceptowalną zdolność (3 sigma)';
    } else if (cpk >= 0.67) {
      return 'Proces ma słabą zdolność - wymaga poprawy';
    } else {
      return 'Proces ma nieakceptowalną zdolność - pilne działania wymagane';
    }
  }
  
  /**
   * Generuje rekomendacje dla wykresów kontrolnych
   */
  private static generateRecommendations(
    chart1: QualityControlChart,
    chart2: QualityControlChart,
    capability?: ProcessCapability
  ): string[] {
    const recommendations: string[] = [];
    
    // Sprawdź punkty poza kontrolą
    const outOfControl1 = chart1.points.filter(p => p.outOfControl).length;
    const outOfControl2 = chart2.points.filter(p => p.outOfControl).length;
    
    if (outOfControl1 > 0 || outOfControl2 > 0) {
      recommendations.push('Wykryto punkty poza granicami kontrolnymi - zbadaj przyczyny szczególne');
    }
    
    // Rekomendacje dla zdolności procesu
    if (capability) {
      if (capability.cpk < 1.0) {
        recommendations.push('Niska zdolność procesu - rozważ poprawę procesu lub zmianę specyfikacji');
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Proces wydaje się być pod kontrolą statystyczną');
    }
    
    return recommendations;
  }
  
  /**
   * Generuje rekomendacje dla zdolności procesu
   */
  private static generateCapabilityRecommendations(
    cp?: number,
    cpk?: number,
    pp?: number,
    ppk?: number
  ): string[] {
    const recommendations: string[] = [];
    
    if (cp && cpk) {
      if (cp > cpk + 0.2) {
        recommendations.push('Proces jest odśrodkowany - wyreguluj średnią procesu');
      }
    }
    
    if (cpk && cpk < 1.33) {
      recommendations.push('Zwiększ zdolność procesu poprzez:');
      recommendations.push('- Redukcję zmienności procesu');
      recommendations.push('- Poprawę centrowania procesu');
      recommendations.push('- Kontrolę przyczyn szczególnych');
    }
    
    if (pp && ppk && pp > ppk + 0.2) {
      recommendations.push('Proces ma problemy z długoterminową stabilnością');
    }
    
    return recommendations;
  }
}

/**
 * Klasa do analizy wzorców w wykresach kontrolnych
 */
export class ControlChartPatterns {
  
  /**
   * Wykrywa wzorce w danych według reguł Western Electric
   */
  static detectPatterns(
    points: number[],
    centerLine: number,
    ucl: number,
    lcl: number
  ): {
    rule1: boolean; // Punkt poza granicami kontrolnymi
    rule2: boolean; // 2 z 3 punktów w strefie A
    rule3: boolean; // 4 z 5 punktów w strefie B lub dalej
    rule4: boolean; // 8 kolejnych punktów w strefie C lub dalej
    rule5: boolean; // 6 punktów z rzędu rosnących lub malejących
    rule6: boolean; // 15 punktów z rzędu w strefie C
    rule7: boolean; // 14 punktów z rzędu naprzemiennie
    rule8: boolean; // 8 punktów z rzędu po obu stronach z brak w strefie C
  } {
    
    const sigma = (ucl - centerLine) / 3;
    
    // Strefy kontrolne
    const zoneA_upper = centerLine + 2 * sigma;
    const zoneA_lower = centerLine - 2 * sigma;
    const zoneB_upper = centerLine + sigma;
    const zoneB_lower = centerLine - sigma;
    
    // Reguła 1: Punkt poza granicami kontrolnymi
    const rule1 = points.some(point => point > ucl || point < lcl);
    
    // Reguła 2: 2 z 3 kolejnych punktów w strefie A lub dalej
    let rule2 = false;
    for (let i = 0; i <= points.length - 3; i++) {
      const inZoneA = points.slice(i, i + 3).filter(point => 
        point > zoneA_upper || point < zoneA_lower
      ).length;
      if (inZoneA >= 2) {
        rule2 = true;
        break;
      }
    }
    
    // Reguła 3: 4 z 5 kolejnych punktów w strefie B lub dalej (ta sama strona)
    let rule3 = false;
    for (let i = 0; i <= points.length - 5; i++) {
      const slice = points.slice(i, i + 5);
      const upperSide = slice.filter(point => point > zoneB_upper).length;
      const lowerSide = slice.filter(point => point < zoneB_lower).length;
      if (upperSide >= 4 || lowerSide >= 4) {
        rule3 = true;
        break;
      }
    }
    
    // Reguła 4: 8 kolejnych punktów w strefie C lub dalej (ta sama strona)
    let rule4 = false;
    for (let i = 0; i <= points.length - 8; i++) {
      const slice = points.slice(i, i + 8);
      const upperSide = slice.filter(point => point > centerLine).length;
      const lowerSide = slice.filter(point => point < centerLine).length;
      if (upperSide === 8 || lowerSide === 8) {
        rule4 = true;
        break;
      }
    }
    
    // Reguła 5: 6 punktów z rzędu rosnących lub malejących
    let rule5 = false;
    let increasing = 0;
    let decreasing = 0;
    for (let i = 1; i < points.length; i++) {
      if (points[i] > points[i - 1]) {
        increasing++;
        decreasing = 0;
      } else if (points[i] < points[i - 1]) {
        decreasing++;
        increasing = 0;
      } else {
        increasing = 0;
        decreasing = 0;
      }
      
      if (increasing >= 5 || decreasing >= 5) {
        rule5 = true;
        break;
      }
    }
    
    // Reguła 6: 15 punktów z rzędu w strefie C (blisko linii centralnej)
    let rule6 = false;
    for (let i = 0; i <= points.length - 15; i++) {
      const slice = points.slice(i, i + 15);
      const inZoneC = slice.filter(point => 
        point > zoneB_lower && point < zoneB_upper
      ).length;
      if (inZoneC === 15) {
        rule6 = true;
        break;
      }
    }
    
    // Reguła 7: 14 punktów z rzędu naprzemiennie w górę i w dół
    let rule7 = false;
    if (points.length >= 14) {
      let alternating = true;
      for (let i = 1; i < 14; i++) {
        const currentUp = points[i] > points[i - 1];
        const nextUp = i < 13 ? points[i + 1] > points[i] : !currentUp;
        if (currentUp === nextUp) {
          alternating = false;
          break;
        }
      }
      rule7 = alternating;
    }
    
    // Reguła 8: 8 punktów z rzędu po obu stronach linii centralnej, brak w strefie C
    let rule8 = false;
    for (let i = 0; i <= points.length - 8; i++) {
      const slice = points.slice(i, i + 8);
      const hasUpper = slice.some(point => point > centerLine);
      const hasLower = slice.some(point => point < centerLine);
      const allOutsideC = slice.every(point => 
        point > zoneB_upper || point < zoneB_lower
      );
      if (hasUpper && hasLower && allOutsideC) {
        rule8 = true;
        break;
      }
    }
    
    return { rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8 };
  }
  
  /**
   * Interpretuje wykryte wzorce
   */
  static interpretPatterns(patterns: ReturnType<typeof ControlChartPatterns.detectPatterns>): string[] {
    const interpretations: string[] = [];
    
    if (patterns.rule1) {
      interpretations.push('Reguła 1: Punkt poza granicami kontrolnymi - przyczyna szczególna');
    }
    if (patterns.rule2) {
      interpretations.push('Reguła 2: Duża zmienność lub przesunięcie procesu');
    }
    if (patterns.rule3) {
      interpretations.push('Reguła 3: Przesunięcie poziomu procesu');
    }
    if (patterns.rule4) {
      interpretations.push('Reguła 4: Przesunięcie średniej procesu');
    }
    if (patterns.rule5) {
      interpretations.push('Reguła 5: Trend w procesie - systematyczna zmiana');
    }
    if (patterns.rule6) {
      interpretations.push('Reguła 6: Zmniejszona zmienność - możliwe nadmierne skalowanie');
    }
    if (patterns.rule7) {
      interpretations.push('Reguła 7: Systematyczne zmiany naprzemienne');
    }
    if (patterns.rule8) {
      interpretations.push('Reguła 8: Brak punktów centralnych - możliwe mieszanie danych');
    }
    
    return interpretations;
  }
}
