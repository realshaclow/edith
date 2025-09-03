import React from 'react';
import {
  Box,
  CssBaseline,
  useTheme,
  useMediaQuery,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { LayoutProvider, useLayout } from '../hooks/useLayout';
import { LayoutProps } from '../types';
import Header from './Header';
import Sidebar from './Sidebar';

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 64;

interface MainLayoutContentProps extends LayoutProps {}

const MainLayoutContent: React.FC<MainLayoutContentProps> = ({
  children,
  title,
  breadcrumbs,
  actions,
  sidebar,
  footer,
  fullHeight = false
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { state, settings } = useLayout();

  // Create theme based on settings
  const layoutTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: settings.theme === 'auto' ? 'light' : settings.theme,
    },
  });

  const getMainStyles = () => {
    return {
      flexGrow: 1,
      transition: theme.transitions.create(['margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: isMobile ? 0 : 0, // Usuwamy marginLeft, bo Drawer jest persistent
      width: '100%',
      minWidth: 0, // Ważne dla flex
    };
  };

  const getContentStyles = () => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginTop: settings.headerFixed ? '64px' : 0,
    minHeight: fullHeight ? `calc(100vh - ${settings.headerFixed ? '64px' : '0px'})` : 'auto',
    backgroundColor: theme.palette.background.default,
    overflow: 'auto',
    maxHeight: settings.headerFixed ? 'calc(100vh - 64px)' : '100vh',
  });

  return (
    <ThemeProvider theme={layoutTheme}>
      <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        <CssBaseline />
        
        {/* Header */}
        <Header
          title={title}
          breadcrumbs={breadcrumbs}
          actions={actions}
        />

        {/* Desktop Sidebar */}
        <Sidebar variant="permanent" />
        
        {/* Mobile Sidebar */}
        <Sidebar variant="temporary" />

        {/* Main Content */}
        <Box component="main" sx={getMainStyles()}>
          <Box sx={getContentStyles()}>
            {/* Custom Sidebar Content */}
            {sidebar && (
              <Box sx={{ mb: 3 }}>
                {sidebar}
              </Box>
            )}

            {/* Page Content */}
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                overflow: 'hidden'
              }}
            >
              {children}
            </Box>

            {/* Custom Footer */}
            {footer && (
              <Box 
                sx={{ 
                  mt: 'auto',
                  pt: 3,
                  position: settings.footerFixed ? 'fixed' : 'relative',
                  bottom: settings.footerFixed ? 0 : 'auto',
                  left: settings.footerFixed ? (isMobile ? 0 : (state.sidebarCollapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH)) : 'auto',
                  right: settings.footerFixed ? 0 : 'auto',
                  zIndex: settings.footerFixed ? theme.zIndex.appBar - 1 : 'auto'
                }}
              >
                {footer}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const MainLayout: React.FC<LayoutProps> = (props) => {
  return (
    <LayoutProvider>
      <MainLayoutContent {...props} />
    </LayoutProvider>
  );
};

export default MainLayout;
