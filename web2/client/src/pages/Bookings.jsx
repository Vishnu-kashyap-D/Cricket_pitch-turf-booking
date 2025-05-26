import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  CircularProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import api from '../config/api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setViewDialog(true);
  };

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/bookings/${selectedBooking.id}`);
      setBookings(bookings.filter((b) => b.id !== selectedBooking.id));
      setDeleteDialog(false);
    } catch (err) {
      setError('Failed to delete booking');
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Booking ID</TableCell>
              <TableCell>Pitch Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.pitch.name}</TableCell>
                <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>{booking.duration} hours</TableCell>
                <TableCell>${booking.amount}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      backgroundColor:
                        booking.status === 'confirmed'
                          ? 'success.light'
                          : booking.status === 'pending'
                          ? 'warning.light'
                          : 'error.light',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block',
                    }}
                  >
                    {booking.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Button
                    startIcon={<ViewIcon />}
                    onClick={() => handleView(booking)}
                    sx={{ mr: 1 }}
                  >
                    View
                  </Button>
                  {booking.status === 'pending' && (
                    <Button
                      startIcon={<DeleteIcon />}
                      color="error"
                      onClick={() => handleDelete(booking)}
                    >
                      Cancel
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View Booking Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Pitch: {selectedBooking.pitch.name}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Date: {new Date(selectedBooking.date).toLocaleDateString()}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Time: {selectedBooking.time}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Duration: {selectedBooking.duration} hours
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Amount: ${selectedBooking.amount}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                Status: {selectedBooking.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this booking? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>No</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Bookings; 