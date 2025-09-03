export type GoalStatus = 'not_started' | 'in_progress' | 'completed' | 'paused' | 'cancelled';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked' | 'cancelled';
export type MilestoneStatus = 'upcoming' | 'current' | 'completed' | 'overdue';

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  status: GoalStatus;
  priority: GoalPriority;
  progress: number; // 0-100
  target: {
    value: number;
    unit: string;
    description: string;
  };
  current: {
    value: number;
    lastUpdated: string;
  };
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  assignedTo: string[];
  tags: string[];
  milestones: Milestone[];
  tasks: Task[];
  attachments?: Attachment[];
  notes?: string;
}

export interface Task {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: GoalPriority;
  assignedTo: string;
  dueDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  estimatedHours?: number;
  actualHours?: number;
  dependencies?: string[]; // Task IDs that must be completed first
  tags: string[];
  checklist?: ChecklistItem[];
  comments?: Comment[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface Milestone {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  status: MilestoneStatus;
  targetDate: string;
  completedAt?: string;
  progress: number;
  requirements: string[];
  dependencies?: string[]; // Milestone IDs
  rewards?: string[];
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  parentId?: string; // For replies
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface GoalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  defaultDuration: number; // days
  milestoneTemplates: MilestoneTemplate[];
  taskTemplates: TaskTemplate[];
  tags: string[];
}

export interface MilestoneTemplate {
  title: string;
  description: string;
  dayOffset: number; // days from start
  requirements: string[];
}

export interface TaskTemplate {
  title: string;
  description: string;
  priority: GoalPriority;
  estimatedHours: number;
  milestoneId?: string;
  dependencies?: string[];
}

export interface GoalMetrics {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  overdueGoals: number;
  completionRate: number;
  averageCompletionTime: number;
  goalsThisMonth: number;
  goalsThisQuarter: number;
  topCategories: CategoryMetric[];
  monthlyProgress: MonthlyProgress[];
}

export interface CategoryMetric {
  category: string;
  count: number;
  completionRate: number;
  averageProgress: number;
}

export interface MonthlyProgress {
  month: string;
  goalsStarted: number;
  goalsCompleted: number;
  averageProgress: number;
  totalTasks: number;
  completedTasks: number;
}

export interface GoalFilter {
  status?: GoalStatus[];
  priority?: GoalPriority[];
  category?: string[];
  assignedTo?: string[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface CreateGoalData {
  title: string;
  description: string;
  category: string;
  priority: GoalPriority;
  target: {
    value: number;
    unit: string;
    description: string;
  };
  startDate: string;
  endDate: string;
  assignedTo: string[];
  tags: string[];
  templateId?: string;
}

export interface UpdateGoalData extends Partial<CreateGoalData> {
  status?: GoalStatus;
  progress?: number;
  currentValue?: number;
  notes?: string;
}

export interface CreateTaskData {
  goalId: string;
  title: string;
  description?: string;
  priority: GoalPriority;
  assignedTo: string;
  dueDate?: string;
  estimatedHours?: number;
  dependencies?: string[];
  tags: string[];
  checklist?: string[];
}

export interface UpdateTaskData {
  goalId?: string;
  title?: string;
  description?: string;
  priority?: GoalPriority;
  assignedTo?: string;
  dueDate?: string;
  estimatedHours?: number;
  dependencies?: string[];
  tags?: string[];
  status?: TaskStatus;
  actualHours?: number;
  notes?: string;
  checklist?: ChecklistItem[];
}
