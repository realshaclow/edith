import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { ProtocolEditor } from '../components/ProtocolEditor';
import { predefinedProtocolsApi, protocolsApi } from '../services/api';
import toast from 'react-hot-toast';

const ProtocolCreatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { id: editId } = useParams();
  const navigate = useNavigate();
  const [initialProtocol, setInitialProtocol] = useState<any>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isEditMode, setIsEditMode] = useState(!!editId);

  useEffect(() => {
    // Sprawdź czy mamy ID szablonu w URL (tylko jeśli nie edytujemy)
    if (!editId) {
      const templateId = searchParams.get('templateId');
      if (templateId) {
        loadTemplate(templateId);
      }
    }
  }, [searchParams, editId]);

  const loadTemplate = async (templateId: string) => {
    try {
      setIsLoadingTemplate(true);
      const response = await predefinedProtocolsApi.getById(templateId);
      if (response.success && response.data) {
        // Usuń ID żeby stworzyć nowy protokół
        const { id, ...protocolWithoutId } = response.data;
        setInitialProtocol({
          ...protocolWithoutId,
          title: `${response.data.title} (Kopia)`,
          id: '', // Nowy protokół będzie miał nowe ID
        });
        toast.success('Szablon protokołu załadowany');
      } else {
        toast.error('Nie udało się załadować szablonu protokołu');
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast.error('Błąd podczas ładowania szablonu');
    } finally {
      setIsLoadingTemplate(false);
    }
  };

  const handleLoad = () => {
    if (isEditMode) {
      toast.success('Protokół załadowany do edycji');
    }
  };

  const handleSave = async (protocol: any) => {
    // Ta funkcja będzie wywoływana przez ProtocolEditor po udanym zapisie
    toast.success(isEditMode ? 'Protokół został zaktualizowany' : 'Protokół został utworzony');
    
    // Przekieruj do listy protokołów po zapisie
    setTimeout(() => {
      navigate('/protocols');
    }, 1500);
  };

  const handleCancel = () => {
    // Przekieruj do listy protokołów
    navigate('/protocols');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 3, flexShrink: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
          {initialProtocol ? 'Edycja Protokołu' : 'Kreator Protokołu Badawczego'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {initialProtocol 
            ? 'Edytuj protokół oparty na standardzie międzynarodowym'
            : isLoadingTemplate 
            ? 'Ładowanie szablonu protokołu...'
            : 'Stwórz nowy standardowy protokół badawczy zgodny z normami ISO/ASTM'
          }
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <ProtocolEditor
          protocolId={editId}
          initialData={initialProtocol}
          onSave={handleSave}
          onCancel={handleCancel}
          onLoad={handleLoad}
        />
      </Paper>
    </Box>
  );
};

export default ProtocolCreatorPage;
