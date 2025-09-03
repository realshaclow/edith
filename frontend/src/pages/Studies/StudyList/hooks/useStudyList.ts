import { useState, useEffect, useCallback, useMemo } from 'react';
import { Study, StudyStatus } from '../../../../types';
import { useStudies } from '../../../../hooks';
import {
  StudyListViewMode,
  StudyFilterOptions,
  StudySortField,
  StudyListStats,
  StudyBulkAction,
  StudyListNotification,
  StudySortOption
} from '../types';
import {
  sortStudies,
  filterStudies,
  groupStudies,
  calculateStudyStats,
  duplicateStudy,
  validateStudyData
} from '../utils';

export interface UseStudyListOptions {
  initialViewMode?: StudyListViewMode;
  initialFilters?: StudyFilterOptions;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface StudyListViewConfig {
  mode: StudyListViewMode;
  itemsPerPage: number;
  sortBy: StudySortField;
  sortOrder: 'asc' | 'desc';
  groupBy?: StudyGroupBy;
}

interface StudyGroupBy {
  field: 'status' | 'category' | 'protocol' | 'createdBy' | 'month';
  label: string;
}

const defaultViewConfig: StudyListViewConfig = {
  mode: 'grid',
  itemsPerPage: 12,
  sortBy: { field: 'updatedAt', label: 'Ostatnia modyfikacja' },
  sortOrder: 'desc'
};

const defaultFilters: StudyFilterOptions = {
  searchQuery: '',
  status: [],
  category: [],
  protocol: []
};

export const useStudyList = (options: UseStudyListOptions = {}) => {
  const {
    initialViewMode = 'grid',
    initialFilters = defaultFilters,
    autoRefresh = false,
    refreshInterval = 30000
  } = options;

  // Core studies hook
  const {
    studies,
    isLoading,
    error,
    fetchStudies,
    createStudy,
    updateStudy,
    deleteStudy,
    updateStudyStatus
  } = useStudies();

  // Local state
  const [viewMode, setViewMode] = useState<StudyListViewMode>(initialViewMode);
  const [viewConfig, setViewConfig] = useState<StudyListViewConfig>(defaultViewConfig);
  const [filters, setFilters] = useState<StudyFilterOptions>(initialFilters);
  const [selectedStudies, setSelectedStudies] = useState<Study[]>([]);
  const [notifications, setNotifications] = useState<StudyListNotification[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Computed values
  const filteredStudies = useMemo(() => {
    const filtered = filterStudies(studies, filters);
    return sortStudies(filtered, viewConfig.sortBy, viewConfig.sortOrder);
  }, [studies, filters, viewConfig.sortBy, viewConfig.sortOrder]);

  const groupedStudies = useMemo(() => {
    if (viewConfig.groupBy) {
      return groupStudies(filteredStudies, viewConfig.groupBy.field);
    }
    return { 'Wszystkie': filteredStudies };
  }, [filteredStudies, viewConfig.groupBy]);

  const paginatedStudies = useMemo(() => {
    const startIndex = (currentPage - 1) * viewConfig.itemsPerPage;
    const endIndex = startIndex + viewConfig.itemsPerPage;
    return filteredStudies.slice(startIndex, endIndex);
  }, [filteredStudies, currentPage, viewConfig.itemsPerPage]);

  const stats = useMemo(() => {
    return calculateStudyStats(studies);
  }, [studies]);

  const totalPages = Math.ceil(filteredStudies.length / viewConfig.itemsPerPage);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchStudies();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
    return undefined;
  }, [autoRefresh, refreshInterval, fetchStudies]);

