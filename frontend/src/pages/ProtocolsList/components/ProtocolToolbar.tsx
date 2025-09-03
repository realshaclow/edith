import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ViewModule as GridIcon,
  ViewList as ListIcon,
  TableChart as TableIcon,
  ArrowUpward as ArrowUpIcon,
  ArrowDownward as ArrowDownIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { ProtocolSortOptions, ProtocolViewMode } from '../types';

interface ProtocolToolbarProps {
  sortOptions: ProtocolSortOptions;
  onSortChange: (sortOptions: ProtocolSortOptions) => void;
  viewMode: ProtocolViewMode;
  onViewModeChange: (mode: ProtocolViewMode) => void;
  totalCount: number;
  filteredCount: number;
  loading: boolean;
  onRefresh: () => void;
}

const ProtocolToolbar: React.FC<ProtocolToolbarProps> = ({
  sortOptions,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalCount,
  filteredCount,
  loading,
  onRefresh
}) => {
  const handleSortFieldChange = (event: any) => {
    onSortChange({
      ...sortOptions,
      field: event.target.value
    });
  };

  const handleSortDirectionToggle = () => {
    onSortChange({
      ...sortOptions,
      direction: sortOptions.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const getSortFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      title: 'Tytuł',
      category: 'Kategoria',
      difficulty: 'Poziom trudności',
      createdAt: 'Data utworzenia',
      estimatedDuration: 'Czas trwania'
    };
    return labels[field] || field;
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mb: 2,
      flexWrap: 'wrap',
      gap: 2
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6" component="div">
          Protokoły
        </Typography>
        
        <Chip
          label={`${filteredCount} z ${totalCount} protokołów`}
          size="small"
          color={filteredCount < totalCount ? 'primary' : 'default'}
          variant="outlined"
        />

        <Tooltip title="Odśwież protokoły">
          <IconButton 
            onClick={onRefresh} 
            size="small"
            disabled={loading}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        {/* Sort Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sortuj według</InputLabel>
            <Select
              value={sortOptions.field}
              onChange={handleSortFieldChange}
              label="Sortuj według"
            >
              <MenuItem value="title">Tytuł</MenuItem>
              <MenuItem value="category">Kategoria</MenuItem>
              <MenuItem value="difficulty">Poziom trudności</MenuItem>
              <MenuItem value="createdAt">Data utworzenia</MenuItem>
              <MenuItem value="estimatedDuration">Czas trwania</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title={`Sortuj ${sortOptions.direction === 'asc' ? 'malejąco' : 'rosnąco'}`}>
            <IconButton 
              onClick={handleSortDirectionToggle}
              size="small"
              color="primary"
            >
              {sortOptions.direction === 'asc' ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        {/* View Mode Controls */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && onViewModeChange(newMode)}
          size="small"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <Tooltip title="Widok siatki">
              <GridIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <Tooltip title="Widok listy">
              <ListIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="table" aria-label="table view">
            <Tooltip title="Widok tabeli">
              <TableIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Box>
  );
};

export default ProtocolToolbar;
