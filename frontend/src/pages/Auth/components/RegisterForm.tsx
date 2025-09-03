import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Divider,
  FormControlLabel,
  Checkbox,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stack,
  Grid,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  Business,
  Work,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import { RegisterData, FormErrors } from '../types';
import OAuthButtonGroup from './OAuthButtonGroup';
import TermsAndConditions from './TermsAndConditions';

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
  checks: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    special: boolean;
  };
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSuccess,
  onSwitchToLogin
}) => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthContext();
  
  const [formData, setFormData] = useState<RegisterData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    department: '',
    position: '',
    phone: '',
    acceptTerms: false,
    acceptMarketing: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [showTerms, setShowTerms] = useState(false);

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(checks).filter(Boolean).length;
    
    let label = '';
    let color: 'error' | 'warning' | 'info' | 'success' = 'error';
    
    switch (score) {
      case 0:
      case 1:
        label = 'Bardzo słabe';
        color = 'error';
        break;
      case 2:
        label = 'Słabe';
        color = 'error';
        break;
      case 3:
        label = 'Średnie';
        color = 'warning';
        break;
      case 4:
        label = 'Silne';
        color = 'info';
        break;
      case 5:
        label = 'Bardzo silne';
        color = 'success';
        break;
    }

    return { score, label, color, checks };
  };

  const passwordStrength = calculatePasswordStrength(formData.password);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Imię jest wymagane';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nazwisko jest wymagane';
    }

    if (!formData.email) {
      newErrors.email = 'Adres email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format adresu email';
    }

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Hasło musi mieć co najmniej 8 znaków';
    } else if (passwordStrength.score < 3) {
      newErrors.password = 'Hasło jest zbyt słabe';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Potwierdzenie hasła jest wymagane';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Hasła nie są identyczne';
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Nieprawidłowy format numeru telefonu';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Musisz zaakceptować regulamin';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear API error
    if (apiError) {
      setApiError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setApiError('');
    
    try {
      await register(formData);
      onSuccess?.();
      navigate('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wystąpił błąd podczas rejestracji';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, width: '100%', mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Utwórz konto
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Wypełnij formularz aby utworzyć nowe konto
          </Typography>
        </Box>

        {/* API Error */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {apiError}
          </Alert>
        )}

        {/* OAuth Buttons */}
        <OAuthButtonGroup 
          mode="register"
          orientation="horizontal"
          disabled={isSubmitting}
          onSuccess={() => {
            if (onSuccess) onSuccess();
          }}
          onError={(error) => {
            setApiError(`${error.provider}: ${error.error}`);
          }}
        />

        <Divider sx={{ my: 3 }}>
          <Typography variant="body2" color="text.secondary">
            lub wypełnij formularz
          </Typography>
        </Divider>

        {/* Register Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2.5}>
            {/* Name Fields */}
            <Grid container spacing={2} sx={{ ml: 0, width: '100%', '& > .MuiGrid-item': { pl: 0 } }}>
              <Grid item xs={12} sm={6} sx={{ pl: '0 !important' }}>
                <TextField
                  fullWidth
                  label="Imię"
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="given-name"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ pl: '16px !important' }}>
                <TextField
                  fullWidth
                  label="Nazwisko"
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  autoComplete="family-name"
                  required
                />
              </Grid>
            </Grid>

            {/* Email Field */}
            <TextField
              fullWidth
              label="Adres email"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              autoComplete="email"
              required
            />

            {/* Username Field */}
            <TextField
              fullWidth
              label="Nazwa użytkownika (opcjonalne)"
              value={formData.username}
              onChange={handleInputChange('username')}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              autoComplete="username"
            />

            {/* Password Field */}
            <TextField
              fullWidth
              label="Hasło"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              autoComplete="new-password"
              required
            />

            {/* Password Strength Indicator */}
            {formData.password && (
              <Box sx={{ mt: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="caption" color="text.secondary">
                    Siła hasła:
                  </Typography>
                  <Chip
                    label={passwordStrength.label}
                    color={passwordStrength.color}
                    size="small"
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(passwordStrength.score / 5) * 100}
                  color={passwordStrength.color}
                  sx={{ height: 6, borderRadius: 3 }}
                />
                <Box mt={1}>
                  <Grid container spacing={1}>
                    {Object.entries(passwordStrength.checks).map(([key, met]) => (
                      <Grid item xs={6} sm={4} key={key}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          {met ? (
                            <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />
                          ) : (
                            <Cancel sx={{ fontSize: 16, color: 'error.main' }} />
                          )}
                          <Typography variant="caption" color={met ? 'success.main' : 'text.secondary'}>
                            {key === 'length' && '8+ znaków'}
                            {key === 'uppercase' && 'Wielka litera'}
                            {key === 'lowercase' && 'Mała litera'}
                            {key === 'number' && 'Cyfra'}
                            {key === 'special' && 'Znak specjalny'}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            )}

            {/* Confirm Password Field */}
            <TextField
              fullWidth
              label="Potwierdź hasło"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              autoComplete="new-password"
              required
            />

            {/* Optional Fields */}
            <Grid container spacing={2} sx={{ ml: 0, width: '100%', '& > .MuiGrid-item': { pl: 0 } }}>
              <Grid item xs={12} sm={6} sx={{ pl: '0 !important' }}>
                <TextField
                  fullWidth
                  label="Dział (opcjonalne)"
                  value={formData.department}
                  onChange={handleInputChange('department')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Business color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ pl: '16px !important' }}>
                <TextField
                  fullWidth
                  label="Stanowisko (opcjonalne)"
                  value={formData.position}
                  onChange={handleInputChange('position')}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Work color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Phone Field */}
            <TextField
              fullWidth
              label="Telefon (opcjonalne)"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              error={!!errors.phone}
              helperText={errors.phone}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
              autoComplete="tel"
            />

            {/* Terms and Marketing */}
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptTerms}
                    onChange={handleInputChange('acceptTerms')}
                    color={errors.acceptTerms ? 'error' : 'primary'}
                  />
                }
                label={
                  <Typography variant="body2">
                    Akceptuję{' '}
                    <Link 
                      component="button" 
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowTerms(true);
                      }}
                      sx={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      Regulamin i Politykę Prywatności
                    </Link>
                    {' '}*
                  </Typography>
                }
                required
                sx={{ alignItems: 'flex-start', mb: 1 }}
              />
              {errors.acceptTerms && (
                <Typography variant="caption" color="error" display="block" sx={{ ml: 4 }}>
                  {errors.acceptTerms}
                </Typography>
              )}
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.acceptMarketing}
                  onChange={handleInputChange('acceptMarketing')}
                />
              }
              label={
                <Typography variant="body2">
                  Wyrażam zgodę na otrzymywanie informacji marketingowych (opcjonalne)
                </Typography>
              }
              sx={{ alignItems: 'flex-start' }}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting || isLoading}
              sx={{
                py: 1.5,
                mt: 3,
                position: 'relative'
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Utwórz konto'
              )}
            </Button>
          </Stack>
        </Box>

        {/* Login Link */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            Masz już konto?{' '}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onSwitchToLogin}
              sx={{ fontWeight: 'bold', textDecoration: 'none' }}
            >
              Zaloguj się
            </Link>
          </Typography>
        </Box>
      </CardContent>

      {/* Terms and Conditions Modal */}
      <TermsAndConditions
        open={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => {
          setFormData(prev => ({ ...prev, acceptTerms: true }));
          if (errors.acceptTerms) {
            setErrors(prev => ({ ...prev, acceptTerms: undefined }));
          }
        }}
        showAcceptButton={true}
      />
    </Card>
  );
};

export default RegisterForm;
