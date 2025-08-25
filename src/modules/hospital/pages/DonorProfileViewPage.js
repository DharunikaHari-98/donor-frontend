import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDonorById } from '../services/hospitalApi';
import { Box, Typography, Paper, CircularProgress, Button, Grid, List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const DetailItem = ({ icon, primary, secondary }) => ( <ListItem> <ListItemIcon sx={{ color: 'primary.main' }}>{icon}</ListItemIcon> <ListItemText primary={primary} secondary={secondary || 'Not provided'} /> </ListItem> );

const DonorProfileViewPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: donor, isLoading, isError, error } = useQuery({ queryKey: ['hospitalDonor', id], queryFn: () => getDonorById(id) });
    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (isError) return <Typography color="error">Error: {error.message}</Typography>;
    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5}}><PersonIcon color="primary" sx={{ fontSize: 32 }} /><Typography variant="h5" fontWeight="600">Donor Profile: {donor.name}</Typography></Box>
                <Button variant="outlined" startIcon={<ArrowBackIcon/>} onClick={() => navigate('/hospital/donors')}>Back to List</Button>
            </Box>
            <Divider sx={{mb: 3}} />
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Personal Details</Typography>
                    <List><DetailItem icon={<PersonIcon />} primary="Name" secondary={donor.name} /><DetailItem icon={<EmailIcon />} primary="Email" secondary={donor.email} /><DetailItem icon={<PhoneIcon />} primary="Phone" secondary={donor.phone} /></List>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6">Address</Typography>
                    <List><DetailItem icon={<HomeIcon />} primary="Address" secondary={`${donor.address}, ${donor.city}, ${donor.state}`} /></List>
                </Grid>
                <Grid item xs={12}><Divider sx={{my: 2}} /></Grid>
                <Grid item xs={12}>
                    <Typography variant="h6">Consents</Typography>
                    <List dense>
                        <ListItem><ListItemIcon sx={{ color: donor.willingBlood ? 'success.main' : 'error.main' }}>{donor.willingBlood ? <CheckCircleIcon /> : <CancelIcon />}</ListItemIcon><ListItemText primary="Willing to donate blood" /></ListItem>
                        <ListItem><ListItemIcon sx={{ color: donor.willingPosthumous ? 'success.main' : 'error.main' }}>{donor.willingPosthumous ? <CheckCircleIcon /> : <CancelIcon />}</ListItemIcon><ListItemText primary="Willing to donate organs (Posthumous)" /></ListItem>
                    </List>
                </Grid>
            </Grid>
        </Paper>
    );
};
export default DonorProfileViewPage;