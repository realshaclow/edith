/**
 * OAuth Callback Handler Component
 * Handles OAuth provider callbacks and redirects
 */

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Container
} from '@mui/material';
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material';
import { OAuthProviderType, OAuthCallbackParams } from '../types/oauth';
import { useOAuth } from '../hooks/useOAuth';
import { useAuthContext } from '../hooks/useAuth';

export const OAuthCallback: React.FC = () => {
  const { provider } = useParams<{ provider: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useOAuth();
  const { isAuthenticated } = useAuthContext();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Przetwarzanie uwierzytelnienia...');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        if (!provider) {
          throw new Error('Brak dostawcy OAuth w URL');
        }

        // Validate provider
        const providerType = provider.toUpperCase() as OAuthProviderType;
        if (!Object.values(OAuthProviderType).includes(providerType)) {
          throw new Error(`Nieznany dostawca OAuth: ${provider}`);
        }

        // Extract callback parameters
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        const callbackParams: OAuthCallbackParams = {
          provider: providerType,
          code: code || '',
          state: state || undefined,
          error: error || undefined,
          error_description: errorDescription || undefined
        };

        setMessage(`Uwierzytelnianie przez ${providerType}...`);

        // Handle the callback
        const response = await handleOAuthCallback(callbackParams);
        
        setStatus('success');
        setMessage(
          response.isNewUser 
            ? 'Konto zostało utworzone pomyślnie!' 
            : 'Uwierzytelnienie zakończone pomyślnie!'
        );

        // Redirect after short delay
        setTimeout(() => {
          const returnUrl = sessionStorage.getItem('oauth_return_url') || '/dashboard';
          navigate(returnUrl, { replace: true });
        }, 2000);

      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setError(err.message || 'Wystąpił błąd podczas uwierzytelniania');
        setMessage('Uwierzytelnienie nie powiodło się');

        // Redirect to auth page after delay
        setTimeout(() => {
          navigate('/auth', { replace: true });
        }, 5000);
      }
    };

    processCallback();
  }, [provider, searchParams, handleOAuthCallback, navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <CircularProgress size={48} color="primary" />;
      case 'success':
        return <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />;
      default:
        return <CircularProgress size={48} color="primary" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        textAlign="center"
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            minWidth: 300,
            maxWidth: 500
          }}
        >
          {/* Status Icon */}
          <Box mb={3}>
            {getStatusIcon()}
          </Box>

          {/* Status Message */}
          <Typography variant="h5" gutterBottom fontWeight="medium">
            {message}
          </Typography>

          {/* Provider Information */}
          {provider && (
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Dostawca: {provider.charAt(0).toUpperCase() + provider.slice(1)}
            </Typography>
          )}

          {/* Error Details */}
          {status === 'error' && error && (
            <Alert severity="error" sx={{ mt: 2, textAlign: 'left' }}>
              <Typography variant="body2">
                {error}
              </Typography>
            </Alert>
          )}

          {/* Success Information */}
          {status === 'success' && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Zostaniesz przekierowany automatycznie...
              </Typography>
              {isAuthenticated && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Jesteś teraz zalogowany do systemu EDITH
                  </Typography>
                </Alert>
              )}
            </Box>
          )}

          {/* Loading Information */}
          {status === 'loading' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Proszę czekać, trwa przetwarzanie danych uwierzytelniania...
            </Typography>
          )}

          {/* Error Recovery */}
          {status === 'error' && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Przekierowanie do strony logowania za 5 sekund...
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default OAuthCallback;
