import { Study, StudyStatus } from '../../../../types';
import { StudyFilterOptions, StudySortField, StudyListStats } from '../types';

export const sortStudies = (studies: Study[], sortBy: StudySortField, order: 'asc' | 'desc'): Study[] => {
  return [...studies].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy.field) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'category':
        aValue = a.category || '';
        bValue = b.category || '';
        break;
      case 'protocol':
        aValue = a.protocolName || a.protocolId || '';
        bValue = b.protocolName || b.protocolId || '';
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterStudies = (studies: Study[], filters: StudyFilterOptions): Study[] => {
  return studies.filter(study => {
    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(study.status)) {
        return false;
      }
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!study.category || !filters.category.includes(study.category)) {
        return false;
      }
    }

    // Protocol filter
    if (filters.protocol && filters.protocol.length > 0) {
      const studyProtocol = study.protocolName || study.protocolId || '';
      if (!filters.protocol.some(p => studyProtocol.includes(p))) {
        return false;
      }
    }

    // Created by filter
    if (filters.createdBy && filters.createdBy.length > 0) {
      if (!study.createdBy || !filters.createdBy.includes(study.createdBy)) {
        return false;
      }
    }

    // Date range filter
    if (filters.dateRange) {
      const studyDate = new Date(study.createdAt);
      if (filters.dateRange.from && studyDate < filters.dateRange.from) {
        return false;
      }
      if (filters.dateRange.to && studyDate > filters.dateRange.to) {
        return false;
      }
    }

    // Search query filter
    if (filters.searchQuery && filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      const searchableText = [
        study.name,
        study.description,
        study.category,
        study.protocolName,
        study.protocolId,
        study.createdBy
      ].filter(Boolean).join(' ').toLowerCase();

      if (!searchableText.includes(query)) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      // Assume studies have tags property (extend Study type if needed)
      const studyTags = (study as any).tags || [];
      if (!filters.tags.some(tag => studyTags.includes(tag))) {
        return false;
      }
    }

    return true;
  });
};

export const groupStudies = (studies: Study[], groupBy: string) => {
  return studies.reduce((groups, study) => {
    let key: string;

    switch (groupBy) {
      case 'status':
        key = getStatusLabel(study.status);
        break;
      case 'category':
        key = study.category || 'Bez kategorii';
        break;
      case 'protocol':
        key = study.protocolName || study.protocolId || 'Bez protokołu';
        break;
      case 'createdBy':
        key = study.createdBy || 'Nieznany';
        break;
      case 'month':
        key = new Date(study.createdAt).toLocaleDateString('pl-PL', { 
          year: 'numeric', 
          month: 'long' 
        });
        break;
      default:
        key = 'Wszystkie';
    }

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(study);
    return groups;
  }, {} as Record<string, Study[]>);
};

export const calculateStudyStats = (studies: Study[]): StudyListStats => {
  const stats: StudyListStats = {
    total: studies.length,
    byStatus: {
      [StudyStatus.DRAFT]: 0,
      [StudyStatus.ACTIVE]: 0,
      [StudyStatus.COMPLETED]: 0,
      [StudyStatus.PAUSED]: 0,
    },
    byCategory: {},
    byProtocol: {},
    recentActivity: {
      created: 0,
      updated: 0,
      executed: 0
    }
  };

  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  studies.forEach(study => {
    // Count by status
    stats.byStatus[study.status]++;

    // Count by category
    const category = study.category || 'Bez kategorii';
    stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;

    // Count by protocol
    const protocol = study.protocolName || study.protocolId || 'Bez protokołu';
    stats.byProtocol[protocol] = (stats.byProtocol[protocol] || 0) + 1;

    // Recent activity
    const createdAt = new Date(study.createdAt);
    const updatedAt = new Date(study.updatedAt);

    if (createdAt >= lastWeek) {
      stats.recentActivity.created++;
    }
    if (updatedAt >= lastWeek) {
      stats.recentActivity.updated++;
    }
    if (study.status === StudyStatus.COMPLETED && updatedAt >= lastWeek) {
      stats.recentActivity.executed++;
    }
  });

  return stats;
};

export const getStatusColor = (status: StudyStatus): 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status) {
    case StudyStatus.DRAFT: return 'secondary';
    case StudyStatus.ACTIVE: return 'success';
    case StudyStatus.COMPLETED: return 'info';
    case StudyStatus.PAUSED: return 'warning';
    default: return 'secondary';
  }
};

export const getStatusLabel = (status: StudyStatus): string => {
  switch (status) {
    case StudyStatus.DRAFT: return 'Szkic';
    case StudyStatus.ACTIVE: return 'Aktywne';
    case StudyStatus.COMPLETED: return 'Zakończone';
    case StudyStatus.PAUSED: return 'Wstrzymane';
    default: return status;
  }
};

export const getStatusIcon = (status: StudyStatus) => {
  switch (status) {
    case StudyStatus.DRAFT: return '📝';
    case StudyStatus.ACTIVE: return '▶️';
    case StudyStatus.COMPLETED: return '✅';
    case StudyStatus.PAUSED: return '⏸️';
    default: return '❓';
  }
};

export const getCategoryColor = (category: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  
  const hash = category.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 7) {
    return date.toLocaleDateString('pl-PL');
  } else if (diffDays > 0) {
    return `${diffDays} dni temu`;
  } else if (diffHours > 0) {
    return `${diffHours} godzin temu`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minut temu`;
  } else {
    return 'Przed chwilą';
  }
};

export const exportStudiesToCSV = (studies: Study[]): string => {
  const headers = ['Nazwa', 'Status', 'Kategoria', 'Protokół', 'Utworzono', 'Zaktualizowano', 'Utworzył'];
  const rows = studies.map(study => [
    study.name,
    getStatusLabel(study.status),
    study.category || '',
    study.protocolName || study.protocolId || '',
    new Date(study.createdAt).toLocaleDateString('pl-PL'),
    new Date(study.updatedAt).toLocaleDateString('pl-PL'),
    study.createdBy || ''
  ]);

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return csvContent;
};

export const generateStudyId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `study_${timestamp}_${random}`;
};

export const validateStudyData = (study: Partial<Study>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!study.name || study.name.trim().length === 0) {
    errors.push('Nazwa badania jest wymagana');
  }

  if (study.name && study.name.length > 100) {
    errors.push('Nazwa badania nie może być dłuższa niż 100 znaków');
  }

  if (!study.protocolId && !study.protocolName) {
    errors.push('Protokół badania jest wymagany');
  }

  if (study.description && study.description.length > 1000) {
    errors.push('Opis badania nie może być dłuższy niż 1000 znaków');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const duplicateStudy = (study: Study): Partial<Study> => {
  const timestamp = new Date().toISOString();
  
  return {
    name: `${study.name} (kopia)`,
    description: study.description,
    protocolId: study.protocolId,
    protocolName: study.protocolName,
    category: study.category,
    status: StudyStatus.DRAFT,
    settings: study.settings,
    createdAt: timestamp,
    updatedAt: timestamp
  };
};
