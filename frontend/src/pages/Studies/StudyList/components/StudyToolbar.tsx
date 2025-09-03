import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  ViewList as ListIcon,
  ViewModule as GridIcon,
  Sort as SortIcon,
  MoreVert as MoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  PlayArrow as StartIcon,
  Pause as PauseIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { Study, StudyStatus } from '../../../../types';
import { StudyListViewMode, StudyBulkActionType, StudySortOption } from '../types';

interface StudyToolbarProps {
  // View and Layout
  viewMode: StudyListViewMode;
  onViewModeChange: (mode: StudyListViewMode) => void;
  sortBy: StudySortOption;
  onSortChange: (sort: StudySortOption) => void;
  
  // Selection and Bulk Actions
  selectedStudies: string[];
  allStudies: Study[];
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkAction: (action: StudyBulkActionType, studyIds: string[]) => Promise<void>;
  
  // Filters
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  onToggleFilters: () => void;
  
  // Actions
  onCreateStudy: () => void;
  onRefresh: () => void;
  onExportStudies: (studies: Study[]) => void;
  onImportStudies: (file: File) => Promise<void>;
  
  // Loading states
  isLoading?: boolean;
  bulkActionLoading?: boolean;
}

const StudyToolbar: React.FC<StudyToolbarProps> = ({
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  selectedStudies,
  allStudies,
  onSelectAll,
  onClearSelection,
  onBulkAction,
  hasActiveFilters,
  onClearFilters,
  onToggleFilters,
  onCreateStudy,
  onRefresh,
  onExportStudies,
  onImportStudies,
  isLoading = false,
  bulkActionLoading = false
}) => {
  const [sortMenuAnchor, setSortMenuAnchor] = useState<null | HTMLElement>(null);
  const [bulkMenuAnchor, setBulkMenuAnchor] = useState<null | HTMLElement>(null);
  const [moreMenuAnchor, setMoreMenuAnchor] = useState<null | HTMLElement>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const hasSelection = selectedStudies.length > 0;
  const isAllSelected = selectedStudies.length === allStudies.length && allStudies.length > 0;

  const sortOptions: { value: StudySortOption; label: string }[] = [
    { value: 'name', label: 'Nazwa (A-Z)' },
    { value: 'name_desc', label: 'Nazwa (Z-A)' },
    { value: 'date', label: 'Data utworzenia (najnowsze)' },
    { value: 'date_desc', label: 'Data utworzenia (najstarsze)' },
    { value: 'status', label: 'Status' },
    { value: 'progress', label: 'Postęp' }
  ];

  const bulkActions: { action: StudyBulkActionType; label: string; icon: React.ReactNode; color?: 'default' | 'primary' | 'secondary' | 'error' }[] = [
    { action: 'start', label: 'Rozpocznij badania', icon: <StartIcon />, color: 'primary' },
    { action: 'pause', label: 'Wstrzymaj badania', icon: <PauseIcon /> },
    { action: 'archive', label: 'Archiwizuj', icon: <ArchiveIcon /> },
    { action: 'delete', label: 'Usuń', icon: <DeleteIcon />, color: 'error' }
  ];

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortMenuAnchor(event.currentTarget);
  };

  const handleBulkMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setBulkMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleBulkAction = async (action: StudyBulkActionType) => {
    setBulkMenuAnchor(null);
    
    if (action === 'delete') {
      setDeleteConfirmOpen(true);
      return;
    }

    await onBulkAction(action, selectedStudies);
  };

  const handleConfirmDelete = async () => {
    setDeleteConfirmOpen(false);
    await onBulkAction('delete', selectedStudies);
  };

  const handleExport = () => {
    const studiesToExport = hasSelection 
      ? allStudies.filter(study => selectedStudies.includes(study.id))
      : allStudies;
    onExportStudies(studiesToExport);
    setExportDialogOpen(false);
    setMoreMenuAnchor(null);
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await onImportStudies(file);
        setImportDialogOpen(false);
        setMoreMenuAnchor(null);
      } catch (error) {
        console.error('Import failed:', error);
      }
    }
  };

  const getSelectedStudiesStats = () => {
    const selected = allStudies.filter(study => selectedStudies.includes(study.id));
    const statusCounts = selected.reduce((acc, study) => {
      acc[study.status] = (acc[study.status] || 0) + 1;
      return acc;
    }, {} as Record<StudyStatus, number>);

    return { total: selected.length, statusCounts };
  };

  const selectedStats = getSelectedStudiesStats();

  return (
    <Box>
      {/* Main Toolbar */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        {/* Left Side - Actions */}
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateStudy}
            size="small"
          >
            Nowe badanie
          </Button>

          <Tooltip title="Odśwież">
            <IconButton onClick={onRefresh} disabled={isLoading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Filtry">
            <Badge color="primary" variant="dot" invisible={!hasActiveFilters}>
              <IconButton onClick={onToggleFilters}>
                <FilterIcon />
              </IconButton>
            </Badge>
          </Tooltip>

          {hasActiveFilters && (
            <Button size="small" onClick={onClearFilters}>
              Wyczyść filtry
            </Button>
          )}
        </Box>

        {/* Right Side - View Controls */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Sort */}
          <Button
            size="small"
            startIcon={<SortIcon />}
            onClick={handleSortMenuOpen}
          >
            Sortuj
          </Button>

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, value) => value && onViewModeChange(value)}
            size="small"
          >
            <ToggleButton value="grid">
              <Tooltip title="Widok siatki">
                <GridIcon />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="list">
              <Tooltip title="Widok listy">
                <ListIcon />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* More Options */}
          <IconButton onClick={handleMoreMenuOpen}>
            <MoreIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Selection Bar */}
      {hasSelection && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={2}
          bgcolor="primary.light"
          borderRadius={1}
          mb={2}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="primary.contrastText">
              Wybrano {selectedStats.total} badań
            </Typography>
            
            <Box display="flex" gap={1}>
              {Object.entries(selectedStats.statusCounts).map(([status, count]) => (
                <Chip
                  key={status}
                  label={`${status}: ${count}`}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            <Button
              size="small"
              onClick={isAllSelected ? onClearSelection : onSelectAll}
            >
              {isAllSelected ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
            </Button>

            <Button
              size="small"
              startIcon={<MoreIcon />}
              onClick={handleBulkMenuOpen}
              disabled={bulkActionLoading}
            >
              Akcje grupowe
            </Button>

            <IconButton onClick={onClearSelection} size="small">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Sort Menu */}
      <Menu
        anchorEl={sortMenuAnchor}
        open={Boolean(sortMenuAnchor)}
        onClose={() => setSortMenuAnchor(null)}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={sortBy === option.value}
            onClick={() => {
              onSortChange(option.value);
              setSortMenuAnchor(null);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Bulk Actions Menu */}
      <Menu
        anchorEl={bulkMenuAnchor}
        open={Boolean(bulkMenuAnchor)}
        onClose={() => setBulkMenuAnchor(null)}
      >
        {bulkActions.map((action) => (
          <MenuItem
            key={`bulk-${action.action}`}
            onClick={() => handleBulkAction(action.action)}
            disabled={bulkActionLoading}
          >
            <ListItemIcon>{action.icon}</ListItemIcon>
            <ListItemText primary={action.label} />
          </MenuItem>
        ))}
      </Menu>

      {/* More Options Menu */}
      <Menu
        anchorEl={moreMenuAnchor}
        open={Boolean(moreMenuAnchor)}
        onClose={() => setMoreMenuAnchor(null)}
      >
        <MenuItem onClick={() => setExportDialogOpen(true)}>
          <ListItemIcon>
            <DownloadIcon />
          </ListItemIcon>
          <ListItemText primary="Eksportuj badania" />
        </MenuItem>
        <MenuItem onClick={() => setImportDialogOpen(true)}>
          <ListItemIcon>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText primary="Importuj badania" />
        </MenuItem>
      </Menu>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onClose={() => setExportDialogOpen(false)}>
        <DialogTitle>Eksportuj badania</DialogTitle>
        <DialogContent>
          <Typography>
            {hasSelection 
              ? `Czy chcesz wyeksportować ${selectedStudies.length} wybranych badań?`
              : `Czy chcesz wyeksportować wszystkie ${allStudies.length} badań?`
            }
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialogOpen(false)}>Anuluj</Button>
          <Button variant="contained" onClick={handleExport}>Eksportuj</Button>
        </DialogActions>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)}>
        <DialogTitle>Importuj badania</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Wybierz plik JSON z badaniami do zaimportowania.
          </Typography>
          <input
            type="file"
            accept=".json"
            onChange={handleImportFile}
            style={{ marginTop: 16 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Anuluj</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Potwierdź usunięcie</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Ta operacja jest nieodwracalna!
          </Alert>
          <Typography>
            Czy na pewno chcesz usunąć {selectedStudies.length} wybranych badań?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Anuluj</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleConfirmDelete}
            disabled={bulkActionLoading}
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudyToolbar;
