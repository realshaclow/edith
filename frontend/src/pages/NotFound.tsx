import React from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import { Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Card sx={{ maxWidth: 400, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h1" component="h1" gutterBottom color="primary">
            404
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Strona nie została znaleziona
          </Typography>
          <Typography color="text.secondary" paragraph>
            Przepraszamy, ale strona której szukasz nie istnieje.
          </Typography>
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            Powrót do strony głównej
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default NotFound;
