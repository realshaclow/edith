// Modern Study List Types

// Study status enum (matching backend)
export enum StudyStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

// Study priority enum (matching backend)
export enum StudyPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Core study interface (matching backend DTO)
export interface StudyListItem {
  id: string;
  title: string;
  description?: string;
  protocolName?: string;
  status: StudyStatus;
  priority: StudyPriority;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  createdBy: string;
  sessionsCount: number;
  completedSessionsCount: number;
  samplesCount: number;
  estimatedDuration?: string;
  progressPercentage: number;
}

// Detailed study interface
export interface Study extends StudyListItem {
  protocolId: string;
  expectedEndDate?: string;
  modifiedBy?: string;
  settings: any; // StudySettings
  dataCollectionSteps: any[]; // DataCollectionStep[]
  studyParameters: any[]; // StudyParameter[]
  teamMembers: any[]; // StudyTeamMember[]
  actualDuration?: string;
  notes?: string;
  version: number;
  isTemplate: boolean;
  templateId?: string;
}

// View modes
export type StudyViewMode = 'grid' | 'list' | 'table' | 'kanban';

// Filter options
export interface StudyFilters {
  search: string;
  status: string[];
  priority: string[];
  protocol: string[];
  category: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  tags: string[];
  createdBy: string[];
}

// Sort options
export interface StudySortConfig {
  field: 'title' | 'status' | 'createdAt' | 'updatedAt' | 'priority' | 'progress';
  direction: 'asc' | 'desc';
}

// Pagination
export interface StudyPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Selection
export interface StudySelection {
  selectedIds: Set<string>;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

// Quick actions
export type StudyQuickAction = 
  | 'execute'
  | 'edit'
  | 'duplicate'
  | 'archive'
  | 'delete'
  | 'export'
  | 'share'
  | 'view_stats';

// Bulk actions
export type StudyBulkAction = 
  | 'bulk_delete'
  | 'bulk_archive'
  | 'bulk_export'
  | 'bulk_status_change';

// Study card props
export interface StudyCardProps {
  study: StudyListItem;
  viewMode: StudyViewMode;
  isSelected: boolean;
  onSelect: (studyId: string, selected: boolean) => void;
  onQuickAction: (action: StudyQuickAction, study: StudyListItem) => void;
}

// Study statistics
export interface StudyStats {
  total: number;
  byStatus: Record<string, number>;
  byPriority: Record<string, number>;
  recent: number;
  active: number;
  completed: number;
}

// API response
export interface StudyListResponse {
  studies: StudyListItem[];
  pagination: StudyPagination;
  stats: StudyStats;
}

// Hook return type
export interface UseStudyListReturn {
  // Data
  studies: StudyListItem[];
  stats: StudyStats;
  pagination: StudyPagination;
  
  // State
  isLoading: boolean;
  error: string | null;
  viewMode: StudyViewMode;
  filters: StudyFilters;
  sortConfig: StudySortConfig;
  selection: StudySelection;
  
  // Actions
  setViewMode: (mode: StudyViewMode) => void;
  setFilters: (filters: Partial<StudyFilters>) => void;
  setSortConfig: (sort: StudySortConfig) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  
  // Selection
  selectStudy: (studyId: string, selected: boolean) => void;
  selectAll: (selected: boolean) => void;
  clearSelection: () => void;
  
  // Study operations
  executeStudy: (study: StudyListItem) => void;
  editStudy: (study: StudyListItem) => void;
  duplicateStudy: (study: StudyListItem) => void;
  deleteStudy: (study: StudyListItem) => void;
  bulkAction: (action: StudyBulkAction, studyIds: string[]) => void;
  
  // Data operations
  refreshStudies: () => Promise<void>;
  searchStudies: (query: string) => void;
}
