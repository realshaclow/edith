import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  Fade,
  Slide
} from '@mui/material';
import {
  Security,
  Speed,
  Cloud,
  Analytics,
  Shield,
  CheckCircle
} from '@mui/icons-material';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

type AuthMode = 'login' | 'register' | 'forgot-password';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const features = [
    {
      icon: <Security />,
      title: 'Bezpieczeństwo',
      description: 'Zaawansowane szyfrowanie i dwuetapowa autoryzacja'
    },
    {
      icon: <Speed />,
      title: 'Wydajność',
      description: 'Szybki dostęp do wszystkich funkcji systemu'
    },
    {
      icon: <Analytics />,
      title: 'Analityka',
      description: 'Kompleksowe raportowanie i analiza danych'
    },
    {
      icon: <Cloud />,
      title: 'Cloud Ready',
      description: 'Dostęp z dowolnego miejsca na świecie'
    }
  ];

  const statistics = [
    { label: 'Aktywnych użytkowników', value: '1,200+' },
    { label: 'Protokołów badawczych', value: '850+' },
    { label: 'Przeprowadzonych badań', value: '5,400+' },
    { label: 'Uptime systemu', value: '99.9%' }
  ];

  const renderAuthForm = () => {
    switch (mode) {
      case 'login':
        return (
          <Fade in={mode === 'login'} timeout={300}>
            <div>
              <LoginForm
                onForgotPassword={() => setMode('forgot-password')}
                onSwitchToRegister={() => setMode('register')}
              />
            </div>
          </Fade>
        );
      
      case 'register':
        return (
          <Fade in={mode === 'register'} timeout={300}>
            <div>
              <RegisterForm
                onSwitchToLogin={() => setMode('login')}
              />
            </div>
          </Fade>
        );
      
      case 'forgot-password':
        return (
          <Fade in={mode === 'forgot-password'} timeout={300}>
            <div>
              <ForgotPasswordForm
                onBack={() => setMode('login')}
                onSuccess={() => setMode('login')}
              />
            </div>
          </Fade>
        );
      
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Left Side - Branding and Info */}
          {!isMobile && (
            <Grid item md={6}>
              <Slide direction="right" in={true} timeout={600}>
                <Box>
                  {/* Logo and Title */}
                  <Box mb={4}>
                    <Typography
                      variant="h2"
                      component="h1"
                      fontWeight="bold"
                      color="primary.main"
                      gutterBottom
                    >
                      Edith Research
                    </Typography>
                    <Typography variant="h5" color="text.secondary" paragraph>
                      Zaawansowany system zarządzania badaniami naukowymi
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      Profesjonalne narzędzie do tworzenia protokołów badawczych, 
                      przeprowadzania eksperymentów i analizy wyników.
                    </Typography>
                  </Box>

                  {/* Features */}
                  <Grid container spacing={3} mb={4}>
                    {features.map((feature, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card elevation={2}>
                          <CardContent sx={{ p: 2 }}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 2,
                                  backgroundColor: 'primary.light',
                                  color: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {feature.icon}
                              </Box>
                              <Box>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {feature.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {feature.description}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Statistics */}
                  <Paper sx={{ p: 3, backgroundColor: 'background.paper' }}>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      Zaufali nam:
                    </Typography>
                    <Grid container spacing={3}>
                      {statistics.map((stat, index) => (
                        <Grid item xs={6} key={index}>
                          <Box textAlign="center">
                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                              {stat.value}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {stat.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>

                  {/* Trust Indicators */}
                  <Box mt={3}>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        icon={<Shield />}
                        label="ISO 27001"
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<CheckCircle />}
                        label="GDPR Compliant"
                        color="success"
                        variant="outlined"
                        size="small"
                      />
                      <Chip
                        icon={<Security />}
                        label="Enterprise Security"
                        color="info"
                        variant="outlined"
                        size="small"
                      />
                    </Stack>
                  </Box>
                </Box>
              </Slide>
            </Grid>
          )}

          {/* Right Side - Auth Forms */}
          <Grid item xs={12} md={6}>
            <Slide direction="left" in={true} timeout={800}>
              <Box>
                {/* Mobile Header */}
                {isMobile && (
                  <Box textAlign="center" mb={4}>
                    <Typography
                      variant="h3"
                      component="h1"
                      fontWeight="bold"
                      color="primary.main"
                      gutterBottom
                    >
                      Edith Research
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      System zarządzania badaniami naukowymi
                    </Typography>
                  </Box>
                )}

                {/* Mode Indicator */}
                <Box textAlign="center" mb={3}>
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Chip
                      label="Logowanie"
                      color={mode === 'login' ? 'primary' : 'default'}
                      variant={mode === 'login' ? 'filled' : 'outlined'}
                      onClick={() => setMode('login')}
                      sx={{ cursor: 'pointer' }}
                    />
                    <Chip
                      label="Rejestracja"
                      color={mode === 'register' ? 'primary' : 'default'}
                      variant={mode === 'register' ? 'filled' : 'outlined'}
                      onClick={() => setMode('register')}
                      sx={{ cursor: 'pointer' }}
                    />
                    {mode === 'forgot-password' && (
                      <Chip
                        label="Reset hasła"
                        color="secondary"
                        variant="filled"
                      />
                    )}
                  </Stack>
                </Box>

                {/* Auth Form */}
                {renderAuthForm()}

                {/* Mobile Features */}
                {isMobile && (
                  <Box mt={4}>
                    <Typography variant="h6" textAlign="center" gutterBottom>
                      Dlaczego Edith Research?
                    </Typography>
                    <Grid container spacing={2}>
                      {features.slice(0, 2).map((feature, index) => (
                        <Grid item xs={12} key={index}>
                          <Card variant="outlined">
                            <CardContent sx={{ p: 2 }}>
                              <Box display="flex" alignItems="center" gap={2}>
                                <Box
                                  sx={{
                                    p: 1,
                                    borderRadius: 1,
                                    backgroundColor: 'primary.light',
                                    color: 'primary.main'
                                  }}
                                >
                                  {feature.icon}
                                </Box>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight="bold">
                                    {feature.title}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {feature.description}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Auth;
