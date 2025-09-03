import React, { useState } from 'react';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Badge,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  Chip
} from '@mui/material';
import {
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLayout } from '../hooks/useLayout';
import { NavigationSection, NavigationItem } from '../types';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 64;

interface SidebarProps {
  variant?: 'permanent' | 'temporary';
}

const Sidebar: React.FC<SidebarProps> = ({ variant = 'permanent' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { state, settings, navigation, collapseSidebar, expandSidebar, toggleSidebar } = useLayout();
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const handleSectionToggle = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleItemClick = (item: NavigationItem) => {
    if (item.external) {
      window.open(item.path, '_blank');
    } else if (item.path) {
      navigate(item.path);
    }
    
    // Close mobile sidebar after navigation
    if (variant === 'temporary') {
      toggleSidebar();
    }
  };

  const isItemActive = (item: NavigationItem): boolean => {
    return location.pathname === item.path || 
           Boolean(item.children && item.children.some(child => location.pathname === child.path));
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const active = isItemActive(item);
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections[item.id] ?? false;

    if (item.divider) {
      return (
        <Divider 
          key={item.id} 
          sx={{ 
            my: 1,
            display: state.sidebarCollapsed ? 'none' : 'block'
          }} 
        />
      );
    }

    return (
      <Box key={item.id}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              if (hasChildren) {
                handleSectionToggle(item.id);
              } else {
                handleItemClick(item);
              }
            }}
            sx={{
              minHeight: 48,
              justifyContent: state.sidebarCollapsed ? 'center' : 'initial',
              px: 2,
              pl: 2 + (level * 2),
              backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              color: active ? theme.palette.primary.main : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              },
              borderRadius: 1,
              mx: 1,
              mb: 0.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: state.sidebarCollapsed ? 0 : 3,
                justifyContent: 'center',
                color: 'inherit'
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.title}
              sx={{
                opacity: state.sidebarCollapsed ? 0 : 1,
                '& .MuiTypography-root': {
                  fontWeight: active ? 600 : 400,
                  fontSize: '0.875rem'
                }
              }}
            />

            {!state.sidebarCollapsed && (
              <>
                {item.badge && (
                  <Badge
                    badgeContent={item.badge.count}
                    color={item.badge.color}
                    sx={{ mr: 1 }}
                  />
                )}
                
                {hasChildren && (
                  isOpen ? <ExpandLess /> : <ExpandMore />
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>

        {/* Children */}
        {hasChildren && !state.sidebarCollapsed && (
          <Collapse in={isOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderNavigationItem(child, level + 1))}
            </List>
          </Collapse>
        )}

        {/* Tooltip for collapsed state */}
        {state.sidebarCollapsed && hasChildren && (
          <Box sx={{ position: 'absolute', left: COLLAPSED_WIDTH, top: 0, zIndex: 1300 }}>
            {/* Will be handled by main tooltip wrapper */}
          </Box>
        )}
      </Box>
    );
  };

  const renderNavigationSection = (section: NavigationSection) => {
    const sectionOpen = openSections[section.id] ?? true;

    return (
      <Box key={section.id} sx={{ mb: 2 }}>
        {/* Section Header */}
        {!state.sidebarCollapsed && (
          <ListItem sx={{ px: 2, py: 1 }}>
            <ListItemButton
              onClick={() => handleSectionToggle(section.id)}
              sx={{
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                }
              }}
            >
              <ListItemText
                primary={
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      color: 'text.secondary'
                    }}
                  >
                    {section.title}
                  </Typography>
                }
              />
              {sectionOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
        )}

        {/* Section Items */}
        <Collapse in={sectionOpen || state.sidebarCollapsed} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {section.items.map((item) => {
              if (state.sidebarCollapsed) {
                return (
                  <Tooltip
                    key={item.id}
                    title={item.title}
                    placement="right"
                    arrow
                  >
                    <div>
                      {renderNavigationItem(item)}
                    </div>
                  </Tooltip>
                );
              }
              return renderNavigationItem(item);
            })}
          </List>
        </Collapse>
      </Box>
    );
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: 64
        }}
      >
        {!state.sidebarCollapsed && (
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                fontSize: '0.875rem'
              }}
            >
              E
            </Avatar>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                Edith Research
              </Typography>
              <Typography variant="caption" color="text.secondary">
                System Badań
              </Typography>
            </Box>
          </Stack>
        )}

        <IconButton
          onClick={state.sidebarCollapsed ? expandSidebar : collapseSidebar}
          size="small"
          sx={{
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08)
            }
          }}
        >
          {state.sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 1 }}>
        {navigation.map((section) => renderNavigationSection(section))}
      </Box>

      {/* Footer */}
      {!state.sidebarCollapsed && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Stack spacing={1}>
            <Chip
              label="v1.0.0"
              size="small"
              variant="outlined"
              color="primary"
            />
            <Typography variant="caption" color="text.secondary">
              © 2024 Edith Research Platform
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );

  if (variant === 'temporary') {
    return (
      <Drawer
        variant="temporary"
        open={state.mobileOpen}
        onClose={toggleSidebar}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  // Desktop Sidebar - conditionally render
  if (!isMobile && !state.sidebarOpen) {
    return null; // Don't render sidebar when closed on desktop
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: state.sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: state.sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          borderRight: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
      open
    >
      {drawerContent}
    </Drawer>
  );
};

export default Sidebar;
