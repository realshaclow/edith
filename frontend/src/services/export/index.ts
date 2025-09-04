import { PDFExportService } from './PDFExportService';
import { ExcelExportService } from './ExcelExportService';
import { ChartExportService } from './ChartExportService';
import { StudyExecution } from '../../pages/ExecuteStudy/types/professional';

export class ExportService {
  private pdfService: PDFExportService;
  private excelService: ExcelExportService;
  private chartService: ChartExportService;

  constructor() {
    this.pdfService = new PDFExportService();
    this.excelService = new ExcelExportService();
    this.chartService = new ChartExportService();
  }

  /**
   * Eksportuje kompletny raport badania do PDF
   */
  async exportStudyToPDF(execution: StudyExecution): Promise<void> {
    try {
      await this.pdfService.exportStudyToPDF(execution);
    } catch (error) {
      console.error('Błąd podczas eksportu PDF:', error);
      throw error;
    }
  }

  /**
   * Eksportuje szczegółowe wyniki próbek do PDF
   */
  async exportSampleResultsToPDF(execution: StudyExecution): Promise<void> {
    try {
      await this.pdfService.exportSampleResultsToPDF(execution);
    } catch (error) {
      console.error('Błąd podczas eksportu wyników próbek do PDF:', error);
      throw error;
    }
  }

  /**
   * Eksportuje kompletne dane badania do Excel
   */
  async exportStudyToExcel(execution: StudyExecution): Promise<void> {
    try {
      await this.excelService.exportStudyToExcel(execution);
    } catch (error) {
      console.error('Błąd podczas eksportu Excel:', error);
      throw error;
    }
  }

  /**
   * Eksportuje tylko wyniki próbek do Excel
   */
  async exportSampleResultsToExcel(execution: StudyExecution): Promise<void> {
    try {
      await this.excelService.exportSampleResultsToExcel(execution);
    } catch (error) {
      console.error('Błąd podczas eksportu wyników próbek do Excel:', error);
      throw error;
    }
  }

  /**
   * Eksportuje szablon do importu próbek
   */
  async exportSampleTemplate(): Promise<void> {
    try {
      await this.excelService.exportSampleTemplate();
    } catch (error) {
      console.error('Błąd podczas eksportu szablonu:', error);
      throw error;
    }
  }

  /**
   * Eksportuje wykres jako PNG
   */
  async exportChartAsPNG(chartElement: HTMLElement, filename?: string): Promise<void> {
    try {
      await this.chartService.exportChartAsPNG(chartElement, filename);
    } catch (error) {
      console.error('Błąd podczas eksportu wykresu:', error);
      throw error;
    }
  }

  /**
   * Eksportuje badanie do wszystkich formatów jednocześnie
   */
  async exportStudyToAllFormats(execution: StudyExecution): Promise<void> {
    try {
      // Eksport równoległy
      await Promise.all([
        this.exportStudyToPDF(execution),
        this.exportStudyToExcel(execution)
      ]);
    } catch (error) {
      console.error('Błąd podczas eksportu do wszystkich formatów:', error);
      throw error;
    }
  }

  /**
   * Waliduje dane przed eksportem
   */
  validateExportData(execution: StudyExecution): boolean {
    if (!execution) {
      throw new Error('Brak danych badania do eksportu');
    }

    if (!execution.id || !execution.studyName) {
      throw new Error('Niepełne dane badania');
    }

    if (!execution.samples || execution.samples.length === 0) {
      throw new Error('Brak próbek do eksportu');
    }

    return true;
  }

  /**
   * Generuje metadane eksportu
   */
  generateExportMetadata(execution: StudyExecution) {
    return {
      studyId: execution.id,
      studyName: execution.studyName,
      protocolName: execution.protocolName,
      exportDate: new Date().toISOString(),
      operator: execution.operator.name,
      samplesCount: execution.samples.length,
      status: execution.status,
      format: 'multiple'
    };
  }
}

// Eksport singletonów
export const exportService = new ExportService();
export { PDFExportService } from './PDFExportService';
export { ExcelExportService } from './ExcelExportService';
export { ChartExportService, chartExportService } from './ChartExportService';
