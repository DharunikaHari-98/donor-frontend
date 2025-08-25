import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createAllocation } from '../services/hospitalApi';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const AllocationCreateModal = ({ open, onClose, matchId }) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        hospitalLocation: '',
        transportMode: 'AMBULANCE',
        scheduledAt: '',
    });

    const mutation = useMutation({
        mutationFn: createAllocation,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['allocations'] });
            onClose();
            navigate(`/hospital/allocations/${data.id}`);
        },
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = () => mutation.mutate({ matchId, ...formData });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AssignmentTurnedInIcon color="primary" />
                    Create Allocation from Match #{matchId}
                </Box>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}><TextField name="hospitalLocation" label="Current Location of Organ/Blood" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12}><FormControl fullWidth>
                        <InputLabel>Transport Mode</InputLabel>
                        <Select name="transportMode" value={formData.transportMode} label="Transport Mode" onChange={handleChange}>
                            <MenuItem value="AMBULANCE">Ambulance</MenuItem>
                            <MenuItem value="SELF">Self-Arranged</MenuItem>
                        </Select>
                    </FormControl></Grid>
                    <Grid item xs={12}><TextField name="scheduledAt" label="Scheduled Pickup Time" type="datetime-local" onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }}/></Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={mutation.isPending} startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}>
                    {mutation.isPending ? 'Creating...' : 'Create Allocation'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AllocationCreateModal;