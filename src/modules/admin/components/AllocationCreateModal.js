import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAllocation } from '../services/adminApi';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Grid, FormControl, InputLabel, Select, MenuItem,
  Box, Typography, LinearProgress, Slide,
  IconButton, useTheme, alpha, Chip, Alert
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// ---------- helpers ----------
/**
 * datetime-local returns "YYYY-MM-DDTHH:mm" in local time (no timezone).
 * Convert it to ISO-8601 (UTC, with 'Z') which your backend accepts.
 */
const toIsoFromDatetimeLocal = (val) => {
  if (!val) return null; // let backend treat as optional
  // val like "2025-08-21T22:51"
  const date = new Date(val); // interprets as local time
  return date.toISOString();  // e.g. "2025-08-21T17:21:00.000Z"
};

// ---------- animations ----------
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// ---------- styles ----------
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    backdropFilter: 'blur(10px)',
  },
  '& .MuiDialog-paper': {
    background: `linear-gradient(135deg,
      ${alpha(theme.palette.background.paper, 0.95)},
      ${alpha(theme.palette.primary.light, 0.05)})`,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.2)}`,
    position: 'relative',
    overflow: 'visible',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
      borderRadius: '24px 24px 0 0',
    }
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  background: `linear-gradient(135deg,
    ${alpha(theme.palette.primary.main, 0.1)},
    ${alpha(theme.palette.secondary.main, 0.05)})`,
  borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  padding: '24px 32px',
  position: 'relative',
  '& .MuiTypography-root': {
    fontSize: '1.5rem',
    fontWeight: 700,
    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    display: 'flex',
    alignItems: 'center',
    gap: 2,
  }
}));

const AnimatedTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: `linear-gradient(135deg,
      ${alpha(theme.palette.background.paper, 0.8)},
      ${alpha(theme.palette.primary.light, 0.02)})`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      }
    },
    '&.Mui-focused': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`,
      background: `linear-gradient(135deg,
        ${alpha(theme.palette.background.paper, 0.95)},
        ${alpha(theme.palette.primary.light, 0.05)})`,
    }
  },
  '& .MuiInputLabel-root': {
    fontWeight: 500,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    }
  }
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '16px',
    background: `linear-gradient(135deg,
      ${alpha(theme.palette.background.paper, 0.8)},
      ${alpha(theme.palette.primary.light, 0.02)})`,
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`,
    }
  }
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  borderRadius: '16px',
  padding: '12px 32px',
  fontWeight: 600,
  textTransform: 'none',
  fontSize: '1rem',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(variant === 'contained' && {
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
    '&:hover': {
      transform: 'translateY(-3px) scale(1.02)',
      boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}`,
    },
    '&:disabled': {
      background: alpha(theme.palette.action.disabled, 0.12),
      animation: `${pulse} 2s infinite`,
    }
  }),
  ...(variant === 'outlined' && {
    borderColor: alpha(theme.palette.text.primary, 0.3),
    color: theme.palette.text.primary,
    '&:hover': {
      transform: 'translateY(-2px)',
      borderColor: theme.palette.primary.main,
      backgroundColor: alpha(theme.palette.primary.main, 0.05),
    }
  })
}));

// ---------- component ----------
const AllocationCreateModal = ({ open, onClose, matchId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const [formData, setFormData] = useState({
    hospitalLocation: '',
    transportMode: 'AMBULANCE',
    scheduledAt: '', // datetime-local, e.g. "2025-08-21T22:51"
  });

  const mutation = useMutation({
    mutationFn: createAllocation,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      onClose();
      if (data?.id) navigate(`/admin/allocations/${data.id}`);
    },
  });

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = () => {
    const payload = {
      matchId,
      hospitalLocation: formData.hospitalLocation?.trim(),
      transportMode: formData.transportMode, // "AMBULANCE"|"SELF"
      scheduledAt: formData.scheduledAt ? toIsoFromDatetimeLocal(formData.scheduledAt) : null
    };
    mutation.mutate(payload);
  };

  const canSubmit = !!matchId && !!formData.hospitalLocation && !mutation.isLoading;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
    >
      <StyledDialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `${float} 2s ease-in-out infinite`,
              }}
            >
              <CheckCircleIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
            </Box>
            Create New Allocation
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              '&:hover': {
                transform: 'rotate(90deg)',
                backgroundColor: alpha(theme.palette.error.main, 0.1),
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </StyledDialogTitle>

      {mutation.isLoading && (
        <Box sx={{ width: '100%' }}>
          <LinearProgress
            sx={{
              height: 3,
              background: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }
            }}
          />
        </Box>
      )}

      <DialogContent sx={{ p: 4 }}>
        {mutation.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(() => {
              const err = mutation.error;
              if (typeof err === 'string') return err;
              if (err?.message) return err.message;
              // Common backend error envelope
              if (err?.error) return err.error;
              return 'Failed to create allocation. Please check inputs and try again.';
            })()}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <LocalHospitalIcon color="primary" />
              <Typography variant="h6" color="primary" fontWeight={600}>
                Hospital Information
              </Typography>
            </Box>
            <AnimatedTextField
              name="hospitalLocation"
              label="Hospital Location"
              value={formData.hospitalLocation}
              onChange={handleChange}
              required
              fullWidth
              placeholder="Enter the destination hospital"
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <DirectionsCarIcon color="primary" />
              <Typography variant="h6" color="primary" fontWeight={600}>
                Transport Details
              </Typography>
            </Box>
            <StyledFormControl fullWidth>
              <InputLabel>Transport Mode</InputLabel>
              <Select
                name="transportMode"
                value={formData.transportMode}
                label="Transport Mode"
                onChange={handleChange}
              >
                <MenuItem value="AMBULANCE">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    🚑 Ambulance
                    <Chip label="Recommended" size="small" color="success" />
                  </Box>
                </MenuItem>
                <MenuItem value="SELF">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    🚗 Self Transport
                  </Box>
                </MenuItem>
              </Select>
            </StyledFormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <AccessTimeIcon color="primary" />
              <Typography variant="h6" color="primary" fontWeight={600}>
                Schedule
              </Typography>
            </Box>
            <AnimatedTextField
              name="scheduledAt"
              label="Scheduled At"
              type="datetime-local"
              value={formData.scheduledAt}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
              helperText="Pick the pickup time (optional)"
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2, justifyContent: 'center' }}>
        <ActionButton onClick={onClose} variant="outlined" size="large">
          Cancel
        </ActionButton>
        <ActionButton
          onClick={handleSubmit}
          variant="contained"
          disabled={!canSubmit}
          size="large"
        >
          {mutation.isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  }
                }}
              />
              Creating...
            </Box>
          ) : (
            'Create Allocation'
          )}
        </ActionButton>
      </DialogActions>
    </StyledDialog>
  );
};

export default AllocationCreateModal;
