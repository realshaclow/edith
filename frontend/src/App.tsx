import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { pl } from 'date-fns/locale';

import { MainLayout } from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import ProtocolsList from './pages/ProtocolsList';
import NewStudyList from './pages/Studies/NewStudyList'; // Nasz nowy komponent
import { CreateStudy } from './pages/CreateStudy';
import { ExecuteStudy } from './pages/ExecuteStudy';
import StudyStatistics from './pages/StudyStatistics';
import ProtocolCreator from './pages/ProtocolCreator';
import { Goals } from './pages/Goals';
import { Auth, AuthProvider, useAuthContext, OAuthProvider, OAuthCallback } from './pages/Auth';
import NotFound from './pages/NotFound';

// Tema Material-UI
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
        <AuthProvider>
          <Router>
            <OAuthProvider>
              <Routes>
                {/* Public Auth Route */}
                <Route path="/auth" element={<Auth />} />
                
                {/* OAuth Callback Routes */}
                <Route path="/auth/oauth/google/callback" element={<OAuthCallback />} />
                <Route path="/auth/oauth/github/callback" element={<OAuthCallback />} />
                <Route path="/auth/oauth/microsoft/callback" element={<OAuthCallback />} />
                
                {/* Protected Routes */}
                <Route path="/*" element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Routes>
                        {/* Dashboard */}
                        <Route path="/" element={<Dashboard />} />
                        
                        {/* Goals */}
                        <Route path="/goals" element={<Goals />} />
                        
                        {/* Protocols */}
                        <Route path="/protocols" element={<ProtocolsList />} />
                        <Route path="/protocols/create" element={<ProtocolCreator />} />
                        <Route path="/protocols/edit/:id" element={<ProtocolCreator />} />
                      
                        {/* Legacy routes */}
                        <Route path="/protocol-creator" element={<ProtocolCreator />} />
                        <Route path="/create-protocol" element={<ProtocolCreator />} />
                        
                        {/* Studies */}
                        <Route path="/studies" element={<NewStudyList />} />
                        <Route path="/studies/create" element={<CreateStudy />} />
                        <Route path="/studies/:id/execute" element={<ExecuteStudy />} />
                        <Route path="/studies/:id/statistics" element={<StudyStatistics />} />
                        
                        {/* 404 */}
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </MainLayout>
                  </ProtectedRoute>
                } />
              </Routes>
            </OAuthProvider>
          </Router>
        </AuthProvider>
      </LocalizationProvider>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </ThemeProvider>
  );
};

export default App;
