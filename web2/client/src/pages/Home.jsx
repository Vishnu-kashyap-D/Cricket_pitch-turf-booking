import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';

function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SportsCricketIcon sx={{ fontSize: 40 }} />,
      title: 'Premium Pitches',
      description: 'Book from our selection of high-quality cricket pitches',
    },
    {
      icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
      title: '24/7 Availability',
      description: 'Book your preferred time slot any day of the week',
    },
    {
      icon: <LocationOnIcon sx={{ fontSize: 40 }} />,
      title: 'Multiple Locations',
      description: 'Choose from various locations across the city',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      title: 'Group Bookings',
      description: 'Perfect for teams and group events',
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
              <Typography variant="h2" component="h1" gutterBottom>
                Book Your Perfect Cricket Pitch
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
                Experience the best cricket facilities with our easy booking system
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/pitches')}
                sx={{ mr: 2 }}
              >
                Book Now
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
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
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Why Choose Us
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
          We provide the best cricket booking experience
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  p: 3,
                }}
              >
                <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                <Typography variant="h6" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'primary.light', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Ready to Play?
          </Typography>
          <Typography variant="h6" align="center" sx={{ mb: 4, opacity: 0.9 }}>
            Book your cricket pitch now and enjoy the game
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate('/pitches')}
            >
              Book a Pitch
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home; 