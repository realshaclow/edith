import React, { useState } from 'react';
import { Box, Grid, Collapse, Alert, CircularProgress, Typography } from '@mui/material';
import { Study, StudyStatus } from '../../../types';
import { useStudyList } from './hooks/useStudyList';
import StudyFilters from './components/StudyFilters';
import StudyToolbar from './components/StudyToolbar';
import StudyCard from './components/StudyCard';
import StudyStatistics from './components/StudyStatistics';
import { StudyListViewMode, StudySortOption, StudyBulkActionType } from './types';

interface StudyListMainProps {
  onCreateStudy: () => void;
  onEditStudy: (study: Study) => void;
  onExecuteStudy: (study: Study) => void;
  onViewStatistics: (study: Study) => void;
}

const StudyListMain: React.FC<StudyListMainProps> = ({
  onCreateStudy,
  onEditStudy,
  onExecuteStudy,
  onViewStatistics
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [showStatistics, setShowStatistics] = useState(true);
  const [viewMode, setViewMode] = useState<StudyListViewMode>('grid');
  const [sortBy, setSortBy] = useState<StudySortOption>('date');

  const {
    // Data
    filteredStudies,
    selectedStudies,
    filters,
    stats,
    isLoading,
    error,
    notifications,
    
    // Actions
    setFilters,
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
    
    // Bulk operations
    bulkActions,
    executeBulkAction,
    
    // Notifications
    dismissNotification,
    
    // Selection helpers
    selectedCount,
    allSelected,
    someSelected
  } = useStudyList();

  const sortedAndFilteredStudies = React.useMemo(() => {
    let studies = [...filteredStudies];

    // Sort studies
    switch (sortBy) {
      case 'name':
        studies.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        studies.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date':
        studies.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'date_desc':
        studies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'status':
        studies.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'progress':
        // Assuming we have progress calculation in utils
        studies.sort((a, b) => {
          const progressA = a.sessions?.length || 0;
          const progressB = b.sessions?.length || 0;
          return progressB - progressA;
        });
        break;
    }

    return studies;
  }, [filteredStudies, sortBy]);

  const hasActiveFilters = React.useMemo(() => {
    return Boolean(
      (filters.status && filters.status.length > 0) ||
      (filters.category && filters.category.length > 0) ||
      (filters.protocol && filters.protocol.length > 0) ||
      (filters.createdBy && filters.createdBy.length > 0) ||
      (filters.tags && filters.tags.length > 0) ||
      filters.dateRange?.from ||
      filters.dateRange?.to ||
      (filters.searchQuery && filters.searchQuery.trim().length > 0)
    );
  }, [filters]);

  // Get selected study IDs for easier comparison
  const selectedStudyIds = selectedStudies.map(study => study.id);

  const handleStudySelect = (study: Study, selected: boolean) => {
    selectStudy(study, selected);
  };

  const handleSelectAll = () => {
    const allCurrentlySelected = selectedStudyIds.length === sortedAndFilteredStudies.length;
    if (allCurrentlySelected) {
      clearSelection();
    } else {
      sortedAndFilteredStudies.forEach(study => {
        if (!selectedStudyIds.includes(study.id)) {
          selectStudy(study, true);
        }
      });
    }
  };

  const handleExportStudies = (studies: Study[]) => {
    // For now, just log the export - in real app this would call export function
    console.log('Exporting studies:', studies);
  };

  const handleImportStudies = async (file: File) => {
    // For now, just log the import - in real app this would call import function
    console.log('Importing studies from file:', file);
    return Promise.resolve();
  };

  const handleBulkAction = async (action: StudyBulkActionType, studyIds: string[]) => {
    // Map the action to the actual bulk operation
    switch (action) {
      case 'delete':
        await executeBulkAction('delete-selected');
        break;
      case 'archive':
        await executeBulkAction('archive-selected');
        break;
      case 'duplicate':
        await executeBulkAction('duplicate-selected');
        break;
      default:
        console.log('Bulk action not implemented:', action);
    }
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      status: [],
      category: [],
      protocol: [],
      createdBy: [],
      tags: [],
      dateRange: undefined
    });
  };

  const renderStudies = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (sortedAndFilteredStudies.length === 0) {
      return (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {hasActiveFilters ? 'Brak badań spełniających kryteria' : 'Brak badań'}
          </Typography>
          <Typography color="text.secondary">
            {hasActiveFilters 
              ? 'Spróbuj zmienić filtry lub wyczyść je aby zobaczyć wszystkie badania'
              : 'Rozpocznij od utworzenia nowego badania'
            }
          </Typography>
        </Box>
      );
    }

    if (viewMode === 'list') {
      return (
        <Box>
          {sortedAndFilteredStudies.map((study) => (
            <Box key={study.id} mb={2}>
              <StudyCard
                study={study}
                viewMode={viewMode}
                onExecute={onExecuteStudy}
                onEdit={onEditStudy}
                onDelete={removeStudy}
                onDuplicate={duplicateStudyHandler}
                onStatusChange={changeStudyStatus}
                onViewStatistics={onViewStatistics}
                isSelected={selectedStudyIds.includes(study.id)}
                onSelect={handleStudySelect}
              />
            </Box>
          ))}
        </Box>
      );
    }

    return (
      <Grid container spacing={3}>
        {sortedAndFilteredStudies.map((study) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={study.id}>
            <StudyCard
              study={study}
              viewMode={viewMode}
              onExecute={onExecuteStudy}
              onEdit={onEditStudy}
              onDelete={removeStudy}
              onDuplicate={duplicateStudyHandler}
              onStatusChange={changeStudyStatus}
              onViewStatistics={onViewStatistics}
              isSelected={selectedStudyIds.includes(study.id)}
              onSelect={handleStudySelect}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box>
      {/* Notifications */}
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          severity={notification.type}
          onClose={() => dismissNotification(notification.id)}
          sx={{ mb: 2 }}
        >
          <strong>{notification.title}</strong> {notification.message}
        </Alert>
      ))}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Statistics */}
      <Collapse in={showStatistics}>
        <Box mb={3}>
          <StudyStatistics
            stats={stats}
            onRefresh={refreshStudies}
            isLoading={isLoading}
            compact={false}
          />
        </Box>
      </Collapse>

      {/* Toolbar */}
      <StudyToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedStudies={selectedStudyIds}
        allStudies={sortedAndFilteredStudies}
        onSelectAll={handleSelectAll}
        onClearSelection={clearSelection}
        onBulkAction={handleBulkAction}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onCreateStudy={onCreateStudy}
        onRefresh={refreshStudies}
        onExportStudies={handleExportStudies}
        onImportStudies={handleImportStudies}
        isLoading={isLoading}
        bulkActionLoading={false}
      />

      {/* Filters */}
      <Collapse in={showFilters}>
        <Box mb={3}>
          <StudyFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableCategories={[]}
            availableProtocols={[]}
            availableUsers={[]}
            availableTags={[]}
            compact={false}
          />
        </Box>
      </Collapse>

      {/* Studies Grid/List */}
      <Box>
        {renderStudies()}
      </Box>
    </Box>
  );
};

export default StudyListMain;
