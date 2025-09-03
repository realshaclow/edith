export interface NavigationItem {
  id: string;
  title: string;
  path: string;
  icon?: React.ReactNode;
  badge?: {
    count: number;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  };
  children?: NavigationItem[];
  permissions?: string[];
  external?: boolean;
  divider?: boolean;
  section?: string;
}

export interface NavigationSection {
  id: string;
  title: string;
  items: NavigationItem[];
  collapsed?: boolean;
  permissions?: string[];
}

export interface UserMenuAction {
  id: string;
  title: string;
  icon?: React.ReactNode;
  action: () => void;
  divider?: boolean;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  actions?: {
    label: string;
    action: () => void;
    primary?: boolean;
  }[];
  avatar?: string;
  link?: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

export interface LayoutState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  userMenuOpen: boolean;
  notificationsOpen: boolean;
  showNotifications: boolean;
  searchOpen: boolean;
  mobileOpen: boolean;
}

export interface LayoutSettings {
  theme: 'light' | 'dark' | 'auto';
  sidebarPosition: 'left' | 'right';
  sidebarBehavior: 'push' | 'overlay' | 'mini';
  headerFixed: boolean;
  sidebarFixed: boolean;
  footerFixed: boolean;
  animations: boolean;
  direction: 'ltr' | 'rtl';
}

export interface LayoutContextType {
  state: LayoutState;
  settings: LayoutSettings;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  toggleUserMenu: () => void;
  toggleNotifications: () => void;
  toggleSearch: () => void;
  setMobileOpen: (open: boolean) => void;
  updateSettings: (settings: Partial<LayoutSettings>) => void;
  navigation: NavigationSection[];
  userMenuActions: UserMenuAction[];
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'page' | 'protocol' | 'study' | 'goal' | 'user';
  path: string;
  icon?: React.ReactNode;
  category: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  shortcuts?: string[];
}

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  footer?: React.ReactNode;
  fullHeight?: boolean;
}
