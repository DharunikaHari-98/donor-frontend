import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOrganRequest } from '../services/adminApi';
import { Box, Button, Grid, Paper, TextField, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FavoriteIcon from '@mui/icons-material/Favorite';

const OrganRequestFormPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        hospitalName: '',
        hospitalContact: '',
        organType: '',
        bloodGroup: '',
        urgency: 'MEDIUM',
        hospitalCity: '',
        hospitalState: '',
    });

    const mutation = useMutation({
        mutationFn: createOrganRequest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['organRequests'] });
            navigate('/admin/organ-requests');
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <FavoriteIcon color="primary" sx={{ fontSize: 40, mr: 2 }}/>
                <Typography variant="h5" component="h1" fontWeight="600">
                    Create New Organ Request
                </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><TextField name="hospitalName" label="Hospital Name" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="hospitalContact" label="Hospital Contact Info" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="hospitalCity" label="City" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="hospitalState" label="State" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="organType" label="Organ Type (e.g., Kidney)" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="bloodGroup" label="Blood Group (e.g., O+)" onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth required>
                            <InputLabel>Urgency</InputLabel>
                            <Select name="urgency" value={formData.urgency} label="Urgency" onChange={handleChange}>
                                <MenuItem value="LOW">Low</MenuItem>
                                <MenuItem value="MEDIUM">Medium</MenuItem>
                                <MenuItem value="HIGH">High</MenuItem>
                                <MenuItem value="CRITICAL">Critical</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={mutation.isPending ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default OrganRequestFormPage;