import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { LocationOn, AccessTime, AttachMoney } from '@mui/icons-material';
import api from '../config/api';

function Pitches() {
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPitch, setSelectedPitch] = useState(null);
  const [bookingDialog, setBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 1,
  });

  useEffect(() => {
    fetchPitches();
  }, []);

  const fetchPitches = async () => {
    try {
      const response = await api.get('/pitches');
      setPitches(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch pitches');
      setLoading(false);
    }
  };

  const handleBooking = (pitch) => {
    setSelectedPitch(pitch);
    setBookingDialog(true);
  };

  const handleBookingSubmit = async () => {
    try {
      await api.post('/bookings', {
        pitchId: selectedPitch.id,
        ...bookingData,
      });
      setBookingDialog(false);
      // Show success message or redirect to bookings page
    } catch (err) {
      setError('Failed to create booking');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Pitches
      </Typography>
      <Grid container spacing={4}>
        {pitches.map((pitch) => (
          <Grid item key={pitch.id} xs={12} sm={6} md={4}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={pitch.image || 'https://via.placeholder.com/300x200'}
                alt={pitch.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {pitch.name}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOn color="action" />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    {pitch.location}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                  <Rating value={pitch.rating} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary" ml={1}>
                    ({pitch.reviews} reviews)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={2}>
                  <AttachMoney color="action" />
                  <Typography variant="h6" color="primary" ml={1}>
                    ${pitch.price}/hour
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleBooking(pitch)}
                >
                  Book Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)}>
        <DialogTitle>Book Pitch</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              type="date"
              label="Date"
              value={bookingData.date}
              onChange={(e) =>
                setBookingData({ ...bookingData, date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
            <TextField
              fullWidth
              type="time"
              label="Time"
              value={bookingData.time}
              onChange={(e) =>
                setBookingData({ ...bookingData, time: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Duration (hours)"
              value={bookingData.duration}
              onChange={(e) =>
                setBookingData({ ...bookingData, duration: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialog(false)}>Cancel</Button>
          <Button onClick={handleBookingSubmit} variant="contained">
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Pitches; 