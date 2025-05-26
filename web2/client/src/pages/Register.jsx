import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Grid,
    Link,
    Alert,
} from '@mui/material';
import { PersonAddOutlined } from '@mui/icons-material';
import api from '../config/api';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });
            localStorage.setItem('token', response.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    <Box
                        sx={{
                            backgroundColor: 'primary.main',
                            borderRadius: '50%',
                            padding: 2,
                            marginBottom: 2,
                        }}
                    >
                        <PersonAddOutlined sx={{ color: 'white', fontSize: 40 }} />
                    </Box>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full Name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    {"Already have an account? Sign in"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}

export default Register; 