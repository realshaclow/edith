import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Stack,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Slider,
  Switch,
  FormControlLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore,
  FilterList,
  Clear,
  Search,
  DateRange,
  Flag,
  Category,
  TrendingUp
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { GoalStatus, GoalPriority } from '../types';

export interface GoalFilters {
  search: string;
  status: GoalStatus[];
  priority: GoalPriority[];
  category: string[];
  assignedTo: string[];
  tags: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  progressRange: [number, number];
  overdue: boolean;
  completionTarget: {
    enabled: boolean;
    operator: 'gte' | 'lte' | 'eq';
    value: number;
  };
}

interface GoalsFiltersProps {
  filters: GoalFilters;
  onFiltersChange: (filters: GoalFilters) => void;
  availableCategories: string[];
  availableTags: string[];
  availableAssignees: string[];
  onReset: () => void;
}

const statusOptions = [
  { value: 'not_started', label: 'Nierozpoczęty', color: '#9e9e9e' },
  { value: 'in_progress', label: 'W trakcie', color: '#2196f3' },
  { value: 'paused', label: 'Wstrzymany', color: '#ff9800' },
  { value: 'completed', label: 'Ukończony', color: '#4caf50' },
  { value: 'cancelled', label: 'Anulowany', color: '#f44336' }
];

const priorityOptions = [
  { value: 'low', label: 'Niski', color: '#4caf50' },
  { value: 'medium', label: 'Średni', color: '#2196f3' },
  { value: 'high', label: 'Wysoki', color: '#ff9800' },
  { value: 'critical', label: 'Krytyczny', color: '#f44336' }
];

