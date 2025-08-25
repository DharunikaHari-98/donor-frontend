// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authApi';
import http from '../services/http';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Avatar,
  Grid,
  CircularProgress,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

// --- styles ---
const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2, 0),
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 40%, #e0c3fc 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'radial-gradient(circle at 30% 20%, rgba(102, 126, 234, 0.1) 0%, transparent 70%), radial-gradient(circle at 70% 80%, rgba(240, 147, 251, 0.1) 0%, transparent 70%)',
    zIndex: 1
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius * 3,
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(15px)',
  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  position: 'relative',
  zIndex: 2
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  background: 'linear-gradient(45deg, #667eea, #764ba2)',
  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  margin: theme.spacing(1)
}));

// --- component ---
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    role: 'DONOR'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // 1) Create the login account
      await registerUser(formData);

      // 2) If DONOR, also create a donor profile — this triggers the welcome email
      if (formData.role === 'DONOR') {
        const donorPayload = {
          name: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: '',
          dob: '1990-01-01',
          gender: 'OTHER',
          bloodGroup: 'A+',
          address: '',
          city: 'Chennai',
          state: 'TN',
          medicalNotes: '',
          willingPosthumous: true,
          willingBlood: true
        };
        await http.post('/donor-profiles', donorPayload);
      }

      // 3) Go to login
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledRoot>
      <Container component="main" maxWidth="xs">
        <Fade in timeout={800}>
          <StyledPaper>
            <StyledAvatar>
              <PersonAddOutlinedIcon />
            </StyledAvatar>
            <Typography
              component="h1"
              variant="h5"
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Create Account
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    width: '100%',
                    mb: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)'
                  }}
                >
                  {error}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    variant="filled"
                    sx={{
                      '& .MuiFilledInput-root': {
                        background: 'rgba(102, 126, 234, 0.08)',
                        borderRadius: 2,
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.12)',
                          border: '1px solid rgba(102, 126, 234, 0.4)'
                        },
                        '&.Mui-focused': {
                          background: 'rgba(102, 126, 234, 0.15)',
                          border: '2px solid #667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': { color: '#555', fontWeight: 500 },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="filled"
                    sx={{
                      '& .MuiFilledInput-root': {
                        background: 'rgba(102, 126, 234, 0.08)',
                        borderRadius: 2,
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.12)',
                          border: '1px solid rgba(102, 126, 234, 0.4)'
                        },
                        '&.Mui-focused': {
                          background: 'rgba(102, 126, 234, 0.15)',
                          border: '2px solid #667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': { color: '#555', fontWeight: 500 },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    variant="filled"
                    sx={{
                      '& .MuiFilledInput-root': {
                        background: 'rgba(102, 126, 234, 0.08)',
                        borderRadius: 2,
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.12)',
                          border: '1px solid rgba(102, 126, 234, 0.4)'
                        },
                        '&.Mui-focused': {
                          background: 'rgba(102, 126, 234, 0.15)',
                          border: '2px solid #667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': { color: '#555', fontWeight: 500 },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    variant="filled"
                    sx={{
                      '& .MuiFilledInput-root': {
                        background: 'rgba(102, 126, 234, 0.08)',
                        borderRadius: 2,
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.12)',
                          border: '1px solid rgba(102, 126, 234, 0.4)'
                        },
                        '&.Mui-focused': {
                          background: 'rgba(102, 126, 234, 0.15)',
                          border: '2px solid #667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': { color: '#555', fontWeight: 500 },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl
                    fullWidth
                    required
                    variant="filled"
                    sx={{
                      '& .MuiFilledInput-root': {
                        background: 'rgba(102, 126, 234, 0.08)',
                        borderRadius: 2,
                        border: '1px solid rgba(102, 126, 234, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(102, 126, 234, 0.12)',
                          border: '1px solid rgba(102, 126, 234, 0.4)'
                        },
                        '&.Mui-focused': {
                          background: 'rgba(102, 126, 234, 0.15)',
                          border: '2px solid #667eea',
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': { color: '#555', fontWeight: 500 },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' }
                    }}
                  >
                    <InputLabel id="role-select-label">
                      I am registering as a...
                    </InputLabel>
                    <Select
                      labelId="role-select-label"
                      name="role"
                      value={formData.role}
                      label="I am registering as a..."
                      onChange={handleChange}
                    >
                      <MenuItem value="DONOR">Donor</MenuItem>
                      <MenuItem value="HOSPITAL">Hospital Representative</MenuItem>
                      <MenuItem value="ORGAN_BANK">Organ Bank Staff</MenuItem>
                      <MenuItem value="ADMIN">System Admin</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5a6fd8, #6a42a0)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)'
                  }
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign Up'
                )}
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#667eea',
                        fontWeight: 500,
                        '&:hover': { textDecoration: 'underline', color: '#764ba2' },
                        transition: 'color 0.3s ease'
                      }}
                    >
                      Already have an account? Sign In
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </StyledPaper>
        </Fade>
      </Container>
    </StyledRoot>
  );
};

export default RegisterPage;
