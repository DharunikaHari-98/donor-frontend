import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBloodRequest } from '../services/hospitalApi';
import { Box, Button, Grid, Paper, TextField, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

const BloodRequestFormPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ hospitalName: '', hospitalContact: '', bloodGroup: '', quantityUnits: 1, urgency: 'MEDIUM', notes: '', hospitalCity: '', hospitalState: '', neededBy: '' });
    const mutation = useMutation({ mutationFn: createBloodRequest, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['bloodRequests'] }); navigate('/hospital/blood-requests'); }, });
    const handleChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); mutation.mutate(formData); };
    return (
        <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><BloodtypeIcon color="primary" sx={{ fontSize: 40, mr: 2 }}/><Typography variant="h5" fontWeight="600">Create New Blood Request</Typography></Box>
            <Divider sx={{mb: 3}} />
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField name="hospitalName" label="Hospital Name" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="hospitalContact" label="Contact Info" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="hospitalCity" label="City" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="hospitalState" label="State" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="bloodGroup" label="Blood Group (e.g., A-)" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="quantityUnits" label="Quantity (Units)" type="number" defaultValue={1} onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12}><FormControl fullWidth required><InputLabel>Urgency</InputLabel><Select name="urgency" value={formData.urgency} label="Urgency" onChange={handleChange}><MenuItem value="LOW">Low</MenuItem><MenuItem value="MEDIUM">Medium</MenuItem><MenuItem value="HIGH">High</MenuItem><MenuItem value="CRITICAL">Critical</MenuItem></Select></FormControl></Grid>
                    <Grid item xs={12}><Button type="submit" variant="contained" size="large" startIcon={mutation.isPending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />} disabled={mutation.isPending}>{mutation.isPending ? 'Submitting...' : 'Submit Request'}</Button></Grid>
                </Grid>
            </Box>
        </Paper>
    );
};
export default BloodRequestFormPage;