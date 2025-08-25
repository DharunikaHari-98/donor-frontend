import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllocations } from '../services/organBankApi';
import { Box, Typography, Paper, Button, Chip, alpha, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({ border: 'none', '& .MuiDataGrid-columnHeaders': { backgroundColor: alpha(theme.palette.primary.light, 0.1) } }));
const StatusChip = styled(Chip)(({ theme, status }) => {
    let color = 'default';
    if (status === 'COMPLETED') color = 'success';
    if (status === 'IN_TRANSIT') color = 'info';
    if (status === 'CANCELLED') color = 'error';
    return { backgroundColor: alpha(theme.palette[color]?.main || '#757575', 0.1), color: theme.palette[color]?.dark || theme.palette.text.primary };
});

const AllocationListPage = () => {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const { data, isLoading } = useQuery({ queryKey: ['organBankAllocations', paginationModel], queryFn: () => getAllocations(paginationModel) });
    const columns = [ { field: 'id', headerName: 'ID', width: 70 }, { field: 'requestType', headerName: 'Type', width: 100 }, { field: 'requestId', headerName: 'Request ID', width: 100 }, { field: 'donorProfileId', headerName: 'Donor ID', width: 100 }, { field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => <StatusChip label={params.value.replace('_', ' ')} status={params.value} /> }, { field: 'transportMode', headerName: 'Transport', width: 130 }, { field: 'actions', headerName: 'Actions', width: 150, sortable: false, renderCell: (params) => ( <Button variant="outlined" size="small" startIcon={<VisibilityIcon/>} onClick={() => navigate(`/organ-bank/allocations/${params.id}`)}> View Details </Button> ), }, ];
    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}><AssignmentTurnedInIcon color="primary" sx={{ fontSize: 32, mr: 1.5 }}/><Typography variant="h5" fontWeight="600">Allocations</Typography></Box>
            <Divider sx={{mb: 3}} />
            <Box sx={{ height: 650, width: '100%' }}><StyledDataGrid rows={data?.content || []} columns={columns} loading={isLoading} rowCount={data?.totalElements || 0} pageSizeOptions={[5, 10, 20]} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} paginationMode="server" /></Box>
        </Paper>
    );
};
export default AllocationListPage;