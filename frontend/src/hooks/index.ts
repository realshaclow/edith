// Export all hooks from a single entry point
export { useProtocols } from './useProtocols';
export { usePredefinedProtocols } from './usePredefinedProtocols';
export { useStudies } from './useStudies';
export { useUsers } from './useUsers';
export { useStudyExecution } from './useStudyExecution';

// Re-export types for convenience
export type { 
  UseProtocolsReturn 
} from './useProtocols';
export type {
  UseUsersResult
} from './useUsers';

export type { 
  PredefinedProtocol, 
  UsePredefinedProtocolsReturn 
} from './usePredefinedProtocols';

export type { 
  UseStudiesReturn 
} from './useStudies';

// Import types for use in compatibility layer
import type { StudyDto, StudySessionDto } from '../services/studiesApi';

// Re-export API types
export type {
  ProtocolDto as Protocol,
  CreateProtocolDto as CreateProtocolRequest,
  UpdateProtocolDto as UpdateProtocolRequest,
  ProtocolTemplateDto
} from '../services/protocolsApi';

export type {
  StudyDto,
  CreateStudyDto as CreateStudyRequest,
  UpdateStudyDto as UpdateStudyRequest,
  StudySessionDto as StudySession,
  CreateStudySessionDto as CreateStudySessionRequest,
  UpdateStudySessionDto as UpdateStudySessionRequest
} from '../services/studiesApi';

// Backward compatibility: extend StudyDto to match old Study interface
export interface Study extends StudyDto {
  name: string; // Maps to title
  sessions?: StudySessionDto[]; // Add sessions property for compatibility
}

// Helper to convert StudyDto to Study for backward compatibility
export const studyDtoToStudy = (studyDto: StudyDto, sessions?: StudySessionDto[]): Study => ({
  ...studyDto,
  name: studyDto.title, // Backend already maps database 'name' to DTO 'title'
  title: studyDto.title, // Ensure title is also available for components that use it
  sessions: sessions || [] // Add sessions array
});
