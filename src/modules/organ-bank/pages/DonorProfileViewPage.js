import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDonorById } from '../services/organBankApi';
import { Box, Typography, Paper, CircularProgress, Button, Grid, List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

const DetailItem = ({ icon, primary, secondary }) => ( <ListItem> <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon> <ListItemText primary={primary} secondary={secondary || 'Not provided'} /> </ListItem> );

const DonorProfileViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: donor, isLoading, isError, error } = useQuery({ queryKey: ['organBankDonor', id], queryFn: () => getDonorById(id) });
    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (isError) return <Typography color="error">Error: {error.message}</Typography>;
    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5}}><PersonIcon color="primary" sx={{ fontSize: 32 }} /><Typography variant="h5" fontWeight="600">Donor Profile: {donor.name}</Typography></Box>
                <Button variant="outlined" startIcon={<ArrowBackIcon/>} onClick={() => navigate('/organ-bank/donors')}>Back to List</Button>
            </Box>
            <Divider sx={{mb: 3}} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}><List><DetailItem icon={<PersonIcon />} primary="Name" secondary={donor.name} /><DetailItem icon={<BloodtypeIcon />} primary="Blood Group" secondary={donor.bloodGroup} /></List></Grid>
                <Grid item xs={12} md={6}><List><DetailItem icon={<PhoneIcon />} primary="Phone" secondary={donor.phone} /><DetailItem icon={<EmailIcon />} primary="Email" secondary={donor.email} /></List></Grid>
            </Grid>
        </Paper>
    );
};
export default DonorProfileViewPage;