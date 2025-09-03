import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Avatar,
  Chip,
  Badge,
  Button,
  Divider,
  Stack,
  Paper,
  useTheme,
  alpha,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Close,
  Info,
  Warning,
  Error,
  CheckCircle,
  MoreVert,
  MarkEmailRead,
  Delete,
  Archive,
  FilterList,
  NotificationsOff
} from '@mui/icons-material';
import { useLayout } from '../hooks/useLayout';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';

const NotificationsPanel: React.FC = () => {
  const theme = useTheme();
  const { state, notifications, toggleNotifications, markNotificationAsRead, deleteNotification } = useLayout();
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const handleFilterSelect = (filter: 'all' | 'unread' | 'read') => {
    setSelectedFilter(filter);
    handleFilterClose();
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    handleFilterClose();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      case 'info':
      default:
        return <Info color="info" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
      default:
        return 'info';
    }
  };

  const filteredNotifications = notifications
    .filter(notification => {
      if (selectedFilter === 'unread') return !notification.read;
      if (selectedFilter === 'read') return notification.read;
      return true;
    })
    .filter(notification => {
      if (selectedType === 'all') return true;
      return notification.type === selectedType;
    });

  const unreadCount = notifications.filter(n => !n.read).length;
  const notificationTypes = [...new Set(notifications.map(n => n.type))];

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markNotificationAsRead(notification.id);
      }
    });
  };

  return (
    <Drawer
      anchor="right"
      open={state.showNotifications}
      onClose={toggleNotifications}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        }
      }}
    >
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        backgroundColor: theme.palette.background.default
      }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" fontWeight={600}>
            Powiadomienia
            {unreadCount > 0 && (
              <Badge
                badgeContent={unreadCount}
                color="error"
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <IconButton onClick={toggleNotifications} size="small">
            <Close />
          </IconButton>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1} mt={2}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<MarkEmailRead />}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Oznacz jako przeczytane
          </Button>
          
          <Tooltip title="Filtry">
            <IconButton size="small" onClick={handleFilterClick}>
              <FilterList />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Filter Chips */}
        <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
          <Chip
            label="Wszystkie"
            size="small"
            variant={selectedFilter === 'all' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFilter('all')}
            color="primary"
          />
          <Chip
            label="Nieprzeczytane"
            size="small"
            variant={selectedFilter === 'unread' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFilter('unread')}
            color="primary"
          />
          <Chip
            label="Przeczytane"
            size="small"
            variant={selectedFilter === 'read' ? 'filled' : 'outlined'}
            onClick={() => setSelectedFilter('read')}
            color="primary"
          />
        </Stack>
      </Box>

      {/* Notifications List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {filteredNotifications.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ height: 200, color: 'text.secondary' }}
          >
            <NotificationsOff sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="body1">
              {selectedFilter === 'all' 
                ? 'Brak powiadomień'
                : selectedFilter === 'unread'
                ? 'Brak nieprzeczytanych powiadomień'
                : 'Brak przeczytanych powiadomień'
              }
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  disablePadding
                  sx={{
                    backgroundColor: notification.read 
                      ? 'transparent' 
                      : alpha(theme.palette.primary.main, 0.05),
                  }}
                >
                  <ListItemButton
                    onClick={() => markNotificationAsRead(notification.id)}
                    sx={{ 
                      py: 2,
                      alignItems: 'flex-start',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.08)
                      }
                    }}
                  >
                    <ListItemIcon sx={{ mt: 0.5, minWidth: 36 }}>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Typography
                            variant="body1"
                            fontWeight={notification.read ? 400 : 600}
                            sx={{ mr: 1 }}
                          >
                            {notification.title}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip
                              label={notification.type}
                              size="small"
                              color={getNotificationColor(notification.type) as any}
                              variant="outlined"
                            />
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDistanceToNow(notification.timestamp, { 
                              addSuffix: true,
                              locale: pl 
                            })}
                          </Typography>
                          {notification.actions && notification.actions.length > 0 && (
                            <Stack direction="row" spacing={1} mt={1}>
                              {notification.actions.map((action, actionIndex) => (
                                <Button
                                  key={actionIndex}
                                  size="small"
                                  variant={action.primary ? 'contained' : 'outlined'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.action();
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </Stack>
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterClose}
      >
        <MenuItem onClick={() => handleFilterSelect('all')}>
          Wszystkie powiadomienia
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('unread')}>
          Nieprzeczytane
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect('read')}>
          Przeczytane
        </MenuItem>
        <Divider />
        {notificationTypes.map(type => (
          <MenuItem key={type} onClick={() => handleTypeSelect(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}
      </Menu>
    </Drawer>
  );
};

export default NotificationsPanel;
