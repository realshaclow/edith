import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Add,
  Flag,
  BarChart,
  FilterList,
  ViewModule,
  ViewList,
  Timeline
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useGoals } from './hooks/useGoals';
import GoalsOverview from './components/widgets/GoalsOverview';
import GoalsStats from './components/widgets/GoalsStats';
import GoalsFilters, { GoalFilters } from './components/GoalsFilters';
import { Goal, GoalStatus, GoalPriority } from './types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`goals-tabpanel-${index}`}
      aria-labelledby={`goals-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const initialFilters: GoalFilters = {
  search: '',
  status: [],
  priority: [],
  category: [],
  assignedTo: [],
  tags: [],
  dateRange: {
    start: null,
    end: null
  },
  progressRange: [0, 100],
  overdue: false,
  completionTarget: {
    enabled: false,
    operator: 'gte',
    value: 0
  }
};

const Goals: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [filters, setFilters] = useState<GoalFilters>(initialFilters);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // New goal form state
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as GoalPriority,
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    targetValue: 0,
    targetUnit: '',
    tags: [] as string[],
    assignedTo: [] as string[]
  });

  const {
    goals,
    isLoading,
    error,
    createGoal,
    updateGoal,
    deleteGoal
  } = useGoals();

  // Filter goals based on current filters
  const filteredGoals = useMemo(() => {
    return goals.filter(goal => {
      // Search filter
      if (filters.search && !goal.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !goal.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !goal.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(goal.status)) {
        return false;
      }

      // Priority filter
      if (filters.priority.length > 0 && !filters.priority.includes(goal.priority)) {
        return false;
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(goal.category)) {
        return false;
      }

      // Assigned to filter
      if (filters.assignedTo.length > 0 && 
          !filters.assignedTo.some(assignee => goal.assignedTo.includes(assignee))) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0 && 
          !filters.tags.some(tag => goal.tags.includes(tag))) {
        return false;
      }

      // Date range filter
      const goalStartDate = new Date(goal.startDate);
      const goalEndDate = new Date(goal.endDate);
      
      if (filters.dateRange.start && goalStartDate < filters.dateRange.start) {
        return false;
      }
      
      if (filters.dateRange.end && goalEndDate > filters.dateRange.end) {
        return false;
      }

      // Progress range filter
      if (goal.progress < filters.progressRange[0] || goal.progress > filters.progressRange[1]) {
        return false;
      }

      // Overdue filter
      if (filters.overdue) {
        const now = new Date();
        const endDate = new Date(goal.endDate);
        const isOverdue = endDate < now && goal.status !== 'completed';
        if (!isOverdue) {
          return false;
        }
      }

      // Completion target filter
      if (filters.completionTarget.enabled) {
        const { operator, value } = filters.completionTarget;
        const currentValue = goal.current.value;
        
        switch (operator) {
          case 'gte':
            if (currentValue < value) return false;
            break;
          case 'lte':
            if (currentValue > value) return false;
            break;
          case 'eq':
            if (currentValue !== value) return false;
            break;
        }
      }

      return true;
    });
  }, [goals, filters]);

  // Get unique values for filter options
  const availableCategories = useMemo(() => 
    [...new Set(goals.map(goal => goal.category))], [goals]);
  
  const availableTags = useMemo(() => 
    [...new Set(goals.flatMap(goal => goal.tags))], [goals]);
  
  const availableAssignees = useMemo(() => 
    [...new Set(goals.flatMap(goal => goal.assignedTo))], [goals]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleCreateGoal = async () => {
    try {
      await createGoal({
        title: newGoal.title,
        description: newGoal.description,
        category: newGoal.category,
        priority: newGoal.priority,
        startDate: newGoal.startDate.toISOString(),
        endDate: newGoal.endDate.toISOString(),
        target: {
          value: newGoal.targetValue,
          unit: newGoal.targetUnit,
          description: `Cel: ${newGoal.targetValue} ${newGoal.targetUnit}`
        },
        tags: newGoal.tags,
        assignedTo: newGoal.assignedTo
      });

      setCreateDialogOpen(false);
      setNewGoal({
        title: '',
        description: '',
        category: '',
        priority: 'medium',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        targetValue: 0,
        targetUnit: '',
        tags: [],
        assignedTo: []
      });

      setSnackbar({
        open: true,
        message: 'Cel został utworzony pomyślnie!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Błąd podczas tworzenia celu',
        severity: 'error'
      });
    }
  };

  const handleUpdateGoalStatus = async (goalId: string, status: GoalStatus) => {
    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      await updateGoal(goalId, { status });
      
      setSnackbar({
        open: true,
        message: 'Status celu został zaktualizowany!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Błąd podczas aktualizacji statusu',
        severity: 'error'
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten cel?')) {
      try {
        await deleteGoal(goalId);
        setSnackbar({
          open: true,
          message: 'Cel został usunięty!',
          severity: 'success'
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Błąd podczas usuwania celu',
          severity: 'error'
        });
      }
    }
  };

  const addTag = (tag: string) => {
    if (tag && !newGoal.tags.includes(tag)) {
      setNewGoal({ ...newGoal, tags: [...newGoal.tags, tag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewGoal({ 
      ...newGoal, 
      tags: newGoal.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          Błąd podczas ładowania celów: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Cele i zadania
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Zarządzaj swoimi celami, zadaniami i kamieniami milowymi
          </Typography>
        </Box>
        
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtry
          </Button>
          
          <Button
            variant="outlined"
            startIcon={viewMode === 'grid' ? <ViewList /> : <ViewModule />}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? 'Lista' : 'Siatka'}
          </Button>
        </Stack>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<ViewModule />} label="Przegląd celów" />
          <Tab icon={<BarChart />} label="Statystyki" />
          <Tab icon={<Timeline />} label="Harmonogram" />
        </Tabs>
      </Card>

      {/* Filters */}
      {showFilters && (
        <Box mb={3}>
          <GoalsFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableCategories={availableCategories}
            availableTags={availableTags}
            availableAssignees={availableAssignees}
            onReset={() => setFilters(initialFilters)}
          />
        </Box>
      )}

      {/* Tab Content */}
      <TabPanel value={currentTab} index={0}>
        <GoalsOverview
          goals={filteredGoals}
          isLoading={isLoading}
          onGoalClick={(goalId) => console.log('Goal clicked:', goalId)}
          onEditGoal={(goalId) => console.log('Edit goal:', goalId)}
          onDeleteGoal={handleDeleteGoal}
          onUpdateStatus={handleUpdateGoalStatus}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={1}>
        <GoalsStats
          goals={filteredGoals}
          isLoading={isLoading}
        />
      </TabPanel>

      <TabPanel value={currentTab} index={2}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Timeline sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Harmonogram w budowie
            </Typography>
            <Typography color="text.secondary">
              Ta funkcja będzie dostępna wkrótce
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add goal"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setCreateDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* Create Goal Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Utwórz nowy cel</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Tytuł celu"
              value={newGoal.title}
              onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
            />
            
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Opis"
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Kategoria"
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Priorytet</InputLabel>
                  <Select
                    value={newGoal.priority}
                    onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as GoalPriority })}
                  >
                    <MenuItem value="low">Niski</MenuItem>
                    <MenuItem value="medium">Średni</MenuItem>
                    <MenuItem value="high">Wysoki</MenuItem>
                    <MenuItem value="critical">Krytyczny</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data rozpoczęcia"
                  value={newGoal.startDate}
                  onChange={(date) => date && setNewGoal({ ...newGoal, startDate: date })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Data zakończenia"
                  value={newGoal.endDate}
                  onChange={(date) => date && setNewGoal({ ...newGoal, endDate: date })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
            </Grid>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Wartość docelowa"
                  value={newGoal.targetValue}
                  onChange={(e) => setNewGoal({ ...newGoal, targetValue: Number(e.target.value) })}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Jednostka"
                  value={newGoal.targetUnit}
                  onChange={(e) => setNewGoal({ ...newGoal, targetUnit: e.target.value })}
                  placeholder="np. sztuki, godziny, punkty"
                />
              </Grid>
            </Grid>
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Tagi
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
                {newGoal.tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    size="small"
                  />
                ))}
              </Box>
              <TextField
                size="small"
                placeholder="Dodaj tag i naciśnij Enter"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const target = e.target as HTMLInputElement;
                    addTag(target.value);
                    target.value = '';
                  }
                }}
              />
            </Box>
          </Stack>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Anuluj
          </Button>
          <Button 
            onClick={handleCreateGoal}
            variant="contained"
            disabled={!newGoal.title || !newGoal.category}
          >
            Utwórz cel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Goals;
