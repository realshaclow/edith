import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Chip,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  useTheme,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  CircularProgress,
  Paper,
  ListItemAvatar,
  Avatar,
  Pagination,
  InputAdornment,
} from '@mui/material';
import { 
  Person as OperatorIcon,
  Engineering as EquipmentIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  Science as LabIcon,
  Assignment as RequirementIcon,
  Search as SearchIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { CreateStudyStepProps } from '../types';
import { useUsers } from '../../../hooks';
import { User } from '../../../types';

const USERS_PER_PAGE = 10;

export const OperatorEquipmentStep: React.FC<CreateStudyStepProps> = ({
  studyData,
  protocolData,
  errors,
  onUpdateStudyData,
}) => {
  const theme = useTheme();
  const { users, loading: usersLoading, error: usersError } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOperator, setSelectedOperator] = useState<User | null>(null);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    if (!searchTerm.trim()) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.department?.toLowerCase().includes(term) ||
      user.position?.toLowerCase().includes(term) ||
      user.title?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // Paginate filtered users
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * USERS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Set selected operator if one is already chosen
  useEffect(() => {
    if (studyData.operatorInfo.operatorId && users) {
      const operator = users.find(user => user.id === studyData.operatorInfo.operatorId);
      setSelectedOperator(operator || null);
    }
  }, [studyData.operatorInfo.operatorId, users]);

  const handleOperatorChange = (newUser: User | null) => {
    setSelectedOperator(newUser);
    onUpdateStudyData({
      operatorInfo: {
        ...studyData.operatorInfo,
        operatorId: newUser?.id || '',
      },
    });
  };

  const handleSelectOperator = (user: User) => {
    handleOperatorChange(user);
  };

  const handleClearSelection = () => {
    handleOperatorChange(null);
  };

  const handleOperatorRequiredChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateStudyData({
      settings: {
        ...studyData.settings,
        operatorRequired: event.target.checked,
      },
    });
  };

  const loadEquipmentFromProtocol = () => {
    if (!protocolData?.equipment || !Array.isArray(protocolData.equipment)) {
      return;
    }

    const protocolEquipment = protocolData.equipment.map((item: any, index: number) => ({
      id: Date.now().toString() + index,
      name: typeof item === 'string' ? item : item.name || '',
      model: typeof item === 'object' ? item.model || '' : '',
      serialNumber: '',
      calibrationDate: '',
      notes: typeof item === 'object' ? item.description || item.notes || '' : '',
    }));

    onUpdateStudyData({
      equipmentList: [...studyData.equipmentList, ...protocolEquipment],
    });
  };

  const addEquipment = () => {
    const newEquipment = {
      id: Date.now().toString(),
      name: '',
      model: '',
      serialNumber: '',
      calibrationDate: '',
      notes: '',
    };

    onUpdateStudyData({
      equipmentList: [...studyData.equipmentList, newEquipment],
    });
  };

  const updateEquipment = (equipmentId: string, field: string, value: string) => {
    onUpdateStudyData({
      equipmentList: studyData.equipmentList.map(equipment =>
        equipment.id === equipmentId
          ? { ...equipment, [field]: value }
          : equipment
      ),
    });
  };

  const removeEquipment = (equipmentId: string) => {
    onUpdateStudyData({
      equipmentList: studyData.equipmentList.filter(equipment => equipment.id !== equipmentId),
    });
  };

  const getRequiredEquipment = () => {
    if (!protocolData?.equipmentRequired) return [];
    return protocolData.equipmentRequired;
  };

  const getOperatorRequirements = () => {
    if (!protocolData?.operatorRequirements) return [];
    return protocolData.operatorRequirements;
  };

  const requiredEquipment = getRequiredEquipment();
  const operatorRequirements = getOperatorRequirements();

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
        👤 Operator i Wyposażenie
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
        Opcjonalnie podaj informacje o operatorze przeprowadzającym badanie oraz wyposażeniu laboratoryjnym. Te informacje nie są wymagane, ale mogą być przydatne do dokumentacji.
      </Typography>

      <Grid container spacing={3}>
        {/* Informacje o operatorze */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <OperatorIcon color="primary" sx={{ mr: 1 }} />
                Informacje o Operatorze
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={studyData.settings.operatorRequired}
                    onChange={handleOperatorRequiredChange}
                    color="primary"
                  />
                }
                label="Informacje o operatorze są wymagane"
                sx={{ mb: 2 }}
              />

              {studyData.settings.operatorRequired && (
                <>
                  {usersError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {usersError}
                    </Alert>
                  )}
                  
                  {/* Selected Operator Display */}
                  {selectedOperator && (
                    <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center" gap={2}>
                            <CheckCircleIcon color="success" />
                            <Box>
                              <Typography variant="h6">
                                Wybrany operator: {selectedOperator.firstName} {selectedOperator.lastName}
                              </Typography>
                              <Typography variant="body2">
                                {selectedOperator.email} • {selectedOperator.department} • {selectedOperator.position}
                              </Typography>
                            </Box>
                          </Box>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            onClick={handleClearSelection}
                            sx={{ color: 'success.contrastText', borderColor: 'success.contrastText' }}
                          >
                            Zmień
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  )}

                  {/* Search Field */}
                  <TextField
                    fullWidth
                    placeholder="Wyszukaj operatora po imieniu, nazwisku, email, dziale lub stanowisku..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  {/* Loading State */}
                  {usersLoading && (
                    <Box display="flex" justifyContent="center" py={4}>
                      <CircularProgress />
                    </Box>
                  )}

                  {/* Users List */}
                  {!usersLoading && !usersError && (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Dostępni operatorzy ({filteredUsers.length})
                      </Typography>
                      
                      {filteredUsers.length === 0 ? (
                        <Alert severity="info">
                          {searchTerm ? 'Nie znaleziono operatorów pasujących do wyszukiwania.' : 'Brak dostępnych operatorów.'}
                        </Alert>
                      ) : (
                        <>
                          <Paper variant="outlined" sx={{ maxHeight: 400, overflow: 'auto' }}>
                            <List dense>
                              {paginatedUsers.map((user, index) => (
                                <React.Fragment key={user.id}>
                                  <ListItem
                                    button
                                    onClick={() => handleSelectOperator(user)}
                                    selected={selectedOperator?.id === user.id}
                                    sx={{
                                      '&:hover': {
                                        bgcolor: 'action.hover',
                                      },
                                      '&.Mui-selected': {
                                        bgcolor: 'primary.light',
                                        '&:hover': {
                                          bgcolor: 'primary.light',
                                        },
                                      },
                                    }}
                                  >
                                    <ListItemAvatar>
                                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <OperatorIcon />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                          <Typography variant="subtitle1" fontWeight="medium">
                                            {user.firstName} {user.lastName}
                                          </Typography>
                                          {user.title && (
                                            <Chip 
                                              label={user.title} 
                                              size="small" 
                                              variant="outlined"
                                              color="primary"
                                            />
                                          )}
                                        </Box>
                                      }
                                      secondary={
                                        <Box>
                                          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                            <EmailIcon sx={{ fontSize: 14 }} />
                                            <Typography variant="body2" color="text.secondary">
                                              {user.email}
                                            </Typography>
                                          </Box>
                                          {user.department && (
                                            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                              <BusinessIcon sx={{ fontSize: 14 }} />
                                              <Typography variant="body2" color="text.secondary">
                                                {user.department}
                                              </Typography>
                                            </Box>
                                          )}
                                          {user.position && (
                                            <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
                                              <WorkIcon sx={{ fontSize: 14 }} />
                                              <Typography variant="body2" color="text.secondary">
                                                {user.position}
                                              </Typography>
                                            </Box>
                                          )}
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                  {index < paginatedUsers.length - 1 && <Divider variant="inset" component="li" />}
                                </React.Fragment>
                              ))}
                            </List>
                          </Paper>

                          {/* Pagination */}
                          {totalPages > 1 && (
                            <Box display="flex" justifyContent="center" mt={2}>
                              <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={(_, page) => setCurrentPage(page)}
                                color="primary"
                                showFirstButton
                                showLastButton
                              />
                            </Box>
                          )}

                          {/* Results info */}
                          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
                            Strona {currentPage} z {totalPages} • 
                            Wyświetlono {paginatedUsers.length} z {filteredUsers.length} operatorów
                          </Typography>
                        </>
                      )}
                    </>
                  )}

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Dodatkowe informacje"
                    value={studyData.operatorInfo.notes}
                    onChange={(e) => onUpdateStudyData({
                      operatorInfo: {
                        ...studyData.operatorInfo,
                        notes: e.target.value,
                      },
                    })}
                    helperText="Dodatkowe informacje o operatorze lub certyfikatach"
                  />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Wymagania operatora z protokołu */}
        {operatorRequirements.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card 
              variant="outlined"
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
                border: `1px solid ${theme.palette.success.main}20`
              }}
            >
              <CardContent>
                <Typography variant="h6" color="success.main" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <RequirementIcon sx={{ mr: 1 }} />
                  Wymagania dla Operatora
                </Typography>
                
                <List dense>
                  {operatorRequirements.map((requirement, index) => (
                    <ListItem key={index} sx={{ py: 0.5, pl: 0 }}>
                      <ListItemText 
                        primary={requirement}
                        primaryTypographyProps={{ fontSize: '0.9rem' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    Upewnij się, że operator spełnia wszystkie wymagania określone w protokole {protocolData?.name}.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Lista wyposażenia */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                  <EquipmentIcon color="secondary" sx={{ mr: 1 }} />
                  Lista Wyposażenia
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {protocolData?.equipment && Array.isArray(protocolData.equipment) && protocolData.equipment.length > 0 && (
                    <Button
                      variant="text"
                      startIcon={<RequirementIcon />}
                      onClick={loadEquipmentFromProtocol}
                      size="small"
                      color="secondary"
                    >
                      Załaduj z Protokołu
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addEquipment}
                    size="small"
                  >
                    Dodaj Sprzęt
                  </Button>
                </Box>
              </Box>

              {studyData.equipmentList.length === 0 ? (
                <Alert severity="info">
                  <Typography variant="body2">
                    Nie dodano jeszcze żadnego sprzętu. Możesz opcjonalnie dodać wyposażenie laboratoryjne używane w badaniu.
                  </Typography>
                </Alert>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {studyData.equipmentList.map((equipment, index) => (
                    <Accordion key={equipment.id} defaultExpanded={!equipment.name}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <LabIcon color="action" sx={{ mr: 2 }} />
                          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                            {equipment.name || `Sprzęt #${index + 1}`}
                          </Typography>
                          {equipment.model && (
                            <Chip 
                              label={equipment.model} 
                              size="small" 
                              variant="outlined" 
                              sx={{ mr: 1 }}
                            />
                          )}
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Nazwa sprzętu *"
                              value={equipment.name}
                              onChange={(e) => updateEquipment(equipment.id, 'name', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Model"
                              value={equipment.model}
                              onChange={(e) => updateEquipment(equipment.id, 'model', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Numer seryjny"
                              value={equipment.serialNumber}
                              onChange={(e) => updateEquipment(equipment.id, 'serialNumber', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              type="date"
                              label="Data kalibracji"
                              value={equipment.calibrationDate}
                              onChange={(e) => updateEquipment(equipment.id, 'calibrationDate', e.target.value)}
                              InputLabelProps={{ shrink: true }}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              label="Uwagi"
                              value={equipment.notes}
                              onChange={(e) => updateEquipment(equipment.id, 'notes', e.target.value)}
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton
                                color="error"
                                onClick={() => removeEquipment(equipment.id)}
                                size="small"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Wymagane wyposażenie z protokołu */}
        {requiredEquipment.length > 0 && (
          <Grid item xs={12}>
            <Card 
              variant="outlined"
              sx={{ 
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)',
                border: `1px solid ${theme.palette.warning.main}20`
              }}
            >
              <CardContent>
                <Typography variant="h6" color="warning.main" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <RequirementIcon sx={{ mr: 1 }} />
                  Wymagane Wyposażenie (wg protokołu {protocolData?.name})
                </Typography>
                
                <Grid container spacing={2}>
                  {requiredEquipment.map((equipment, index) => (
                    <Grid item xs={12} md={6} lg={4} key={index}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {equipment.name || `Sprzęt ${index + 1}`}
                          </Typography>
                          {equipment.specifications && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <strong>Specyfikacje:</strong> {equipment.specifications}
                            </Typography>
                          )}
                          {equipment.accuracy && (
                            <Chip 
                              label={`Dokładność: ${equipment.accuracy}`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Alert severity="warning">
                  <Typography variant="body2">
                    <strong>Ważne:</strong> Upewnij się, że dostępne wyposażenie spełnia wymagania określone w protokole. 
                    W przeciwnym razie wyniki badania mogą być nieprawidłowe.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Wskazówki */}
        <Grid item xs={12}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Wskazówka:</strong> Dokładne udokumentowanie operatora i wyposażenia jest kluczowe dla:
            </Typography>
            <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
              <li>Zapewnienia powtarzalności badań</li>
              <li>Spełnienia wymagań jakości laboratorium</li>
              <li>Śledzenia kalibracji i konserwacji sprzętu</li>
              <li>Audytów i certyfikacji</li>
            </ul>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};
