import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyMatches, acceptMatch, declineMatch } from '../services/donorApi';
import { useAuth } from '../../../context/AuthContext';
import { Box, Typography, Paper, CircularProgress, Button, List, ListItem, ListItemText, Divider, Alert, CircularProgress as ButtonSpinner } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import FavoriteIcon from '@mui/icons-material/Favorite';

const DonorMatchesPage = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: matches, isLoading, isError, error } = useQuery({
        queryKey: ['myMatches', user.id],
        queryFn: () => getMyMatches(user.id),
        enabled: !!user?.id,
    });

    const mutation = useMutation({
        mutationFn: ({ matchId, action }) => action === 'accept' ? acceptMatch(matchId) : declineMatch(matchId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myMatches', user.id] });
        },
    });

    const pendingMatches = matches?.filter(m => m.status === 'PENDING_DONOR_CONFIRM') || [];

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (isError) return <Alert severity="error">Could not load matches: {error.message}.</Alert>;

    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FavoriteIcon color="primary" sx={{ fontSize: 32, mr: 1.5 }}/>
                <Typography variant="h5" fontWeight="600">My Pending Matches</Typography>
            </Box>
            <Divider sx={{mb: 2}}/>
            {mutation.isError && <Alert severity="error" sx={{mb: 2}}>{mutation.error.message}</Alert>}
            {pendingMatches.length > 0 ? (
                <List sx={{p: 0}}>
                    {pendingMatches.map((match) => (
                        <ListItem
                            key={match.id}
                            sx={{ p: 2, mb: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider', flexDirection: {xs: 'column', sm: 'row'} }}
                            secondaryAction={
                                <Box sx={{mt: {xs: 2, sm: 0}}}>
                                    <Button
                                        variant="contained" color="success" sx={{ mr: 1 }}
                                        disabled={mutation.isPending}
                                        startIcon={mutation.isPending && mutation.variables?.matchId === match.id && mutation.variables?.action === 'accept' ? <ButtonSpinner size={20} color="inherit"/> : <CheckCircleIcon/>}
                                        onClick={() => mutation.mutate({ matchId: match.id, action: 'accept' })}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        variant="outlined" color="error"
                                        disabled={mutation.isPending}
                                        startIcon={mutation.isPending && mutation.variables?.matchId === match.id && mutation.variables?.action === 'decline' ? <ButtonSpinner size={20} color="inherit"/> : <CancelIcon/>}
                                        onClick={() => mutation.mutate({ matchId: match.id, action: 'decline' })}
                                    >
                                        Decline
                                    </Button>
                                </Box>
                            }
                        >
                            <ListItemText
                                primary={`Match Request for ${match.requestType.replace('_', ' ')}`}
                                secondary={`Request ID: ${match.requestId}`}
                                primaryTypographyProps={{fontWeight: 500}}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Box textAlign="center" p={5}>
                    <FavoriteIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary" mt={2}>You have no pending matches.</Typography>
                    <Typography color="text.secondary">We'll notify you when a potential match is found.</Typography>
                </Box>
            )}
        </Paper>
    );
};

export default DonorMatchesPage;