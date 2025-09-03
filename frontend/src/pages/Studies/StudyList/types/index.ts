import { Study, StudyStatus } from '../../../../types';

export type StudyListViewMode = 'grid' | 'list' | 'table' | 'kanban';

export type StudySortOption = 'name' | 'name_desc' | 'date' | 'date_desc' | 'status' | 'progress';

export type StudyBulkActionType = 'delete' | 'archive' | 'duplicate' | 'export' | 'start' | 'pause';

export interface StudyFilterOptions {
  status?: StudyStatus[];
  category?: string[];
  protocol?: string[];
  createdBy?: string[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  searchQuery?: string;
  tags?: string[];
}

export interface StudySortField {
  field: 'name' | 'createdAt' | 'updatedAt' | 'status' | 'category' | 'protocol';
  label: string;
}

export interface StudyGroupBy {
  field: 'status' | 'category' | 'protocol' | 'createdBy' | 'month';
  label: string;
}

export interface StudyCardProps {
  study: Study;
  viewMode: StudyListViewMode;
  onExecute: (study: Study) => void;
  onEdit: (study: Study) => void;
  onDelete: (study: Study) => void;
  onDuplicate: (study: Study) => void;
  onStatusChange: (study: Study, status: StudyStatus) => void;
  onViewStatistics: (study: Study) => void;
  isSelected?: boolean;
  onSelect?: (study: Study, selected: boolean) => void;
}

export interface StudyListStats {
  total: number;
  byStatus: Record<StudyStatus, number>;
  byCategory: Record<string, number>;
  byProtocol: Record<string, number>;
  recentActivity: {
    created: number;
    updated: number;
    executed: number;
  };
  averageExecutionTime?: number;
  successRate?: number;
}

export interface StudyBulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: (studies: Study[]) => void;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: (studies: Study[]) => boolean;
}

export interface StudyListContext {
  studies: Study[];
  filteredStudies: Study[];
  selectedStudies: Study[];
  viewMode: StudyListViewMode;
  filters: StudyFilterOptions;
  stats: StudyListStats;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setViewMode: (mode: StudyListViewMode) => void;
  setFilters: (filters: StudyFilterOptions) => void;
  selectStudy: (study: Study, selected: boolean) => void;
  selectAllStudies: (selected: boolean) => void;
  refreshStudies: () => void;
  
  // Study operations
  executeStudy: (study: Study) => void;
  editStudy: (study: Study) => void;
  deleteStudy: (study: Study) => void;
  duplicateStudy: (study: Study) => void;
  changeStudyStatus: (study: Study, status: StudyStatus) => void;
  viewStatistics: (study: Study) => void;
  
  // Bulk operations
  bulkActions: StudyBulkAction[];
  executeBulkAction: (actionId: string) => void;
}

export interface StudyQuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
  color?: string;
  variant?: 'contained' | 'outlined' | 'text';
}

export interface StudyTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  protocolId: string;
  tags: string[];
  estimatedDuration: number; // w minutach
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon?: string;
  color?: string;
}

export interface StudyExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  includeData: boolean;
  includeStatistics: boolean;
  includeCharts: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  selectedStudies?: string[];
}

export interface StudyImportOptions {
  source: 'file' | 'template' | 'backup';
  format: 'excel' | 'csv' | 'json';
  mergeStrategy: 'replace' | 'merge' | 'append';
  validateData: boolean;
}

export interface StudyListNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  autoHide?: boolean;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
    color?: string;
  }>;
}
