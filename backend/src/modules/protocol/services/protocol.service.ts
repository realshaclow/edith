import { PrismaClient } from '@prisma/client';
import { ProtocolRepository } from '../repositories/protocol.repository';
import { 
  CreateProtocolDto, 
  UpdateProtocolDto, 
  ProtocolResponseDto,
  ProtocolListItemDto,
  ProtocolQueryDto,
  ProtocolStatsDto
} from '../dto';

export class ProtocolService {
  private repository: ProtocolRepository;

  constructor(prisma: PrismaClient) {
    this.repository = new ProtocolRepository(prisma);
  }

  async createProtocol(data: CreateProtocolDto, userId: string): Promise<ProtocolResponseDto> {
    // Walidacja biznesowa
    if (!data.title || data.title.trim().length < 3) {
      throw new Error('Tytuł protokołu musi mieć minimum 3 znaki');
    }

    if (!data.steps || data.steps.length === 0) {
      throw new Error('Protokół musi mieć przynajmniej jeden krok');
    }

    // Walidacja unikalności tytułu dla użytkownika
    const existingProtocol = await this.repository.findMany({
      search: data.title,
      createdBy: userId,
      limit: 1
    });

    if (existingProtocol.data.length > 0 && 
        existingProtocol.data[0].title.toLowerCase() === data.title.toLowerCase()) {
      throw new Error('Protokół o tej nazwie już istnieje');
    }

    return this.repository.create(data, userId);
  }

  async getProtocolById(id: string, userId?: string): Promise<ProtocolResponseDto | null> {
    const protocol = await this.repository.findById(id);
    
    if (!protocol) {
      return null;
    }

    // Sprawdź uprawnienia dostępu
    if (!protocol.isPublic && protocol.createdBy !== userId) {
      throw new Error('Brak uprawnień do przeglądania tego protokołu');
    }

    return protocol;
  }

  async getProtocols(query: ProtocolQueryDto, userId?: string): Promise<{
    data: ProtocolListItemDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Jeśli użytkownik nie jest zalogowany, pokaż tylko publiczne
    if (!userId) {
      query.isPublic = true;
    }

    return this.repository.findMany(query);
  }

  async getUserProtocols(userId: string, query: Partial<ProtocolQueryDto> = {}): Promise<{
    data: ProtocolListItemDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.repository.findMany({
      ...query,
      createdBy: userId
    } as ProtocolQueryDto);
  }

  async getPublicProtocols(query: Partial<ProtocolQueryDto> = {}): Promise<{
    data: ProtocolListItemDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.repository.findMany({
      ...query,
      isPublic: true
    } as ProtocolQueryDto);
  }

  async updateProtocol(id: string, data: UpdateProtocolDto, userId: string): Promise<ProtocolResponseDto> {
    // Sprawdź czy protokół istnieje i czy użytkownik ma prawo go edytować
    const existingProtocol = await this.repository.findById(id);
    
    if (!existingProtocol) {
      throw new Error('Protokół nie został znaleziony');
    }

    if (existingProtocol.createdBy !== userId) {
      throw new Error('Brak uprawnień do edycji tego protokołu');
    }

    if (existingProtocol.type === 'PREDEFINED') {
      throw new Error('Nie można edytować predefiniowanych protokołów');
    }

    // Walidacja biznesowa
    if (data.title && data.title.trim().length < 3) {
      throw new Error('Tytuł protokołu musi mieć minimum 3 znaki');
    }

    if (data.steps && data.steps.length === 0) {
      throw new Error('Protokół musi mieć przynajmniej jeden krok');
    }

    const updatedProtocol = await this.repository.update(id, data);
    if (!updatedProtocol) {
      throw new Error('Błąd podczas aktualizacji protokołu');
    }
    return updatedProtocol;
  }

  async deleteProtocol(id: string, userId: string): Promise<boolean> {
    // Sprawdź czy protokół istnieje i czy użytkownik ma prawo go usunąć
    const existingProtocol = await this.repository.findById(id);
    
    if (!existingProtocol) {
      throw new Error('Protokół nie został znaleziony');
    }

    if (existingProtocol.createdBy !== userId) {
      throw new Error('Brak uprawnień do usunięcia tego protokołu');
    }

    if (existingProtocol.type === 'PREDEFINED') {
      throw new Error('Nie można usuwać predefiniowanych protokołów');
    }

    return this.repository.delete(id);
  }

  async duplicateProtocol(id: string, userId: string, newTitle?: string): Promise<ProtocolResponseDto> {
    const originalProtocol = await this.getProtocolById(id, userId);
    
    if (!originalProtocol) {
      throw new Error('Protokół nie został znaleziony');
    }

    const duplicateData: CreateProtocolDto = {
      title: newTitle || `${originalProtocol.title} (kopia)`,
      description: originalProtocol.description,
      category: originalProtocol.category,
      difficulty: originalProtocol.difficulty,
      estimatedDuration: originalProtocol.estimatedDuration,
      overview: originalProtocol.overview,
      equipment: originalProtocol.equipment,
      materials: originalProtocol.materials,
      safetyGuidelines: originalProtocol.safetyGuidelines,
      references: originalProtocol.references,
      notes: originalProtocol.notes,
      steps: originalProtocol.steps,
      testConditions: originalProtocol.testConditions,
      calculations: originalProtocol.calculations,
      acceptanceCriteria: originalProtocol.acceptanceCriteria,
      typicalValues: originalProtocol.typicalValues,
      commonIssues: originalProtocol.commonIssues,
      isPublic: false // Kopie są domyślnie prywatne
    };

    return this.createProtocol(duplicateData, userId);
  }

  async getProtocolStats(): Promise<ProtocolStatsDto> {
    return this.repository.getStats();
  }

  async searchProtocols(searchTerm: string, userId?: string): Promise<ProtocolListItemDto[]> {
    const query: ProtocolQueryDto = {
      search: searchTerm,
      limit: 20
    };

    if (!userId) {
      query.isPublic = true;
    }

    const result = await this.repository.findMany(query);
    return result.data;
  }

  async getProtocolsByCategory(category: string, userId?: string): Promise<ProtocolListItemDto[]> {
    const query: ProtocolQueryDto = {
      category: category as any,
      limit: 50
    };

    if (!userId) {
      query.isPublic = true;
    }

    const result = await this.repository.findMany(query);
    return result.data;
  }
}
