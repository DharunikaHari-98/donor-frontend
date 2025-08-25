import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrganRequest } from '../services/hospitalApi';
import { Box, Button, Grid, Paper, TextField, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';

const OrganRequestFormPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({ hospitalName: '', hospitalContact: '', organType: '', bloodGroup: '', urgency: 'MEDIUM' });
    const mutation = useMutation({ mutationFn: createOrganRequest, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['organRequests'] }); navigate('/hospital/organ-requests'); } });
    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault(); mutation.mutate(formData); };
    return (
        <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><MedicalServicesIcon color="primary" sx={{ fontSize: 40, mr: 2 }}/><Typography variant="h5" fontWeight="600">Create New Organ Request</Typography></Box>
            <Divider sx={{mb: 3}} />
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField name="hospitalName" label="Hospital Name" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="hospitalContact" label="Contact Info" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="organType" label="Organ Type (e.g., Kidney)" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="bloodGroup" label="Blood Group (e.g., O+)" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="hospitalCity" label="City" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="hospitalState" label="State" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12}><FormControl fullWidth required><InputLabel>Urgency</InputLabel><Select name="urgency" value={formData.urgency} label="Urgency" onChange={handleChange}><MenuItem value="LOW">Low</MenuItem><MenuItem value="MEDIUM">Medium</MenuItem><MenuItem value="HIGH">High</MenuItem><MenuItem value="CRITICAL">Critical</MenuItem></Select></FormControl></Grid>
                    <Grid item xs={12}><Button type="submit" variant="contained" size="large" startIcon={mutation.isPending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />} disabled={mutation.isPending}>{mutation.isPending ? 'Submitting...' : 'Submit Request'}</Button></Grid>
                </Grid>
            </Box>
        </Paper>
    );
};
export default OrganRequestFormPage;