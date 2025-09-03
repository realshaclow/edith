import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Skeleton,
  Button,
  Divider
} from '@mui/material';
import {
  Science,
  Add,
  CheckCircle,
  Error,
  Description,
  Person,
  MoreHoriz
} from '@mui/icons-material';
import { type RecentActivity } from '../../types';

interface RecentActivityProps {
  activities: RecentActivity[];
  isLoading: boolean;
  showAll?: boolean;
  onShowMore?: () => void;
}

const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'study_created': return <Add />;
    case 'study_completed': return <CheckCircle />;
    case 'protocol_added': return <Science />;
    case 'error_occurred': return <Error />;
    case 'report_generated': return <Description />;
    default: return <Science />;
  }
};

const getActivityColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'study_created': return 'primary';
    case 'study_completed': return 'success';
    case 'protocol_added': return 'info';
    case 'error_occurred': return 'error';
    case 'report_generated': return 'secondary';
    default: return 'default';
  }
};

const getActivityTypeLabel = (type: RecentActivity['type']) => {
  switch (type) {
    case 'study_created': return 'Nowe badanie';
    case 'study_completed': return 'Badanie ukończone';
    case 'protocol_added': return 'Nowy protokół';
    case 'error_occurred': return 'Błąd systemu';
    case 'report_generated': return 'Raport';
    default: return 'Aktywność';
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
  
  return date.toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const RecentActivityWidget: React.FC<RecentActivityProps> = ({
  activities,
  isLoading,
  showAll = false,
  onShowMore
}) => {
  const displayActivities = showAll ? activities : activities.slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader title="Ostatnia aktywność" />
        <CardContent>
          {[...Array(5)].map((_, index) => (
            <Box key={index} display="flex" alignItems="flex-start" mb={2}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box flex={1}>
                <Skeleton variant="text" width="70%" height={20} />
                <Skeleton variant="text" width="90%" height={16} />
                <Skeleton variant="text" width="50%" height={14} />
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader title="Ostatnia aktywność" />
        <CardContent>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            py={4}
            color="text.secondary"
          >
            <Science sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6" gutterBottom>
              Brak aktywności
            </Typography>
            <Typography variant="body2" textAlign="center">
              Nie ma jeszcze żadnej aktywności w systemie
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Ostatnia aktywność"
        action={
          activities.length > 5 && !showAll && (
            <Chip
              label={`+${activities.length - 5} więcej`}
              size="small"
              variant="outlined"
              clickable
              onClick={onShowMore}
            />
          )
        }
      />
      <CardContent sx={{ pt: 0 }}>
        <List disablePadding>
          {displayActivities.map((activity, index) => (
            <Box key={activity.id}>
              <ListItem
                disablePadding
                sx={{
                  py: 1.5,
                  px: 0,
                  '&:hover': {
                    bgcolor: 'action.hover',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${getActivityColor(activity.type)}.light`,
                      color: `${getActivityColor(activity.type)}.dark`,
                      width: 40,
                      height: 40
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                      <Typography variant="subtitle2" fontWeight="medium">
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(activity.timestamp)}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          mb: 1
                        }}
                      >
                        {activity.description}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={getActivityTypeLabel(activity.type)}
                            size="small"
                            color={getActivityColor(activity.type) as any}
                            variant="outlined"
                          />
                          <Box display="flex" alignItems="center">
                            <Person sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                              {activity.user}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>

                      {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                        <Box mt={1}>
                          <Typography variant="caption" color="text.secondary">
                            Dodatkowe informacje:
                          </Typography>
                          <Box display="flex" gap={0.5} mt={0.5} flexWrap="wrap">
                            {Object.entries(activity.metadata).slice(0, 3).map(([key, value]) => (
                              <Chip
                                key={key}
                                label={`${key}: ${value}`}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.7rem', height: 20 }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  }
                />
              </ListItem>
              {index < displayActivities.length - 1 && (
                <Divider variant="middle" sx={{ my: 1 }} />
              )}
            </Box>
          ))}
        </List>

        {!showAll && activities.length > 5 && (
          <Box mt={2} textAlign="center">
            <Button
              variant="outlined"
              startIcon={<MoreHoriz />}
              onClick={onShowMore}
              size="small"
            >
              Pokaż wszystkie ({activities.length} aktywności)
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityWidget;
