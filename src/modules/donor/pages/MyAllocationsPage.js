import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllocations } from '../services/donorApi';
import { Box, Typography, Paper, Button, Chip, alpha, Divider } from '@mui/material'; // Corrected this line
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
    '& .MuiDataGrid-row:hover': {
        backgroundColor: alpha(theme.palette.primary.light, 0.05),
    },
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
    let color = 'default';
    if (status === 'COMPLETED') color = 'success';
    if (status === 'IN_TRANSIT') color = 'info';
    if (status === 'CANCELLED') color = 'error';
    return {
        backgroundColor: alpha(theme.palette[color]?.main || '#757575', 0.1),
        color: theme.palette[color]?.dark || theme.palette.text.primary,
    };
});

const MyAllocationsPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data, isLoading } = useQuery({
        queryKey: ['allAllocationsForDonor', user.id],
        queryFn: () => getAllocations(),
        enabled: !!user?.id,
    });

    const myAllocations = useMemo(() => {
        if (!data?.content || !user?.id) return [];
        return data.content.filter(alloc => alloc.donorProfileId === user.id);
    }, [data, user]);

    const columns = [
        { field: 'id', headerName: 'Allocation ID', width: 120 },
        { field: 'requestType', headerName: 'Type', width: 120 },
        { field: 'requestId', headerName: 'Request ID', width: 120 },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => <StatusChip label={params.value.replace('_', ' ')} status={params.value} />
        },
        {
            field: 'actions', headerName: 'Actions', width: 180, sortable: false,
            renderCell: (params) => (
                <Button variant="outlined" size="small" startIcon={<VisibilityIcon />} onClick={() => navigate(`/donor/allocations/${params.id}`)}>
                    View Timeline
                </Button>
            ),
        },
    ];

    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssignmentTurnedInIcon color="primary" sx={{ fontSize: 32, mr: 1.5 }} />
                <Typography variant="h5" fontWeight="600">My Allocations</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ height: 650, width: '100%' }}>
                <StyledDataGrid
                    rows={myAllocations}
                    columns={columns}
                    loading={isLoading}
                    pageSizeOptions={[10, 25, 50]}
                />
            </Box>
        </Paper>
    );
};
export default MyAllocationsPage;