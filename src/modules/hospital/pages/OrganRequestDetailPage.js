import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganRequestById, findOrganMatches, getOrganRequestCandidates } from '../services/hospitalApi';
import { Box, Typography, Paper, Button, CircularProgress, Alert, Grid, Divider, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MatchCandidatesTable from '../components/MatchCandidatesTable';
import AuditViewerModal from '../components/AuditViewerModal';
import InfoIcon from '@mui/icons-material/Info';
import ScienceIcon from '@mui/icons-material/Science';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import PolicyIcon from '@mui/icons-material/Policy';
const DetailItem = ({ icon, primary, secondary }) => ( <ListItem> <ListItemIcon sx={{minWidth: 40, color: 'primary.main'}}>{icon}</ListItemIcon> <ListItemText primary={primary} secondary={secondary} primaryTypographyProps={{fontWeight: 500}} /> </ListItem> );
const OrganRequestDetailPage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [auditModalOpen, setAuditModalOpen] = useState(false);
    const { data: request, isLoading, isError, error } = useQuery({ queryKey: ['organRequest', id], queryFn: () => getOrganRequestById(id) });
    const { data: candidates, isLoading: candidatesLoading } = useQuery({ queryKey: ['organRequestCandidates', id], queryFn: () => getOrganRequestCandidates(id), enabled: !!request });
    const findMatchesMutation = useMutation({ mutationFn: () => findOrganMatches(id), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['organRequest', id] }); queryClient.invalidateQueries({ queryKey: ['organRequestCandidates', id] }); }, });
    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (isError) return <Typography color="error">Error: {error.message}</Typography>;
    return (
        <>
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: '100%' }}>
                    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}><Typography variant="h6" fontWeight={600} gutterBottom>Request Details</Typography><Button size="small" startIcon={<PolicyIcon />} onClick={() => setAuditModalOpen(true)}>Audit Log</Button></Box><Divider sx={{ mb: 1 }} /><List dense><DetailItem icon={<InfoIcon />} primary="Status" secondary={request.status} /><DetailItem icon={<ScienceIcon />} primary="Organ" secondary={`${request.organType} (${request.bloodGroup})`} /></List>
                    <Box sx={{ mt: 2, p: 2 }}>
                        <Button fullWidth variant="contained" startIcon={findMatchesMutation.isPending ? <CircularProgress size={20} color="inherit"/> : <PersonSearchIcon />} onClick={() => findMatchesMutation.mutate()} disabled={findMatchesMutation.isPending || request.status !== 'OPEN'}>{findMatchesMutation.isPending ? 'Finding Matches...' : 'Find Matches'}</Button>
                        {findMatchesMutation.isError && <Alert severity="error" sx={{mt: 2}}>{(findMatchesMutation.error).message}</Alert>}
                    </Box>
                </Paper>
            </Grid>
            <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}><Typography variant="h6" fontWeight={600} gutterBottom>Match Candidates</Typography><MatchCandidatesTable candidates={candidates || []} isLoading={candidatesLoading} requestType="ORGAN" requestId={id}/></Paper>
            </Grid>
        </Grid>
        <AuditViewerModal open={auditModalOpen} onClose={() => setAuditModalOpen(false)} entityType="ORGAN_REQUEST_V3" entityId={id} />
        </>
    );
};
export default OrganRequestDetailPage;