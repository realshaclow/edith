import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  StudyListItem, 
  StudyFilters, 
  StudySortConfig, 
  StudyPagination, 
  StudyViewMode,
  StudySelection,
  StudyStats,
  StudyQuickAction,
  StudyBulkAction,
  UseStudyListReturn
} from '../types';
import { studyListApiService } from '../services/studyListApi';

// Default values
const defaultFilters: StudyFilters = {
  search: '',
  status: [],
  priority: [],
  protocol: [],
  category: [],
  dateRange: {},
  tags: [],
  createdBy: []
};

const defaultSortConfig: StudySortConfig = {
  field: 'updatedAt',
  direction: 'desc'
};

const defaultPagination: StudyPagination = {
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0
};

const defaultStats: StudyStats = {
  total: 0,
  byStatus: {},
  byPriority: {},
  recent: 0,
  active: 0,
  completed: 0
};

export const useStudyList = (): UseStudyListReturn => {
  const navigate = useNavigate();
  
  // State
  const [studies, setStudies] = useState<StudyListItem[]>([]);
  const [stats, setStats] = useState<StudyStats>(defaultStats);
  const [pagination, setPagination] = useState<StudyPagination>(defaultPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<StudyViewMode>('grid');
  const [filters, setFilters] = useState<StudyFilters>(defaultFilters);
  const [sortConfig, setSortConfig] = useState<StudySortConfig>(defaultSortConfig);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Selection computed values
  const selection: StudySelection = useMemo(() => {
    const isAllSelected = studies.length > 0 && selectedIds.size === studies.length;
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < studies.length;
    
    return {
      selectedIds,
      isAllSelected,
      isIndeterminate
    };
  }, [studies, selectedIds]);
  
  // Fetch studies function
  const fetchStudies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await studyListApiService.getStudies(
        filters,
        sortConfig,
        { page: pagination.page, pageSize: pagination.pageSize }
      );
      
      setStudies(response.studies);
      setStats(response.stats);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
    } catch (err: any) {
      setError(err.message);
      console.error('🚨 useStudyList.fetchStudies error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortConfig, pagination.page, pagination.pageSize]);
  
  // Refresh studies
  const refreshStudies = useCallback(async () => {
    await fetchStudies();
  }, [fetchStudies]);
  
  // Search studies
  const searchStudies = useCallback((query: string) => {
    setFilters(prev => ({ ...prev, search: query }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);
  
  // Set filters
  const handleSetFilters = useCallback((newFilters: Partial<StudyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);
  
  // Set sort config
  const handleSetSortConfig = useCallback((sort: StudySortConfig) => {
    setSortConfig(sort);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);
  
  // Pagination handlers
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);
  
  const setPageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, page: 1, pageSize }));
  }, []);
  
  // Selection handlers
  const selectStudy = useCallback((studyId: string, selected: boolean) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(studyId);
      } else {
        newSet.delete(studyId);
      }
      return newSet;
    });
  }, []);
  
  const selectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedIds(new Set(studies.map(study => study.id)));
    } else {
      setSelectedIds(new Set());
    }
  }, [studies]);
  
  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);
  
  // Study operations
  const executeStudy = useCallback((study: StudyListItem) => {
    navigate(`/studies/${study.id}/execute`);
  }, [navigate]);
  
  const editStudy = useCallback((study: StudyListItem) => {
    navigate(`/studies/${study.id}/edit`);
  }, [navigate]);
  
  const duplicateStudy = useCallback(async (study: StudyListItem) => {
    try {
      // TODO: Implement duplicate API call
      console.log('🔄 Duplicating study:', study.title);
      await refreshStudies();
    } catch (err: any) {
      setError(`Failed to duplicate study: ${err.message}`);
    }
  }, [refreshStudies]);
  
  const deleteStudy = useCallback(async (study: StudyListItem) => {
    if (!window.confirm(`Are you sure you want to delete "${study.title}"?`)) {
      return;
    }
    
    try {
      await studyListApiService.deleteStudy(study.id);
      await refreshStudies();
      clearSelection();
    } catch (err: any) {
      setError(`Failed to delete study: ${err.message}`);
    }
  }, [refreshStudies, clearSelection]);
  
  const bulkAction = useCallback(async (action: StudyBulkAction, studyIds: string[]) => {
    if (studyIds.length === 0) return;
    
    try {
      switch (action) {
        case 'bulk_delete':
          if (!window.confirm(`Are you sure you want to delete ${studyIds.length} studies?`)) {
            return;
          }
          await studyListApiService.bulkDeleteStudies(studyIds);
          break;
        
        case 'bulk_archive':
          // TODO: Implement bulk archive
          console.log('🗃️ Bulk archiving studies:', studyIds);
          break;
        
        case 'bulk_export':
          // TODO: Implement bulk export
          console.log('📦 Bulk exporting studies:', studyIds);
          break;
        
        case 'bulk_status_change':
          // TODO: Implement bulk status change
          console.log('🔄 Bulk status change for studies:', studyIds);
          break;
        
        default:
          throw new Error(`Unknown bulk action: ${action}`);
      }
      
      await refreshStudies();
      clearSelection();
    } catch (err: any) {
      setError(`Bulk action failed: ${err.message}`);
    }
  }, [refreshStudies, clearSelection]);
  
  // Effect to fetch studies when dependencies change
  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);
  
  return {
    // Data
    studies,
    stats,
    pagination,
    
    // State
    isLoading,
    error,
    viewMode,
    filters,
    sortConfig,
    selection,
    
    // Actions
    setViewMode,
    setFilters: handleSetFilters,
    setSortConfig: handleSetSortConfig,
    setPage,
    setPageSize,
    
    // Selection
    selectStudy,
    selectAll,
    clearSelection,
    
    // Study operations
    executeStudy,
    editStudy,
    duplicateStudy,
    deleteStudy,
    bulkAction,
    
    // Data operations
    refreshStudies,
    searchStudies
  };
};
