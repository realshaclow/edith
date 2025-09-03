import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Box,
  InputBase,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Stack,
  alpha,
  useTheme,
  Tooltip,
  Button,
  Breadcrumbs,
  Link
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Brightness4,
  Brightness7,
  Fullscreen,
  FullscreenExit,
  Close,
  Settings,
  Language,
  NavigateNext,
  Home
} from '@mui/icons-material';
import { useLayout } from '../hooks/useLayout';
import { useAuthContext } from '../../../pages/Auth';
import { BreadcrumbItem } from '../types';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, breadcrumbs, actions }) => {
  const theme = useTheme();
  const { user } = useAuthContext();
  const {
    state,
    settings,
    toggleSidebar,
    toggleSearch,
    toggleUserMenu,
    toggleNotifications,
    updateSettings,
    userMenuActions,
    notifications
  } = useLayout();

  const [searchValue, setSearchValue] = useState('');
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleUserMenuAction = (action: () => void) => {
    action();
    handleUserMenuClose();
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Search:', searchValue);
    // Implement search logic here
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {/* Menu Button */}
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={toggleSidebar}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Title */}
          <Box display="flex" alignItems="center" sx={{ mr: 3 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: 'primary.main',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Edith Research
            </Typography>
            {title && (
              <>
                <Divider orientation="vertical" flexItem sx={{ mx: 2, height: 24 }} />
                <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                  {title}
                </Typography>
              </>
            )}
          </Box>

          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 'auto' }}>
              <Breadcrumbs
                separator={<NavigateNext fontSize="small" />}
                aria-label="breadcrumb"
                sx={{ color: 'text.secondary' }}
              >
                {breadcrumbs.map((crumb, index) => {
                  const isLast = index === breadcrumbs.length - 1;
                  
                  if (isLast) {
                    return (
                      <Box key={index} display="flex" alignItems="center">
                        {crumb.icon && (
                          <Box sx={{ mr: 0.5, display: 'flex' }}>
                            {crumb.icon}
                          </Box>
                        )}
                        <Typography variant="body2" color="text.primary">
                          {crumb.label}
                        </Typography>
                      </Box>
                    );
                  }
                  
                  return (
                    <Link
                      key={index}
                      underline="hover"
                      color="inherit"
                      href={crumb.path || '#'}
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        '&:hover': {
                          color: 'primary.main'
                        }
                      }}
                    >
                      {crumb.icon && (
                        <Box sx={{ mr: 0.5, display: 'flex' }}>
                          {crumb.icon}
                        </Box>
                      )}
                      <Typography variant="body2">
                        {crumb.label}
                      </Typography>
                    </Link>
                  );
                })}
              </Breadcrumbs>
            </Box>
          )}

          {/* Search Bar */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              position: 'relative',
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.common.black, 0.05),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.black, 0.08),
              },
              ml: { xs: 'auto', md: 2 },
              mr: 2,
              width: { xs: 40, md: 300 },
              transition: theme.transitions.create('width'),
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <IconButton
              type="submit"
              sx={{ p: 1 }}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Szukaj..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                color: 'inherit',
                width: '100%',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: theme.spacing(1),
                  transition: theme.transitions.create('width'),
                  width: '100%',
                  display: { xs: 'none', md: 'block' }
                },
              }}
            />
          </Box>

          {/* Actions */}
          {actions && (
            <Box sx={{ mr: 2 }}>
              {actions}
            </Box>
          )}

          {/* Header Actions */}
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Theme Toggle */}
            <Tooltip title={`Przełącz na ${settings.theme === 'light' ? 'ciemny' : 'jasny'} motyw`}>
              <IconButton onClick={toggleTheme} color="inherit">
                {settings.theme === 'light' ? <Brightness4 /> : <Brightness7 />}
              </IconButton>
            </Tooltip>

            {/* Fullscreen Toggle */}
            <Tooltip title={isFullscreen ? 'Wyjdź z pełnego ekranu' : 'Pełny ekran'}>
              <IconButton onClick={toggleFullscreen} color="inherit">
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Powiadomienia">
              <IconButton onClick={toggleNotifications} color="inherit">
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* User Menu */}
            <Button
              onClick={handleUserMenuClick}
              sx={{
                ml: 1,
                borderRadius: 2,
                textTransform: 'none',
                color: 'inherit',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.common.black, 0.04)
                }
              }}
              startIcon={
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: '0.875rem',
                    bgcolor: 'primary.main'
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Avatar>
              }
            >
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'left', ml: 1 }}>
                <Typography variant="body2" fontWeight={600}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role?.name}
                </Typography>
              </Box>
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        onClick={handleUserMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
            mt: 1.5,
            minWidth: 250,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* User Info */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="body1" fontWeight={600}>
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email}
          </Typography>
          <Box mt={1}>
            <Chip
              label={user?.role?.name}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Menu Items */}
        {userMenuActions.map((action) => (
          <div key={action.id}>
            {action.divider && <Divider />}
            <MenuItem
              onClick={() => handleUserMenuAction(action.action)}
              sx={{
                py: 1,
                color: action.color === 'error' ? 'error.main' : 'inherit'
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {action.icon}
              </ListItemIcon>
              <ListItemText>{action.title}</ListItemText>
            </MenuItem>
          </div>
        ))}
      </Menu>

      {/* Notifications Panel */}
      <NotificationsPanel />
    </>
  );
};

export default Header;
