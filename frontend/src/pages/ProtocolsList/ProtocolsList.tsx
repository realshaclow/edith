import React, { useState } from 'react';
import {
  Box,
  Container,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Fab,
  Tabs,
  Tab
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useProtocolsList } from './hooks/useProtocolsList';
import { Protocol, ProtocolViewMode } from './types';
import ProtocolFiltersBar from './components/ProtocolFiltersBar';
import ProtocolToolbar from './components/ProtocolToolbar';
import ProtocolGridView from './components/ProtocolGridView';
import ProtocolListView from './components/ProtocolListView';
import ProtocolTableView from './components/ProtocolTableView';
import ProtocolPreview from '../../components/ProtocolEditor/components/ProtocolPreview';

const ProtocolsList: React.FC = () => {
  const navigate = useNavigate();
  const {
    protocols,
    allProtocols,
    loading,
    error,
    filters,
    sortOptions,
    categories,
    difficulties,
    setFilters,
    setSortOptions,
    getProtocolById,
    deleteProtocol,
    refetch
  } = useProtocolsList();

  const [viewMode, setViewMode] = useState<ProtocolViewMode>('grid');
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0 = Wszystkie, 1 = Predefiniowane, 2 = Moje
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [protocolToDelete, setProtocolToDelete] = useState<Protocol | null>(null);

  // Filtrowanie protokołów według aktywnej zakładki
  const filteredProtocolsByTab = React.useMemo(() => {
    switch (activeTab) {
      case 1: // Predefiniowane
        return protocols.filter(p => p.type === 'PREDEFINED');
      case 2: // Moje
        return protocols.filter(p => p.type === 'USER');
      default: // Wszystkie
        return protocols;
    }
  }, [protocols, activeTab]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleViewProtocol = async (protocol: Protocol) => {
    try {
      const fullProtocol = await getProtocolById(protocol.id);
      if (fullProtocol) {
        setSelectedProtocol(fullProtocol);
        setPreviewOpen(true);
      }
    } catch (err) {
      toast.error('Failed to load protocol details');
    }
  };

  const handleEditProtocol = (protocol: Protocol) => {
    // Navigate to protocol editor
    navigate(`/protocols/edit/${protocol.id}`);
  };

  const handleDeleteProtocol = (protocol: Protocol) => {
    setProtocolToDelete(protocol);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!protocolToDelete) return;

    const success = await deleteProtocol(protocolToDelete.id);
    if (success) {
      setDeleteConfirmOpen(false);
      setProtocolToDelete(null);
    }
  };

  const handleCreateProtocol = () => {
    navigate('/protocols/create');
  };

  const renderProtocolsView = () => {
    const commonProps = {
      protocols: filteredProtocolsByTab,
      onView: handleViewProtocol,
      onEdit: handleEditProtocol,
      onDelete: handleDeleteProtocol,
      showActions: true
    };

    switch (viewMode) {
      case 'list':
        return <ProtocolListView {...commonProps} />;
      case 'table':
        return <ProtocolTableView {...commonProps} />;
      case 'grid':
      default:
        return <ProtocolGridView {...commonProps} />;
    }
  };

  if (loading && protocols.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress size={48} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Protokoły Badawcze
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Przeglądaj i zarządzaj protokołami badawczymi. Kliknij na dowolny protokół, aby zobaczyć szczegóły.
        </Typography>
      </Box>

      {/* Zakładki filtrowania */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="protocol tabs">
          <Tab label={`Wszystkie (${protocols.length})`} />
          <Tab label={`Predefiniowane (${protocols.filter(p => p.type === 'PREDEFINED').length})`} />
          <Tab label={`Moje (${protocols.filter(p => p.type === 'USER').length})`} />
        </Tabs>
      </Box>

      <ProtocolFiltersBar
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
        difficulties={difficulties}
      />

      <ProtocolToolbar
        sortOptions={sortOptions}
        onSortChange={setSortOptions}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={allProtocols.length}
        filteredCount={filteredProtocolsByTab.length}
        loading={loading}
        onRefresh={refetch}
      />

      <Box sx={{ position: 'relative', minHeight: 400 }}>
        {loading && (
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}
        
        {renderProtocolsView()}
      </Box>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="create protocol"
        onClick={handleCreateProtocol}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24
        }}
      >
        <AddIcon />
      </Fab>

      {/* Protocol Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setSelectedProtocol(null);
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { maxHeight: '90vh' }
        }}
      >
        <DialogTitle>
          {selectedProtocol?.title}
        </DialogTitle>
        <DialogContent dividers>
          {selectedProtocol && (
            <ProtocolPreview protocol={selectedProtocol} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>
            Zamknij
          </Button>
          {selectedProtocol && (
            <Button
              variant="contained"
              onClick={() => {
                setPreviewOpen(false);
                handleEditProtocol(selectedProtocol);
              }}
            >
              Edytuj Protokół
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setProtocolToDelete(null);
        }}
      >
        <DialogTitle>Potwierdź Usunięcie</DialogTitle>
        <DialogContent>
          <Typography>
            Czy na pewno chcesz usunąć protokół "{protocolToDelete?.title}"?
            Ta akcja nie może zostać cofnięta.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setDeleteConfirmOpen(false);
              setProtocolToDelete(null);
            }}
          >
            Anuluj
          </Button>
          <Button 
            onClick={confirmDelete}
            color="error"
            variant="contained"
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProtocolsList;
