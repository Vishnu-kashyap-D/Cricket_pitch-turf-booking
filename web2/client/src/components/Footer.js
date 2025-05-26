import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Cricket Booking
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Book your cricket pitch with ease. We provide the best facilities for cricket enthusiasts.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link href="/pitches" color="inherit" display="block" sx={{ mb: 1 }}>
              Pitches
            </Link>
            <Link href="/bookings" color="inherit" display="block" sx={{ mb: 1 }}>
              My Bookings
            </Link>
            <Link href="/login" color="inherit" display="block" sx={{ mb: 1 }}>
              Login
            </Link>
            <Link href="/register" color="inherit" display="block" sx={{ mb: 1 }}>
              Register
            </Link>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Email: info@cricketbooking.com
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Phone: +1 234 567 890
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Address: 123 Cricket Street, Sports City
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            mt: 4,
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            © {new Date().getFullYear()} Cricket Booking. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 