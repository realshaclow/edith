import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  IconButton,
  Button
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface OverviewEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const OverviewEditor: React.FC<OverviewEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  const overview = protocol.overview || {};

  const handleOverviewChange = (field: string, value: any) => {
    updateProtocol({
      overview: {
        ...overview,
        [field]: value
      }
    });
  };

  const handleStandardAdd = () => {
    const standards = overview.standards || [];
    handleOverviewChange('standards', [...standards, '']);
  };

  const handleStandardChange = (index: number, value: string) => {
    const standards = [...(overview.standards || [])];
    standards[index] = value;
    handleOverviewChange('standards', standards);
  };

  const handleStandardRemove = (index: number) => {
    const standards = [...(overview.standards || [])];
    standards.splice(index, 1);
    handleOverviewChange('standards', standards);
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Przegląd protokołu
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardHeader 
          title="Cel i zakres badania"
          sx={{ pb: 1 }}
        />
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Cel badania */}
            <TextField
              label="Cel badania (Purpose)"
              value={overview.purpose || ''}
              onChange={(e) => handleOverviewChange('purpose', e.target.value)}
              error={!!errors.overviewPurpose}
              helperText={errors.overviewPurpose || 'Opisz po co wykonuje się to badanie'}
              fullWidth
              required
              multiline
              rows={3}
              placeholder="Określenie... w celu..."
            />

            {/* Zakres zastosowania */}
            <TextField
              label="Zakres zastosowania (Scope)"
              value={overview.scope || ''}
              onChange={(e) => handleOverviewChange('scope', e.target.value)}
              error={!!errors.overviewScope}
              helperText={errors.overviewScope || 'Do jakich materiałów/przypadków stosuje się badanie'}
              fullWidth
              required
              multiline
              rows={3}
              placeholder="Stosowane do... materiałów w przypadku..."
            />

            {/* Zasady badania */}
            <TextField
              label="Zasady badania (Principles)"
              value={overview.principles || ''}
              onChange={(e) => handleOverviewChange('principles', e.target.value)}
              error={!!errors.overviewPrinciples}
              helperText={errors.overviewPrinciples || 'Krótko opisz na jakiej zasadzie fizycznej/chemicznej opiera się badanie'}
              fullWidth
              required
              multiline
              rows={3}
              placeholder="Badanie opiera się na..."
            />
          </Box>
        </CardContent>
      </Card>

      {/* Normy i standardy */}
      <Card>
        <CardHeader 
          title="Normy i standardy"
          action={
            <Button
              startIcon={<AddIcon />}
              onClick={handleStandardAdd}
              variant="outlined"
              size="small"
            >
              Dodaj normę
            </Button>
          }
        />
        <CardContent>
          {(!overview.standards || overview.standards.length === 0) ? (
            <Typography color="text.secondary" sx={{ fontStyle: 'italic', py: 2 }}>
              Brak dodanych norm. Kliknij "Dodaj normę" aby dodać pierwszą.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {overview.standards.map((standard: string, index: number) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <TextField
                    label={`Norma ${index + 1}`}
                    value={standard}
                    onChange={(e) => handleStandardChange(index, e.target.value)}
                    fullWidth
                    placeholder="np. ISO 1133-1:2019, ASTM D412-16"
                    helperText={index === 0 ? "Podaj pełną nazwę normy z rokiem" : undefined}
                  />
                  <IconButton
                    onClick={() => handleStandardRemove(index)}
                    color="error"
                    sx={{ mt: index === 0 ? 1 : 0 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Podgląd */}
      {(overview.purpose || overview.scope || overview.principles) && (
        <Card sx={{ mt: 3, border: '2px dashed #ccc' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Podgląd przeglądu:
            </Typography>
            
            {overview.purpose && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">Cel badania:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {overview.purpose}
                </Typography>
              </Box>
            )}

            {overview.scope && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">Zakres zastosowania:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {overview.scope}
                </Typography>
              </Box>
            )}

            {overview.principles && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" fontWeight="bold">Zasady badania:</Typography>
                <Typography variant="body2" color="text.secondary">
                  {overview.principles}
                </Typography>
              </Box>
            )}

            {overview.standards && overview.standards.length > 0 && (
              <Box>
                <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                  Normy i standardy:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {overview.standards.filter((s: string) => s.trim()).map((standard: string, index: number) => (
                    <Chip
                      key={index}
                      label={standard}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default OverviewEditor;
