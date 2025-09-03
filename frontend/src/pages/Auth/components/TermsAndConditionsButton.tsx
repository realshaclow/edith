import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Gavel as GavelIcon } from '@mui/icons-material';
import TermsAndConditions from './TermsAndConditions';

interface TermsAndConditionsButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children?: React.ReactNode;
  showAcceptButton?: boolean;
  onAccept?: () => void;
  sx?: any;
}

/**
 * Przycisk otwierający modal z regulaminem i polityką prywatności
 * Może być używany w dowolnym miejscu w aplikacji
 */
const TermsAndConditionsButton: React.FC<TermsAndConditionsButtonProps> = ({
  variant = 'text',
  size = 'medium',
  fullWidth = false,
  children,
  showAcceptButton = false,
  onAccept,
  sx
}) => {
  const [open, setOpen] = useState(false);

  const handleAccept = () => {
    if (onAccept) {
      onAccept();
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        startIcon={<GavelIcon />}
        onClick={() => setOpen(true)}
        sx={sx}
      >
        {children || 'Regulamin i Polityka Prywatności'}
      </Button>

      <TermsAndConditions
        open={open}
        onClose={() => setOpen(false)}
        onAccept={handleAccept}
        showAcceptButton={showAcceptButton}
      />
    </>
  );
};

export default TermsAndConditionsButton;