const GoalsFilters: React.FC<GoalsFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories,
  availableTags,
  availableAssignees,
  onReset
}) => {
  const [expanded, setExpanded] = useState<string | false>('basic');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const updateFilters = (updates: Partial<GoalFilters>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const toggleArrayFilter = <T extends string>(
    key: keyof Pick<GoalFilters, 'status' | 'priority' | 'category' | 'assignedTo' | 'tags'>,
    value: T
  ) => {
    const current = filters[key] as T[];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilters({ [key]: updated });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status.length > 0) count++;
    if (filters.priority.length > 0) count++;
    if (filters.category.length > 0) count++;
    if (filters.assignedTo.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.progressRange[0] > 0 || filters.progressRange[1] < 100) count++;
    if (filters.overdue) count++;
    if (filters.completionTarget.enabled) count++;
    return count;
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <FilterList />
            <Typography variant="h6">
              Filtry
            </Typography>
            {getActiveFiltersCount() > 0 && (
              <Chip 
                label={getActiveFiltersCount()} 
                size="small" 
                color="primary" 
              />
            )}
          </Box>
          <Tooltip title="Wyczyść wszystkie filtry">
            <IconButton onClick={onReset} size="small">
              <Clear />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Basic Filters */}
        <Accordion expanded={expanded === 'basic'} onChange={handleChange('basic')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <Search />
              <Typography>Podstawowe filtry</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {/* Search */}
              <TextField
                fullWidth
                label="Szukaj celów"
                variant="outlined"
                value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Wpisz tytuł, opis lub tag..."
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              {/* Status Filter */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Status
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {statusOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => toggleArrayFilter('status', option.value as GoalStatus)}
                      variant={filters.status.includes(option.value as GoalStatus) ? 'filled' : 'outlined'}
                      sx={{
                        backgroundColor: filters.status.includes(option.value as GoalStatus) 
                          ? option.color 
                          : 'transparent',
                        color: filters.status.includes(option.value as GoalStatus) 
                          ? 'white' 
                          : option.color,
                        borderColor: option.color
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Priority Filter */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Priorytet
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {priorityOptions.map((option) => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      onClick={() => toggleArrayFilter('priority', option.value as GoalPriority)}
                      variant={filters.priority.includes(option.value as GoalPriority) ? 'filled' : 'outlined'}
                      sx={{
                        backgroundColor: filters.priority.includes(option.value as GoalPriority) 
                          ? option.color 
                          : 'transparent',
                        color: filters.priority.includes(option.value as GoalPriority) 
                          ? 'white' 
                          : option.color,
                        borderColor: option.color
                      }}
                    />
                  ))}
                </Stack>
              </Box>

              {/* Overdue Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.overdue}
                    onChange={(e) => updateFilters({ overdue: e.target.checked })}
                  />
                }
                label="Tylko przekroczone terminy"
              />
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Advanced Filters */}
        <Accordion expanded={expanded === 'advanced'} onChange={handleChange('advanced')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <Category />
              <Typography>Filtry zaawansowane</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {/* Category Filter */}
              <FormControl fullWidth>
                <InputLabel>Kategorie</InputLabel>
                <Select
                  multiple
                  value={filters.category}
                  onChange={(e) => updateFilters({ 
                    category: typeof e.target.value === 'string' 
                      ? [e.target.value] 
                      : e.target.value 
                  })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Assigned To Filter */}
              <FormControl fullWidth>
                <InputLabel>Przypisane do</InputLabel>
                <Select
                  multiple
                  value={filters.assignedTo}
                  onChange={(e) => updateFilters({ 
                    assignedTo: typeof e.target.value === 'string' 
                      ? [e.target.value] 
                      : e.target.value 
                  })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableAssignees.map((assignee) => (
                    <MenuItem key={assignee} value={assignee}>
                      {assignee}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Tags Filter */}
              <FormControl fullWidth>
                <InputLabel>Tagi</InputLabel>
                <Select
                  multiple
                  value={filters.tags}
                  onChange={(e) => updateFilters({ 
                    tags: typeof e.target.value === 'string' 
                      ? [e.target.value] 
                      : e.target.value 
                  })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {availableTags.map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      {tag}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Date and Progress Filters */}
        <Accordion expanded={expanded === 'dateProgress'} onChange={handleChange('dateProgress')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <DateRange />
              <Typography>Daty i postęp</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              {/* Date Range */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Zakres dat
                </Typography>
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    label="Data rozpoczęcia"
                    value={filters.dateRange.start}
                    onChange={(date) => updateFilters({
                      dateRange: { ...filters.dateRange, start: date }
                    })}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <DatePicker
                    label="Data zakończenia"
                    value={filters.dateRange.end}
                    onChange={(date) => updateFilters({
                      dateRange: { ...filters.dateRange, end: date }
                    })}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Stack>
              </Box>

              {/* Progress Range */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Zakres postępu: {filters.progressRange[0]}% - {filters.progressRange[1]}%
                </Typography>
                <Slider
                  value={filters.progressRange}
                  onChange={(_, newValue) => updateFilters({ 
                    progressRange: newValue as [number, number] 
                  })}
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 25, label: '25%' },
                    { value: 50, label: '50%' },
                    { value: 75, label: '75%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Completion Target Filter */}
        <Accordion expanded={expanded === 'completion'} onChange={handleChange('completion')}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center" gap={1}>
              <TrendingUp />
              <Typography>Cel ukończenia</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.completionTarget.enabled}
                    onChange={(e) => updateFilters({
                      completionTarget: { 
                        ...filters.completionTarget, 
                        enabled: e.target.checked 
                      }
                    })}
                  />
                }
                label="Filtruj według celu ukończenia"
              />

              {filters.completionTarget.enabled && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Operator</InputLabel>
                    <Select
                      value={filters.completionTarget.operator}
                      onChange={(e) => updateFilters({
                        completionTarget: {
                          ...filters.completionTarget,
                          operator: e.target.value as 'gte' | 'lte' | 'eq'
                        }
                      })}
                    >
                      <MenuItem value="gte">≥</MenuItem>
                      <MenuItem value="lte">≤</MenuItem>
                      <MenuItem value="eq">=</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    type="number"
                    label="Wartość"
                    value={filters.completionTarget.value}
                    onChange={(e) => updateFilters({
                      completionTarget: {
                        ...filters.completionTarget,
                        value: Number(e.target.value)
                      }
                    })}
                    sx={{ width: 100 }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    jednostek
                  </Typography>
                </Stack>
              )}
            </Stack>
          </AccordionDetails>
        </Accordion>

        {getActiveFiltersCount() > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Button
              variant="outlined"
              color="secondary"
              onClick={onReset}
              startIcon={<Clear />}
              fullWidth
            >
              Wyczyść wszystkie filtry ({getActiveFiltersCount()})
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsFilters;
