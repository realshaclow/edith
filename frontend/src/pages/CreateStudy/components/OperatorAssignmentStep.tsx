import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  FormControlLabel,
  Switch,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
  Pagination,
  InputAdornment,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { CreateStudyStepProps } from '../types';
import { useUsers } from '../../../hooks';

const USERS_PER_PAGE = 10;

export const OperatorAssignmentStep: React.FC<CreateStudyStepProps> = ({
  studyData,
  onUpdateStudyData,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  
  const { users, loading, error } = useUsers();

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    if (!searchTerm.trim()) return users;
    
    const term = searchTerm.toLowerCase();
    return users.filter(user => 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.department?.toLowerCase().includes(term) ||
      user.position?.toLowerCase().includes(term)
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

  const handleOperatorRequiredChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isRequired = event.target.checked;
    onUpdateStudyData({
      settings: {
        ...studyData.settings,
        operatorRequired: isRequired,
        operatorName: isRequired ? studyData.settings.operatorName : '',
        operatorEmail: isRequired ? studyData.settings.operatorEmail : '',
      },
    });
    
    if (!isRequired) {
      setSelectedOperator(null);
    }
  };

  const handleSelectOperator = (user: any) => {
    setSelectedOperator(user);
    onUpdateStudyData({
      settings: {
        ...studyData.settings,
        operatorName: `${user.firstName} ${user.lastName}`,
        operatorEmail: user.email,
        operatorId: user.id,
      },
    });
  };

  const handleClearSelection = () => {
    setSelectedOperator(null);
    onUpdateStudyData({
      settings: {
        ...studyData.settings,
        operatorName: '',
        operatorEmail: '',
        operatorId: undefined,
      },
    });
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Przypisanie Operatora
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Określ kto będzie odpowiedzialny za wykonanie badania
      </Typography>

      <Paper sx={{ p: 3, mt: 3 }}>
        <FormControl fullWidth>
          <FormControlLabel
            control={
              <Switch
                checked={studyData.settings.operatorRequired}
                onChange={handleOperatorRequiredChange}
              />
            }
            label={
              <Box>
                <Typography variant="body1">Wymagany operator</Typography>
                <Typography variant="body2" color="text.secondary">
                  Czy badanie wymaga przypisania konkretnego operatora?
                </Typography>
              </Box>
            }
          />
        </FormControl>

        {studyData.settings.operatorRequired && (
          <Box sx={{ mt: 3 }}>
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
            {loading && (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            )}

            {/* Error State */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Błąd podczas ładowania listy operatorów. Spróbuj ponownie.
              </Alert>
            )}

            {/* Users List */}
            {!loading && !error && (
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
                                  <PersonIcon />
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
          </Box>
        )}
      </Paper>
    </Box>
  );
};
