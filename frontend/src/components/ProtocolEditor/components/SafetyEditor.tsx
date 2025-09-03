import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

interface SafetyEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const SafetyEditor: React.FC<SafetyEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  const safetyGuidelines = protocol.safetyGuidelines || [];
  const [newGuideline, setNewGuideline] = React.useState('');

  const handleGuidelineAdd = () => {
    if (newGuideline.trim()) {
      updateProtocol({
        safetyGuidelines: [...safetyGuidelines, newGuideline.trim()]
      });
      setNewGuideline('');
    }
  };

  const handleGuidelineRemove = (index: number) => {
    const newGuidelines = [...safetyGuidelines];
    newGuidelines.splice(index, 1);
    updateProtocol({ safetyGuidelines: newGuidelines });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGuidelineAdd();
    }
  };

  const commonSafetyItems = [
    'Noś okulary ochronne podczas całego badania',
    'Używaj rękawic laboratoryjnych przy manipulacji chemikaliami',
    'Pracuj w dobrze wentylowanym pomieszczeniu',
    'Sprawdź działanie wyciągu/okapu przed rozpoczęciem',
    'Nie jedz ani nie pij w laboratorium',
    'Zapoznaj się z kartami charakterystyki używanych substancji',
    'Przygotuj środki gaśnicze na wypadek pożaru',
    'Sprawdź lokalizację pryszniców bezpieczeństwa',
    'Nie pozostawiaj pracujących urządzeń bez nadzoru'
  ];

  const addCommonItem = (item: string) => {
    if (!safetyGuidelines.includes(item)) {
      updateProtocol({
        safetyGuidelines: [...safetyGuidelines, item]
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Wytyczne bezpieczeństwa
      </Typography>

      <Alert severity="warning" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Bezpieczeństwo jest najważniejsze! Zawsze uwzględnij wszystkie potencjalne zagrożenia 
          związane z używanym sprzętem, materiałami i procedurami.
        </Typography>
      </Alert>

      <Card>
        <CardHeader
          avatar={<SecurityIcon />}
          title="Zasady bezpieczeństwa"
          subheader="Wszystkie środki ostrożności i procedury bezpieczeństwa"
        />
        <CardContent>
          {/* Dodawanie nowej wytycznej */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              label="Nowa wytyczna bezpieczeństwa"
              value={newGuideline}
              onChange={(e) => setNewGuideline(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              multiline
              rows={2}
              placeholder="np. Noś rękawice termiczne przy pracy z gorącymi materiałami"
            />
            <Button
              onClick={handleGuidelineAdd}
              variant="contained"
              disabled={!newGuideline.trim()}
              sx={{ minWidth: 120, alignSelf: 'flex-start' }}
            >
              Dodaj
            </Button>
          </Box>

          {/* Często używane wytyczne */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Często używane wytyczne:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {commonSafetyItems.map((item, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  size="small"
                  onClick={() => addCommonItem(item)}
                  disabled={safetyGuidelines.includes(item)}
                  sx={{ fontSize: '0.75rem' }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          </Box>

          {/* Lista wytycznych */}
          {safetyGuidelines.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <WarningIcon sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Brak wytycznych bezpieczeństwa
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dodaj wytyczne używając pola powyżej lub wybierając z często używanych
              </Typography>
            </Box>
          ) : (
            <List>
              {safetyGuidelines.map((guideline: string, index: number) => (
                <ListItem key={index} divider>
                  <ListItemIcon>
                    <WarningIcon color="warning" />
                  </ListItemIcon>
                  <ListItemText primary={guideline} />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleGuidelineRemove(index)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}

          {/* Błąd walidacji */}
          {errors.safetyGuidelines && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errors.safetyGuidelines}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Podgląd */}
      {safetyGuidelines.length > 0 && (
        <Card sx={{ mt: 3, border: '2px dashed #ccc' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Podgląd wytycznych bezpieczeństwa:
            </Typography>
            
            <Alert severity="warning" sx={{ backgroundColor: '#fff3e0' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {safetyGuidelines.map((guideline: string, index: number) => (
                  <Typography key={index} variant="body2">
                    ⚠️ {guideline}
                  </Typography>
                ))}
              </Box>
            </Alert>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default SafetyEditor;
