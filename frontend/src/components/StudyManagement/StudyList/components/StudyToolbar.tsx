import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Toolbar,
  Typography,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Badge,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ViewModule as ViewModuleIcon,
  ViewList as ViewListIcon,
  ViewAgenda as ViewAgendaIcon,
  ViewKanban as ViewKanbanIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  GetApp as GetAppIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { StudyFilters, StudyViewMode, StudySelection, StudyStatus, StudyPriority } from '../types';

interface StudyToolbarProps {
  filters: StudyFilters;
  onFiltersChange: (filters: Partial<StudyFilters>) => void;
  viewMode: StudyViewMode;
  onViewModeChange: (mode: StudyViewMode) => void;
  selection: StudySelection;
  onBulkAction: (action: string) => void;
  onRefresh: () => void;
  onCreateNew: () => void;
  isLoading: boolean;
  totalCount: number;
}

const statusOptions = Object.values(StudyStatus);
const priorityOptions = Object.values(StudyPriority);

export const StudyToolbar: React.FC<StudyToolbarProps> = ({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  selection,
  onBulkAction,
  onRefresh,
  onCreateNew,
  isLoading,
  totalCount
}) => {
  const [showFilters, setShowFilters] = React.useState(false);
  
  const hasActiveFilters = React.useMemo(() => {
    return (
      filters.search ||
      filters.status.length > 0 ||
      filters.priority.length > 0 ||
      filters.protocol.length > 0 ||
      filters.category.length > 0 ||
      filters.tags.length > 0 ||
      filters.createdBy.length > 0 ||
      filters.dateRange.start ||
      filters.dateRange.end
    );
  }, [filters]);

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.protocol.length > 0) count++;
    if (filters.category.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.createdBy.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    return count;
  }, [filters]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ search: event.target.value });
  };

  const handleStatusChange = (event: any) => {
    onFiltersChange({ status: event.target.value });
  };

  const handlePriorityChange = (event: any) => {
    onFiltersChange({ priority: event.target.value });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      status: [],
      priority: [],
      protocol: [],
      category: [],
      tags: [],
      createdBy: [],
      dateRange: {}
    });
  };

  return (
    <Box>
      {/* Main Toolbar */}
      <Toolbar sx={{ px: { xs: 1, sm: 2 }, gap: 2 }}>
        {/* Left side - Title and count */}
        <Box flex={1} display="flex" alignItems="center" gap={2}>
          <Typography variant="h5" fontWeight="bold">
            Studies
          </Typography>
          <Chip 
            label={`${totalCount} total`} 
            size="small" 
            variant="outlined"
          />
          {selection.selectedIds.size > 0 && (
            <Chip 
              label={`${selection.selectedIds.size} selected`}
              size="small"
              color="primary"
            />
          )}
        </Box>

        {/* Search */}
        <TextField
          placeholder="Search studies..."
          value={filters.search}
          onChange={handleSearchChange}
          size="small"
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: filters.search && (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => onFiltersChange({ search: '' })}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        {/* Filters Toggle */}
        <Tooltip title="Toggle Filters">
          <Badge badgeContent={activeFilterCount} color="primary">
            <IconButton 
              onClick={() => setShowFilters(!showFilters)}
              color={hasActiveFilters ? 'primary' : 'default'}
            >
              <FilterListIcon />
            </IconButton>
          </Badge>
        </Tooltip>

        {/* View Mode */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
          size="small"
        >
          <ToggleButton value="grid">
            <Tooltip title="Grid View">
              <ViewModuleIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="list">
            <Tooltip title="List View">
              <ViewListIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="table">
            <Tooltip title="Table View">
              <ViewAgendaIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="kanban">
            <Tooltip title="Kanban View">
              <ViewKanbanIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        {/* Action Buttons */}
        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh} disabled={isLoading}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onCreateNew}
        >
          Create Study
        </Button>
      </Toolbar>

      {/* Bulk Actions Bar (appears when items are selected) */}
      {selection.selectedIds.size > 0 && (
        <Box sx={{ px: 2, py: 1, backgroundColor: 'action.hover' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle2" fontWeight="medium">
              {selection.selectedIds.size} item(s) selected
            </Typography>
            
            <Divider orientation="vertical" flexItem />
            
            <Button
              size="small"
              startIcon={<GetAppIcon />}
              onClick={() => onBulkAction('bulk_export')}
            >
              Export
            </Button>
            
            <Button
              size="small"
              startIcon={<ArchiveIcon />}
              onClick={() => onBulkAction('bulk_archive')}
            >
              Archive
            </Button>
            
            <Button
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => onBulkAction('bulk_delete')}
              color="error"
            >
              Delete
            </Button>
          </Box>
        </Box>
      )}

      {/* Extended Filters Panel */}
      {showFilters && (
        <Box sx={{ px: 2, py: 2, backgroundColor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
          <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
            {/* Status Filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                value={filters.status}
                onChange={handleStatusChange}
                input={<OutlinedInput label="Status" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Checkbox checked={filters.status.indexOf(status) > -1} />
                    <ListItemText primary={status} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Priority Filter */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                multiple
                value={filters.priority}
                onChange={handlePriorityChange}
                input={<OutlinedInput label="Priority" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {(selected as string[]).map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {priorityOptions.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    <Checkbox checked={filters.priority.indexOf(priority) > -1} />
                    <ListItemText primary={priority} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date Range Filters */}
            <TextField
              label="Start Date"
              type="date"
              size="small"
              value={filters.dateRange.start?.toISOString().split('T')[0] || ''}
              onChange={(e) => onFiltersChange({
                dateRange: {
                  ...filters.dateRange,
                  start: e.target.value ? new Date(e.target.value) : undefined
                }
              })}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="End Date"
              type="date"
              size="small"
              value={filters.dateRange.end?.toISOString().split('T')[0] || ''}
              onChange={(e) => onFiltersChange({
                dateRange: {
                  ...filters.dateRange,
                  end: e.target.value ? new Date(e.target.value) : undefined
                }
              })}
              InputLabelProps={{ shrink: true }}
            />

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={clearAllFilters}
              >
                Clear All
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};
