import React, { useState } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  IconButton,
  Popover,
  Paper,
  Typography,
  Divider,
  Stack,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Badge
} from '@mui/material';
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Search as SearchIcon,
  Tune as TuneIcon
} from '@mui/icons-material';
import { StudyStatus } from '../../../../types';
import { StudyFilterOptions } from '../types';
import { getStatusLabel } from '../utils';

interface StudyFiltersProps {
  filters: StudyFilterOptions;
  onFiltersChange: (filters: StudyFilterOptions) => void;
  availableCategories: string[];
  availableProtocols: string[];
  availableUsers: string[];
  availableTags: string[];
  compact?: boolean;
}

const StudyFilters: React.FC<StudyFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableProtocols,
  availableUsers,
  availableTags,
  compact = false
}) => {
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [tempFilters, setTempFilters] = useState<StudyFilterOptions>(filters);

  const hasActiveFilters = () => {
    return (
      (filters.status && filters.status.length > 0) ||
      (filters.category && filters.category.length > 0) ||
      (filters.protocol && filters.protocol.length > 0) ||
      (filters.createdBy && filters.createdBy.length > 0) ||
      (filters.tags && filters.tags.length > 0) ||
      filters.dateRange?.from ||
      filters.dateRange?.to ||
      (filters.searchQuery && filters.searchQuery.trim().length > 0)
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.category && filters.category.length > 0) count++;
    if (filters.protocol && filters.protocol.length > 0) count++;
    if (filters.createdBy && filters.createdBy.length > 0) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.dateRange?.from || filters.dateRange?.to) count++;
    return count;
  };

  const handleFilterOpen = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
    setTempFilters(filters);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleApplyFilters = () => {
    onFiltersChange(tempFilters);
    handleFilterClose();
  };

  const handleClearFilters = () => {
    const clearedFilters: StudyFilterOptions = {
      searchQuery: '',
      status: [],
      category: [],
      protocol: [],
      createdBy: [],
      tags: [],
      dateRange: undefined
    };
    setTempFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    handleFilterClose();
  };

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleQuickFilter = (type: keyof StudyFilterOptions, value: any) => {
    onFiltersChange({ ...filters, [type]: value });
  };

  if (compact) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        {/* Search */}
        <TextField
          size="small"
          placeholder="Szukaj badań..."
          value={filters.searchQuery || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 250 }}
        />

        {/* Status Quick Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            multiple
            value={filters.status || []}
            onChange={(e) => handleQuickFilter('status', e.target.value)}
            renderValue={(selected) => (
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {(selected as StudyStatus[]).map((value) => (
                  <Chip key={value} label={getStatusLabel(value)} size="small" />
                ))}
              </Box>
            )}
          >
            {Object.values(StudyStatus).map((status) => (
              <MenuItem key={status} value={status}>
                <Checkbox checked={(filters.status || []).includes(status)} />
                {getStatusLabel(status)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Advanced Filters Button */}
        <Badge badgeContent={getActiveFiltersCount()} color="primary">
          <IconButton onClick={handleFilterOpen} color={hasActiveFilters() ? 'primary' : 'default'}>
            <TuneIcon />
          </IconButton>
        </Badge>

        {/* Clear Filters */}
        {hasActiveFilters() && (
          <IconButton onClick={handleClearFilters} size="small" color="secondary">
            <ClearIcon />
          </IconButton>
        )}
      </Box>
    );
  }

  return (
    <Box>
      {/* Search Bar */}
      <Box display="flex" gap={2} mb={2}>
        <TextField
          fullWidth
          placeholder="Szukaj badań po nazwie, opisie, kategorii..."
          value={filters.searchQuery || ''}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
          }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={handleFilterOpen}
          color={hasActiveFilters() ? 'primary' : 'inherit'}
        >
          Filtry {hasActiveFilters() && `(${getActiveFiltersCount()})`}
        </Button>
      </Box>

      {/* Quick Filters */}
      <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
        {Object.values(StudyStatus).map((status) => (
          <Chip
            key={status}
            label={getStatusLabel(status)}
            clickable
            variant={(filters.status || []).includes(status) ? 'filled' : 'outlined'}
            onClick={() => {
              const currentStatus = filters.status || [];
              const newStatus = currentStatus.includes(status)
                ? currentStatus.filter(s => s !== status)
                : [...currentStatus, status];
              handleQuickFilter('status', newStatus);
            }}
            size="small"
          />
        ))}
      </Box>

      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant="body2" color="text.secondary">
            Aktywne filtry:
          </Typography>
          
          {filters.category && filters.category.map(cat => (
            <Chip
              key={cat}
              label={`Kategoria: ${cat}`}
              size="small"
              onDelete={() => {
                const newCategories = filters.category?.filter(c => c !== cat) || [];
                handleQuickFilter('category', newCategories);
              }}
            />
          ))}

          {filters.protocol && filters.protocol.map(prot => (
            <Chip
              key={prot}
              label={`Protokół: ${prot}`}
              size="small"
              onDelete={() => {
                const newProtocols = filters.protocol?.filter(p => p !== prot) || [];
                handleQuickFilter('protocol', newProtocols);
              }}
            />
          ))}

          {filters.createdBy && filters.createdBy.map(user => (
            <Chip
              key={user}
              label={`Autor: ${user}`}
              size="small"
              onDelete={() => {
                const newUsers = filters.createdBy?.filter(u => u !== user) || [];
                handleQuickFilter('createdBy', newUsers);
              }}
            />
          ))}

          <Button
            size="small"
            onClick={handleClearFilters}
            startIcon={<ClearIcon />}
          >
            Wyczyść wszystkie
          </Button>
        </Box>
      )}

      {/* Advanced Filters Popover */}
      <Popover
        open={Boolean(filterAnchor)}
        anchorEl={filterAnchor}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 3, minWidth: 400, maxWidth: 600 }}>
          <Typography variant="h6" gutterBottom>
            Zaawansowane filtry
          </Typography>

          <Stack spacing={3}>
            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                multiple
                value={tempFilters.status || []}
                onChange={(e) => setTempFilters({ ...tempFilters, status: e.target.value as StudyStatus[] })}
                renderValue={(selected) => (
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {(selected as StudyStatus[]).map((value) => (
                      <Chip key={value} label={getStatusLabel(value)} size="small" />
                    ))}
                  </Box>
                )}
              >
                {Object.values(StudyStatus).map((status) => (
                  <MenuItem key={status} value={status}>
                    <Checkbox checked={(tempFilters.status || []).includes(status)} />
                    {getStatusLabel(status)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Category */}
            <Autocomplete
              multiple
              options={availableCategories}
              value={tempFilters.category || []}
              onChange={(_, value) => setTempFilters({ ...tempFilters, category: value })}
              renderInput={(params) => (
                <TextField {...params} label="Kategoria" placeholder="Wybierz kategorie" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
            />

            {/* Protocol */}
            <Autocomplete
              multiple
              options={availableProtocols}
              value={tempFilters.protocol || []}
              onChange={(_, value) => setTempFilters({ ...tempFilters, protocol: value })}
              renderInput={(params) => (
                <TextField {...params} label="Protokół" placeholder="Wybierz protokoły" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
            />

            {/* Created By */}
            <Autocomplete
              multiple
              options={availableUsers}
              value={tempFilters.createdBy || []}
              onChange={(_, value) => setTempFilters({ ...tempFilters, createdBy: value })}
              renderInput={(params) => (
                <TextField {...params} label="Utworzone przez" placeholder="Wybierz użytkowników" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
            />

            {/* Tags */}
            <Autocomplete
              multiple
              freeSolo
              options={availableTags}
              value={tempFilters.tags || []}
              onChange={(_, value) => setTempFilters({ ...tempFilters, tags: value })}
              renderInput={(params) => (
                <TextField {...params} label="Tagi" placeholder="Dodaj tagi" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip {...getTagProps({ index })} key={option} label={option} size="small" />
                ))
              }
            />

            {/* Date Range */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Zakres dat utworzenia
              </Typography>
              <Box display="flex" gap={2}>
                <TextField
                  type="date"
                  label="Od"
                  value={tempFilters.dateRange?.from?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setTempFilters({
                      ...tempFilters,
                      dateRange: { ...tempFilters.dateRange, from: date }
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="Do"
                  value={tempFilters.dateRange?.to?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const date = e.target.value ? new Date(e.target.value) : undefined;
                    setTempFilters({
                      ...tempFilters,
                      dateRange: { ...tempFilters.dateRange, to: date }
                    });
                  }}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between">
            <Button onClick={handleClearFilters} color="secondary">
              Wyczyść wszystkie
            </Button>
            <Box display="flex" gap={1}>
              <Button onClick={handleFilterClose}>
                Anuluj
              </Button>
              <Button variant="contained" onClick={handleApplyFilters}>
                Zastosuj filtry
              </Button>
            </Box>
          </Box>
        </Paper>
      </Popover>
    </Box>
  );
};

export default StudyFilters;
