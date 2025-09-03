import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import StudyListMain from './StudyList/StudyListMain';
import { Study } from '../../types';

const StudyList: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateStudy = () => {
    navigate('/studies/create');
  };

  const handleEditStudy = (study: Study) => {
    navigate(`/studies/${study.id}/edit`);
  };

  const handleExecuteStudy = (study: Study) => {
    navigate(`/studies/${study.id}/execute`);
  };

  const handleViewStatistics = (study: Study) => {
    navigate(`/studies/${study.id}/statistics`);
  };

  return (
    <Container maxWidth="xl">
      <Box py={3}>
        <StudyListMain
          onCreateStudy={handleCreateStudy}
          onEditStudy={handleEditStudy}
          onExecuteStudy={handleExecuteStudy}
          onViewStatistics={handleViewStatistics}
        />
      </Box>
    </Container>
  );
};

export default StudyList;
