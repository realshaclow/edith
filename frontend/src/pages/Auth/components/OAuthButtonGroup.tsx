/**
 * OAuth Button Group Component
 * Professional OAuth buttons group with multiple providers
 */

import React from 'react';
import {
  Stack,
  Divider,
  Typography,
  Alert,
  Box
} from '@mui/material';
import { OAuthProviderType, OAuthButtonGroupProps } from '../types/oauth';
import { useOAuth } from '../hooks/useOAuth';
import OAuthButton from './OAuthButton';

export const OAuthButtonGroup: React.FC<OAuthButtonGroupProps> = ({
  mode = 'login',
  providers,
  disabled = false,
  orientation = 'vertical',
  onSuccess,
  onError
}) => {
  const { availableProviders, oauthState } = useOAuth();

  // Filter providers based on props or use all available
  const displayProviders = providers 
    ? availableProviders.filter(p => providers.includes(p.id) && p.enabled)
    : availableProviders.filter(p => p.enabled);

  if (displayProviders.length === 0) {
    return null;
  }

  const getModeText = () => {
    switch (mode) {
      case 'login':
        return 'Zaloguj się przez';
      case 'register':
        return 'Zarejestruj się przez';
      case 'link':
        return 'Połącz konta';
      default:
        return 'Uwierzytelnij się przez';
    }
  };

  return (
    <Box>
      {/* Header */}
      {mode !== 'link' && (
        <Typography 
          variant="body2" 
          color="text.secondary" 
          textAlign="center" 
          sx={{ mb: 2 }}
        >
          {getModeText()}
        </Typography>
      )}

      {/* Error Display */}
      {oauthState.error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>{oauthState.error.provider}:</strong> {oauthState.error.error}
          </Typography>
          {oauthState.error.error_description && (
            <Typography variant="caption" display="block" sx={{ mt: 0.5, opacity: 0.8 }}>
              {oauthState.error.error_description}
            </Typography>
          )}
        </Alert>
      )}

      {/* OAuth Buttons */}
      <Stack 
        direction={orientation === 'horizontal' ? 'row' : 'column'}
        spacing={2}
        sx={{ width: '100%' }}
      >
        {displayProviders.map((provider) => (
          <OAuthButton
            key={provider.id}
            provider={provider.id}
            mode={mode}
            disabled={disabled}
            fullWidth={orientation === 'vertical'}
            variant="outlined"
            size="medium"
            onSuccess={onSuccess}
            onError={onError}
          />
        ))}
      </Stack>

      {/* Link Mode Additional Info */}
      {mode === 'link' && (
        <Typography 
          variant="caption" 
          color="text.secondary" 
          textAlign="center" 
          sx={{ mt: 2, display: 'block' }}
        >
          Połączone konta umożliwiają szybsze logowanie i synchronizację danych
        </Typography>
      )}
    </Box>
  );
};

export default OAuthButtonGroup;
