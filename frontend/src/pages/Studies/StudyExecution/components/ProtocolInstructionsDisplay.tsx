import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Alert,
  Divider,
  IconButton,
  Tooltip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  ExpandMore as ExpandIcon,
  Assignment as InstructionIcon,
  Warning as WarningIcon,
  Build as EquipmentIcon,
  Science as MaterialIcon,
  Thermostat as TemperatureIcon,
  Speed as PressureIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Timeline as StepIcon,
  Help as HelpIcon,
  Fullscreen as FullscreenIcon
} from '@mui/icons-material';
import { ProtocolInstructions, TroubleshootingItem } from '../types';

interface ProtocolInstructionsDisplayProps {
  instructions: ProtocolInstructions;
  compact?: boolean;
  showFullscreen?: boolean;
  onParameterChange?: (parameter: string, value: any) => void;
}

const ProtocolInstructionsDisplay: React.FC<ProtocolInstructionsDisplayProps> = ({
  instructions,
  compact = false,
  showFullscreen = false,
  onParameterChange
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    overview: true,
    instructions: true,
    safety: false,
    equipment: false,
    conditions: false,
    troubleshooting: false,
    quality: false
  });
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}min` : ''}`;
  };

  const InstructionsContent = () => (
    <Box>
      {/* Header with key info */}
      <Box mb={3}>
        <Typography variant="h6" gutterBottom>
          {instructions.title}
        </Typography>
        
        <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
          <Chip 
            icon={<StepIcon />}
            label={`Czas: ${formatDuration(instructions.duration)}`}
            color="primary"
            variant="outlined"
          />
          {instructions.temperature && (
            <Chip 
              icon={<TemperatureIcon />}
              label={`${instructions.temperature}°C`}
              color="info"
              variant="outlined"
            />
          )}
          {instructions.pressure && (
            <Chip 
              icon={<PressureIcon />}
              label={`${instructions.pressure} bar`}
              color="info"
              variant="outlined"
            />
          )}
        </Box>

        {instructions.overview && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              {instructions.overview}
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Main Instructions */}
      <Accordion 
        expanded={expandedSections.instructions}
        onChange={() => toggleSection('instructions')}
      >
        <AccordionSummary expandIcon={<ExpandIcon />}>
          <Box display="flex" alignItems="center" gap={1}>
            <InstructionIcon color="primary" />
            <Typography variant="subtitle1" fontWeight="bold">
              Instrukcje wykonania
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <List dense>
            {instructions.detailedInstructions.map((instruction, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      backgroundColor: 'primary.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 24,
                      height: 24,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem'
                    }}
                  >
                    {index + 1}
                  </Typography>
                </ListItemIcon>
                <ListItemText 
                  primary={instruction}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </AccordionDetails>
      </Accordion>

      {/* Safety Guidelines */}
      {instructions.safetyGuidelines && instructions.safetyGuidelines.length > 0 && (
        <Accordion 
          expanded={expandedSections.safety}
          onChange={() => toggleSection('safety')}
        >
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <WarningIcon color="warning" />
              <Typography variant="subtitle1" fontWeight="bold">
                Zasady bezpieczeństwa
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="warning" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Przed rozpoczęciem wykonania koniecznie zapoznaj się z zasadami bezpieczeństwa!
              </Typography>
            </Alert>
            <List dense>
              {instructions.safetyGuidelines.map((guideline, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <WarningIcon color="warning" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={guideline}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Equipment */}
      {instructions.equipment && instructions.equipment.length > 0 && (
        <Accordion 
          expanded={expandedSections.equipment}
          onChange={() => toggleSection('equipment')}
        >
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <EquipmentIcon color="info" />
              <Typography variant="subtitle1" fontWeight="bold">
                Wymagane wyposażenie
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" gap={1} flexWrap="wrap">
              {instructions.equipment.map((item, index) => (
                <Chip 
                  key={index}
                  label={item}
                  icon={<EquipmentIcon />}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Materials */}
      {instructions.materials && instructions.materials.length > 0 && (
        <Accordion 
          expanded={expandedSections.equipment}
          onChange={() => toggleSection('equipment')}
        >
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <MaterialIcon color="info" />
              <Typography variant="subtitle1" fontWeight="bold">
                Materiały i odczynniki
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" gap={1} flexWrap="wrap">
              {instructions.materials.map((item, index) => (
                <Chip 
                  key={index}
                  label={item}
                  icon={<MaterialIcon />}
                  variant="outlined"
                  size="small"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Special Conditions */}
      {instructions.specialConditions && instructions.specialConditions.length > 0 && (
        <Accordion 
          expanded={expandedSections.conditions}
          onChange={() => toggleSection('conditions')}
        >
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <InfoIcon color="info" />
              <Typography variant="subtitle1" fontWeight="bold">
                Warunki specjalne
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {instructions.specialConditions.map((condition, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <InfoIcon color="info" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={condition}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Critical Points */}
      {instructions.criticalPoints && instructions.criticalPoints.length > 0 && (
        <Accordion 
          expanded={expandedSections.quality}
          onChange={() => toggleSection('quality')}
        >
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <ErrorIcon color="error" />
              <Typography variant="subtitle1" fontWeight="bold">
                Punkty krytyczne
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Alert severity="error" sx={{ mb: 2 }}>
              <Typography variant="body2" fontWeight="bold">
                Zwróć szczególną uwagę na poniższe punkty krytyczne!
              </Typography>
            </Alert>
            <List dense>
              {instructions.criticalPoints.map((point, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ErrorIcon color="error" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={point}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 'bold' }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Quality Controls */}
      {instructions.qualityControls && instructions.qualityControls.length > 0 && (
        <Accordion 
          expanded={expandedSections.quality}
          onChange={() => toggleSection('quality')}
        >
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <CheckIcon color="success" />
              <Typography variant="subtitle1" fontWeight="bold">
                Kontrola jakości
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <List dense>
              {instructions.qualityControls.map((control, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CheckIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={control}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Troubleshooting */}
      {instructions.troubleshooting && instructions.troubleshooting.length > 0 && (
        <Accordion 
          expanded={expandedSections.troubleshooting}
          onChange={() => toggleSection('troubleshooting')}
        >
          <AccordionSummary expandIcon={<ExpandIcon />}>
            <Box display="flex" alignItems="center" gap={1}>
              <HelpIcon color="warning" />
              <Typography variant="subtitle1" fontWeight="bold">
                Rozwiązywanie problemów
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box display="flex" flexDirection="column" gap={2}>
              {instructions.troubleshooting.map((item, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="error" gutterBottom>
                      Problem: {item.problem}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Przyczyna:</strong> {item.cause}
                    </Typography>
                    <Typography variant="body2" color="text.primary" gutterBottom>
                      <strong>Rozwiązanie:</strong> {item.solution}
                    </Typography>
                    <Typography variant="body2" color="success.main">
                      <strong>Zapobieganie:</strong> {item.prevention}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );

  if (compact) {
    return (
      <Card>
        <CardHeader 
          title="Instrukcje protokołu"
          action={
            showFullscreen && (
              <Tooltip title="Pełny ekran">
                <IconButton onClick={() => setFullscreenOpen(true)}>
                  <FullscreenIcon />
                </IconButton>
              </Tooltip>
            )
          }
        />
        <CardContent>
          <InstructionsContent />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <InstructionsContent />
      
      {/* Fullscreen Dialog */}
      {showFullscreen && (
        <Dialog 
          fullScreen 
          open={fullscreenOpen} 
          onClose={() => setFullscreenOpen(false)}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Instrukcje protokołu - {instructions.title}</Typography>
              <Button onClick={() => setFullscreenOpen(false)}>
                Zamknij
              </Button>
            </Box>
          </DialogTitle>
          <DialogContent>
            <InstructionsContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProtocolInstructionsDisplay;
