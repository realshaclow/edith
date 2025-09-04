import { StudyExecutionRepository } from '../repositories/StudyExecutionRepository';
import {
  StudyExecutionData,
  StudyExecutionSampleData,
  StudyMeasurementData,
  StudyExportData,
  CreateStudyExecutionRequest,
  AddMeasurementRequest,
  CreateExportRequest,
  UpdateExecutionStatusRequest,
  StudyExecutionFilters,
  PaginationOptions,
  StudyExecutionResponse,
  ExecutionStatus,
  SampleStatus,
  ResultStatus
} from '../types';

export class StudyExecutionService {
  constructor(private repository: StudyExecutionRepository) {}

  /**
   * Tworzy nowe wykonanie badania
   */
  async createExecution(
    data: CreateStudyExecutionRequest,
    operatorId: string
  ): Promise<StudyExecutionData> {
    try {
      // Pobierz dane operatora
      const operator = await this.getOperatorById(operatorId);
      
      // Walidacja danych wejściowych
      this.validateExecutionData(data);
      
      // Tworzenie wykonania w bazie
      const execution = await this.repository.createExecution(
        data,
        operator.name,
        operator.position
      );

      return execution;
    } catch (error) {
      throw new Error(`Błąd tworzenia wykonania badania: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Rozpoczyna wykonanie badania
   */
  async startExecution(executionId: string): Promise<StudyExecutionData> {
    try {
      const execution = await this.repository.getExecutionById(executionId);
      
      if (!execution) {
        throw new Error('Execution not found');
      }

      if (execution.status !== ExecutionStatus.NOT_STARTED) {
        throw new Error('Execution already started or completed');
      }

      return await this.repository.updateExecutionStatus(
        executionId,
        ExecutionStatus.IN_PROGRESS,
        {
          startedAt: new Date(),
          progress: 0
        }
      );
    } catch (error) {
      throw new Error(`Błąd rozpoczynania badania: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Wstrzymuje wykonanie badania
   */
  async pauseExecution(executionId: string, notes?: string): Promise<StudyExecutionData> {
    try {
      const execution = await this.repository.getExecutionById(executionId);
      
      if (!execution) {
        throw new Error('Execution not found');
      }

      if (execution.status !== ExecutionStatus.IN_PROGRESS) {
        throw new Error('Can only pause execution that is in progress');
      }

      return await this.repository.updateExecutionStatus(
        executionId,
        ExecutionStatus.PAUSED,
        {
          pausedAt: new Date(),
          notes
        }
      );
    } catch (error) {
      throw new Error(`Błąd wstrzymywania badania: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Wznawia wykonanie badania
   */
  async resumeExecution(executionId: string): Promise<StudyExecutionData> {
    try {
      const execution = await this.repository.getExecutionById(executionId);
      
      if (!execution) {
        throw new Error('Execution not found');
      }

      if (execution.status !== ExecutionStatus.PAUSED) {
        throw new Error('Can only resume paused execution');
      }

      return await this.repository.updateExecutionStatus(
        executionId,
        ExecutionStatus.IN_PROGRESS,
        {
          pausedAt: undefined
        }
      );
    } catch (error) {
      throw new Error(`Błąd wznawiania badania: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Kończy wykonanie badania
   */
  async completeExecution(
    executionId: string,
    summary?: string,
    recommendations?: string
  ): Promise<StudyExecutionData> {
    try {
      const execution = await this.repository.getExecutionById(executionId);
      
      if (!execution) {
        throw new Error('Execution not found');
      }

      if (execution.status === ExecutionStatus.COMPLETED) {
        throw new Error('Execution already completed');
      }

      // Oblicz statystyki
      const stats = this.calculateExecutionStatistics(execution);
      
      // Określ ogólny status wyników
      const overallStatus = this.determineOverallStatus(execution.samples);

      return await this.repository.updateExecutionStatus(
        executionId,
        ExecutionStatus.COMPLETED,
        {
          completedAt: new Date(),
          progress: 100,
          notes: summary ? `Podsumowanie: ${summary}${recommendations ? `. Rekomendacje: ${recommendations}` : ''}` : undefined
        }
      );
    } catch (error) {
      throw new Error(`Błąd kończenia badania: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Rozpoczyna próbkę
   */
  async startSample(
    sampleId: string,
    operatorId: string
  ): Promise<StudyExecutionSampleData> {
    try {
      const operator = await this.getOperatorById(operatorId);
      
      return await this.repository.updateSampleStatus(
        sampleId,
        SampleStatus.IN_PROGRESS,
        {
          startedAt: new Date(),
          operatorId,
          operatorName: operator.name
        }
      );
    } catch (error) {
      throw new Error(`Błąd rozpoczynania próbki: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Kończy próbkę
   */
  async completeSample(
    sampleId: string,
    quality: 'pass' | 'fail' | 'warning',
    notes?: string
  ): Promise<StudyExecutionSampleData> {
    try {
      return await this.repository.updateSampleStatus(
        sampleId,
        SampleStatus.COMPLETED,
        {
          completedAt: new Date(),
          progress: 100,
          quality,
          notes
        }
      );
    } catch (error) {
      throw new Error(`Błąd kończenia próbki: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Pomija próbkę
   */
  async skipSample(sampleId: string, reason: string): Promise<StudyExecutionSampleData> {
    try {
      return await this.repository.updateSampleStatus(
        sampleId,
        SampleStatus.SKIPPED,
        {
          notes: `Pominięto: ${reason}`,
          progress: 100
        }
      );
    } catch (error) {
      throw new Error(`Błąd pomijania próbki: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Dodaje pomiar do próbki
   */
  async addMeasurement(data: AddMeasurementRequest): Promise<StudyMeasurementData> {
    try {
      // Walidacja pomiaru
      this.validateMeasurementData(data);
      
      return await this.repository.addMeasurement(data);
    } catch (error) {
      throw new Error(`Błąd dodawania pomiaru: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Pobiera wykonanie badania z wszystkimi danymi
   */
  async getExecutionById(executionId: string): Promise<StudyExecutionData | null> {
    try {
      return await this.repository.getExecutionById(executionId);
    } catch (error) {
      throw new Error(`Błąd pobierania wykonania badania: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Pobiera listę wykonań z filtrami i paginacją
   */
  async getExecutions(
    filters: StudyExecutionFilters = {},
    pagination: PaginationOptions
  ): Promise<StudyExecutionResponse> {
    try {
      const { data, total } = await this.repository.getExecutions(filters, pagination);
      
      return {
        data,
        total,
        page: pagination.page,
        totalPages: Math.ceil(total / pagination.limit)
      };
    } catch (error) {
      throw new Error(`Błąd pobierania listy wykonań: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Tworzy eksport badania
   */
  async createExport(data: CreateExportRequest): Promise<StudyExportData> {
    try {
      return await this.repository.createExport(data);
    } catch (error) {
      throw new Error(`Błąd tworzenia eksportu: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Pobiera eksporty dla wykonania
   */
  async getExportsByExecution(executionId: string): Promise<StudyExportData[]> {
    try {
      return await this.repository.getExportsByExecution(executionId);
    } catch (error) {
      throw new Error(`Błąd pobierania eksportów: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Aktualizuje postęp wykonania na podstawie próbek
   */
  async updateExecutionProgress(executionId: string): Promise<StudyExecutionData> {
    try {
      const execution = await this.repository.getExecutionById(executionId);
      
      if (!execution) {
        throw new Error('Execution not found');
      }

      const stats = this.calculateExecutionStatistics(execution);
      
      return await this.repository.updateExecutionStatus(
        executionId,
        execution.status,
        {
          progress: stats.progress,
          currentStep: stats.currentStep,
          notes: `Progress: ${stats.progress}%, Passed: ${stats.passedSamples}, Failed: ${stats.failedSamples}, Completion: ${stats.completionPercentage}%`
        }
      );
    } catch (error) {
      throw new Error(`Błąd aktualizacji postępu: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Waliduje dane wykonania badania
   */
  private validateExecutionData(data: CreateStudyExecutionRequest): void {
    if (!data.studyName?.trim()) {
      throw new Error('Nazwa badania jest wymagana');
    }

    if (!data.protocolName?.trim()) {
      throw new Error('Nazwa protokołu jest wymagana');
    }

    if (!data.category?.trim()) {
      throw new Error('Kategoria badania jest wymagana');
    }

    if (!data.operatorId?.trim()) {
      throw new Error('ID operatora jest wymagane');
    }

    if (!data.samples || data.samples.length === 0) {
      throw new Error('Wymagana jest co najmniej jedna próbka');
    }

    // Walidacja próbek
    data.samples.forEach((sample, index) => {
      if (!sample.name?.trim()) {
        throw new Error(`Nazwa próbki ${index + 1} jest wymagana`);
      }
    });
  }

  /**
   * Waliduje dane pomiaru
   */
  private validateMeasurementData(data: AddMeasurementRequest): void {
    if (!data.sampleId?.trim()) {
      throw new Error('ID próbki jest wymagane');
    }

    if (!data.stepId?.trim()) {
      throw new Error('ID kroku jest wymagane');
    }

    if (!data.measurementId?.trim()) {
      throw new Error('ID pomiaru jest wymagane');
    }

    if (!data.operator?.trim()) {
      throw new Error('Operator pomiaru jest wymagany');
    }

    if (data.value == null && !data.textValue?.trim()) {
      throw new Error('Wartość pomiaru jest wymagana');
    }
  }

  /**
   * Oblicza statystyki wykonania badania
   */
  private calculateExecutionStatistics(execution: StudyExecutionData) {
    const totalSamples = execution.samples.length;
    const completedSamples = execution.samples.filter(s => 
      s.status === SampleStatus.COMPLETED || s.status === SampleStatus.SKIPPED
    ).length;
    const passedSamples = execution.samples.filter(s => 
      s.status === SampleStatus.COMPLETED && s.quality === 'pass'
    ).length;
    const failedSamples = execution.samples.filter(s => 
      s.status === SampleStatus.COMPLETED && s.quality === 'fail'
    ).length;

    const progress = totalSamples > 0 ? (completedSamples / totalSamples) * 100 : 0;
    const completionPercentage = Math.round(progress);
    const currentStep = completedSamples;

    return {
      progress,
      currentStep,
      passedSamples,
      failedSamples,
      completionPercentage
    };
  }

  /**
   * Określa ogólny status wyników
   */
  private determineOverallStatus(samples: StudyExecutionSampleData[]): ResultStatus {
    const completedSamples = samples.filter(s => s.status === SampleStatus.COMPLETED);
    
    if (completedSamples.length === 0) {
      return ResultStatus.PENDING;
    }

    const passedSamples = completedSamples.filter(s => s.quality === 'pass');
    const failedSamples = completedSamples.filter(s => s.quality === 'fail');

    if (failedSamples.length === 0) {
      return ResultStatus.PASSED;
    }

    if (passedSamples.length === 0) {
      return ResultStatus.FAILED;
    }

    return ResultStatus.PARTIAL;
  }

  /**
   * Pobiera dane operatora (mock - w rzeczywistości z bazy użytkowników)
   */
  private async getOperatorById(operatorId: string): Promise<{ name: string; position: string }> {
    // To powinno pobierać z tabeli users
    // Na razie mock
    return {
      name: 'Jan Kowalski',
      position: 'Technik Laboratoryjny'
    };
  }
}
