import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllocationEvents } from '../services/organBankApi';
import { Box, Typography, Paper, CircularProgress, Button, Divider } from '@mui/material';
import EventTimeline from '../components/Timeline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const AllocationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: events, isLoading, isError, error } = useQuery({ queryKey: ['organBankAllocationEvents', id], queryFn: () => getAllocationEvents(id) });
    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" fontWeight="600">Allocation Timeline</Typography>
                <Button variant="outlined" startIcon={<ArrowBackIcon/>} onClick={() => navigate('/organ-bank/allocations')}>Back to List</Button>
            </Box>
            <Typography variant="subtitle1" color="text.secondary">Tracking history for Allocation ID: #{id}</Typography>
            <Divider sx={{ my: 3 }} />
            {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> : isError ? <Typography color="error">Error: {error.message}</Typography> : <EventTimeline events={events} />}
        </Paper>
    );
};
export default AllocationDetailPage;