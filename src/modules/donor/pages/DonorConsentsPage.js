import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyConsents } from '../services/donorApi';
import { useAuth } from '../../../context/AuthContext';
import { Box, Typography, Paper, CircularProgress, Button, List, ListItem, ListItemText, Divider, Chip, ListItemIcon, alpha } from '@mui/material';
import AddConsentModal from '../components/AddConsentModal';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import AddIcon from '@mui/icons-material/Add';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FavoriteIcon from '@mui/icons-material/Favorite';

const getConsentIcon = (type) => {
    if (type === 'BLOOD') return <BloodtypeIcon />;
    if (type === 'POSTHUMOUS' || type === 'LIVING') return <FavoriteIcon />;
    return <FactCheckIcon />;
};

const DonorConsentsPage = () => {
    const { user } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);

    const { data: consents, isLoading } = useQuery({
        queryKey: ['myConsents', user.id],
        queryFn: () => getMyConsents(user.id),
    });

    return (
        <>
            <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h5" fontWeight="600">My Consents</Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setModalOpen(true)}>Add New Consent</Button>
                </Box>
                <Divider sx={{ mb: 2 }}/>
                {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> :
                    consents?.length > 0 ? (
                        <List sx={{p: 0}}>
                            {consents.map((consent) => (
                                <ListItem key={consent.id} sx={{ p: 2, mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                                    <ListItemIcon sx={{color: 'primary.main', mr: 1}}>{getConsentIcon(consent.consentType)}</ListItemIcon>
                                    <ListItemText
                                        primary={consent.consentType.replace('_', ' ')}
                                        secondary={`Added on: ${new Date(consent.createdAt).toLocaleDateString()}`}
                                        primaryTypographyProps={{fontWeight: 500}}
                                    />
                                    <Chip
                                        label={consent.status}
                                        color={consent.status === 'ACCEPTED' ? 'success' : 'warning'}
                                        sx={{backgroundColor: alpha(consent.status === 'ACCEPTED' ? '#2e7d32' : '#ed6c02', 0.1), color: consent.status === 'ACCEPTED' ? 'success.dark' : 'warning.dark'}}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Box textAlign="center" p={5}>
                            <FactCheckIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                            <Typography variant="h6" color="text.secondary" mt={2}>You haven't added any consents yet.</Typography>
                            <Typography color="text.secondary">Click "Add New Consent" to get started.</Typography>
                        </Box>
                    )
                }
            </Paper>
            <AddConsentModal open={modalOpen} onClose={() => setModalOpen(false)} donorProfileId={user.id} />
        </>
    );
};
export default DonorConsentsPage;