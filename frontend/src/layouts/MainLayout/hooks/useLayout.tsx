import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  Dashboard,
  Flag,
  Science,
  Assignment,
  BarChart,
  Settings,
  Person,
  Logout,
  Notifications,
  Help,
  Security,
  Palette,
  Language
} from '@mui/icons-material';
import { useAuthContext } from '../../../pages/Auth';
import {
  LayoutContextType,
  LayoutState,
  LayoutSettings,
  NavigationSection,
  UserMenuAction,
  NotificationItem
} from '../types';

// Layout reducer
type LayoutAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'COLLAPSE_SIDEBAR' }
  | { type: 'EXPAND_SIDEBAR' }
  | { type: 'TOGGLE_USER_MENU' }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_SEARCH' }
  | { type: 'SET_MOBILE_OPEN'; payload: boolean }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<LayoutSettings> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

const layoutReducer = (state: LayoutState & { settings: LayoutSettings; notifications: NotificationItem[] }, action: LayoutAction) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    
    case 'COLLAPSE_SIDEBAR':
      return { ...state, sidebarCollapsed: true };
    
    case 'EXPAND_SIDEBAR':
      return { ...state, sidebarCollapsed: false };
    
    case 'TOGGLE_USER_MENU':
      return { ...state, userMenuOpen: !state.userMenuOpen };
    
    case 'TOGGLE_NOTIFICATIONS':
      return { 
        ...state, 
        notificationsOpen: !state.notificationsOpen,
        showNotifications: !state.showNotifications 
      };
    
    case 'TOGGLE_SEARCH':
      return { ...state, searchOpen: !state.searchOpen };
    
    case 'SET_MOBILE_OPEN':
      return { ...state, mobileOpen: action.payload };
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload }
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        )
      };
    
    case 'DELETE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification =>
          notification.id !== action.payload
        )
      };
    
    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: []
      };
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  sidebarOpen: true,
  sidebarCollapsed: false,
  userMenuOpen: false,
  notificationsOpen: false,
  showNotifications: false,
  searchOpen: false,
  mobileOpen: false,
  settings: {
    theme: 'light' as const,
    sidebarPosition: 'left' as const,
    sidebarBehavior: 'push' as const,
    headerFixed: true,
    sidebarFixed: true,
    footerFixed: false,
    animations: true,
    direction: 'ltr' as const,
  },
  notifications: [
    {
      id: '1',
      title: 'Nowe badanie',
      message: 'Protokół ASTM-D638 został zaktualizowany',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 300000),
      read: false,
      link: '/protocols'
    },
    {
      id: '2',
      title: 'Cel ukończony',
      message: 'Cel "Analiza próbek" został pomyślnie ukończony',
      type: 'success' as const,
      timestamp: new Date(Date.now() - 900000),
      read: false,
      link: '/goals'
    },
    {
      id: '3',
      title: 'Błąd systemu',
      message: 'Wykryto problem z połączeniem bazy danych',
      type: 'error' as const,
      timestamp: new Date(Date.now() - 1800000),
      read: true
    }
  ] as NotificationItem[]
};

// Navigation configuration
const getNavigationSections = (): NavigationSection[] => [
  {
    id: 'main',
    title: 'Główne',
    items: [
      {
        id: 'dashboard',
        title: 'Panel główny',
        path: '/',
        icon: <Dashboard />
      },
      {
        id: 'goals',
        title: 'Cele',
        path: '/goals',
        icon: <Flag />,
        badge: { count: 3, color: 'primary' }
      }
    ]
  },
  {
    id: 'research',
    title: 'Badania',
    items: [
      {
        id: 'protocols',
        title: 'Protokoły',
        path: '/protocols',
        icon: <Science />
      },
      {
        id: 'studies',
        title: 'Badania',
        path: '/studies',
        icon: <Assignment />,
        badge: { count: 12, color: 'info' }
      },
      {
        id: 'statistics',
        title: 'Statystyki',
        path: '/statistics',
        icon: <BarChart />
      }
    ]
  },
  {
    id: 'system',
    title: 'System',
    items: [
      {
        id: 'settings',
        title: 'Ustawienia',
        path: '/settings',
        icon: <Settings />,
        permissions: ['settings:read']
      }
    ]
  }
];

