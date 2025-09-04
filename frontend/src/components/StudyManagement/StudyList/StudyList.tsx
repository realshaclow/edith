import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Alert,
  Snackbar,
  LinearProgress,
  Fab,
  Zoom
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useStudyList } from './hooks/useStudyList';
import { StudyToolbar } from './components/StudyToolbar';
import { StudyGrid } from './components/StudyGrid';
import { StudyPaginationComponent } from './components/StudyPagination';
import { StudyQuickAction, StudyBulkAction } from './types';

export const StudyList: React.FC = () => {
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  
  const {
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
    setFilters,
    setSortConfig,
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
  } = useStudyList();

  // Handle quick actions
  const handleQuickAction = React.useCallback(async (action: StudyQuickAction, study: any) => {
    try {
      switch (action) {
        case 'execute':
          executeStudy(study);
          break;
          
        case 'edit':
          editStudy(study);
          break;
          
        case 'duplicate':
          await duplicateStudy(study);
          setSnackbarMessage(`Study "${study.title}" duplicated successfully`);
          setSnackbarOpen(true);
          break;
          
        case 'delete':
          await deleteStudy(study);
          setSnackbarMessage(`Study "${study.title}" deleted successfully`);
          setSnackbarOpen(true);
          break;
          
        case 'archive':
          // TODO: Implement archive
          setSnackbarMessage(`Study "${study.title}" archived`);
          setSnackbarOpen(true);
          break;
          
        case 'export':
          // TODO: Implement export
          setSnackbarMessage(`Exporting study "${study.title}"...`);
          setSnackbarOpen(true);
          break;
          
        case 'share':
          // TODO: Implement share
          setSnackbarMessage(`Sharing study "${study.title}"...`);
          setSnackbarOpen(true);
          break;
          
        case 'view_stats':
          navigate(`/studies/${study.id}/statistics`);
          break;
          
        default:
          console.warn('Unknown quick action:', action);
      }
    } catch (err: any) {
      setSnackbarMessage(`Error: ${err.message}`);
      setSnackbarOpen(true);
    }
  }, [executeStudy, editStudy, duplicateStudy, deleteStudy, navigate]);

  // Handle bulk actions
  const handleBulkAction = React.useCallback(async (action: string) => {
    const selectedIds = Array.from(selection.selectedIds);
    
    try {
      await bulkAction(action as StudyBulkAction, selectedIds);
      setSnackbarMessage(`Bulk action "${action}" completed successfully`);
      setSnackbarOpen(true);
    } catch (err: any) {
      setSnackbarMessage(`Bulk action failed: ${err.message}`);
      setSnackbarOpen(true);
    }
  }, [bulkAction, selection.selectedIds]);

  // Handle create new study
  const handleCreateNew = () => {
    navigate('/studies/create');
  };

  // Close snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Loading indicator */}
      {isLoading && (
        <LinearProgress 
          sx={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 1301 
          }} 
        />
      )}

      <Container maxWidth="xl" sx={{ py: 2 }}>
        {/* Toolbar */}
        <StudyToolbar
          filters={filters}
          onFiltersChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selection={selection}
          onBulkAction={handleBulkAction}
          onRefresh={refreshStudies}
          onCreateNew={handleCreateNew}
          isLoading={isLoading}
          totalCount={stats.total}
        />

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            onClose={() => {/* TODO: Clear error */}}
          >
            {error}
          </Alert>
        )}

        {/* Study Grid */}
        <Box sx={{ mt: 2 }}>
          <StudyGrid
            studies={studies}
            viewMode={viewMode}
            selectedIds={selection.selectedIds}
            onSelect={selectStudy}
            onQuickAction={handleQuickAction}
            isLoading={isLoading}
          />
        </Box>

        {/* Pagination */}
        <StudyPaginationComponent
          pagination={pagination}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          isLoading={isLoading}
        />
      </Container>

      {/* Floating Action Button */}
      <Zoom in={!isLoading}>
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1200
          }}
          onClick={handleCreateNew}
        >
          <AddIcon />
        </Fab>
      </Zoom>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </Box>
  );
};
