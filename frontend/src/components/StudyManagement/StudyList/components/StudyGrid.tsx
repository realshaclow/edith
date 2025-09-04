import React from 'react';
import { Grid, Box, Typography, Skeleton } from '@mui/material';
import { StudyCard } from './StudyCard';
import { StudyListItem, StudyViewMode, StudyQuickAction } from '../types';

interface StudyGridProps {
  studies: StudyListItem[];
  viewMode: StudyViewMode;
  selectedIds: Set<string>;
  onSelect: (studyId: string, selected: boolean) => void;
  onQuickAction: (action: StudyQuickAction, study: StudyListItem) => void;
  isLoading: boolean;
}

export const StudyGrid: React.FC<StudyGridProps> = ({
  studies,
  viewMode,
  selectedIds,
  onSelect,
  onQuickAction,
  isLoading
}) => {
  
  // Loading skeleton
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 8 }).map((_, index) => (
          <Grid 
            item 
            xs={12} 
            sm={viewMode === 'list' ? 12 : 6} 
            md={viewMode === 'list' ? 12 : 4} 
            lg={viewMode === 'list' ? 12 : 3}
            key={index}
          >
            <Skeleton variant="rectangular" height={viewMode === 'list' ? 80 : 320} />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Empty state
  if (studies.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        py={8}
        textAlign="center"
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No studies found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Try adjusting your search criteria or create a new study
        </Typography>
      </Box>
    );
  }

  // Grid layout
  if (viewMode === 'grid') {
    return (
      <Grid container spacing={2}>
        {studies.map((study) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={study.id}>
            <StudyCard
              study={study}
              viewMode={viewMode}
              isSelected={selectedIds.has(study.id)}
              onSelect={onSelect}
              onQuickAction={onQuickAction}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  // List layout
  return (
    <Box>
      {studies.map((study) => (
        <StudyCard
          key={study.id}
          study={study}
          viewMode={viewMode}
          isSelected={selectedIds.has(study.id)}
          onSelect={onSelect}
          onQuickAction={onQuickAction}
        />
      ))}
    </Box>
  );
};
