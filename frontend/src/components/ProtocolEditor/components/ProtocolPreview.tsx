import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert
} from '@mui/material';
import {
  Science as ScienceIcon,
  Category as CategoryIcon,
  Schedule as DurationIcon,
  Person as AuthorIcon,
  CalendarToday as DateIcon,
  Assignment as StepIcon,
  Calculate as CalcIcon,
  Security as SafetyIcon,
  Build as EquipmentIcon,
  Inventory as MaterialIcon,
  CheckCircle as AcceptanceIcon,
  Warning as IssuesIcon,
  BarChart as ValuesIcon,
  Notes as NotesIcon
} from '@mui/icons-material';
import { getCategoryColor, getDifficultyColor } from '../utils/helpers';

interface ProtocolPreviewProps {
  protocol: any;
}

const ProtocolPreview: React.FC<ProtocolPreviewProps> = ({ protocol }) => {
  const formatDate = (date: string) => {
    if (!date) return 'Nie podano';
    return new Date(date).toLocaleDateString('pl-PL');
  };

  const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode) => (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {icon}
        <Typography variant="h6" fontWeight="bold">
          {title}
        </Typography>
      </Box>
      {content}
    </Paper>
  );

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
      {/* Header */}
      <Paper sx={{ p: 4, mb: 3, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          {protocol.title || 'Protokół badawczy'}
        </Typography>
        <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
          {protocol.subtitle || 'Szczegółowy protokół badawczy'}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
          {protocol.category && (
            <Chip
              label={protocol.category}
              sx={{
                backgroundColor: getCategoryColor(protocol.category),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
          {protocol.difficulty && (
            <Chip
              label={protocol.difficulty}
              sx={{
                backgroundColor: getDifficultyColor(protocol.difficulty),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
          {protocol.version && (
            <Chip
              label={`v${protocol.version}`}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
          )}
        </Box>
      </Paper>

      {/* Podstawowe informacje */}
      {renderSection(
        'Informacje podstawowe',
        <ScienceIcon color="primary" />,
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AuthorIcon fontSize="small" />
              <Typography variant="body2" fontWeight="medium">Autor:</Typography>
              <Typography variant="body2">{protocol.author || 'Brak'}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DateIcon fontSize="small" />
              <Typography variant="body2" fontWeight="medium">Data utworzenia:</Typography>
              <Typography variant="body2">{formatDate(protocol.createdAt)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <DurationIcon fontSize="small" />
              <Typography variant="body2" fontWeight="medium">Czas trwania:</Typography>
              <Typography variant="body2">{protocol.estimatedDuration || 'Brak'}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Opis:</Typography>
            <Typography variant="body2" color="text.secondary">
              {protocol.description || 'Brak opisu protokołu'}
            </Typography>
          </Grid>
        </Grid>
      )}

      {/* Przegląd badania */}
      {(protocol.overview || protocol.purpose || protocol.scope) && renderSection(
        'Przegląd badania',
        <CategoryIcon color="primary" />,
        <Box>
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Cel badania:</Typography>
          <Typography variant="body2" paragraph>
            {protocol.overview?.purpose || protocol.purpose || 'Nie określono celu badania'}
          </Typography>
          
          <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Zakres badania:</Typography>
          <Typography variant="body2" paragraph>
            {protocol.overview?.scope || protocol.scope || 'Nie określono zakresu badania'}
          </Typography>

          {protocol.overview?.principles && (
            <>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Zasady działania:</Typography>
              <Typography variant="body2" paragraph>
                {protocol.overview.principles}
              </Typography>
            </>
          )}

          {protocol.overview?.applications && (
            <>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Zastosowania:</Typography>
              <Typography variant="body2" paragraph>
                {protocol.overview.applications}
              </Typography>
            </>
          )}
          
          {(protocol.overview?.standards || protocol.applicableStandards) && (
            <>
              <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>Normy stosowane:</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(protocol.overview?.standards || protocol.applicableStandards || []).map((standard: string, index: number) => (
                  <Chip key={index} label={standard} size="small" variant="outlined" />
                ))}
              </Box>
            </>
          )}
        </Box>
      )}

      {/* Wyposażenie */}
      {renderSection(
        'Wyposażenie',
        <EquipmentIcon color="primary" />,
        protocol.equipment && protocol.equipment.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nazwa</TableCell>
                  <TableCell>Specyfikacja</TableCell>
                  <TableCell>Uwagi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {protocol.equipment.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      {typeof item === 'string' ? item : item.name || item}
                    </TableCell>
                    <TableCell>
                      {typeof item === 'object' && item.specification 
                        ? item.specification 
                        : typeof item === 'object' && item.specifications 
                        ? item.specifications 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {typeof item === 'object' 
                        ? (item.model || item.notes || '-')
                        : '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Brak wyposażenia
          </Typography>
        )
      )}

      {/* Materiały */}
      {renderSection(
        'Materiały i odczynniki',
        <MaterialIcon color="primary" />,
        protocol.materials && protocol.materials.length > 0 ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Nazwa</TableCell>
                  <TableCell>Specyfikacja</TableCell>
                  <TableCell>Uwagi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {protocol.materials.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      {typeof item === 'string' ? item : item.name || item}
                    </TableCell>
                    <TableCell>
                      {typeof item === 'object' && item.specification 
                        ? item.specification 
                        : typeof item === 'object' && item.grade 
                        ? item.grade 
                        : typeof item === 'object' && item.purity 
                        ? item.purity 
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      {typeof item === 'object' 
                        ? (item.quantity ? `${item.quantity} ${item.unit || ''}` : 
                           item.notes ? item.notes : '-')
                        : '-'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Brak materiałów
          </Typography>
        )
      )}

      {/* Warunki testowe */}
      {protocol.testConditions && Object.keys(protocol.testConditions).length > 0 && renderSection(
        'Warunki testowe',
        <DurationIcon color="info" />,
        <Box>
          {Object.entries(protocol.testConditions).map(([key, value], index) => (
            <Typography key={index} variant="body2" sx={{ mb: 1 }}>
              <strong>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</strong> {value as string}
            </Typography>
          ))}
        </Box>
      )}

      {/* Bezpieczeństwo */}
      {protocol.safetyGuidelines && protocol.safetyGuidelines.length > 0 && renderSection(
        'Zasady bezpieczeństwa',
        <SafetyIcon color="error" />,
        <List>
          {protocol.safetyGuidelines.map((guideline: any, index: number) => (
            <ListItem key={index}>
              <ListItemIcon>
                <SafetyIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={typeof guideline === 'string' ? guideline : guideline.guideline}
                secondary={typeof guideline === 'object' ? guideline.description : undefined}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Kroki procedury */}
      {protocol.steps && protocol.steps.length > 0 && renderSection(
        'Procedura badawcza',
        <StepIcon color="primary" />,
        <Box>
          {protocol.steps.map((step: any, index: number) => (
            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Chip label={`Krok ${index + 1}`} color="primary" size="small" />
                <Typography variant="subtitle2" fontWeight="bold">
                  {step.title}
                </Typography>
                {step.duration && (
                  <Chip label={step.duration} size="small" variant="outlined" />
                )}
              </Box>
              
              <Typography variant="body2" paragraph>
                {step.description}
              </Typography>
              
              {step.instructions && step.instructions.length > 0 && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
                    Instrukcje:
                  </Typography>
                  <List dense>
                    {step.instructions.map((instruction: string, instrIndex: number) => (
                      <ListItem key={instrIndex} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Chip label={instrIndex + 1} size="small" color="primary" sx={{ minWidth: 24 }} />
                              <Typography variant="body2">{instruction}</Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              {step.safety && step.safety.length > 0 && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  <Typography variant="body2" fontWeight="medium" sx={{ mb: 0.5 }}>
                    Środki bezpieczeństwa:
                  </Typography>
                  <List dense>
                    {step.safety.map((safety: string, safetyIndex: number) => (
                      <ListItem key={safetyIndex} sx={{ py: 0 }}>
                        <ListItemText primary={safety} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* Obliczenia */}
      {protocol.calculations && protocol.calculations.length > 0 && renderSection(
        'Obliczenia i wzory',
        <CalcIcon color="primary" />,
        <Box>
          {protocol.calculations.map((calc: any, index: number) => (
            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                {calc.name}
              </Typography>
              <Typography variant="body2" paragraph>
                {calc.description}
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, mb: 2 }}>
                <Typography variant="h6" sx={{ fontFamily: 'monospace', color: 'primary.main', textAlign: 'center' }}>
                  {calc.formula}
                </Typography>
              </Box>
              {calc.variables && calc.variables.length > 0 && (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Nazwa</TableCell>
                        <TableCell>Jednostka</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calc.variables.map((variable: any, varIndex: number) => (
                        <TableRow key={varIndex}>
                          <TableCell sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            {variable.symbol}
                          </TableCell>
                          <TableCell>{variable.name}</TableCell>
                          <TableCell>{variable.unit}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* Kryteria akceptacji */}
      {protocol.acceptanceCriteria && (
        (Array.isArray(protocol.acceptanceCriteria) && protocol.acceptanceCriteria.length > 0) ||
        (typeof protocol.acceptanceCriteria === 'object' && Object.keys(protocol.acceptanceCriteria).length > 0)
      ) && renderSection(
        'Kryteria akceptacji',
        <AcceptanceIcon color="success" />,
        <Box>
          {Array.isArray(protocol.acceptanceCriteria) ? (
            <List>
              {protocol.acceptanceCriteria.map((criterion: string, index: number) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <AcceptanceIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={criterion}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box>
              {Object.entries(protocol.acceptanceCriteria).map(([key, value]: [string, any]) => (
                <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                  <AcceptanceIcon color="success" fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                  <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Typowe problemy i rozwiązania */}
      {protocol.commonIssues && protocol.commonIssues.length > 0 && renderSection(
        'Typowe problemy i rozwiązania',
        <IssuesIcon color="warning" />,
        <Box>
          {protocol.commonIssues.map((issue: any, index: number) => (
            <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1, color: 'warning.main' }}>
                <IssuesIcon fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Problem: {typeof issue === 'string' ? issue : issue.issue}
              </Typography>
              {typeof issue === 'object' && issue.cause && (
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Przyczyna:</strong> {issue.cause}
                </Typography>
              )}
              {typeof issue === 'object' && issue.solution && (
                <Typography variant="body2">
                  <strong>Rozwiązanie:</strong> {issue.solution}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}

      {/* Typowe wartości */}
      {protocol.typicalValues && (
        (Array.isArray(protocol.typicalValues) && protocol.typicalValues.length > 0) ||
        (typeof protocol.typicalValues === 'object' && Object.keys(protocol.typicalValues).length > 0)
      ) && renderSection(
        'Typowe wartości',
        <ValuesIcon color="info" />,
        <Box>
          {Array.isArray(protocol.typicalValues) ? (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Materiał/Parametr</TableCell>
                    <TableCell>Wartość</TableCell>
                    <TableCell>Jednostka</TableCell>
                    <TableCell>Uwagi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {protocol.typicalValues.map((value: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{value.material || value.parameter || `Wartość ${index + 1}`}</TableCell>
                      <TableCell>{value.value || value.range || '-'}</TableCell>
                      <TableCell>{value.unit || '-'}</TableCell>
                      <TableCell>{value.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box>
              {Object.entries(protocol.typicalValues).map(([key, value]: [string, any]) => (
                <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                  <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
                </Typography>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Notatki */}
      {protocol.notes && protocol.notes.length > 0 && renderSection(
        'Notatki',
        <NotesIcon color="primary" />,
        <List>
          {protocol.notes.map((note: string, index: number) => (
            <ListItem key={index}>
              <ListItemIcon>
                <NotesIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={note}
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Bibliografia */}
      {protocol.references && protocol.references.length > 0 && renderSection(
        'Bibliografia',
        <CategoryIcon color="primary" />,
        <List>
          {protocol.references.map((reference: any, index: number) => (
            <ListItem key={index} divider={index < protocol.references.length - 1}>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="body2" fontWeight="bold" component="span">
                      [{index + 1}] {typeof reference === 'string' ? reference : reference.title}
                    </Typography>
                  </Box>
                }
                secondary={
                  typeof reference === 'object' && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {reference.authors} ({reference.year})
                      </Typography>
                      {reference.source && (
                        <Typography variant="caption" color="text.secondary">
                          {reference.source}
                        </Typography>
                      )}
                    </Box>
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      )}

      {/* Stopka */}
      <Paper sx={{ p: 2, mt: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
        <Typography variant="caption" color="text.secondary">
          Protokół wygenerowany przez Edith
        </Typography>
        <br />
        <Typography variant="caption" color="text.secondary">
          Data wygenerowania: {new Date().toLocaleDateString('pl-PL')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProtocolPreview;
