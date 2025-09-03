import { useState, useEffect, useCallback } from 'react';
import {
  Goal,
  Task,
  Milestone,
  GoalMetrics,
  GoalFilter,
  CreateGoalData,
  UpdateGoalData,
  CreateTaskData,
  UpdateTaskData,
  GoalStatus,
  TaskStatus,
  GoalPriority
} from '../types';

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [metrics, setMetrics] = useState<GoalMetrics>({
    totalGoals: 0,
    completedGoals: 0,
    inProgressGoals: 0,
    overdueGoals: 0,
    completionRate: 0,
    averageCompletionTime: 0,
    goalsThisMonth: 0,
    goalsThisQuarter: 0,
    topCategories: [],
    monthlyProgress: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate mock data
  const generateMockGoals = useCallback(() => {
    const mockGoals: Goal[] = [
      {
        id: 'goal-1',
        title: 'Zwiększenie efektywności badań',
        description: 'Optymalizacja procesów laboratoryjnych w celu zwiększenia liczby przeprowadzanych badań miesięcznie',
        category: 'Produktywność',
        status: 'in_progress',
        priority: 'high',
        progress: 65,
        target: {
          value: 150,
          unit: 'badań/miesiąc',
          description: 'Docelowa liczba badań miesięcznie'
        },
        current: {
          value: 97,
          lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: ['Jan Kowalski', 'Anna Nowak'],
        tags: ['Q4-2025', 'laboratorium', 'optymalizacja'],
        milestones: [],
        tasks: [],
        notes: 'Kluczowy cel na ten kwartał'
      },
      {
        id: 'goal-2',
        title: 'Implementacja nowych protokołów',
        description: 'Dodanie 10 nowych protokołów badawczych do systemu EDITH',
        category: 'Rozwój',
        status: 'in_progress',
        priority: 'medium',
        progress: 40,
        target: {
          value: 10,
          unit: 'protokołów',
          description: 'Nowe protokoły w systemie'
        },
        current: {
          value: 4,
          lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: ['Tomasz Wiśniewski'],
        tags: ['protokoły', 'rozbudowa', 'system'],
        milestones: [],
        tasks: []
      },
      {
        id: 'goal-3',
        title: 'Redukcja czasu wykonania badań',
        description: 'Skrócenie średniego czasu wykonania badania o 20%',
        category: 'Efektywność',
        status: 'not_started',
        priority: 'high',
        progress: 0,
        target: {
          value: 20,
          unit: '% redukcji',
          description: 'Zmniejszenie czasu wykonania'
        },
        current: {
          value: 0,
          lastUpdated: new Date().toISOString()
        },
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: ['Zespół Lab'],
        tags: ['czas', 'optymalizacja', 'Q1-2026'],
        milestones: [],
        tasks: []
      },
      {
        id: 'goal-4',
        title: 'Szkolenie zespołu',
        description: 'Przeprowadzenie szkoleń z nowych protokołów dla całego zespołu laboratoryjnego',
        category: 'Edukacja',
        status: 'completed',
        priority: 'medium',
        progress: 100,
        target: {
          value: 15,
          unit: 'osób',
          description: 'Przeszkolone osoby'
        },
        current: {
          value: 15,
          lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        assignedTo: ['Maria Kowalczyk'],
        tags: ['szkolenia', 'zespół', 'ukończone'],
        milestones: [],
        tasks: []
      }
    ];

    const mockTasks: Task[] = [
      {
        id: 'task-1',
        goalId: 'goal-1',
        title: 'Analiza obecnych procesów',
        description: 'Mapowanie i dokumentacja aktualnych procesów laboratoryjnych',
        status: 'completed',
        priority: 'high',
        assignedTo: 'Jan Kowalski',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 16,
        actualHours: 18,
        tags: ['analiza', 'procesy'],
        checklist: [
          { id: 'check-1', text: 'Mapowanie procesów badawczych', completed: true },
          { id: 'check-2', text: 'Identyfikacja wąskich gardeł', completed: true },
          { id: 'check-3', text: 'Dokumentacja wyników', completed: true }
        ]
      },
      {
        id: 'task-2',
        goalId: 'goal-1',
        title: 'Optymalizacja harmonogramów',
        description: 'Przeprojektowanie harmonogramów pracy laboratorium',
        status: 'in_progress',
        priority: 'high',
        assignedTo: 'Anna Nowak',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 12,
        actualHours: 8,
        dependencies: ['task-1'],
        tags: ['harmonogramy', 'optymalizacja'],
        checklist: [
          { id: 'check-4', text: 'Analiza obecnych harmonogramów', completed: true },
          { id: 'check-5', text: 'Propozycja nowych rozwiązań', completed: false },
          { id: 'check-6', text: 'Testowanie nowych harmonogramów', completed: false }
        ]
      },
      {
        id: 'task-3',
        goalId: 'goal-2',
        title: 'Badanie protokołów ASTM',
        description: 'Implementacja protokołów ASTM D790 i ASTM D648',
        status: 'pending',
        priority: 'medium',
        assignedTo: 'Tomasz Wiśniewski',
        dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedHours: 24,
        tags: ['ASTM', 'protokoły', 'implementacja'],
        checklist: [
          { id: 'check-7', text: 'Przegląd dokumentacji ASTM D790', completed: false },
          { id: 'check-8', text: 'Implementacja ASTM D790', completed: false },
          { id: 'check-9', text: 'Przegląd dokumentacji ASTM D648', completed: false },
          { id: 'check-10', text: 'Implementacja ASTM D648', completed: false },
          { id: 'check-11', text: 'Testy protokołów', completed: false }
        ]
      }
    ];

    const mockMilestones: Milestone[] = [
      {
        id: 'milestone-1',
        goalId: 'goal-1',
        title: 'Faza analizy zakończona',
        description: 'Ukończenie analizy obecnych procesów i identyfikacja obszarów poprawy',
        status: 'completed',
        targetDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 100,
        requirements: [
          'Pełna dokumentacja procesów',
          'Identyfikacja wąskich gardeł',
          'Plan optymalizacji'
        ]
      },
      {
        id: 'milestone-2',
        goalId: 'goal-1',
        title: 'Implementacja ulepszeń',
        description: 'Wdrożenie zoptymalizowanych procesów w laboratorium',
        status: 'current',
        targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 45,
        requirements: [
          'Nowe harmonogramy wdrożone',
          'Zespół przeszkolony',
          'Pierwsze testy przeprowadzone'
        ],
        dependencies: ['milestone-1']
      },
      {
        id: 'milestone-3',
        goalId: 'goal-2',
        title: 'Pierwsza grupa protokołów',
        description: 'Implementacja pierwszych 5 protokołów',
        status: 'current',
        targetDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 80,
        requirements: [
          '5 protokołów zaimplementowanych',
          'Testy przeprowadzone',
          'Dokumentacja gotowa'
        ]
      }
    ];

    setGoals(mockGoals);
    setTasks(mockTasks);
    setMilestones(mockMilestones);

    // Calculate metrics
    const totalGoals = mockGoals.length;
    const completedGoals = mockGoals.filter(g => g.status === 'completed').length;
    const inProgressGoals = mockGoals.filter(g => g.status === 'in_progress').length;
    const overdueGoals = mockGoals.filter(g => {
      const endDate = new Date(g.endDate);
      const now = new Date();
      return endDate < now && g.status !== 'completed';
    }).length;

    const categoryStats = mockGoals.reduce((acc, goal) => {
      if (!acc[goal.category]) {
        acc[goal.category] = { total: 0, completed: 0, progress: 0 };
      }
      acc[goal.category].total++;
      if (goal.status === 'completed') acc[goal.category].completed++;
      acc[goal.category].progress += goal.progress;
      return acc;
    }, {} as Record<string, { total: number; completed: number; progress: number }>);

    const topCategories = Object.entries(categoryStats).map(([category, stats]) => ({
      category,
      count: stats.total,
      completionRate: (stats.completed / stats.total) * 100,
      averageProgress: stats.progress / stats.total
    }));

    setMetrics({
      totalGoals,
      completedGoals,
      inProgressGoals,
      overdueGoals,
      completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      averageCompletionTime: 45, // Mock average
      goalsThisMonth: mockGoals.filter(g => {
        const created = new Date(g.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
      goalsThisQuarter: mockGoals.filter(g => {
        const created = new Date(g.createdAt);
        const now = new Date();
        const quarter = Math.floor(now.getMonth() / 3);
        const goalQuarter = Math.floor(created.getMonth() / 3);
        return goalQuarter === quarter && created.getFullYear() === now.getFullYear();
      }).length,
      topCategories,
      monthlyProgress: [] // Would be populated with historical data
    });
  }, []);

  // CRUD Operations
  const createGoal = useCallback(async (data: CreateGoalData): Promise<Goal> => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      ...data,
      status: 'not_started',
      progress: 0,
      current: {
        value: 0,
        lastUpdated: new Date().toISOString()
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      milestones: [],
      tasks: []
    };

    setGoals(prev => [...prev, newGoal]);
    return newGoal;
  }, []);

  const updateGoal = useCallback(async (id: string, data: UpdateGoalData): Promise<Goal | null> => {
    setGoals(prev => prev.map(goal => 
      goal.id === id 
        ? { 
            ...goal, 
            ...data, 
            updatedAt: new Date().toISOString(),
            current: data.progress !== undefined 
              ? { ...goal.current, value: data.currentValue || goal.current.value, lastUpdated: new Date().toISOString() }
              : goal.current
          }
        : goal
    ));

    return goals.find(g => g.id === id) || null;
  }, [goals]);

  const deleteGoal = useCallback(async (id: string): Promise<boolean> => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    setTasks(prev => prev.filter(task => task.goalId !== id));
    setMilestones(prev => prev.filter(milestone => milestone.goalId !== id));
    return true;
  }, []);

  const createTask = useCallback(async (data: CreateTaskData): Promise<Task> => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: data.tags || [],
      checklist: data.checklist?.map((text, index) => ({
        id: `check-${Date.now()}-${index}`,
        text,
        completed: false
      })) || []
    };

    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, []);

  const updateTask = useCallback(async (id: string, data: UpdateTaskData): Promise<Task | null> => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const updatedTask: Task = {
          ...task,
          ...data,
          updatedAt: new Date().toISOString(),
          completedAt: data.status === 'completed' ? new Date().toISOString() : task.completedAt
        };
        return updatedTask;
      }
      return task;
    }));

    return tasks.find(t => t.id === id) || null;
  }, [tasks]);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    setTasks(prev => prev.filter(task => task.id !== id));
    return true;
  }, []);

  // Filter and search
  const filterGoals = useCallback((filter: GoalFilter) => {
    return goals.filter(goal => {
      if (filter.status && !filter.status.includes(goal.status)) return false;
      if (filter.priority && !filter.priority.includes(goal.priority)) return false;
      if (filter.category && !filter.category.includes(goal.category)) return false;
      if (filter.assignedTo && !filter.assignedTo.some(user => goal.assignedTo.includes(user))) return false;
      if (filter.tags && !filter.tags.some(tag => goal.tags.includes(tag))) return false;
      if (filter.search) {
        const search = filter.search.toLowerCase();
        if (!goal.title.toLowerCase().includes(search) && 
            !goal.description.toLowerCase().includes(search)) return false;
      }
      if (filter.dateRange) {
        const start = new Date(filter.dateRange.start);
        const end = new Date(filter.dateRange.end);
        const goalStart = new Date(goal.startDate);
        const goalEnd = new Date(goal.endDate);
        if (goalEnd < start || goalStart > end) return false;
      }
      return true;
    });
  }, [goals]);

  // Initialize data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    try {
      generateMockGoals();
    } catch (err) {
      setError('Nie udało się załadować celów');
    } finally {
      setIsLoading(false);
    }
  }, [generateMockGoals]);

  return {
    // Data
    goals,
    tasks,
    milestones,
    metrics,
    isLoading,
    error,
    
    // CRUD Operations
    createGoal,
    updateGoal,
    deleteGoal,
    createTask,
    updateTask,
    deleteTask,
    
    // Utilities
    filterGoals
  };
};