// User menu actions
const getUserMenuActions = (logout: () => void): UserMenuAction[] => [
  {
    id: 'profile',
    title: 'Profil użytkownika',
    icon: <Person />,
    action: () => console.log('Profile clicked')
  },
  {
    id: 'preferences',
    title: 'Preferencje',
    icon: <Palette />,
    action: () => console.log('Preferences clicked')
  },
  {
    id: 'security',
    title: 'Bezpieczeństwo',
    icon: <Security />,
    action: () => console.log('Security clicked')
  },
  {
    id: 'language',
    title: 'Język',
    icon: <Language />,
    action: () => console.log('Language clicked')
  },
  {
    id: 'help',
    title: 'Pomoc',
    icon: <Help />,
    action: () => console.log('Help clicked'),
    divider: true
  },
  {
    id: 'logout',
    title: 'Wyloguj się',
    icon: <Logout />,
    action: logout,
    color: 'error'
  }
];

// Context
const LayoutContext = createContext<LayoutContextType | null>(null);

export const LayoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { logout } = useAuthContext();
  
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      dispatch({ type: 'SET_MOBILE_OPEN', payload: false });
      dispatch({ type: 'COLLAPSE_SIDEBAR' });
    } else {
      dispatch({ type: 'EXPAND_SIDEBAR' });
    }
  }, [isMobile]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('layout-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
      } catch (error) {
        console.error('Failed to load layout settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage
  const updateSettings = useCallback((newSettings: Partial<LayoutSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
    
    const updatedSettings = { ...state.settings, ...newSettings };
    localStorage.setItem('layout-settings', JSON.stringify(updatedSettings));
  }, [state.settings]);

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      dispatch({ type: 'SET_MOBILE_OPEN', payload: !state.mobileOpen });
    } else {
      dispatch({ type: 'TOGGLE_SIDEBAR' });
    }
  }, [isMobile, state.mobileOpen]);

  const collapseSidebar = useCallback(() => {
    dispatch({ type: 'COLLAPSE_SIDEBAR' });
  }, []);

  const expandSidebar = useCallback(() => {
    dispatch({ type: 'EXPAND_SIDEBAR' });
  }, []);

  const toggleUserMenu = useCallback(() => {
    dispatch({ type: 'TOGGLE_USER_MENU' });
  }, []);

  const toggleNotifications = useCallback(() => {
    dispatch({ type: 'TOGGLE_NOTIFICATIONS' });
  }, []);

  const toggleSearch = useCallback(() => {
    dispatch({ type: 'TOGGLE_SEARCH' });
  }, []);

  const setMobileOpen = useCallback((open: boolean) => {
    dispatch({ type: 'SET_MOBILE_OPEN', payload: open });
  }, []);

  const markNotificationAsRead = useCallback((id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  }, []);

  const deleteNotification = useCallback((id: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  }, []);

  const contextValue: LayoutContextType = {
    state: {
      sidebarOpen: state.sidebarOpen,
      sidebarCollapsed: state.sidebarCollapsed,
      userMenuOpen: state.userMenuOpen,
      notificationsOpen: state.notificationsOpen,
      showNotifications: state.showNotifications,
      searchOpen: state.searchOpen,
      mobileOpen: state.mobileOpen
    },
    settings: state.settings,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    toggleUserMenu,
    toggleNotifications,
    toggleSearch,
    setMobileOpen,
    updateSettings,
    navigation: getNavigationSections(),
    userMenuActions: getUserMenuActions(logout),
    notifications: state.notifications,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
