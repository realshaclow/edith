import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { StudyExecution } from '../../pages/ExecuteStudy/types/professional';

export class ExcelExportService {
  
  /**
   * Główna metoda eksportu badania do Excel
   */
  async exportStudyToExcel(execution: StudyExecution): Promise<void> {
    try {
      // Tworzenie nowego workbook
      const workbook = XLSX.utils.book_new();
      
      // Arkusz 1: Podsumowanie badania
      const summarySheet = this.createSummarySheet(execution);
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Podsumowanie');
      
      // Arkusz 2: Próbki
      const samplesSheet = this.createSamplesSheet(execution);
      XLSX.utils.book_append_sheet(workbook, samplesSheet, 'Próbki');
      
      // Arkusz 3: Statystyki
      const statisticsSheet = this.createStatisticsSheet(execution);
      XLSX.utils.book_append_sheet(workbook, statisticsSheet, 'Statystyki');
      
      // Arkusz 4: Szczegółowe pomiary
      const measurementsSheet = this.createMeasurementsSheet(execution);
      XLSX.utils.book_append_sheet(workbook, measurementsSheet, 'Pomiary');
      
      // Arkusz 5: Wyniki
      const resultsSheet = this.createResultsSheet(execution);
      XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Wyniki');
      
      // Generowanie pliku Excel
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array',
        compression: true
      });
      
