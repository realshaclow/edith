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
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Assignment as MaterialIcon
} from '@mui/icons-material';

interface MaterialsEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const MaterialsEditor: React.FC<MaterialsEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  const materials = protocol.materials || [];
  const [newMaterial, setNewMaterial] = React.useState('');

  const handleMaterialAdd = () => {
    if (newMaterial.trim()) {
      updateProtocol({
        materials: [...materials, newMaterial.trim()]
      });
      setNewMaterial('');
    }
  };

  const handleMaterialRemove = (index: number) => {
    const newMaterials = [...materials];
    newMaterials.splice(index, 1);
    updateProtocol({ materials: newMaterials });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleMaterialAdd();
    }
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Materiały i odczynniki
      </Typography>

      <Card>
        <CardHeader
          avatar={<MaterialIcon />}
          title="Lista wymaganych materiałów"
          subheader="Wszystkie materiały, odczynniki i próbki potrzebne do badania"
        />
        <CardContent>
          {/* Dodawanie nowego materiału */}
          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <TextField
              label="Nowy materiał"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              onKeyPress={handleKeyPress}
              fullWidth
              placeholder="np. Próbki testowe (1-2g), Woda destylowana, Rękawice laboratoryjne"
            />
            <Button
              onClick={handleMaterialAdd}
              variant="contained"
              disabled={!newMaterial.trim()}
              sx={{ minWidth: 120 }}
            >
              Dodaj
            </Button>
          </Box>

          {/* Lista materiałów */}
          {materials.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <MaterialIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Brak dodanych materiałów
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dodaj materiały używając pola powyżej
              </Typography>
            </Box>
          ) : (
            <List>
              {materials.map((material: string, index: number) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={index + 1}
                          size="small"
                          color="primary"
                          sx={{ minWidth: 24 }}
                        />
                        {material}
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => handleMaterialRemove(index)}
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
          {errors.materials && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errors.materials}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Podgląd */}
      {materials.length > 0 && (
        <Card sx={{ mt: 3, border: '2px dashed #ccc' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Podgląd listy materiałów:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {materials.map((material: string, index: number) => (
                <Typography key={index} variant="body2">
                  • {material}
                </Typography>
              ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default MaterialsEditor;
