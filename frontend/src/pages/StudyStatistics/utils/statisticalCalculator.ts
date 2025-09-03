import { StatisticalData, StatisticalSummary, DistributionTest } from '../types/statistics';

/**
 * Główna klasa do obliczeń statystycznych
 */
export class StatisticalCalculator {
  
  /**
   * Oblicza podstawowe statystyki opisowe
   */
  static calculateDescriptiveStats(data: number[]): StatisticalSummary {
    if (data.length === 0) {
      throw new Error('Brak danych do analizy');
    }

    const sorted = [...data].sort((a, b) => a - b);
    const n = data.length;
    
    // Podstawowe miary
    const mean = this.mean(data);
    const median = this.median(sorted);
    const mode = this.mode(data);
    const variance = this.variance(data, mean);
    const standardDeviation = Math.sqrt(variance);
    const range = { min: sorted[0], max: sorted[n - 1] };
    
    // Kwartyle
    const quartiles = {
      q1: this.percentile(sorted, 25),
      q2: median,
      q3: this.percentile(sorted, 75)
    };
    
    // Percentyle
    const percentiles = {
      p5: this.percentile(sorted, 5),
      p95: this.percentile(sorted, 95),
      p99: this.percentile(sorted, 99)
    };
    
    // Skośność i kurtoza
    const skewness = this.skewness(data, mean, standardDeviation);
    const kurtosis = this.kurtosis(data, mean, standardDeviation);
    
    // Przedział ufności dla średniej (95%)
    const confidenceInterval95 = this.confidenceInterval(data, 0.95);
    
    // Wykrywanie outlierów (metoda IQR)
    const outliers = this.detectOutliers(sorted, quartiles.q1, quartiles.q3);
    
    // Test normalności
    const distribution = this.normalityTest(data);
    
    return {
      parameter: 'Analiza opisowa',
      count: n,
      mean,
      median,
      mode,
      standardDeviation,
      variance,
      range,
      quartiles,
      percentiles,
      skewness,
      kurtosis,
      confidenceInterval95,
      outliers,
      distribution
    };
  }
  
  /**
   * Średnia arytmetyczna
   */
  static mean(data: number[]): number {
    return data.reduce((sum, value) => sum + value, 0) / data.length;
  }
  
  /**
   * Mediana
   */
  static median(sortedData: number[]): number {
    const n = sortedData.length;
    if (n % 2 === 0) {
      return (sortedData[n / 2 - 1] + sortedData[n / 2]) / 2;
    }
    return sortedData[Math.floor(n / 2)];
  }
  
  /**
   * Dominanta (wartość najczęściej występująca)
   */
  static mode(data: number[]): number | undefined {
    const frequency: { [key: number]: number } = {};
    let maxFreq = 0;
    let mode: number | undefined;
    
    data.forEach(value => {
      frequency[value] = (frequency[value] || 0) + 1;
      if (frequency[value] > maxFreq) {
        maxFreq = frequency[value];
        mode = value;
      }
    });
    
    // Zwróć dominantę tylko jeśli występuje więcej niż raz
    return maxFreq > 1 ? mode : undefined;
  }
  
