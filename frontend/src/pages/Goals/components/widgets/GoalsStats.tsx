import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Box,
  Typography,
  LinearProgress,
  Divider,
  Chip,
  Avatar,
  Stack
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Flag,
  Assignment,
  CheckCircle,
  Schedule,
  PlayArrow,
  Pause,
  Cancel,
  NotStarted
} from '@mui/icons-material';
import { Goal, GoalStatus, GoalPriority } from '../../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface GoalsStatsProps {
  goals: Goal[];
  isLoading: boolean;
}

const statusColors = {
  completed: '#4caf50',
  in_progress: '#2196f3',
  paused: '#ff9800',
  cancelled: '#f44336',
  not_started: '#9e9e9e'
};

const statusIcons = {
  completed: CheckCircle,
  in_progress: PlayArrow,
  paused: Pause,
  cancelled: Cancel,
  not_started: NotStarted
};

const priorityColors = {
  critical: '#f44336',
  high: '#ff9800',
  medium: '#2196f3',
  low: '#4caf50'
};

const StatCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number;
  color?: string;
  icon?: React.ReactNode;
}> = ({ title, value, subtitle, trend, color, icon }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        {icon && (
          <Avatar sx={{ bgcolor: color || 'primary.main', width: 40, height: 40 }}>
            {icon}
          </Avatar>
        )}
      </Box>
      
      <Typography variant="h4" component="div" fontWeight="bold" color={color || 'primary.main'}>
        {value}
      </Typography>
      
      {subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {subtitle}
        </Typography>
      )}
      
      {trend !== undefined && (
        <Box display="flex" alignItems="center" mt={1}>
          {trend > 0 ? (
            <TrendingUp color="success" sx={{ fontSize: 20, mr: 0.5 }} />
          ) : trend < 0 ? (
            <TrendingDown color="error" sx={{ fontSize: 20, mr: 0.5 }} />
          ) : null}
          <Typography 
            variant="caption" 
            color={trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary'}
            fontWeight="medium"
          >
            {trend > 0 ? '+' : ''}{trend}% vs poprzedni miesiąc
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

const GoalsStats: React.FC<GoalsStatsProps> = ({ goals, isLoading }) => {
  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[...Array(8)].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box height={120} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  // Calculate statistics
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'completed').length;
  const activeGoals = goals.filter(g => g.status === 'in_progress').length;
  const overdue = goals.filter(g => {
    const endDate = new Date(g.endDate);
    const now = new Date();
    return endDate < now && g.status !== 'completed';
  }).length;

  const completionRate = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;
  const averageProgress = totalGoals > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / totalGoals) : 0;

  // Goals by status for pie chart
  const statusData = Object.entries(
    goals.reduce((acc, goal) => {
      acc[goal.status] = (acc[goal.status] || 0) + 1;
      return acc;
    }, {} as Record<GoalStatus, number>)
  ).map(([status, count]) => ({
    name: status,
    value: count,
    color: statusColors[status as GoalStatus]
  }));

  // Goals by priority
  const priorityData = Object.entries(
    goals.reduce((acc, goal) => {
      acc[goal.priority] = (acc[goal.priority] || 0) + 1;
      return acc;
    }, {} as Record<GoalPriority, number>)
  ).map(([priority, count]) => ({
    name: priority,
    value: count,
    color: priorityColors[priority as GoalPriority]
  }));

  // Goals by category
  const categoryData = Object.entries(
    goals.reduce((acc, goal) => {
      acc[goal.category] = (acc[goal.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([category, count]) => ({
    name: category,
    value: count
  }));

  // Monthly progress data (mock data for demonstration)
  const monthlyProgressData = [
    { month: 'Sty', created: 5, completed: 3 },
    { month: 'Lut', created: 8, completed: 6 },
    { month: 'Mar', created: 6, completed: 4 },
    { month: 'Kwi', created: 10, completed: 8 },
    { month: 'Maj', created: 7, completed: 5 },
    { month: 'Cze', created: 9, completed: 7 }
  ];

  // Upcoming deadlines
  const upcomingDeadlines = goals
    .filter(g => g.status !== 'completed' && g.status !== 'cancelled')
    .map(g => ({
      ...g,
      daysRemaining: Math.ceil((new Date(g.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .slice(0, 5);

  return (
    <Grid container spacing={3}>
      {/* Main Stats */}
      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Wszystkie cele"
          value={totalGoals}
          subtitle={`${activeGoals} aktywnych`}
          trend={12}
          color="primary.main"
          icon={<Flag />}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Ukończone"
          value={completedGoals}
          subtitle={`${completionRate}% wskaźnik ukończenia`}
          trend={8}
          color="success.main"
          icon={<CheckCircle />}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Średni postęp"
          value={`${averageProgress}%`}
          subtitle="Wszystkich celów"
          trend={-2}
          color="info.main"
          icon={<TrendingUp />}
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <StatCard
          title="Przekroczone"
          value={overdue}
          subtitle="Wymagają uwagi"
          trend={-15}
          color="error.main"
          icon={<Schedule />}
        />
      </Grid>

      {/* Status Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Rozkład statusów" />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box mt={2}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {statusData.map((item, index) => {
                  const Icon = statusIcons[item.name as GoalStatus];
                  return (
                    <Chip
                      key={index}
                      icon={<Icon />}
                      label={`${item.name}: ${item.value}`}
                      sx={{ backgroundColor: item.color, color: 'white' }}
                      size="small"
                    />
                  );
                })}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Priority Distribution */}
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Rozkład priorytetów" />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Monthly Progress */}
      <Grid item xs={12} md={8}>
        <Card>
          <CardHeader title="Postęp miesięczny" />
          <CardContent>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="created" fill="#2196f3" name="Utworzone" />
                  <Bar dataKey="completed" fill="#4caf50" name="Ukończone" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Upcoming Deadlines */}
      <Grid item xs={12} md={4}>
        <Card>
          <CardHeader title="Nadchodzące terminy" />
          <CardContent>
            {upcomingDeadlines.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                Brak nadchodzących terminów
              </Typography>
            ) : (
              <Stack spacing={2}>
                {upcomingDeadlines.map((goal, index) => (
                  <Box key={goal.id}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="body2" fontWeight="medium" noWrap>
                          {goal.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {goal.category}
                        </Typography>
                      </Box>
                      <Chip
                        label={
                          goal.daysRemaining === 0 ? 'Dziś' :
                          goal.daysRemaining === 1 ? 'Jutro' :
                          goal.daysRemaining < 0 ? `${Math.abs(goal.daysRemaining)}d spóźnienia` :
                          `${goal.daysRemaining}d`
                        }
                        color={
                          goal.daysRemaining < 0 ? 'error' :
                          goal.daysRemaining <= 1 ? 'warning' : 'default'
                        }
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={goal.progress}
                      sx={{ mt: 1, height: 4, borderRadius: 2 }}
                    />
                    {index < upcomingDeadlines.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Categories Overview */}
      <Grid item xs={12}>
        <Card>
          <CardHeader title="Cele według kategorii" />
          <CardContent>
            <Grid container spacing={2}>
              {categoryData.map((category, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Box textAlign="center" p={2} sx={{ backgroundColor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {category.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.name}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default GoalsStats;
