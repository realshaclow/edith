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
  Paper
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  GitHub
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuth';
import { LoginCredentials, FormErrors } from '../types';
import OAuthButtonGroup from './OAuthButtonGroup';
import { MicrosoftIcon } from './icons';

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  onSwitchToRegister?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onForgotPassword,
  onSwitchToRegister
}) => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthContext();
  
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'Adres email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Nieprawidłowy format adresu email';
    }

    if (!formData.password) {
      newErrors.password = 'Hasło jest wymagane';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Hasło musi mieć co najmniej 6 znaków';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
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
      await login(formData);
      onSuccess?.();
      navigate('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wystąpił błąd podczas logowania';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, width: '100%', mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Zaloguj się
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Wprowadź swoje dane aby uzyskać dostęp do konta
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
          mode="login"
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
            lub
          </Typography>
        </Divider>

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
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
              autoFocus
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
              autoComplete="current-password"
            />

            {/* Remember Me & Forgot Password */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.rememberMe}
                    onChange={handleInputChange('rememberMe')}
                    size="small"
                  />
                }
                label={
                  <Typography variant="body2">
                    Zapamiętaj mnie
                  </Typography>
                }
              />
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={onForgotPassword}
                sx={{ textDecoration: 'none' }}
              >
                Zapomniałeś hasła?
              </Link>
            </Box>

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting || isLoading}
              sx={{
                py: 1.5,
                position: 'relative'
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Zaloguj się'
              )}
            </Button>
          </Stack>
        </Box>

        {/* Register Link */}
        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            Nie masz konta?{' '}
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onSwitchToRegister}
              sx={{ fontWeight: 'bold', textDecoration: 'none' }}
            >
              Zarejestruj się
            </Link>
          </Typography>
        </Box>

        {/* Demo Credentials */}
        <Paper
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: 'grey.50',
            border: '1px dashed',
            borderColor: 'grey.300'
          }}
        >
          <Typography variant="caption" display="block" fontWeight="bold" gutterBottom>
            Demo Accounts:
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1 }}>
            <strong>Administrator:</strong><br/>
            Email: admin@edith.pl<br/>
            Password: Admin123!@#
          </Typography>
          <Typography variant="caption" display="block" sx={{ mb: 1 }}>
            <strong>Researcher:</strong><br/>
            Email: researcher@edith.pl<br/>
            Password: Research123!
          </Typography>
          <Typography variant="caption" display="block">
            <strong>Operator:</strong><br/>
            Email: operator@edith.pl<br/>
            Password: Operator123!
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