      // Zapisywanie pliku
      const fileName = `Badanie_${execution.id}_${new Date().toISOString().split('T')[0]}.xlsx`;
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error('Błąd podczas eksportu Excel:', error);
      throw new Error('Nie udało się wyeksportować danych do Excel');
    }
  }

  /**
   * Eksport tylko wyników próbek do Excel
   */
  async exportSampleResultsToExcel(execution: StudyExecution): Promise<void> {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Arkusz z wynikami próbek
      const samplesSheet = this.createDetailedSamplesSheet(execution);
      XLSX.utils.book_append_sheet(workbook, samplesSheet, 'Wyniki Próbek');
      
      // Arkusz z pomiarami
      const measurementsSheet = this.createMeasurementsSheet(execution);
      XLSX.utils.book_append_sheet(workbook, measurementsSheet, 'Wszystkie Pomiary');
      
      // Generowanie pliku
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array',
        compression: true
      });
      
      const fileName = `Wyniki_Proben_${execution.id}_${new Date().toISOString().split('T')[0]}.xlsx`;
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error('Błąd podczas eksportu wyników próbek:', error);
      throw new Error('Nie udało się wyeksportować wyników próbek');
    }
  }

  /**
   * Eksport szablonu do importu próbek
   */
  async exportSampleTemplate(): Promise<void> {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Arkusz z szablonem próbek
      const templateData = [
        ['Nazwa Próbki', 'Opis', 'Materiał', 'Operator', 'Notatki'],
        ['Próbka 1', 'Opis próbki 1', 'Stal', 'Jan Kowalski', ''],
        ['Próbka 2', 'Opis próbki 2', 'Aluminium', 'Jan Kowalski', ''],
        ['Próbka 3', 'Opis próbki 3', 'Plastik', 'Jan Kowalski', '']
      ];
      
      const templateSheet = XLSX.utils.aoa_to_sheet(templateData);
      
      // Ustawienia kolumn
      templateSheet['!cols'] = [
        { width: 20 },
        { width: 30 },
        { width: 15 },
        { width: 20 },
        { width: 30 }
      ];
      
      XLSX.utils.book_append_sheet(workbook, templateSheet, 'Szablon Próbek');
      
      // Generowanie pliku
      const excelBuffer = XLSX.write(workbook, { 
        bookType: 'xlsx', 
        type: 'array' 
      });
      
      const fileName = `Szablon_Proben_${new Date().toISOString().split('T')[0]}.xlsx`;
      const blob = new Blob([excelBuffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      saveAs(blob, fileName);
      
    } catch (error) {
      console.error('Błąd podczas eksportu szablonu:', error);
      throw new Error('Nie udało się wyeksportować szablonu');
    }
  }

  /**
   * Tworzy arkusz podsumowania badania
   */
  private createSummarySheet(execution: StudyExecution): XLSX.WorkSheet {
    const data = [
      ['PODSUMOWANIE BADANIA'],
      [''],
      ['ID Badania:', execution.id],
      ['Nazwa Badania:', execution.studyName],
      ['Protokół:', execution.protocolName],
      ['Kategoria:', execution.category],
      [''],
      ['OPERATOR'],
      ['Imię i Nazwisko:', execution.operator.name],
      ['Stanowisko:', execution.operator.position],
      ['Email:', '-'],
      [''],
      ['DATY I CZAS'],
      ['Data rozpoczęcia:', execution.startedAt.toLocaleString('pl-PL')],
      ['Data zakończenia:', execution.completedAt?.toLocaleString('pl-PL') || 'W trakcie'],
      ['Status:', this.translateExecutionStatus(execution.status)],
      [''],
      ['WARUNKI ŚRODOWISKOWE'],
      ['Temperatura:', execution.environment.temperature ? `${execution.environment.temperature}°C` : '-'],
      ['Wilgotność:', execution.environment.humidity ? `${execution.environment.humidity}% RH` : '-'],
      ['Ciśnienie:', execution.environment.pressure ? `${execution.environment.pressure} hPa` : '-'],
      ['Notatki:', execution.environment.notes || '-'],
      [''],
      ['STATYSTYKI'],
      ['Łączna liczba próbek:', execution.samples.length],
      ['Próbki ukończone:', execution.samples.filter(s => s.status === 'COMPLETED').length],
      ['Próbki nieudane:', execution.samples.filter(s => s.status === 'FAILED').length],
      ['Próbki pominięte:', execution.samples.filter(s => s.status === 'SKIPPED').length],
      ['Łączna liczba pomiarów:', execution.samples.reduce((sum, sample) => 
        sum + (sample.measurements ? sample.measurements.length : 0), 0)],
      [''],
      ['WYNIKI'],
      ['Status ogólny:', this.translateOverallStatus(execution.results.overallStatus)],
      ['Podsumowanie:', execution.results.summary || '-']
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Ustawienia kolumn
    worksheet['!cols'] = [
      { width: 25 },
      { width: 40 }
    ];
    
    // Formatowanie nagłówków
    if (worksheet['A1']) {
      worksheet['A1'].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: 'center' }
      };
    }
    
    return worksheet;
  }

  /**
   * Tworzy arkusz z próbkami
   */
  private createSamplesSheet(execution: StudyExecution): XLSX.WorkSheet {
    const headers = ['Lp.', 'Nazwa Próbki', 'Status', 'Materiał', 'Opis', 'Operator', 'Liczba Pomiarów', 'Notatki'];
    
    const data = [
      headers,
      ...execution.samples.map((sample, index) => [
        index + 1,
        sample.name,
        this.translateSampleStatus(sample.status),
        sample.material || '-',
        sample.description || '-',
        sample.operator || '-',
        sample.measurements ? sample.measurements.length : 0,
        sample.notes || '-'
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Ustawienia kolumn
    worksheet['!cols'] = [
      { width: 5 },   // Lp.
      { width: 20 },  // Nazwa
      { width: 12 },  // Status
      { width: 15 },  // Materiał
      { width: 30 },  // Opis
      { width: 15 },  // Operator
      { width: 12 },  // Pomiary
      { width: 30 }   // Notatki
    ];
    
    return worksheet;
  }

  /**
   * Tworzy szczegółowy arkusz próbek
   */
  private createDetailedSamplesSheet(execution: StudyExecution): XLSX.WorkSheet {
    const data: any[][] = [['SZCZEGÓŁOWE WYNIKI PRÓBEK'], ['']];
    
    execution.samples.forEach((sample, sampleIndex) => {
      // Nagłówek próbki
      data.push([`PRÓBKA ${sampleIndex + 1}: ${sample.name}`]);
      data.push(['Status:', this.translateSampleStatus(sample.status)]);
      data.push(['Materiał:', sample.material || '-']);
      data.push(['Opis:', sample.description || '-']);
      data.push(['Operator:', sample.operator || '-']);
      data.push(['']);
      
      // Pomiary próbki
      if (sample.measurements && sample.measurements.length > 0) {
        data.push(['POMIARY:']);
        data.push(['Krok', 'Pomiar', 'Wartość', 'Jednostka', 'Operator', 'Data/Czas']);
        
        sample.measurements.forEach((measurement: any) => {
          data.push([
            measurement.stepId || '-',
            measurement.measurementId || '-',
            measurement.value?.toString() || '-',
            measurement.unit || '-',
            measurement.operator || '-',
            new Date(measurement.timestamp).toLocaleString('pl-PL')
          ]);
        });
        data.push(['']);
      }
      
      // Notatki
      if (sample.notes) {
        data.push(['Notatki:', sample.notes]);
      }
      
      data.push(['', '', '', '', '', '']); // Odstęp między próbkami
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Ustawienia kolumn
    worksheet['!cols'] = [
      { width: 15 },
      { width: 20 },
      { width: 15 },
      { width: 10 },
      { width: 15 },
      { width: 20 }
    ];
    
    return worksheet;
  }

  /**
   * Tworzy arkusz statystyk
   */
  private createStatisticsSheet(execution: StudyExecution): XLSX.WorkSheet {
    const completedSamples = execution.samples.filter(s => s.status === 'COMPLETED').length;
    const failedSamples = execution.samples.filter(s => s.status === 'FAILED').length;
    const skippedSamples = execution.samples.filter(s => s.status === 'SKIPPED').length;
    const totalSamples = execution.samples.length;
    const successRate = totalSamples > 0 ? (completedSamples / totalSamples * 100).toFixed(1) : '0';
    
    const totalMeasurements = execution.samples.reduce((sum, sample) => 
      sum + (sample.measurements ? sample.measurements.length : 0), 0
    );
    
    const data = [
      ['STATYSTYKI BADANIA'],
      [''],
      ['PRÓBKI'],
      ['Łączna liczba próbek:', totalSamples],
      ['Próbki ukończone:', completedSamples],
      ['Próbki nieudane:', failedSamples],
      ['Próbki pominięte:', skippedSamples],
      ['Wskaźnik powodzenia:', `${successRate}%`],
      [''],
      ['POMIARY'],
      ['Łączna liczba pomiarów:', totalMeasurements],
      ['Średnia pomiarów na próbkę:', totalSamples > 0 ? (totalMeasurements / totalSamples).toFixed(2) : '0'],
      [''],
      ['CZAS WYKONANIA'],
      ['Data rozpoczęcia:', execution.startedAt.toLocaleString('pl-PL')],
      ['Data zakończenia:', execution.completedAt?.toLocaleString('pl-PL') || 'W trakcie'],
      ['Czas trwania:', this.calculateDuration(execution)],
      [''],
      ['STATUS'],
      ['Status wykonania:', this.translateExecutionStatus(execution.status)],
      ['Status wyników:', this.translateOverallStatus(execution.results.overallStatus)]
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Ustawienia kolumn
    worksheet['!cols'] = [
      { width: 30 },
      { width: 25 }
    ];
    
    return worksheet;
  }

  /**
   * Tworzy arkusz z pomiarami
   */
  private createMeasurementsSheet(execution: StudyExecution): XLSX.WorkSheet {
    const headers = ['Próbka', 'Krok', 'Pomiar', 'Wartość', 'Jednostka', 'Operator', 'Data/Czas', 'Notatki'];
    const data: any[][] = [headers];
    
    execution.samples.forEach((sample, sampleIndex) => {
      if (sample.measurements && sample.measurements.length > 0) {
        sample.measurements.forEach((measurement: any) => {
          data.push([
            `${sampleIndex + 1}. ${sample.name}`,
            measurement.stepId || '-',
            measurement.measurementId || '-',
            measurement.value?.toString() || '-',
            measurement.unit || '-',
            measurement.operator || '-',
            new Date(measurement.timestamp).toLocaleString('pl-PL'),
            measurement.notes || '-'
          ]);
        });
      }
    });

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Ustawienia kolumn
    worksheet['!cols'] = [
      { width: 25 },  // Próbka
      { width: 15 },  // Krok
      { width: 20 },  // Pomiar
      { width: 15 },  // Wartość
      { width: 10 },  // Jednostka
      { width: 15 },  // Operator
      { width: 20 },  // Data/Czas
      { width: 30 }   // Notatki
    ];
    
    return worksheet;
  }

  /**
   * Tworzy arkusz wyników
   */
  private createResultsSheet(execution: StudyExecution): XLSX.WorkSheet {
    const data = [
      ['WYNIKI BADANIA'],
      [''],
      ['Status ogólny:', this.translateOverallStatus(execution.results.overallStatus)],
      [''],
      ['Podsumowanie:'],
      [execution.results.summary || 'Brak podsumowania'],
      [''],
      ['Zalecenia:'],
      ['Brak zaleceń'],
      [''],
      ['Załączniki:']
    ];
    
    if (execution.results.attachments && execution.results.attachments.length > 0) {
      execution.results.attachments.forEach((attachment, index) => {
        data.push([`${index + 1}.`, attachment]);
      });
    } else {
      data.push(['Brak załączników']);
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    
    // Ustawienia kolumn
    worksheet['!cols'] = [
      { width: 20 },
      { width: 50 }
    ];
    
    return worksheet;
  }

  /**
   * Oblicza czas trwania badania
   */
  private calculateDuration(execution: StudyExecution): string {
    if (!execution.completedAt) {
      const now = new Date();
      const diffMs = now.getTime() - execution.startedAt.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return `${diffHours}h ${diffMinutes}m (w trakcie)`;
    }
    
    const diffMs = execution.completedAt.getTime() - execution.startedAt.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}m`;
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
