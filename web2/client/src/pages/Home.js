import React from 'react';
import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SportsCricketIcon sx={{ fontSize: 40 }} />,
      title: 'Premium Pitches',
      description: 'Book high-quality cricket pitches for your matches',
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Booking',
      description: 'Book your pitch anytime, anywhere',
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      title: 'Multiple Locations',
      description: 'Choose from various locations across the city',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                Book Your Cricket Pitch
              </Typography>
              <Typography variant="h5" gutterBottom sx={{ mb: 4, opacity: 0.9 }}>
                Experience the best cricket facilities in town
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate('/pitches')}
                >
                  View Pitches
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  onClick={() => navigate('/register')}
                >
                  Register Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                alt="Cricket Pitch"
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 4,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  bgcolor: 'background.paper',
                  borderRadius: 4,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h5" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="text.secondary">{feature.description}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              bgcolor: 'primary.main',
              color: 'white',
              borderRadius: 4,
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              Ready to Book Your Pitch?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Join thousands of cricket enthusiasts who trust us for their matches
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/register')}
            >
              Get Started Now
            </Button>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default Home; 