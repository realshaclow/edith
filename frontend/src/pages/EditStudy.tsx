import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import EditStudyMain from './Studies/EditStudy/components/EditStudyMain';

const EditStudy: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Container maxWidth="lg">
      <Box>
        <EditStudyMain mode={id ? 'edit' : 'create'} />
      </Box>
    </Container>
  );
};

export default EditStudy;
