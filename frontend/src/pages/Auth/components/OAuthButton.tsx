/**
 * OAuth Button Component
 * Professional OAuth authentication button
 */

import React from 'react';
import {
  Button,
  CircularProgress,
  Box,
  Typography,
  useTheme
} from '@mui/material';
import {
  Google,
  GitHub
} from '@mui/icons-material';
import { OAuthProviderType, OAuthButtonProps } from '../types/oauth';
import { useOAuth } from '../hooks/useOAuth';
import { MicrosoftIcon } from './icons';

// Provider icons mapping - updated
const PROVIDER_ICONS: Record<OAuthProviderType, React.ComponentType<any>> = {
  [OAuthProviderType.GOOGLE]: Google,
  [OAuthProviderType.GITHUB]: GitHub,
  [OAuthProviderType.MICROSOFT]: MicrosoftIcon
};

// Provider colors mapping
const PROVIDER_COLORS = {
  [OAuthProviderType.GOOGLE]: '#db4437',
  [OAuthProviderType.GITHUB]: '#333333',
  [OAuthProviderType.MICROSOFT]: '#00a1f1'
};

export const OAuthButton: React.FC<OAuthButtonProps> = ({
  provider,
  mode = 'login',
  disabled = false,
  fullWidth = true,
  variant = 'outlined',
  size = 'medium',
  onSuccess,
  onError,
  children
}) => {
  const theme = useTheme();
  const { 
    authenticateWithOAuth, 
    linkOAuthAccount, 
    oauthState, 
    getProviderInfo,
    isProviderLinked 
  } = useOAuth();

  const providerInfo = getProviderInfo(provider);
  const IconComponent = PROVIDER_ICONS[provider];
  const providerColor = PROVIDER_COLORS[provider];
  
  const isLoading = oauthState.isAuthenticating || oauthState.isLinking;
  const isCurrentProvider = oauthState.provider === provider;
  const isLinked = isProviderLinked(provider);

  if (!providerInfo || !providerInfo.enabled) {
    return null;
  }

  const handleClick = async () => {
    try {
      if (mode === 'link') {
        await linkOAuthAccount(provider);
      } else {
        await authenticateWithOAuth(provider);
      }
    } catch (error: any) {
      if (onError) {
        onError(error);
      } else {
        console.error('OAuth authentication failed:', error);
      }
    }
  };

  const getButtonText = () => {
    if (children) return children;
    
    const actionText = mode === 'login' ? 'Zaloguj się przez' : 
                     mode === 'register' ? 'Zarejestruj się przez' : 
                     'Połącz konto';
    
    return `${actionText} ${providerInfo.displayName}`;
  };

  const getButtonColor = () => {
    if (variant === 'contained') {
      return providerColor;
    }
    return theme.palette.mode === 'dark' ? 'inherit' : 'primary';
  };

  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      disabled={disabled || isLoading || (mode === 'link' && isLinked)}
      onClick={handleClick}
      startIcon={
        isLoading && isCurrentProvider ? (
          <CircularProgress size={20} />
        ) : (
          <IconComponent />
        )
      }
      sx={{
        py: size === 'large' ? 1.5 : size === 'small' ? 1 : 1.25,
        px: 2,
        color: variant === 'outlined' ? providerColor : 'white',
        backgroundColor: variant === 'contained' ? providerColor : 'transparent',
        borderColor: variant === 'outlined' ? providerColor : 'transparent',
        '&:hover': {
          backgroundColor: variant === 'contained' 
            ? `${providerColor}dd` 
            : `${providerColor}08`,
          borderColor: providerColor
        },
        '&:disabled': {
          opacity: 0.6
        }
      }}
    >
      <Typography variant="body2" fontWeight="medium">
        {getButtonText()}
      </Typography>
      {mode === 'link' && isLinked && (
        <Box component="span" sx={{ ml: 1, fontSize: '0.75rem', opacity: 0.7 }}>
          (Połączone)
        </Box>
      )}
    </Button>
  );
};

export default OAuthButton;
