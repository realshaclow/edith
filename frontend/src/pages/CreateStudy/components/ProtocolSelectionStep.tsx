import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormHelperText,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import { useProtocols } from '../../../hooks/useProtocols';
import { ProtocolForStudy, CreateStudyFormErrors } from '../types';

interface ProtocolCard {
  id: string;
  title: string;
  category: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

const ProtocolCardComponent: React.FC<ProtocolCard> = ({
  title,
  category,
  description,
  isSelected,
  onClick
}) => (
  <Card
    onClick={onClick}
    sx={{
      cursor: 'pointer',
      border: isSelected ? '2px solid #1976d2' : '1px solid #e0e0e0',
      backgroundColor: isSelected ? '#f3f8ff' : 'white',
      transition: 'all 0.2s ease',
      '&:hover': {
        backgroundColor: isSelected ? '#f3f8ff' : '#f5f5f5',
        borderColor: isSelected ? '#1976d2' : '#bdbdbd'
      }
    }}
  >
    <CardContent>
      <Typography variant="h6" component="div" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Kategoria: {category}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description || 'Brak opisu'}
      </Typography>
    </CardContent>
  </Card>
);

interface ProtocolSelectionStepProps {
  selectedProtocol: ProtocolForStudy | null;
  errors: CreateStudyFormErrors;
  onSelectProtocol: (protocol: ProtocolForStudy) => void;
}

export const ProtocolSelectionStep: React.FC<ProtocolSelectionStepProps> = ({
  selectedProtocol,
  errors,
  onSelectProtocol
}) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const { 
    protocols: allProtocols, 
    isLoading, 
    error,
    fetchProtocols
  } = useProtocols();

  // Pobierz dane przy pierwszym renderze
  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  // Sortuj protokoły według typu
  const { predefinedProtocols, userProtocols } = useMemo(() => {
    if (!allProtocols) {
      return { predefinedProtocols: [], userProtocols: [] };
    }

    const predefined = allProtocols.filter((protocol: any) => protocol.type === 'PREDEFINED');
    const user = allProtocols.filter((protocol: any) => protocol.type === 'USER');

    return {
      predefinedProtocols: predefined,
      userProtocols: user
    };
  }, [allProtocols]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const convertToProtocolForStudy = (protocol: any): ProtocolForStudy => ({
    id: protocol.id,
    title: protocol.title || protocol.name,
    category: protocol.category || 'Inne',
    description: protocol.description,
    steps: protocol.steps || []
  });

  const handleProtocolSelect = (protocol: any) => {
    const protocolForStudy = convertToProtocolForStudy(protocol);
    onSelectProtocol(protocolForStudy);
  };

  const renderProtocolList = (protocols: any[], loading: boolean, error: string | null) => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          Błąd podczas ładowania protokołów: {error}
        </Alert>
      );
    }

    if (!protocols || protocols.length === 0) {
      return (
        <Box p={3} textAlign="center">
          <Typography color="text.secondary">
            Brak dostępnych protokołów
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'grid', gap: 2, mt: 2 }}>
        {protocols.map((protocol) => (
          <ProtocolCardComponent
            key={protocol.id}
            id={protocol.id}
            title={protocol.title || protocol.name}
            category={protocol.category || 'Inne'}
            description={protocol.description || ''}
            isSelected={selectedProtocol?.id === protocol.id}
            onClick={() => handleProtocolSelect(protocol)}
          />
        ))}
      </Box>
    );
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Wybór protokołu badawczego
        </Typography>
        
        {errors.protocol && (
          <FormHelperText error sx={{ mb: 2 }}>
            {errors.protocol}
          </FormHelperText>
        )}

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab 
              label={`Predefiniowane (${predefinedProtocols?.length || 0})`}
              id="predefined-tab"
            />
            <Tab 
              label={`Użytkownika (${userProtocols?.length || 0})`}
              id="user-tab"
            />
          </Tabs>
        </Box>

        {activeTab === 0 && renderProtocolList(predefinedProtocols || [], isLoading, error)}
        {activeTab === 1 && renderProtocolList(userProtocols || [], isLoading, error)}

        {selectedProtocol && (
          <Box sx={{ mt: 3, p: 2, backgroundColor: '#f3f8ff', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Wybrany protokół:
            </Typography>
            <Typography variant="body1" fontWeight="medium">
              {selectedProtocol.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Kategoria: {selectedProtocol.category}
            </Typography>
            {selectedProtocol.description && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {selectedProtocol.description}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
