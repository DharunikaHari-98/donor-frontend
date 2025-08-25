import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDonorById, createDonor, updateDonor } from '../services/donorAdminApi';
import {
    Box,
    Button,
    Grid,
    Paper,
    TextField,
    Typography,
    CircularProgress,
    FormControlLabel,
    Checkbox,
    Divider,
    Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';

const DonorProfileFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dob: '',
        bloodGroup: '',
        address: '',
        city: '',
        state: '',
        willingBlood: false,
        willingPosthumous: false,
        medicalNotes: ''
    });

    // Fetch donor data if in edit mode
    const { data: existingDonor, isLoading: isFetching, isError: isFetchError } = useQuery({
        queryKey: ['donor', id],
        queryFn: () => getDonorById(id),
        enabled: isEditMode, // Only run this query if there's an ID
    });

    // Pre-fill the form with existing data in edit mode
    useEffect(() => {
        if (isEditMode && existingDonor) {
            setFormData({
                name: existingDonor.name || '',
                email: existingDonor.email || '',
                phone: existingDonor.phone || '',
                // Format date for the date input field
                dob: existingDonor.dob ? new Date(existingDonor.dob).toISOString().split('T')[0] : '',
                bloodGroup: existingDonor.bloodGroup || '',
                address: existingDonor.address || '',
                city: existingDonor.city || '',
                state: existingDonor.state || '',
                willingBlood: existingDonor.willingBlood || false,
                willingPosthumous: existingDonor.willingPosthumous || false,
                medicalNotes: existingDonor.medicalNotes || ''
            });
        }
    }, [isEditMode, existingDonor]);

    // Mutation for creating or updating the donor
    const mutation = useMutation({
        mutationFn: (donorData) => {
            return isEditMode ? updateDonor({ id, ...donorData }) : createDonor(donorData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['donors'] }); // Invalidate the list
            queryClient.invalidateQueries({ queryKey: ['donor', id] }); // Invalidate this specific donor
            navigate('/admin/donors');
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (isFetching) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    }

    if (isFetchError) {
        return <Alert severity="error">Failed to fetch donor data. Please try again later.</Alert>;
    }

    return (
        <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                {isEditMode ? <EditIcon color="primary" sx={{ fontSize: 40, mr: 2 }}/> : <PersonAddIcon color="primary" sx={{ fontSize: 40, mr: 2 }}/>}
                <Typography variant="h5" component="h1" fontWeight="600">
                    {isEditMode ? `Edit Donor Profile #${id}` : 'Create New Donor'}
                </Typography>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* --- Personal & Contact Info --- */}
                    <Grid item xs={12}><Typography variant="h6">Personal & Contact Info</Typography><Divider /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="name" label="Full Name" value={formData.name} onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="phone" label="Phone Number" value={formData.phone} onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} required fullWidth InputLabelProps={{ shrink: true }} /></Grid>

                    {/* --- Address --- */}
                    <Grid item xs={12}><Typography variant="h6" mt={2}>Address</Typography><Divider /></Grid>
                    <Grid item xs={12}><TextField name="address" label="Street Address" value={formData.address} onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="city" label="City" value={formData.city} onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="state" label="State" value={formData.state} onChange={handleChange} required fullWidth /></Grid>

                    {/* --- Medical & Consent --- */}
                    <Grid item xs={12}><Typography variant="h6" mt={2}>Medical & Consent</Typography><Divider /></Grid>
                    <Grid item xs={12} sm={6}><TextField name="bloodGroup" label="Blood Group (e.g., O+)" value={formData.bloodGroup} onChange={handleChange} required fullWidth /></Grid>
                    <Grid item xs={12}>
                        <FormControlLabel control={<Checkbox name="willingBlood" checked={formData.willingBlood} onChange={handleChange} />} label="Willing to donate blood" />
                        <FormControlLabel control={<Checkbox name="willingPosthumous" checked={formData.willingPosthumous} onChange={handleChange} />} label="Willing to donate organs (posthumous)" />
                    </Grid>
                    <Grid item xs={12}><TextField name="medicalNotes" label="Medical Notes (Optional)" multiline rows={3} value={formData.medicalNotes} onChange={handleChange} fullWidth /></Grid>

                    {/* --- Submission --- */}
                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            startIcon={mutation.isPending ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? 'Saving...' : 'Save Profile'}
                        </Button>
                         {mutation.isError && <Alert severity="error" sx={{mt: 2}}>{(mutation.error).message}</Alert>}
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    );
};

export default DonorProfileFormPage;