import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isAuthenticated = localStorage.getItem('token');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { text: 'Home', path: '/' },
    { text: 'Pitches', path: '/pitches' },
    ...(isAuthenticated
      ? [{ text: 'My Bookings', path: '/bookings' }]
      : []),
  ];

  const authButtons = isAuthenticated ? (
    <Button
      color="inherit"
      onClick={() => {
        localStorage.removeItem('token');
        window.location.href = '/';
      }}
    >
      Logout
    </Button>
  ) : (
    <Box>
      <Button
        color="inherit"
        component={RouterLink}
        to="/login"
        sx={{ mr: 1 }}
      >
        Login
      </Button>
      <Button
        variant="contained"
        color="secondary"
        component={RouterLink}
        to="/register"
      >
        Register
      </Button>
    </Box>
  );

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <SportsCricketIcon sx={{ mr: 1 }} />
        <Typography variant="h6">Cricket Booking</Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem
            key={item.text}
            component={RouterLink}
            to={item.path}
            sx={{ textAlign: 'center' }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        {isAuthenticated ? (
          <ListItem
            button
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/';
            }}
          >
            <ListItemText primary="Logout" />
          </ListItem>
        ) : (
          <>
            <ListItem component={RouterLink} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem component={RouterLink} to="/register">
              <ListItemText primary="Register" />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'white', color: 'primary.main' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <SportsCricketIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
              }}
            >
              Cricket Booking
            </Typography>
          </Box>

          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navItems.map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  component={RouterLink}
                  to={item.path}
                  sx={{ mx: 1 }}
                >
                  {item.text}
                </Button>
              ))}
              {authButtons}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar; 