  // Initial data fetch
  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  // Notifications management
  const addNotification = useCallback((notification: Omit<StudyListNotification, 'id' | 'timestamp'>) => {
    const newNotification: StudyListNotification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random()}`,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, newNotification]);

    if (notification.autoHide !== false) {
      setTimeout(() => {
        dismissNotification(newNotification.id);
      }, notification.duration || 5000);
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Selection management
  const selectStudy = useCallback((study: Study, selected: boolean) => {
    setSelectedStudies(prev => {
      if (selected) {
        return prev.find(s => s.id === study.id) ? prev : [...prev, study];
      } else {
        return prev.filter(s => s.id !== study.id);
      }
    });
  }, []);

  const selectAllStudies = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedStudies(filteredStudies);
    } else {
      setSelectedStudies([]);
    }
  }, [filteredStudies]);

  const clearSelection = useCallback(() => {
    setSelectedStudies([]);
  }, []);

  // Study operations
  const executeStudy = useCallback(async (study: Study) => {
    try {
      if (study.status !== StudyStatus.ACTIVE) {
        await updateStudyStatus(study.id, StudyStatus.ACTIVE);
      }
      addNotification({
        type: 'success',
        title: 'Badanie rozpoczęte',
        message: `Badanie "${study.name}" zostało rozpoczęte`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Błąd podczas rozpoczynania badania',
        message: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd'
      });
    }
  }, [updateStudyStatus, addNotification]);

  const editStudy = useCallback((study: Study) => {
    // Navigation logic will be handled by the component
  }, []);

  const removeStudy = useCallback(async (study: Study) => {
    try {
      await deleteStudy(study.id);
      setSelectedStudies(prev => prev.filter(s => s.id !== study.id));
      addNotification({
        type: 'success',
        title: 'Badanie usunięte',
        message: `Badanie "${study.name}" zostało usunięte`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Błąd podczas usuwania badania',
        message: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd'
      });
    }
  }, [deleteStudy, addNotification]);

  const duplicateStudyHandler = useCallback(async (study: Study) => {
    try {
      const duplicatedData = duplicateStudy(study);
      const validation = validateStudyData(duplicatedData);
      
      if (!validation.isValid) {
        addNotification({
          type: 'error',
          title: 'Błąd walidacji',
          message: validation.errors.join(', ')
        });
        return;
      }

      // Ensure required fields are present
      const studyToCreate = {
        name: duplicatedData.name!,
        description: duplicatedData.description || '',
        protocolId: duplicatedData.protocolId || study.protocolId || '',
        category: duplicatedData.category || '',
        settings: duplicatedData.settings || {}
      };

      await createStudy(studyToCreate);
      addNotification({
        type: 'success',
        title: 'Badanie zduplikowane',
        message: `Utworzono kopię badania "${study.name}"`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Błąd podczas duplikowania badania',
        message: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd'
      });
    }
  }, [createStudy, addNotification]);

  const changeStudyStatus = useCallback(async (study: Study, status: StudyStatus) => {
    try {
      await updateStudyStatus(study.id, status);
      addNotification({
        type: 'success',
        title: 'Status zmieniony',
        message: `Status badania "${study.name}" został zmieniony`
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Błąd podczas zmiany statusu',
        message: error instanceof Error ? error.message : 'Wystąpił nieoczekiwany błąd'
      });
    }
  }, [updateStudyStatus, addNotification]);

  const viewStatistics = useCallback((study: Study) => {
    // Navigation logic will be handled by the component
  }, []);

  // Bulk actions
  const bulkActions: StudyBulkAction[] = useMemo(() => [
    {
      id: 'activate',
      label: 'Aktywuj',
      icon: '▶️',
      action: async (studies: Study[]) => {
        try {
          await Promise.all(
            studies
              .filter(s => s.status === StudyStatus.DRAFT)
              .map(s => updateStudyStatus(s.id, StudyStatus.ACTIVE))
          );
          addNotification({
            type: 'success',
            title: 'Badania aktywowane',
            message: `Aktywowano ${studies.length} badań`
          });
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Błąd podczas aktywacji',
            message: 'Nie udało się aktywować wszystkich badań'
          });
        }
      },
      color: 'success',
      disabled: (studies) => studies.every(s => s.status !== StudyStatus.DRAFT)
    },
    {
      id: 'pause',
      label: 'Wstrzymaj',
      icon: '⏸️',
      action: async (studies: Study[]) => {
        try {
          await Promise.all(
            studies
              .filter(s => s.status === StudyStatus.ACTIVE)
              .map(s => updateStudyStatus(s.id, StudyStatus.PAUSED))
          );
          addNotification({
            type: 'success',
            title: 'Badania wstrzymane',
            message: `Wstrzymano ${studies.length} badań`
          });
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Błąd podczas wstrzymywania',
            message: 'Nie udało się wstrzymać wszystkich badań'
          });
        }
      },
      color: 'warning',
      disabled: (studies) => studies.every(s => s.status !== StudyStatus.ACTIVE)
    },
    {
      id: 'delete',
      label: 'Usuń',
      icon: '🗑️',
      action: async (studies: Study[]) => {
        try {
          await Promise.all(studies.map(s => deleteStudy(s.id)));
          setSelectedStudies([]);
          addNotification({
            type: 'success',
            title: 'Badania usunięte',
            message: `Usunięto ${studies.length} badań`
          });
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Błąd podczas usuwania',
            message: 'Nie udało się usunąć wszystkich badań'
          });
        }
      },
      color: 'error',
      requiresConfirmation: true,
      confirmationMessage: 'Czy na pewno chcesz usunąć wybrane badania? Ta akcja jest nieodwracalna.'
    }
  ], [updateStudyStatus, deleteStudy, addNotification]);

  const executeBulkAction = useCallback(async (actionId: string) => {
    const action = bulkActions.find(a => a.id === actionId);
    if (action && selectedStudies.length > 0) {
      await action.action(selectedStudies);
      await fetchStudies(); // Refresh data
    }
  }, [bulkActions, selectedStudies, fetchStudies]);

  // Filter and sort helpers
  const updateFilters = useCallback((newFilters: Partial<StudyFilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  const updateViewMode = useCallback((newViewMode: StudyListViewMode) => {
    setViewMode(newViewMode);
    setViewConfig(prev => ({ ...prev, mode: newViewMode }));
    setCurrentPage(1); // Reset to first page when view mode changes
  }, []);

  const updateViewConfig = useCallback((newConfig: Partial<StudyListViewConfig>) => {
    setViewConfig(prev => ({ ...prev, ...newConfig }));
    setCurrentPage(1); // Reset to first page when view config changes
  }, []);

  const refreshStudies = useCallback(async () => {
    try {
      await fetchStudies();
      addNotification({
        type: 'success',
        title: 'Lista odświeżona',
        message: 'Lista badań została odświeżona'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Błąd podczas odświeżania',
        message: 'Nie udało się odświeżyć listy badań'
      });
    }
  }, [fetchStudies, addNotification]);

  return {
    // Data
    studies,
    filteredStudies,
    paginatedStudies,
    groupedStudies,
    selectedStudies,
    stats,
    notifications,
    
    // State
    viewMode,
    viewConfig,
    filters,
    currentPage,
    totalPages,
    isLoading,
    error,
    
    // Actions
    setViewMode: updateViewMode,
    setViewConfig: updateViewConfig,
    setFilters: updateFilters,
    setCurrentPage,
    selectStudy,
    selectAllStudies,
    clearSelection,
    refreshStudies,
    
    // Study operations
    executeStudy,
    editStudy,
    deleteStudy: removeStudy,
    duplicateStudy: duplicateStudyHandler,
    changeStudyStatus,
    viewStatistics,
    
    // Bulk operations
    bulkActions,
    executeBulkAction,
    
    // Notifications
    addNotification,
    dismissNotification,
    
    // Selection info
    isStudySelected: (study: Study) => selectedStudies.some(s => s.id === study.id),
    selectedCount: selectedStudies.length,
    allSelected: selectedStudies.length === filteredStudies.length && filteredStudies.length > 0,
    someSelected: selectedStudies.length > 0 && selectedStudies.length < filteredStudies.length
  };
};
