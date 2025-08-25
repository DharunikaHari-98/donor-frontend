// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Grid,
  CircularProgress,
  Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';

// Enhanced root container with mild gradient background
const StyledRoot = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  position: 'relative',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(3px)',
    opacity: 0.3,
    zIndex: -1,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(245, 247, 250, 0.8), rgba(195, 207, 226, 0.9))',
    zIndex: -1,
  }
});

// Enhanced form container with better styling
const FormContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(5, 4),
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: theme.shape.borderRadius * 3,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  color: '#333',
  maxWidth: 450,
  width: '100%',
}));

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login({ username, password }, navigate);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledRoot>
      <Container component="main" maxWidth="xs">
        <Fade in timeout={800}>
          <FormContainer>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: '600',
                textAlign: 'center',
                background: 'linear-gradient(45deg, #667eea, #764ba2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              {error && (
                <Alert
                  severity="error"
                  variant="filled"
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
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username or Email"
                name="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root': {
                    background: 'rgba(102, 126, 234, 0.08)',
                    borderRadius: 2,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.12)',
                      border: '1px solid rgba(102, 126, 234, 0.4)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(102, 126, 234, 0.15)',
                      border: '2px solid #667eea',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                    fontWeight: 500,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  }
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="filled"
                sx={{
                  '& .MuiFilledInput-root': {
                    background: 'rgba(102, 126, 234, 0.08)',
                    borderRadius: 2,
                    border: '1px solid rgba(102, 126, 234, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.12)',
                      border: '1px solid rgba(102, 126, 234, 0.4)',
                    },
                    '&.Mui-focused': {
                      background: 'rgba(102, 126, 234, 0.15)',
                      border: '2px solid #667eea',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#555',
                    fontWeight: 500,
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#667eea',
                  }
                }}
              />
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
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
                  },
                }}
              >
                {isLoading ? <CircularProgress size={26} color="inherit" /> : 'Sign In'}
              </Button>
              <Grid container>
                <Grid item>
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#667eea',
                        fontWeight: 500,
                        '&:hover': {
                          textDecoration: 'underline',
                          color: '#764ba2'
                        },
                        transition: 'color 0.3s ease'
                      }}
                    >
                      New to Vitalink? Sign up now.
                    </Typography>
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </FormContainer>
        </Fade>
      </Container>
    </StyledRoot>
  );
};

export default LoginPage;