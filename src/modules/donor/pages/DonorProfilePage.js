
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile, createMyProfile } from '../services/donorApi';
import { useAuth } from '../../../context/AuthContext';
import { Box, Typography, Paper, CircularProgress, Button, Grid, TextField, Alert, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const DonorProfilePage = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isEditMode, setIsEditMode] = useState(false);

    const [formData, setFormData] = useState({
        name: '', phone: '', email: '', dob: '', gender: '', bloodGroup: '',
        address: '', city: '', state: '', medicalNotes: '',
        willingPosthumous: false, willingBlood: true,
    });

    // NOTE: This assumes the logged-in user's ID can be used to find their Donor Profile.
    // If this fails for a new user, you may need a backend change to link UserAccount to DonorProfile on creation.
    const { data: profile, isLoading, isError, error, isSuccess } = useQuery({
        queryKey: ['myProfile', user?.id],
        queryFn: () => getMyProfile(user.id),
        enabled: !!user?.id,
        retry: false,
    });

    useEffect(() => {
        if (isSuccess && profile) {
            setFormData(profile);
            setIsEditMode(false);
        } else if (isSuccess && !profile) {
            setFormData(prev => ({ ...prev, name: user.username }));
            setIsEditMode(true);
        }
    }, [profile, isSuccess, user.username]);

    const mutation = useMutation({
        mutationFn: (data) => profile ? updateMyProfile({ id: profile.id, donorData: data }) : createMyProfile(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProfile', user.id] });
            setIsEditMode(false);
        },
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    if (isError && !profile) { // Show critical error only if there's no profile to display
        return <Alert severity="error">Could not load profile data: {error.message}</Alert>;
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">{profile ? 'My Profile' : 'Create Your Donor Profile'}</Typography>
                {!isEditMode && profile && <Button variant="contained" onClick={() => setIsEditMode(true)}>Edit</Button>}
            </Box>

            <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* --- Personal & Contact Info --- */}
                    <Grid item xs={12} sm={6}>
                        {isEditMode ? <TextField name="name" label="Full Name" value={formData.name || ''} onChange={handleChange} required fullWidth/> : <Typography><b>Name:</b> {profile?.name}</Typography>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {isEditMode ? <TextField name="email" label="Email" type="email" value={formData.email || ''} onChange={handleChange} required fullWidth/> : <Typography><b>Email:</b> {profile?.email}</Typography>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {isEditMode ? <TextField name="phone" label="Phone" value={formData.phone || ''} onChange={handleChange} fullWidth/> : <Typography><b>Phone:</b> {profile?.phone}</Typography>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {isEditMode ? <TextField name="dob" label="Date of Birth" type="date" value={formData.dob || ''} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }}/> : <Typography><b>Date of Birth:</b> {profile?.dob}</Typography>}
                    </Grid>

                    {/* --- Medical Info --- */}
                    <Grid item xs={12} sm={6}>
                        {isEditMode ? <TextField name="bloodGroup" label="Blood Group" value={formData.bloodGroup || ''} onChange={handleChange} required fullWidth/> : <Typography><b>Blood Group:</b> {profile?.bloodGroup}</Typography>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                         {isEditMode ? (<FormControl fullWidth>
                            <InputLabel>Gender</InputLabel>
                            <Select name="gender" value={formData.gender || ''} label="Gender" onChange={handleChange}>
                                <MenuItem value="Male">Male</MenuItem>
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Other">Other</MenuItem>
                            </Select>
                        </FormControl>) : <Typography><b>Gender:</b> {profile?.gender}</Typography>}
                    </Grid>

                    {/* --- Address Info --- */}
                     <Grid item xs={12}>
                        {isEditMode ? <TextField name="address" label="Address" value={formData.address || ''} onChange={handleChange} fullWidth /> : <Typography><b>Address:</b> {profile?.address}</Typography>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {isEditMode ? <TextField name="city" label="City" value={formData.city || ''} onChange={handleChange} fullWidth /> : <Typography><b>City:</b> {profile?.city}</Typography>}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        {isEditMode ? <TextField name="state" label="State" value={formData.state || ''} onChange={handleChange} fullWidth /> : <Typography><b>State:</b> {profile?.state}</Typography>}
                    </Grid>

                    {/* --- Consents & Notes --- */}
                    {isEditMode ? (
                        <>
                            <Grid item xs={12}>
                                <TextField name="medicalNotes" label="Medical History / Notes" value={formData.medicalNotes || ''} onChange={handleChange} fullWidth multiline rows={3} />
                            </Grid>
                            <Grid item xs={12}><FormControlLabel control={<Checkbox name="willingPosthumous" checked={formData.willingPosthumous} onChange={handleChange} />} label="Willing to donate organs posthumously" /></Grid>
                            <Grid item xs={12}><FormControlLabel control={<Checkbox name="willingBlood" checked={formData.willingBlood} onChange={handleChange} />} label="Willing to donate blood" /></Grid>
                        </>
                    ) : (
                        <Grid item xs={12} sx={{mt: 2}}>
                             <Typography><b>Willing to donate blood:</b> {profile?.willingBlood ? 'Yes' : 'No'}</Typography>
                            <Typography><b>Willing to donate posthumously:</b> {profile?.willingPosthumous ? 'Yes' : 'No'}</Typography>
                            <Typography sx={{mt: 1}}><b>Medical Notes:</b> {profile?.medicalNotes || 'N/A'}</Typography>
                        </Grid>
                    )}
                </Grid>
                {isEditMode && (
                    <Box sx={{ mt: 3 }}>
                        <Button type="submit" variant="contained" disabled={mutation.isLoading}>
                            {mutation.isLoading ? 'Saving...' : (profile ? 'Save Changes' : 'Create Profile')}
                        </Button>
                        {profile && <Button variant="outlined" sx={{ ml: 2 }} onClick={() => { setIsEditMode(false); setFormData(profile); }}>Cancel</Button>}
                    </Box>
                )}
            </Box>
        </Paper>
    );
};

export default DonorProfilePage;
