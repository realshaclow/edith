import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Stack
} from '@mui/material';
import {
  Clear as ClearIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { ProtocolFilters } from '../types';

interface ProtocolFiltersBarProps {
  filters: ProtocolFilters;
  onFiltersChange: (filters: ProtocolFilters) => void;
  categories: string[];
  difficulties: string[];
}

const ProtocolFiltersBar: React.FC<ProtocolFiltersBarProps> = ({
  filters,
  onFiltersChange,
  categories,
  difficulties
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      search: event.target.value
    });
  };

  const handleCategoryChange = (event: any) => {
    onFiltersChange({
      ...filters,
      category: event.target.value || undefined
    });
  };

  const handleDifficultyChange = (event: any) => {
    onFiltersChange({
      ...filters,
      difficulty: event.target.value || undefined
    });
  };

  const handleTypeChange = (event: any) => {
    onFiltersChange({
      ...filters,
      type: event.target.value || undefined
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Boolean(
    filters.search || filters.category || filters.difficulty || filters.type
  );

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.category) count++;
    if (filters.difficulty) count++;
    if (filters.type) count++;
    return count;
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon color="action" />
          <TextField
            label="Szukaj protokołów"
            variant="outlined"
            size="small"
            value={filters.search || ''}
            onChange={handleSearchChange}
            placeholder="Szukaj po tytule, opisie lub kategorii..."
            sx={{ minWidth: 300 }}
          />
        </Box>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Kategoria</InputLabel>
          <Select
            value={filters.category || ''}
            onChange={handleCategoryChange}
            label="Kategoria"
          >
            <MenuItem value="">Wszystkie kategorie</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Poziom</InputLabel>
          <Select
            value={filters.difficulty || ''}
            onChange={handleDifficultyChange}
            label="Poziom"
          >
            <MenuItem value="">Wszystkie poziomy</MenuItem>
            {difficulties.map((difficulty) => (
              <MenuItem key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Typ</InputLabel>
          <Select
            value={filters.type || ''}
            onChange={handleTypeChange}
            label="Typ"
          >
            <MenuItem value="">Wszystkie typy</MenuItem>
            <MenuItem value="PREDEFINED">Predefiniowane</MenuItem>
            <MenuItem value="USER">Utworzone przez użytkownika</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
          {hasActiveFilters && (
            <>
              <Chip
                label={`${getActiveFiltersCount()} filtr${getActiveFiltersCount() > 1 ? 'y' : ''} aktywne`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Tooltip title="Wyczyść wszystkie filtry">
                <IconButton onClick={clearFilters} size="small">
                  <ClearIcon />
                </IconButton>
              </Tooltip>
            </>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default ProtocolFiltersBar;
