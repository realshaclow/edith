/**
 * OAuth Account List Component
 * Display and manage linked OAuth accounts
 */

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Button,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Google,
  GitHub,
  Microsoft,
  Delete as DeleteIcon,
  LinkOff as UnlinkIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import { OAuthProviderType, OAuthAccountListProps } from '../types/oauth';
import { useOAuth } from '../hooks/useOAuth';

// Provider icons mapping
const PROVIDER_ICONS = {
  [OAuthProviderType.GOOGLE]: Google,
  [OAuthProviderType.GITHUB]: GitHub,
  [OAuthProviderType.MICROSOFT]: Microsoft
};

// Provider colors mapping
const PROVIDER_COLORS = {
  [OAuthProviderType.GOOGLE]: '#db4437',
  [OAuthProviderType.GITHUB]: '#333333',
  [OAuthProviderType.MICROSOFT]: '#00a1f1'
};

export const OAuthAccountList: React.FC<OAuthAccountListProps> = ({
  accounts,
  onUnlink,
  showActions = true
}) => {
  const theme = useTheme();
  const { unlinkOAuthAccount, getProviderInfo } = useOAuth();
  const [unlinkDialog, setUnlinkDialog] = useState<{
    open: boolean;
    provider: OAuthProviderType | null;
    email: string;
  }>({
    open: false,
    provider: null,
    email: ''
  });
  const [isUnlinking, setIsUnlinking] = useState(false);

  if (!accounts || accounts.length === 0) {
    return (
      <Card>
        <CardContent>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Brak połączonych kont OAuth
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const handleUnlinkClick = (provider: OAuthProviderType, email: string) => {
    setUnlinkDialog({
      open: true,
      provider,
      email
    });
  };

  const handleUnlinkConfirm = async () => {
    if (!unlinkDialog.provider) return;

    setIsUnlinking(true);
    try {
      await unlinkOAuthAccount(unlinkDialog.provider);
      
      if (onUnlink) {
        onUnlink(unlinkDialog.provider);
      }
    } catch (error) {
      console.error('Failed to unlink account:', error);
    } finally {
      setIsUnlinking(false);
      setUnlinkDialog({ open: false, provider: null, email: '' });
    }
  };

  const handleUnlinkCancel = () => {
    setUnlinkDialog({ open: false, provider: null, email: '' });
  };

  const getProviderDisplayName = (provider: OAuthProviderType): string => {
    const info = getProviderInfo(provider);
    return info?.displayName || provider;
  };

  const getProviderIcon = (provider: OAuthProviderType) => {
    const IconComponent = PROVIDER_ICONS[provider];
    const color = PROVIDER_COLORS[provider];
    return <IconComponent sx={{ color }} />;
  };

  const formatLastUsed = (lastUsed?: string): string => {
    if (!lastUsed) return 'Nigdy';
    
    try {
      const date = new Date(lastUsed);
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: pl 
      });
    } catch {
      return 'Nieznane';
    }
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Połączone konta OAuth
          </Typography>
          
          <List>
            {accounts.map((account, index) => (
              <ListItem
                key={`${account.provider}-${account.email}`}
                divider={index < accounts.length - 1}
                sx={{ px: 0 }}
              >
                <ListItemIcon>
                  {getProviderIcon(account.provider)}
                </ListItemIcon>
                
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1">
                        {getProviderDisplayName(account.provider)}
                      </Typography>
                      {account.isLinked && (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Połączone"
                          size="small"
                          color="success"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {account.email}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Ostatnie użycie: {formatLastUsed(account.lastUsed)}
                      </Typography>
                      {account.linkedAt && (
                        <Typography variant="caption" color="text.secondary" display="block">
                          Połączone: {formatLastUsed(account.linkedAt)}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                
                {showActions && account.isLinked && (
                  <ListItemSecondaryAction>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<UnlinkIcon />}
                      onClick={() => handleUnlinkClick(account.provider, account.email)}
                    >
                      Rozłącz
                    </Button>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Unlink Confirmation Dialog */}
      <Dialog
        open={unlinkDialog.open}
        onClose={handleUnlinkCancel}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Rozłącz konto OAuth
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Czy na pewno chcesz rozłączyć konto?
            </Typography>
          </Alert>
          <Typography variant="body1" gutterBottom>
            <strong>Dostawca:</strong> {unlinkDialog.provider && getProviderDisplayName(unlinkDialog.provider)}
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {unlinkDialog.email}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Po rozłączeniu nie będziesz mógł używać tego konta do logowania. 
            Będziesz mógł je ponownie połączyć w dowolnym momencie.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleUnlinkCancel}
            disabled={isUnlinking}
          >
            Anuluj
          </Button>
          <Button
            onClick={handleUnlinkConfirm}
            color="error"
            variant="contained"
            disabled={isUnlinking}
            startIcon={isUnlinking ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {isUnlinking ? 'Rozłączanie...' : 'Rozłącz'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OAuthAccountList;
