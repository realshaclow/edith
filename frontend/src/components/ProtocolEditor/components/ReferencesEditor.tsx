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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  Book as BookIcon,
  Article as ArticleIcon,
  Web as WebIcon
} from '@mui/icons-material';

interface Reference {
  id: string;
  title: string;
  authors: string;
  source: string;
  year: string;
  type: 'standard' | 'article' | 'book' | 'website' | 'other';
  url?: string;
  doi?: string;
  notes?: string;
}

interface ReferencesEditorProps {
  protocol: any;
  updateProtocol: (updates: any) => void;
  errors: Record<string, string>;
}

const ReferencesEditor: React.FC<ReferencesEditorProps> = ({
  protocol,
  updateProtocol,
  errors
}) => {
  const references = protocol.references || [];
  const [newReference, setNewReference] = React.useState<Reference>({
    id: '',
    title: '',
    authors: '',
    source: '',
    year: '',
    type: 'standard',
    url: '',
    doi: '',
    notes: ''
  });

  const referenceTypes = [
    { value: 'standard', label: 'Norma/Standard', icon: <BookIcon /> },
    { value: 'article', label: 'Artykuł naukowy', icon: <ArticleIcon /> },
    { value: 'book', label: 'Książka', icon: <BookIcon /> },
    { value: 'website', label: 'Strona internetowa', icon: <WebIcon /> },
    { value: 'other', label: 'Inne', icon: <LinkIcon /> }
  ];

  const handleAddReference = () => {
    if (!newReference.title || !newReference.authors) return;

    const referenceToAdd = {
      ...newReference,
      id: `ref-${Date.now()}`
    };

    updateProtocol({
      references: [...references, referenceToAdd]
    });

    setNewReference({
      id: '',
      title: '',
      authors: '',
      source: '',
      year: '',
      type: 'standard',
      url: '',
      doi: '',
      notes: ''
    });
  };

  const handleRemoveReference = (refId: string) => {
    const newReferences = references.filter((r: Reference) => r.id !== refId);
    updateProtocol({ references: newReferences });
  };

  const getTypeIcon = (type: string) => {
    const typeInfo = referenceTypes.find(t => t.value === type);
    return typeInfo?.icon || <LinkIcon />;
  };

  const getTypeLabel = (type: string) => {
    const typeInfo = referenceTypes.find(t => t.value === type);
    return typeInfo?.label || 'Inne';
  };

  return (
    <Box sx={{ maxWidth: 1000 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
        Bibliografia i referencje
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          Dodaj wszystkie źródła, normy i dokumenty, na których oparty jest protokół badawczy.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Formularz dodawania referencji */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Dodaj nową referencję"
              action={
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddReference}
                  variant="contained"
                  size="small"
                  disabled={!newReference.title || !newReference.authors}
                >
                  Dodaj
                </Button>
              }
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    label="Typ referencji"
                    value={newReference.type}
                    onChange={(e) => setNewReference({ ...newReference, type: e.target.value as any })}
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    {referenceTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Tytuł"
                    value={newReference.title}
                    onChange={(e) => setNewReference({ ...newReference, title: e.target.value })}
                    fullWidth
                    required
                    placeholder="np. ISO 527-1:2012 Plastics - Determination of tensile properties"
                  />
                </Grid>

                <Grid item xs={12} md={8}>
                  <TextField
                    label="Autorzy"
                    value={newReference.authors}
                    onChange={(e) => setNewReference({ ...newReference, authors: e.target.value })}
                    fullWidth
                    required
                    placeholder="np. ISO, Smith J., Kowalski A."
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    label="Rok"
                    value={newReference.year}
                    onChange={(e) => setNewReference({ ...newReference, year: e.target.value })}
                    fullWidth
                    placeholder="2024"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Źródło"
                    value={newReference.source}
                    onChange={(e) => setNewReference({ ...newReference, source: e.target.value })}
                    fullWidth
                    placeholder="np. International Organization for Standardization"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="URL (opcjonalny)"
                    value={newReference.url}
                    onChange={(e) => setNewReference({ ...newReference, url: e.target.value })}
                    fullWidth
                    placeholder="https://..."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="DOI (opcjonalny)"
                    value={newReference.doi}
                    onChange={(e) => setNewReference({ ...newReference, doi: e.target.value })}
                    fullWidth
                    placeholder="10.1000/..."
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Uwagi (opcjonalne)"
                    value={newReference.notes}
                    onChange={(e) => setNewReference({ ...newReference, notes: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Dodatkowe informacje o referencji"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista referencji */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title={`Bibliografia (${references.length})`}
              subheader="Wszystkie dodane referencje"
            />
            <CardContent>
              {references.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <BookIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    Brak referencji w bibliografii
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dodaj pierwsze źródło używając formularza obok
                  </Typography>
                </Box>
              ) : (
                <List>
                  {references.map((reference: Reference, index: number) => (
                    <React.Fragment key={reference.id}>
                      <ListItem alignItems="flex-start">
                        <Box sx={{ display: 'flex', width: '100%', gap: 2 }}>
                          <Box sx={{ mt: 1 }}>
                            {getTypeIcon(reference.type)}
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="body2" fontWeight="bold">
                                [{index + 1}]
                              </Typography>
                              <Chip
                                label={getTypeLabel(reference.type)}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                            
                            <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                              {reference.title}
                            </Typography>
                            
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                              {reference.authors} ({reference.year})
                            </Typography>
                            
                            {reference.source && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                {reference.source}
                              </Typography>
                            )}
                            
                            {(reference.url || reference.doi) && (
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                {reference.url && (
                                  <Chip
                                    icon={<LinkIcon />}
                                    label="URL"
                                    size="small"
                                    component="a"
                                    href={reference.url}
                                    target="_blank"
                                    clickable
                                    color="primary"
                                    variant="outlined"
                                  />
                                )}
                                {reference.doi && (
                                  <Chip
                                    label={`DOI: ${reference.doi}`}
                                    size="small"
                                    variant="outlined"
                                    color="secondary"
                                  />
                                )}
                              </Box>
                            )}
                            
                            {reference.notes && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                                {reference.notes}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveReference(reference.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      {index < references.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}

              {errors.references && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  {errors.references}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReferencesEditor;
