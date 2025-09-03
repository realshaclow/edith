import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Chip,
  Button,
  Collapse,
  Alert,
  Skeleton
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  Close,
  ExpandMore,
  ExpandLess,
  Notifications,
  NotificationsOff,
  Launch
} from '@mui/icons-material';
import { SystemAlert } from '../../types';

interface SystemAlertsProps {
  alerts: SystemAlert[];
  isLoading: boolean;
  onMarkAsRead: (alertId: string) => void;
  onDismiss: (alertId: string) => void;
  onActionClick?: (alert: SystemAlert) => void;
}

const getAlertIcon = (type: SystemAlert['type']) => {
  switch (type) {
    case 'error': return <Error color="error" />;
    case 'warning': return <Warning color="warning" />;
    case 'success': return <CheckCircle color="success" />;
    case 'info': return <Info color="info" />;
    default: return <Info />;
  }
};

const getAlertColor = (type: SystemAlert['type']) => {
  switch (type) {
    case 'error': return 'error';
    case 'warning': return 'warning';
    case 'success': return 'success';
    case 'info': return 'info';
    default: return 'default';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Przed chwilą';
  if (diffInMinutes < 60) return `${diffInMinutes} min temu`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h temu`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} dni temu`;
  
  return date.toLocaleDateString('pl-PL');
};

const SystemAlerts: React.FC<SystemAlertsProps> = ({
  alerts,
  isLoading,
  onMarkAsRead,
  onDismiss,
  onActionClick
}) => {
  const [expanded, setExpanded] = React.useState<string[]>([]);
  const [showOnlyUnread, setShowOnlyUnread] = React.useState(false);

  const unreadCount = alerts.filter(alert => !alert.read).length;
  const filteredAlerts = showOnlyUnread ? alerts.filter(alert => !alert.read) : alerts;

  const toggleExpanded = (alertId: string) => {
    setExpanded(prev => 
      prev.includes(alertId) 
        ? prev.filter(id => id !== alertId)
        : [...prev, alertId]
    );
  };

  const handleMarkAsRead = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onMarkAsRead(alertId);
  };

  const handleDismiss = (alertId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onDismiss(alertId);
  };

  const handleActionClick = (alert: SystemAlert, event: React.MouseEvent) => {
    event.stopPropagation();
    onActionClick?.(alert);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Alerty systemowe" />
        <CardContent>
          {[...Array(3)].map((_, index) => (
            <Box key={index} display="flex" alignItems="flex-start" mb={2}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box flex={1}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={20} />
                <Skeleton variant="text" width="40%" height={16} />
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Alerty systemowe"
        action={
          <Box display="flex" alignItems="center" gap={1}>
            {unreadCount > 0 && (
              <Chip
                label={unreadCount}
                color="warning"
                size="small"
                icon={<Notifications />}
              />
            )}
            <IconButton
              size="small"
              onClick={() => setShowOnlyUnread(!showOnlyUnread)}
              color={showOnlyUnread ? 'primary' : 'default'}
            >
              {showOnlyUnread ? <Notifications /> : <NotificationsOff />}
            </IconButton>
          </Box>
        }
      />
      <CardContent sx={{ pt: 0 }}>
        {filteredAlerts.length === 0 ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
            color="text.secondary"
          >
            <CheckCircle sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              {showOnlyUnread ? 'Brak nieprzeczytanych alertów' : 'Brak alertów'}
            </Typography>
            <Typography variant="body2" textAlign="center">
              {showOnlyUnread 
                ? 'Wszystkie alerty zostały przeczytane'
                : 'System działa bez problemów'
              }
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filteredAlerts.map((alert, index) => (
              <Box key={alert.id}>
                <ListItem
                  disablePadding
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: alert.read ? 'background.paper' : 'action.hover',
                    border: '1px solid',
                    borderColor: alert.read ? 'divider' : `${getAlertColor(alert.type)}.light`,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.selected'
                    }
                  }}
                  onClick={() => toggleExpanded(alert.id)}
                >
                  <ListItemIcon sx={{ minWidth: 48 }}>
                    {getAlertIcon(alert.type)}
                  </ListItemIcon>
                  
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography 
                          variant="subtitle2" 
                          fontWeight={alert.read ? 'normal' : 'bold'}
                          color={alert.read ? 'text.primary' : 'text.primary'}
                        >
                          {alert.title}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(alert.timestamp)}
                          </Typography>
                          {expanded.includes(alert.id) ? <ExpandLess /> : <ExpandMore />}
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            display: '-webkit-box',
                            WebkitLineClamp: expanded.includes(alert.id) ? 'none' : 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {alert.message}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>

                <Collapse in={expanded.includes(alert.id)} timeout="auto" unmountOnExit>
                  <Box px={2} pb={2}>
                    <Alert 
                      severity={getAlertColor(alert.type) as any}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    >
                      {alert.message}
                    </Alert>
                    
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {!alert.read && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(e) => handleMarkAsRead(alert.id, e)}
                        >
                          Oznacz jako przeczytane
                        </Button>
                      )}
                      
                      {alert.actionable && alert.actionUrl && (
                        <Button
                          size="small"
                          variant="contained"
                          color={getAlertColor(alert.type) as any}
                          startIcon={<Launch />}
                          onClick={(e) => handleActionClick(alert, e)}
                        >
                          Przejdź do akcji
                        </Button>
                      )}
                      
                      <Button
                        size="small"
                        variant="text"
                        color="error"
                        startIcon={<Close />}
                        onClick={(e) => handleDismiss(alert.id, e)}
                      >
                        Odrzuć
                      </Button>
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
