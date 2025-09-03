import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Card,
  CardContent,
  FormHelperText,
  Chip
} from '@mui/material';
import { PROTOCOL_CATEGORIES, PROTOCOL_DIFFICULTIES } from '../types/protocol';

interface BasicInfoEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const BasicInfoEditor: React.FC<BasicInfoEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  const handleChange = (field: string, value: any) => {
    updateProtocol({ [field]: value });
  };

  return (
    <Box sx={{ maxWidth: 800 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Podstawowe informacje o protokole
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* ID Protokołu */}
            <TextField
              label="ID Protokołu"
              value={protocol.id || ''}
              onChange={(e) => handleChange('id', e.target.value)}
              error={!!errors.id}
              helperText={errors.id || 'Unikalny identyfikator protokołu (np. iso-1133-mfr)'}
              fullWidth
              required
            />

            {/* Tytuł */}
            <TextField
              label="Tytuł protokołu"
              value={protocol.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title || 'Pełny tytuł protokołu badawczego'}
              fullWidth
              required
              multiline
              rows={2}
            />

            {/* Opis */}
            <TextField
              label="Opis protokołu"
              value={protocol.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              error={!!errors.description}
              helperText={errors.description || 'Krótki opis tego co protokół bada'}
              fullWidth
              required
              multiline
              rows={3}
            />

            {/* Kategoria i Trudność w jednym rzędzie */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Kategoria badania</InputLabel>
                <Select
                  value={protocol.category || ''}
                  onChange={(e) => handleChange('category', e.target.value)}
                  label="Kategoria badania"
                  required
                >
                  {PROTOCOL_CATEGORIES.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          size="small"
                          sx={{
                            backgroundColor: category.color,
                            color: 'white',
                            minWidth: 16,
                            height: 16
                          }}
                        />
                        {category.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>

              <FormControl fullWidth error={!!errors.difficulty}>
                <InputLabel>Poziom trudności</InputLabel>
                <Select
                  value={protocol.difficulty || ''}
                  onChange={(e) => handleChange('difficulty', e.target.value)}
                  label="Poziom trudności"
                  required
                >
                  {PROTOCOL_DIFFICULTIES.map((difficulty) => (
                    <MenuItem key={difficulty.value} value={difficulty.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          size="small"
                          sx={{
                            backgroundColor: difficulty.color,
                            color: 'white',
                            minWidth: 16,
                            height: 16
                          }}
                        />
                        {difficulty.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.difficulty && <FormHelperText>{errors.difficulty}</FormHelperText>}
              </FormControl>
            </Box>

            {/* Szacowany czas trwania */}
            <TextField
              label="Szacowany czas trwania"
              value={protocol.estimatedDuration || ''}
              onChange={(e) => handleChange('estimatedDuration', e.target.value)}
              error={!!errors.estimatedDuration}
              helperText={errors.estimatedDuration || 'np. "45-60 minut na próbkę", "2-4 godziny"'}
              fullWidth
              required
              placeholder="np. 45-60 minut na próbkę"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Podgląd na żywo */}
      {protocol.title && (
        <Card sx={{ border: '2px dashed #ccc' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Podgląd:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
              {protocol.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {protocol.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {protocol.category && (
                <Chip
                  label={PROTOCOL_CATEGORIES.find(c => c.value === protocol.category)?.label}
                  size="small"
                  sx={{
                    backgroundColor: PROTOCOL_CATEGORIES.find(c => c.value === protocol.category)?.color,
                    color: 'white'
                  }}
                />
              )}
              {protocol.difficulty && (
                <Chip
                  label={PROTOCOL_DIFFICULTIES.find(d => d.value === protocol.difficulty)?.label}
                  size="small"
                  sx={{
                    backgroundColor: PROTOCOL_DIFFICULTIES.find(d => d.value === protocol.difficulty)?.color,
                    color: 'white'
                  }}
                />
              )}
              {protocol.estimatedDuration && (
                <Chip
                  label={`⏱️ ${protocol.estimatedDuration}`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BasicInfoEditor;
