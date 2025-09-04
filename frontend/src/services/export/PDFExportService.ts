import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { StudyExecution } from '../../pages/ExecuteStudy/types/professional';

// Rozszerzenie typu jsPDF o autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
  }
}

export class PDFExportService {
  private doc: jsPDF;
  private pageHeight: number;
  private currentY: number;
  private margin: number = 20;

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.pageHeight = this.doc.internal.pageSize.height;
    this.currentY = this.margin;
  }

  /**
   * Główna metoda eksportu badania do PDF
   */
  async exportStudyToPDF(execution: StudyExecution): Promise<void> {
    try {
      // Reset pozycji
      this.currentY = this.margin;
      
      // Nagłówek dokumentu
      this.addHeader(execution);
      
      // Informacje o badaniu
      this.addStudyInfo(execution);
      
      // Warunki środowiskowe
      this.addEnvironmentalConditions(execution);
      
      // Tabela próbek
      this.addSamplesTable(execution);
      
      // Statystyki
      this.addStatistics(execution);
      
      // Szczegółowe wyniki
      this.addDetailedResults(execution);
      
      // Stopka
      this.addFooter();
      
      // Zapisz plik
      const fileName = `Raport_Badania_${execution.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      this.doc.save(fileName);
      
    } catch (error) {
      console.error('Błąd podczas eksportu PDF:', error);
      throw new Error('Nie udało się wyeksportować raportu PDF');
    }
  }

  /**
   * Eksport wyników próbek z szczegółowymi pomiarami
   */
  async exportSampleResultsToPDF(execution: StudyExecution): Promise<void> {
    try {
      this.currentY = this.margin;
      
      this.addHeader(execution, 'Szczegółowe Wyniki Próbek');
      
      // Dla każdej próbki
      execution.samples.forEach((sample, index) => {
        this.checkPageBreak(40); // Sprawdź czy jest miejsce na próbkę
        
        // Nagłówek próbki
        this.doc.setFontSize(14);
        this.doc.setFont('helvetica', 'bold');
        this.doc.text(`Próbka ${index + 1}: ${sample.name}`, this.margin, this.currentY);
        this.currentY += 8;
        
        // Informacje o próbce
        this.doc.setFontSize(10);
        this.doc.setFont('helvetica', 'normal');
        this.doc.text(`Status: ${this.translateSampleStatus(sample.status)}`, this.margin, this.currentY);
        this.currentY += 5;
        
        if (sample.description) {
          this.doc.text(`Opis: ${sample.description}`, this.margin, this.currentY);
          this.currentY += 5;
        }
        
        if (sample.material) {
          this.doc.text(`Materiał: ${sample.material}`, this.margin, this.currentY);
          this.currentY += 5;
        }
        
        // Tabela pomiarów dla próbki
        if (sample.measurements && sample.measurements.length > 0) {
          this.addSampleMeasurementsTable(sample);
        }
        
        // Notatki
        if (sample.notes) {
          this.checkPageBreak(15);
          this.doc.setFont('helvetica', 'bold');
          this.doc.text('Notatki:', this.margin, this.currentY);
          this.currentY += 5;
          this.doc.setFont('helvetica', 'normal');
          
          // Podział tekstu na linie
          const splitNotes = this.doc.splitTextToSize(sample.notes, 170);
          this.doc.text(splitNotes, this.margin, this.currentY);
          this.currentY += splitNotes.length * 5;
        }
        
        this.currentY += 10; // Odstęp między próbkami
      });
      
      this.addFooter();
      
      const fileName = `Wyniki_Proben_${execution.id}_${new Date().toISOString().split('T')[0]}.pdf`;
      this.doc.save(fileName);
      
    } catch (error) {
      console.error('Błąd podczas eksportu wyników próbek:', error);
      throw new Error('Nie udało się wyeksportować wyników próbek');
    }
  }

  /**
   * Dodaje nagłówek dokumentu
   */
  private addHeader(execution: StudyExecution, subtitle?: string): void {
    // Logo/Tytuł firmy (można dodać logo)
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('EDITH - System Badań Laboratoryjnych', this.margin, this.currentY);
    this.currentY += 10;
    
    // Tytuł raportu
    this.doc.setFontSize(16);
    this.doc.text(subtitle || 'Raport z Badania', this.margin, this.currentY);
    this.currentY += 8;
    
    // Linia oddzielająca
    this.doc.setLineWidth(0.5);
    this.doc.line(this.margin, this.currentY, 210 - this.margin, this.currentY);
    this.currentY += 10;
    
    // Data generowania raportu
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    const currentDate = new Date().toLocaleString('pl-PL');
    this.doc.text(`Wygenerowano: ${currentDate}`, this.margin, this.currentY);
    this.currentY += 8;
  }

  /**
   * Dodaje podstawowe informacje o badaniu
   */
  private addStudyInfo(execution: StudyExecution): void {
    this.checkPageBreak(40);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Informacje o Badaniu', this.margin, this.currentY);
    this.currentY += 8;
    
    const studyInfo = [
      ['ID Badania:', execution.id],
      ['Nazwa Badania:', execution.studyName],
      ['Protokół:', execution.protocolName],
      ['Kategoria:', execution.category],
      ['Operator:', `${execution.operator.name} (${execution.operator.position})`],
      ['Data rozpoczęcia:', execution.startedAt.toLocaleString('pl-PL')],
      ['Data zakończenia:', execution.completedAt?.toLocaleString('pl-PL') || 'W trakcie'],
      ['Status:', this.translateExecutionStatus(execution.status)]
    ];
    
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: [],
      body: studyInfo,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 40 },
        1: { cellWidth: 130 }
      },
      margin: { left: this.margin },
      didDrawPage: () => {
        this.currentY = (this.doc as any).lastAutoTable.finalY + 5;
      }
    });
  }

  /**
   * Dodaje warunki środowiskowe
   */
  private addEnvironmentalConditions(execution: StudyExecution): void {
    this.checkPageBreak(30);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Warunki Środowiskowe', this.margin, this.currentY);
    this.currentY += 8;
    
    const envData = [];
    if (execution.environment.temperature !== undefined) {
      envData.push(['Temperatura:', `${execution.environment.temperature}°C`]);
    }
    if (execution.environment.humidity !== undefined) {
      envData.push(['Wilgotność:', `${execution.environment.humidity}% RH`]);
    }
    if (execution.environment.pressure !== undefined) {
      envData.push(['Ciśnienie:', `${execution.environment.pressure} hPa`]);
    }
    if (execution.environment.notes) {
      envData.push(['Notatki:', execution.environment.notes]);
    }
    
    if (envData.length > 0) {
      autoTable(this.doc, {
        startY: this.currentY,
        head: [],
        body: envData,
        theme: 'plain',
        styles: {
          fontSize: 10,
          cellPadding: 2
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40 },
          1: { cellWidth: 130 }
        },
        margin: { left: this.margin },
        didDrawPage: () => {
          this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
        }
      });
    }
  }

  /**
   * Dodaje tabelę próbek
   */
  private addSamplesTable(execution: StudyExecution): void {
    this.checkPageBreak(50);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Przegląd Próbek', this.margin, this.currentY);
    this.currentY += 8;
    
    const tableHead = [['Lp.', 'Nazwa Próbki', 'Status', 'Materiał', 'Liczba Pomiarów']];
    const tableBody = execution.samples.map((sample, index) => [
      (index + 1).toString(),
      sample.name,
      this.translateSampleStatus(sample.status),
      sample.material || '-',
      sample.measurements ? sample.measurements.length.toString() : '0'
    ]);
    
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: tableHead,
      body: tableBody,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      margin: { left: this.margin },
      didDrawPage: () => {
        this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
      }
    });
  }

  /**
   * Dodaje statystyki badania
   */
  private addStatistics(execution: StudyExecution): void {
    this.checkPageBreak(40);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Statystyki Badania', this.margin, this.currentY);
    this.currentY += 8;
    
    const completedSamples = execution.samples.filter(s => s.status === 'COMPLETED').length;
    const totalSamples = execution.samples.length;
    const successRate = totalSamples > 0 ? (completedSamples / totalSamples * 100).toFixed(1) : '0';
    
    const failedSamples = execution.samples.filter(s => s.status === 'FAILED').length;
    const skippedSamples = execution.samples.filter(s => s.status === 'SKIPPED').length;
    
    const totalMeasurements = execution.samples.reduce((sum, sample) => 
      sum + (sample.measurements ? sample.measurements.length : 0), 0
    );
    
    const statsData = [
      ['Łączna liczba próbek:', totalSamples.toString()],
      ['Próbki ukończone:', completedSamples.toString()],
      ['Próbki nieudane:', failedSamples.toString()],
      ['Próbki pominięte:', skippedSamples.toString()],
      ['Wskaźnik powodzenia:', `${successRate}%`],
      ['Łączna liczba pomiarów:', totalMeasurements.toString()],
      ['Status wykonania:', this.translateExecutionStatus(execution.status)]
    ];
    
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: [],
      body: statsData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 2
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 120 }
      },
      margin: { left: this.margin },
      didDrawPage: () => {
        this.currentY = (this.doc as any).lastAutoTable.finalY + 10;
      }
    });
  }

  /**
   * Dodaje szczegółowe wyniki
   */
  private addDetailedResults(execution: StudyExecution): void {
    this.checkPageBreak(50);
    
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('Szczegółowe Wyniki', this.margin, this.currentY);
    this.currentY += 8;
    
    // Podsumowanie wyników
    const overallStatus = execution.results.overallStatus;
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`Status ogólny: ${this.translateOverallStatus(overallStatus)}`, this.margin, this.currentY);
    this.currentY += 8;
    
    if (execution.results.summary) {
      this.doc.setFont('helvetica', 'normal');
      this.doc.setFontSize(10);
      this.doc.text('Podsumowanie:', this.margin, this.currentY);
      this.currentY += 5;
      
      const splitSummary = this.doc.splitTextToSize(execution.results.summary, 170);
      this.doc.text(splitSummary, this.margin, this.currentY);
      this.currentY += splitSummary.length * 5 + 5;
    }
    
    // Załączniki
    if (execution.results.attachments && execution.results.attachments.length > 0) {
      this.checkPageBreak(20);
      this.doc.setFont('helvetica', 'bold');
      this.doc.text('Załączniki:', this.margin, this.currentY);
      this.currentY += 5;
      
      this.doc.setFont('helvetica', 'normal');
      execution.results.attachments.forEach((attachment, index) => {
        this.doc.text(`${index + 1}. ${attachment}`, this.margin + 5, this.currentY);
        this.currentY += 5;
      });
    }
  }

  /**
   * Dodaje tabelę pomiarów dla konkretnej próbki
   */
  private addSampleMeasurementsTable(sample: any): void {
    this.checkPageBreak(30);
    
    this.doc.setFont('helvetica', 'bold');
    this.doc.setFontSize(11);
    this.doc.text('Pomiary:', this.margin, this.currentY);
    this.currentY += 5;
    
    const measurementHead = [['Krok', 'Pomiar', 'Wartość', 'Operator', 'Data']];
    const measurementBody = sample.measurements.map((measurement: any) => [
      measurement.stepId || '-',
      measurement.measurementId || '-',
      measurement.value?.toString() || '-',
      measurement.operator || '-',
      new Date(measurement.timestamp).toLocaleString('pl-PL')
    ]);
    
    
    autoTable(this.doc, {
      startY: this.currentY,
      head: measurementHead,
      body: measurementBody,
      theme: 'grid',
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      margin: { left: this.margin + 5 },
      didDrawPage: () => {
        this.currentY = (this.doc as any).lastAutoTable.finalY + 5;
      }
    });
  }

  /**
   * Dodaje stopkę dokumentu
   */
  private addFooter(): void {
    const pageCount = this.doc.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      
      // Linia nad stopką
      this.doc.setLineWidth(0.3);
      this.doc.line(this.margin, this.pageHeight - 15, 210 - this.margin, this.pageHeight - 15);
      
      // Tekst stopki
      this.doc.setFontSize(8);
      this.doc.setFont('helvetica', 'normal');
      this.doc.text('EDITH - System Badań Laboratoryjnych', this.margin, this.pageHeight - 10);
      this.doc.text(`Strona ${i} z ${pageCount}`, 210 - this.margin - 20, this.pageHeight - 10);
    }
  }

  /**
   * Sprawdza czy jest wystarczająco miejsca na stronie
   */
  private checkPageBreak(requiredSpace: number): void {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  /**
   * Tłumaczy status próbki
   */
  private translateSampleStatus(status: string): string {
    const translations: Record<string, string> = {
      'PENDING': 'Oczekuje',
      'IN_PROGRESS': 'W trakcie',
      'COMPLETED': 'Ukończone',
      'FAILED': 'Nieudane',
      'SKIPPED': 'Pominięte'
    };
    return translations[status] || status;
  }

  /**
   * Tłumaczy status wykonania
   */
  private translateExecutionStatus(status: string): string {
    const translations: Record<string, string> = {
      'NOT_STARTED': 'Nie rozpoczęte',
      'IN_PROGRESS': 'W trakcie',
      'PAUSED': 'Wstrzymane',
      'COMPLETED': 'Ukończone',
      'FAILED': 'Nieudane',
      'CANCELLED': 'Anulowane'
    };
    return translations[status] || status;
  }

  /**
   * Tłumaczy ogólny status wyników
   */
  private translateOverallStatus(status: string): string {
    const translations: Record<string, string> = {
      'PASSED': 'Zaliczone',
      'FAILED': 'Niezaliczone',
      'PENDING': 'Oczekuje',
      'PARTIAL': 'Częściowe'
    };
    return translations[status] || status;
  }
}
