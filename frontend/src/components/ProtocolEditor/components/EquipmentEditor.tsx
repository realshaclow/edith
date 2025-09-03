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
  Grid,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Science as ScienceIcon
} from '@mui/icons-material';
import { createEmptyEquipment } from '../utils/helpers';

interface EquipmentEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const EquipmentEditor: React.FC<EquipmentEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  const equipment = protocol.equipment || [];

  const handleEquipmentAdd = () => {
    updateProtocol({
      equipment: [...equipment, createEmptyEquipment()]
    });
  };

  const handleEquipmentChange = (index: number, field: 'name' | 'specification', value: string) => {
    const newEquipment = [...equipment];
    newEquipment[index] = {
      ...newEquipment[index],
      [field]: value
    };
    updateProtocol({ equipment: newEquipment });
  };

  const handleEquipmentRemove = (index: number) => {
    const newEquipment = [...equipment];
    newEquipment.splice(index, 1);
    updateProtocol({ equipment: newEquipment });
  };

  const getEquipmentError = (index: number, field: string) => {
    return errors[`equipment-${index}-${field}`];
  };

  return (
    <Box sx={{ maxWidth: 900 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Wyposażenie laboratoryjne
      </Typography>

      <Card>
        <CardHeader
          avatar={<ScienceIcon />}
          title="Lista wymagań sprzętowych"
          subheader="Określ wszystkie urządzenia i narzędzia potrzebne do przeprowadzenia badania"
          action={
            <Button
              startIcon={<AddIcon />}
              onClick={handleEquipmentAdd}
              variant="contained"
              size="small"
            >
              Dodaj urządzenie
            </Button>
          }
        />
        <CardContent>
          {equipment.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <ScienceIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Brak dodanego wyposażenia
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleEquipmentAdd}
                variant="outlined"
              >
                Dodaj pierwsze urządzenie
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {equipment.map((item: any, index: number) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        Urządzenie #{index + 1}
                      </Typography>
                      <IconButton
                        onClick={() => handleEquipmentRemove(index)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={5}>
                        <TextField
                          label="Nazwa urządzenia"
                          value={item.name || ''}
                          onChange={(e) => handleEquipmentChange(index, 'name', e.target.value)}
                          error={!!getEquipmentError(index, 'name')}
                          helperText={getEquipmentError(index, 'name') || 'np. Waga analityczna, Termometr'}
                          fullWidth
                          required
                          placeholder="Wprowadź nazwę urządzenia"
                        />
                      </Grid>
                      <Grid item xs={12} md={7}>
                        <TextField
                          label="Specyfikacja/Wymagania"
                          value={item.specification || ''}
                          onChange={(e) => handleEquipmentChange(index, 'specification', e.target.value)}
                          error={!!getEquipmentError(index, 'specification')}
                          helperText={getEquipmentError(index, 'specification') || 'Dokładność, zakres, standardy'}
                          fullWidth
                          required
                          placeholder="np. Dokładność ±0.1mg, zakres 0-200g"
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {/* Ogólny błąd wyposażenia */}
          {errors.equipment && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {errors.equipment}
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Podgląd listy wyposażenia */}
      {equipment.length > 0 && equipment.some((item: any) => item.name && item.specification) && (
        <Card sx={{ mt: 3, border: '2px dashed #ccc' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Podgląd listy wyposażenia:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {equipment
                .filter((item: any) => item.name && item.specification)
                .map((item: any, index: number) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Chip
                      label={index + 1}
                      size="small"
                      color="primary"
                      sx={{ minWidth: 24, fontSize: '0.75rem' }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.specification}
                      </Typography>
                    </Box>
                  </Box>
                ))}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default EquipmentEditor;
