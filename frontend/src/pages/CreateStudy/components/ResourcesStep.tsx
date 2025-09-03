import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Grid,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  Divider
} from '@mui/material';
import { Add, Delete, ExpandMore, Person, Build, Inventory } from '@mui/icons-material';
import { StudyFormData, PersonnelResource, EquipmentResource, MaterialResource, CreateStudyFormErrors } from '../types';

interface ResourcesStepProps {
  studyData: StudyFormData;
  errors: CreateStudyFormErrors;
  onUpdate: (data: Partial<StudyFormData>) => void;
}

export const ResourcesStep: React.FC<ResourcesStepProps> = ({
  studyData,
  errors,
  onUpdate
}) => {
  const updateResources = (updates: Partial<typeof studyData.resources>) => {
    onUpdate({
      resources: {
        ...studyData.resources,
        ...updates
      }
    });
  };

  const updateBudget = (updates: Partial<typeof studyData.resources.budget>) => {
    updateResources({
      budget: {
        ...studyData.resources.budget,
        ...updates
      }
    });
  };

  const updateBudgetBreakdown = (updates: Partial<typeof studyData.resources.budget.breakdown>) => {
    updateBudget({
      breakdown: {
        ...studyData.resources.budget.breakdown,
        ...updates
      }
    });
  };

  // Personnel functions
  const addPersonnel = () => {
    const newPersonnel: PersonnelResource = {
      id: `person_${Date.now()}`,
      name: '',
      role: '',
      responsibility: '',
      allocation: 100,
      cost: 0
    };
    updateResources({
      personnel: [...studyData.resources.personnel, newPersonnel]
    });
  };

  const updatePersonnel = (personId: string, updates: Partial<PersonnelResource>) => {
    const updatedPersonnel = studyData.resources.personnel.map(person =>
      person.id === personId ? { ...person, ...updates } : person
    );
    updateResources({ personnel: updatedPersonnel });
  };

  const removePersonnel = (personId: string) => {
    const filteredPersonnel = studyData.resources.personnel.filter(person => person.id !== personId);
    updateResources({ personnel: filteredPersonnel });
  };

  // Equipment functions
  const addEquipment = () => {
    const newEquipment: EquipmentResource = {
      id: `equipment_${Date.now()}`,
      name: '',
      specification: '',
      quantity: 1,
      cost: 0,
      availability: 'available'
    };
    updateResources({
      equipment: [...studyData.resources.equipment, newEquipment]
    });
  };

  const updateEquipment = (equipmentId: string, updates: Partial<EquipmentResource>) => {
    const updatedEquipment = studyData.resources.equipment.map(equipment =>
      equipment.id === equipmentId ? { ...equipment, ...updates } : equipment
    );
    updateResources({ equipment: updatedEquipment });
  };

  const removeEquipment = (equipmentId: string) => {
    const filteredEquipment = studyData.resources.equipment.filter(equipment => equipment.id !== equipmentId);
    updateResources({ equipment: filteredEquipment });
  };

  // Materials functions
  const addMaterial = () => {
    const newMaterial: MaterialResource = {
      id: `material_${Date.now()}`,
      name: '',
      description: '',
      quantity: '',
      cost: 0,
      supplier: ''
    };
    updateResources({
      materials: [...studyData.resources.materials, newMaterial]
    });
  };

  const updateMaterial = (materialId: string, updates: Partial<MaterialResource>) => {
    const updatedMaterials = studyData.resources.materials.map(material =>
      material.id === materialId ? { ...material, ...updates } : material
    );
    updateResources({ materials: updatedMaterials });
  };

  const removeMaterial = (materialId: string) => {
    const filteredMaterials = studyData.resources.materials.filter(material => material.id !== materialId);
    updateResources({ materials: filteredMaterials });
  };

  // Calculate total budget
  const calculateTotalBudget = () => {
    const breakdown = studyData.resources.budget.breakdown;
    return breakdown.personnel + breakdown.equipment + breakdown.materials + breakdown.overhead + breakdown.contingency;
  };

  React.useEffect(() => {
    const totalBudget = calculateTotalBudget();
    if (totalBudget !== studyData.resources.budget.totalBudget) {
      updateBudget({ totalBudget });
    }
  }, [studyData.resources.budget.breakdown]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Zasoby badania
        </Typography>

        <Box display="flex" flexDirection="column" gap={3}>
          {/* Personnel */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Person />
                <Typography variant="h6">
                  Personel ({studyData.resources.personnel.length})
                </Typography>
                <IconButton onClick={addPersonnel} color="primary" size="small">
                  <Add />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {studyData.resources.personnel.length === 0 ? (
                <Box textAlign="center" py={2}>
                  <Typography color="text.secondary">
                    Brak przypisanego personelu. Kliknij "+" aby dodać osobę.
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {studyData.resources.personnel.map((person, index) => (
                    <Card key={person.id} variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
                          <Typography variant="subtitle1">
                            Osoba {index + 1}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => removePersonnel(person.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Imię i nazwisko"
                              value={person.name}
                              onChange={(e) => updatePersonnel(person.id, { name: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Rola/Stanowisko"
                              value={person.role}
                              onChange={(e) => updatePersonnel(person.id, { role: e.target.value })}
                              placeholder="np. Główny badacz, Technik"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Odpowiedzialności"
                              value={person.responsibility}
                              onChange={(e) => updatePersonnel(person.id, { responsibility: e.target.value })}
                              multiline
                              rows={2}
                              placeholder="Opisz zadania i odpowiedzialności"
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Zaangażowanie"
                              type="number"
                              value={person.allocation}
                              onChange={(e) => updatePersonnel(person.id, { allocation: Number(e.target.value) })}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">%</InputAdornment>
                              }}
                              inputProps={{ min: 0, max: 100 }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Koszt"
                              type="number"
                              value={person.cost}
                              onChange={(e) => updatePersonnel(person.id, { cost: Number(e.target.value) })}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">{studyData.resources.budget.currency}</InputAdornment>
                              }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Equipment */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Build />
                <Typography variant="h6">
                  Sprzęt ({studyData.resources.equipment.length})
                </Typography>
                <IconButton onClick={addEquipment} color="primary" size="small">
                  <Add />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {studyData.resources.equipment.length === 0 ? (
                <Box textAlign="center" py={2}>
                  <Typography color="text.secondary">
                    Brak wymaganego sprzętu. Kliknij "+" aby dodać urządzenie.
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {studyData.resources.equipment.map((equipment, index) => (
                    <Card key={equipment.id} variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="subtitle1">
                            Sprzęt {index + 1}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => removeEquipment(equipment.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Nazwa sprzętu"
                              value={equipment.name}
                              onChange={(e) => updateEquipment(equipment.id, { name: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Ilość"
                              type="number"
                              value={equipment.quantity}
                              onChange={(e) => updateEquipment(equipment.id, { quantity: Number(e.target.value) })}
                              inputProps={{ min: 1 }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Specyfikacja"
                              value={equipment.specification}
                              onChange={(e) => updateEquipment(equipment.id, { specification: e.target.value })}
                              placeholder="Model, parametry techniczne, wymagania"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Materials */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Box display="flex" alignItems="center" gap={1}>
                <Inventory />
                <Typography variant="h6">
                  Materiały ({studyData.resources.materials.length})
                </Typography>
                <IconButton onClick={addMaterial} color="primary" size="small">
                  <Add />
                </IconButton>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {studyData.resources.materials.length === 0 ? (
                <Box textAlign="center" py={2}>
                  <Typography color="text.secondary">
                    Brak zdefiniowanych materiałów. Kliknij "+" aby dodać materiał.
                  </Typography>
                </Box>
              ) : (
                <Box display="flex" flexDirection="column" gap={2}>
                  {studyData.resources.materials.map((material, index) => (
                    <Card key={material.id} variant="outlined">
                      <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="subtitle1">
                            Materiał {index + 1}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => removeMaterial(material.id)}
                            color="error"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Nazwa materiału"
                              value={material.name}
                              onChange={(e) => updateMaterial(material.id, { name: e.target.value })}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Ilość"
                              value={material.quantity}
                              onChange={(e) => updateMaterial(material.id, { quantity: e.target.value })}
                              placeholder="np. 10 kg, 5 szt., 2 l"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              label="Opis"
                              value={material.description}
                              onChange={(e) => updateMaterial(material.id, { description: e.target.value })}
                              placeholder="Specyfikacja, wymagania jakościowe"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </AccordionDetails>
          </Accordion>

          {/* Budget Summary */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Podsumowanie budżetu
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Personel"
                    type="number"
                    value={studyData.resources.budget.breakdown.personnel}
                    onChange={(e) => updateBudgetBreakdown({ personnel: Number(e.target.value) })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{studyData.resources.budget.currency}</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Sprzęt"
                    type="number"
                    value={studyData.resources.budget.breakdown.equipment}
                    onChange={(e) => updateBudgetBreakdown({ equipment: Number(e.target.value) })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{studyData.resources.budget.currency}</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Materiały"
                    type="number"
                    value={studyData.resources.budget.breakdown.materials}
                    onChange={(e) => updateBudgetBreakdown({ materials: Number(e.target.value) })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{studyData.resources.budget.currency}</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Koszty pośrednie"
                    type="number"
                    value={studyData.resources.budget.breakdown.overhead}
                    onChange={(e) => updateBudgetBreakdown({ overhead: Number(e.target.value) })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{studyData.resources.budget.currency}</InputAdornment>
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Rezerwa"
                    type="number"
                    value={studyData.resources.budget.breakdown.contingency}
                    onChange={(e) => updateBudgetBreakdown({ contingency: Number(e.target.value) })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">{studyData.resources.budget.currency}</InputAdornment>
                    }}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Budżet całkowity:
                </Typography>
                <Typography variant="h5" color="primary">
                  {calculateTotalBudget().toLocaleString()} {studyData.resources.budget.currency}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </CardContent>
    </Card>
  );
};
