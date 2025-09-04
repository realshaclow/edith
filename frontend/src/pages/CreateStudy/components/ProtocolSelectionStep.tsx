import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Skeleton,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Search as SearchIcon,
  Science as ScienceIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  TrendingUp as DifficultyIcon,
} from '@mui/icons-material';
import { usePredefinedProtocols } from '../../../hooks/usePredefinedProtocols';
import { CreateStudyStepProps, ProtocolData } from '../types';

interface ProtocolSelectionStepProps extends CreateStudyStepProps {
  onSetProtocol: (protocol: ProtocolData) => void;
}

const categoryColors = {
  mechanical: '#1976d2',
  chemical: '#388e3c',
  physical: '#7b1fa2',
  thermal: '#f57c00',
  electrical: '#303f9f',
} as const;

const difficultyColors = {
  basic: '#4caf50',
  intermediate: '#ff9800',
  advanced: '#f44336',
} as const;

export const ProtocolSelectionStep: React.FC<ProtocolSelectionStepProps> = ({
  studyData,
  onSetProtocol,
}) => {
  const theme = useTheme();
  const { protocols, isLoading, error, fetchPredefinedProtocols } = usePredefinedProtocols();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  useEffect(() => {
    fetchPredefinedProtocols();
  }, [fetchPredefinedProtocols]);

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = !searchTerm || 
      protocol.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      protocol.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || protocol.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(protocols.map(p => p.category)));

  const handleProtocolSelect = (protocol: any) => {
    // Convert API protocol to our ProtocolData format
    const protocolData: ProtocolData = {
      id: protocol.id,
      title: protocol.title,
      description: protocol.description,
      category: protocol.category,
      difficulty: protocol.difficulty,
      estimatedDuration: protocol.estimatedDuration,
      overview: protocol.overview,
      equipment: protocol.equipment || [],
      materials: protocol.materials || [],
      safetyGuidelines: protocol.safetyGuidelines || [],
      testConditions: protocol.testConditions || [],
      steps: protocol.steps || [],
      calculations: protocol.calculations || [],
    };
    
    onSetProtocol(protocolData);
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        Błąd podczas ładowania protokołów: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Wybierz Protokół Badawczy
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Wybierz protokół, który będzie podstawą dla Twojego studium badawczego.
      </Typography>

      {/* Search and Filters */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Szukaj protokołów..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />

        {/* Category Filter */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="Wszystkie"
            onClick={() => setSelectedCategory('')}
            variant={selectedCategory === '' ? 'filled' : 'outlined'}
            color={selectedCategory === '' ? 'primary' : 'default'}
          />
          {categories.map(category => (
            <Chip
              key={category}
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              onClick={() => setSelectedCategory(category)}
              variant={selectedCategory === category ? 'filled' : 'outlined'}
              color={selectedCategory === category ? 'primary' : 'default'}
              sx={{
                backgroundColor: selectedCategory === category 
                  ? categoryColors[category as keyof typeof categoryColors] || theme.palette.primary.main
                  : 'transparent',
                '&:hover': {
                  backgroundColor: selectedCategory === category 
                    ? alpha(categoryColors[category as keyof typeof categoryColors] || theme.palette.primary.main, 0.8)
                    : alpha(categoryColors[category as keyof typeof categoryColors] || theme.palette.primary.main, 0.1),
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Protocol Cards */}
      <Grid container spacing={3}>
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="80%" height={32} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Skeleton variant="text" width="100%" height={20} />
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Skeleton variant="rectangular" width={80} height={24} />
                    <Skeleton variant="rectangular" width={60} height={24} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : filteredProtocols.length === 0 ? (
          <Grid item xs={12}>
            <Alert severity="info">
              Nie znaleziono protokołów spełniających kryteria wyszukiwania.
            </Alert>
          </Grid>
        ) : (
          filteredProtocols.map((protocol) => (
            <Grid item xs={12} md={6} lg={4} key={protocol.id}>
              <Card
                sx={{
                  height: '100%',
                  border: studyData.protocolId === protocol.id 
                    ? `2px solid ${theme.palette.primary.main}` 
                    : `1px solid ${theme.palette.divider}`,
                  backgroundColor: studyData.protocolId === protocol.id 
                    ? alpha(theme.palette.primary.main, 0.05)
                    : 'background.paper',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleProtocolSelect(protocol)}
                  sx={{ height: '100%', p: 0 }}
                >
                  <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                      <ScienceIcon 
                        sx={{ 
                          mr: 1, 
                          mt: 0.5,
                          color: categoryColors[protocol.category as keyof typeof categoryColors] || theme.palette.primary.main,
                        }} 
                      />
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {protocol.title}
                      </Typography>
                    </Box>

                    {/* Description */}
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2, 
                        flexGrow: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {protocol.description}
                    </Typography>

                    {/* Metadata */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CategoryIcon fontSize="small" color="action" />
                        <Chip
                          size="small"
                          label={protocol.category}
                          sx={{
                            backgroundColor: alpha(categoryColors[protocol.category as keyof typeof categoryColors] || theme.palette.primary.main, 0.1),
                            color: categoryColors[protocol.category as keyof typeof categoryColors] || theme.palette.primary.main,
                            fontWeight: 500,
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <DifficultyIcon fontSize="small" color="action" />
                        <Chip
                          size="small"
                          label={protocol.difficulty}
                          sx={{
                            backgroundColor: alpha(difficultyColors[protocol.difficulty as keyof typeof difficultyColors] || theme.palette.grey[500], 0.1),
                            color: difficultyColors[protocol.difficulty as keyof typeof difficultyColors] || theme.palette.grey[500],
                            fontWeight: 500,
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <ScheduleIcon fontSize="small" color="action" />
                        <Typography variant="caption" color="text.secondary">
                          {protocol.estimatedDuration}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Selected Protocol Summary */}
      {studyData.protocolId && (
        <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Wybrany Protokół: {studyData.protocolName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Kategoria: {studyData.category}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