  /**
   * Wariancja
   */
  static variance(data: number[], mean?: number): number {
    const avg = mean || this.mean(data);
    const sumSquaredDiffs = data.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0);
    return sumSquaredDiffs / (data.length - 1); // próbkowa wariancja
  }
  
  /**
   * Percentyl
   */
  static percentile(sortedData: number[], p: number): number {
    const index = (p / 100) * (sortedData.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;
    
    if (upper >= sortedData.length) return sortedData[sortedData.length - 1];
    if (lower < 0) return sortedData[0];
    
    return sortedData[lower] * (1 - weight) + sortedData[upper] * weight;
  }
  
  /**
   * Skośność (skewness)
   */
  static skewness(data: number[], mean: number, stdDev: number): number {
    const n = data.length;
    const sumCubed = data.reduce((sum, value) => sum + Math.pow((value - mean) / stdDev, 3), 0);
    return (n / ((n - 1) * (n - 2))) * sumCubed;
  }
  
  /**
   * Kurtoza
   */
  static kurtosis(data: number[], mean: number, stdDev: number): number {
    const n = data.length;
    const sumQuartic = data.reduce((sum, value) => sum + Math.pow((value - mean) / stdDev, 4), 0);
    const excess = (n * (n + 1) / ((n - 1) * (n - 2) * (n - 3))) * sumQuartic - 
                   (3 * (n - 1) * (n - 1) / ((n - 2) * (n - 3)));
    return excess;
  }
  
  /**
   * Przedział ufności dla średniej
   */
  static confidenceInterval(data: number[], confidence: number): { lower: number; upper: number } {
    const mean = this.mean(data);
    const stdDev = Math.sqrt(this.variance(data, mean));
    const n = data.length;
    const alpha = 1 - confidence;
    
    // Używamy rozkładu t-Studenta
    const tValue = this.tDistribution(alpha / 2, n - 1);
    const marginOfError = tValue * (stdDev / Math.sqrt(n));
    
    return {
      lower: mean - marginOfError,
      upper: mean + marginOfError
    };
  }
  
  /**
   * Aproksymacja wartości t-Studenta (dla małych próbek)
   */
  static tDistribution(alpha: number, df: number): number {
    // Uproszczona aproksymacja - w produkcji użyj biblioteki statystycznej
    if (df >= 30) {
      return this.normalInverse(1 - alpha);
    }
    
    // Aproksymacja dla małych stopni swobody
    const tTable: { [key: number]: number } = {
      1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571,
      6: 2.447, 7: 2.365, 8: 2.306, 9: 2.262, 10: 2.228,
      15: 2.131, 20: 2.086, 25: 2.060, 30: 2.042
    };
    
    return tTable[df] || tTable[30] || 1.96;
  }
  
  /**
   * Aproksymacja odwrotności funkcji rozkładu normalnego
   */
  static normalInverse(p: number): number {
    // Aproksymacja Beasley-Springer-Moro
    const a = [0, -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02, 1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
    const b = [0, -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02, 6.680131188771972e+01, -1.328068155288572e+01];
    const c = [0, -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00, -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
    const d = [0, 7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00, 3.754408661907416e+00];
    
    if (p <= 0 || p >= 1) {
      throw new Error('p musi być między 0 a 1');
    }
    
    if (p < 0.02425) {
      const q = Math.sqrt(-2 * Math.log(p));
      return (((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
             ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    }
    
    if (p > 0.97575) {
      const q = Math.sqrt(-2 * Math.log(1 - p));
      return -(((((c[1] * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) * q + c[6]) /
              ((((d[1] * q + d[2]) * q + d[3]) * q + d[4]) * q + 1);
    }
    
    const q = p - 0.5;
    const r = q * q;
    return (((((a[1] * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * r + a[6]) * q /
           (((((b[1] * r + b[2]) * r + b[3]) * r + b[4]) * r + b[5]) * r + 1);
  }
  
  /**
   * Wykrywanie outlierów metodą IQR
   */
  static detectOutliers(sortedData: number[], q1: number, q3: number): number[] {
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    return sortedData.filter(value => value < lowerBound || value > upperBound);
  }
  
  /**
   * Test normalności Shapiro-Wilk (uproszczony)
   */
  static normalityTest(data: number[]): DistributionTest {
    if (data.length < 3) {
      return {
        name: 'Shapiro-Wilk',
        testStatistic: 0,
        pValue: 0,
        isNormal: false,
        recommendation: 'Za mało danych do przeprowadzenia testu normalności'
      };
    }
    
    // Uproszczona implementacja - w produkcji użyj biblioteki statystycznej
    const mean = this.mean(data);
    const stdDev = Math.sqrt(this.variance(data, mean));
    const skew = this.skewness(data, mean, stdDev);
    const kurt = this.kurtosis(data, mean, stdDev);
    
    // Heurystyka oparta na skośności i kurtozie
    const normalityScore = Math.exp(-(Math.abs(skew) + Math.abs(kurt)) / 2);
    
    return {
      name: 'Shapiro-Wilk (aproksymacja)',
      testStatistic: normalityScore,
      pValue: normalityScore,
      isNormal: normalityScore > 0.05,
      recommendation: normalityScore > 0.05 
        ? 'Dane prawdopodobnie pochodzą z rozkładu normalnego'
        : 'Dane prawdopodobnie nie pochodzą z rozkładu normalnego. Rozważ transformację lub testy nieparametryczne.'
    };
  }
  
  /**
   * Korelacja Pearsona
   */
  static correlation(x: number[], y: number[]): number {
    if (x.length !== y.length) {
      throw new Error('Tablice muszą mieć tę samą długość');
    }
    
    const n = x.length;
    const meanX = this.mean(x);
    const meanY = this.mean(y);
    
    let numerator = 0;
    let sumXSquared = 0;
    let sumYSquared = 0;
    
    for (let i = 0; i < n; i++) {
      const deltaX = x[i] - meanX;
      const deltaY = y[i] - meanY;
      numerator += deltaX * deltaY;
      sumXSquared += deltaX * deltaX;
      sumYSquared += deltaY * deltaY;
    }
    
    const denominator = Math.sqrt(sumXSquared * sumYSquared);
    return denominator === 0 ? 0 : numerator / denominator;
  }
  
  /**
   * Regresja liniowa (metoda najmniejszych kwadratów)
   */
  static linearRegression(x: number[], y: number[]): { 
    slope: number; 
    intercept: number; 
    rSquared: number; 
    residuals: number[];
    predictions: number[];
  } {
    if (x.length !== y.length) {
      throw new Error('Tablice muszą mieć tę samą długość');
    }
    
    const n = x.length;
    const meanX = this.mean(x);
    const meanY = this.mean(y);
    
    let numerator = 0;
    let denominator = 0;
    
    for (let i = 0; i < n; i++) {
      const deltaX = x[i] - meanX;
      const deltaY = y[i] - meanY;
      numerator += deltaX * deltaY;
      denominator += deltaX * deltaX;
    }
    
    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = meanY - slope * meanX;
    
    // Oblicz R²
    const predictions = x.map(xi => slope * xi + intercept);
    const residuals = y.map((yi, i) => yi - predictions[i]);
    
    const totalSumSquares = y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0);
    const residualSumSquares = residuals.reduce((sum, ri) => sum + ri * ri, 0);
    const rSquared = totalSumSquares === 0 ? 0 : 1 - (residualSumSquares / totalSumSquares);
    
    return {
      slope,
      intercept,
      rSquared,
      residuals,
      predictions
    };
  }
  
  /**
   * Test t-Studenta dla dwóch próbek niezależnych
   */
  static tTestTwoSample(sample1: number[], sample2: number[]): {
    tStatistic: number;
    pValue: number;
    significant: boolean;
    effectSize: number;
  } {
    const mean1 = this.mean(sample1);
    const mean2 = this.mean(sample2);
    const var1 = this.variance(sample1);
    const var2 = this.variance(sample2);
    const n1 = sample1.length;
    const n2 = sample2.length;
    
    // Połączone odchylenie standardowe
    const pooledVariance = ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
    const standardError = Math.sqrt(pooledVariance * (1/n1 + 1/n2));
    
    const tStatistic = (mean1 - mean2) / standardError;
    const df = n1 + n2 - 2;
    
    // Aproksymacja wartości p (dwustronna)
    const pValue = 2 * (1 - this.tCDF(Math.abs(tStatistic), df));
    
    // Rozmiar efektu (Cohen's d)
    const effectSize = (mean1 - mean2) / Math.sqrt(pooledVariance);
    
    return {
      tStatistic,
      pValue,
      significant: pValue < 0.05,
      effectSize
    };
  }
  
  /**
   * Dystrybuanta rozkładu t-Studenta (aproksymacja)
   */
  static tCDF(t: number, df: number): number {
    // Uproszczona aproksymacja - w produkcji użyj biblioteki statystycznej
    if (df >= 30) {
      return this.normalCDF(t);
    }
    
    // Aproksymacja dla małych stopni swobody
    const x = t / Math.sqrt(df);
    return 0.5 + (x / (1 + x * x)) * 0.5; // bardzo uproszczona
  }
  
  /**
   * Dystrybuanta standardowego rozkładu normalnego
   */
  static normalCDF(z: number): number {
    return 0.5 * (1 + this.erf(z / Math.sqrt(2)));
  }
  
  /**
   * Funkcja błędu (error function) - aproksymacja
   */
  static erf(x: number): number {
    // Aproksymacja Abramowitz and Stegun
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
 * Klasa do zarządzania danymi statystycznymi
 */
export class StatisticalDataManager {
  
  /**
   * Filtruje dane według kategorii
   */
  static filterByCategory(data: StatisticalData[], category: string): StatisticalData[] {
    return data.filter(item => item.category === category);
  }
  
  /**
   * Grupuje dane według parametru
   */
  static groupByParameter(data: StatisticalData[]): Map<string, StatisticalData[]> {
    const groups = new Map<string, StatisticalData[]>();
    
    data.forEach(item => {
      if (!groups.has(item.name)) {
        groups.set(item.name, []);
      }
      groups.get(item.name)!.push(item);
    });
    
    return groups;
  }
  
  /**
   * Konwertuje dane na format numeryczny
   */
  static extractValues(data: StatisticalData[]): number[] {
    return data.map(item => item.value).filter(value => !isNaN(value));
  }
  
  /**
   * Sprawdza jakość danych
   */
  static validateData(data: StatisticalData[]): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    if (data.length === 0) {
      issues.push('Brak danych');
      recommendations.push('Dodaj pomiary do analizy');
      return { isValid: false, issues, recommendations };
    }
    
    if (data.length < 3) {
      issues.push('Za mało danych do wiarygodnej analizy statystycznej');
      recommendations.push('Zbierz więcej pomiarów (minimum 3, zalecane 5+)');
    }
    
    const values = this.extractValues(data);
    const nanCount = data.length - values.length;
    
    if (nanCount > 0) {
      issues.push(`${nanCount} nieprawidłowych wartości`);
      recommendations.push('Sprawdź i popraw nieprawidłowe pomiary');
    }
    
    if (values.length > 0) {
      const uniqueValues = new Set(values).size;
      if (uniqueValues === 1) {
        issues.push('Wszystkie wartości są identyczne');
        recommendations.push('Sprawdź procedurę pomiarową i dokładność przyrządów');
      }
      
      const outliers = StatisticalCalculator.detectOutliers(
        [...values].sort((a, b) => a - b),
        StatisticalCalculator.percentile([...values].sort((a, b) => a - b), 25),
        StatisticalCalculator.percentile([...values].sort((a, b) => a - b), 75)
      );
      
      if (outliers.length > values.length * 0.1) {
        issues.push(`Dużo wartości odstających (${outliers.length})`);
        recommendations.push('Przeanalizuj przyczyny wartości odstających');
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }
}
