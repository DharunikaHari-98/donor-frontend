import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBloodRequestById, findBloodMatches, getBloodRequestCandidates } from '../services/hospitalApi';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Grid, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MatchCandidatesTable from '../components/MatchCandidatesTable';
import InfoIcon from '@mui/icons-material/Info';
import ScienceIcon from '@mui/icons-material/Science';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
const DetailItem = ({ icon, primary, secondary }) => ( <ListItem> <ListItemIcon sx={{minWidth: 40, color: 'primary.main'}}>{icon}</ListItemIcon> <ListItemText primary={primary} secondary={secondary} primaryTypographyProps={{fontWeight: 500}} /> </ListItem> );
const BloodRequestDetailPage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const { data: request, isLoading, isError, error } = useQuery({ queryKey: ['bloodRequest', id], queryFn: () => getBloodRequestById(id) });
    const { data: candidates, isLoading: candidatesLoading } = useQuery({ queryKey: ['bloodRequestCandidates', id], queryFn: () => getBloodRequestCandidates(id), enabled: !!request });
    const findMatchesMutation = useMutation({ mutationFn: () => findBloodMatches(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['bloodRequest', id] }); queryClient.invalidateQueries({ queryKey: ['bloodRequestCandidates', id] }); }, });
    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (isError) return <Typography color="error">Error: {error.message}</Typography>;
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>Request Details</Typography><Divider sx={{ mb: 1 }} /><List dense><DetailItem icon={<InfoIcon />} primary="Status" secondary={request.status} /><DetailItem icon={<ScienceIcon />} primary="Blood Group" secondary={`${request.bloodGroup} (${request.quantityUnits} units)`} /></List>
                    <Box sx={{ mt: 2, p: 2 }}>
                        <Button fullWidth variant="contained" startIcon={findMatchesMutation.isPending ? <CircularProgress size={20} color="inherit"/> : <PersonSearchIcon />} onClick={() => findMatchesMutation.mutate()} disabled={findMatchesMutation.isPending || request.status !== 'OPEN'}>{findMatchesMutation.isPending ? 'Finding Matches...' : 'Find Matches'}</Button>
                        {findMatchesMutation.isError && <Alert severity="error" sx={{mt: 2}}>{(findMatchesMutation.error).message}</Alert>}
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}><Typography variant="h6" fontWeight={600} gutterBottom>Match Candidates</Typography><MatchCandidatesTable candidates={candidates || []} isLoading={candidatesLoading} requestType="BLOOD" requestId={id}/></Paper>
            </Grid>
        </Grid>
    );
};
export default BloodRequestDetailPage;