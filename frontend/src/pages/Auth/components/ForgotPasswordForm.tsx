import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  InputAdornment,
  CircularProgress,
  Stack,
  Stepper,
  Step,
  StepLabel,
  Paper
} from '@mui/material';
import {
  Email,
  ArrowBack,
  CheckCircle,
  Send
} from '@mui/icons-material';
import { useAuthContext } from '../hooks/useAuth';
import { PasswordResetRequest, FormErrors } from '../types';

interface ForgotPasswordFormProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onBack,
  onSuccess
}) => {
  const { forgotPassword } = useAuthContext();
  
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = 'Adres email jest wymagany';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Nieprawidłowy format adresu email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    
    // Clear field error when user starts typing
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
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
      await forgotPassword({ email });
      setIsSuccess(true);
      setTimeout(() => {
        onSuccess?.();
      }, 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Wystąpił błąd podczas wysyłania linku';
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card sx={{ maxWidth: 400, width: '100%', mx: 'auto' }}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          
          <Typography variant="h5" component="h1" gutterBottom fontWeight="bold">
            Email wysłany!
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph>
            Wysłaliśmy link do resetowania hasła na adres:
          </Typography>
          
          <Typography variant="body1" fontWeight="bold" color="primary.main" paragraph>
            {email}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph>
            Sprawdź swoją skrzynkę email i kliknij w link, aby zresetować hasło. 
            Link będzie ważny przez 24 godziny.
          </Typography>

          <Paper sx={{ p: 2, backgroundColor: 'grey.50', mt: 3, mb: 3 }}>
            <Typography variant="caption" color="text.secondary">
              Nie widzisz emaila? Sprawdź folder ze spamem lub kliknij ponownie wysyłanie za 60 sekund.
            </Typography>
          </Paper>
          
          <Stack spacing={2}>
            <Button
              variant="outlined"
              onClick={onBack}
              startIcon={<ArrowBack />}
            >
              Powrót do logowania
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 400, width: '100%', mx: 'auto' }}>
      <CardContent sx={{ p: 4 }}>
        {/* Header */}
        <Box textAlign="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Resetuj hasło
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Wprowadź swój adres email, a wyślemy Ci link do resetowania hasła
          </Typography>
        </Box>

        {/* Progress Stepper */}
        <Box mb={3}>
          <Stepper activeStep={0} alternativeLabel>
            <Step>
              <StepLabel>Wprowadź email</StepLabel>
            </Step>
            <Step>
              <StepLabel>Sprawdź email</StepLabel>
            </Step>
            <Step>
              <StepLabel>Ustaw nowe hasło</StepLabel>
            </Step>
          </Stepper>
        </Box>

        {/* API Error */}
        {apiError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {apiError}
          </Alert>
        )}

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Email Field */}
            <TextField
              fullWidth
              label="Adres email"
              type="email"
              value={email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email || 'Wprowadź email powiązany z Twoim kontem'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
              autoComplete="email"
              autoFocus
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : <Send />}
              sx={{ py: 1.5 }}
            >
              {isSubmitting ? 'Wysyłanie...' : 'Wyślij link resetowania'}
            </Button>

            {/* Back Button */}
            <Button
              fullWidth
              variant="outlined"
              onClick={onBack}
              startIcon={<ArrowBack />}
              sx={{ py: 1.5 }}
            >
              Powrót do logowania
            </Button>
          </Stack>
        </Box>

        {/* Help Text */}
        <Paper sx={{ p: 2, backgroundColor: 'info.light', mt: 3, border: '1px solid', borderColor: 'info.main' }}>
          <Typography variant="caption" color="info.dark">
            <strong>Wskazówka:</strong> Jeśli nie pamiętasz adresu email powiązanego z kontem, 
            skontaktuj się z administratorem systemu.
          </Typography>
        </Paper>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
