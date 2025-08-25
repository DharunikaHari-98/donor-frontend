import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getBloodRequests } from '../services/hospitalApi';
import { Box, Typography, Paper, Button, Chip, alpha, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({ border: 'none', '& .MuiDataGrid-columnHeaders': { backgroundColor: alpha(theme.palette.primary.light, 0.1) } }));
const StatusChip = styled(Chip)(({ theme, status }) => { const color = status === 'OPEN' ? theme.palette.success : theme.palette.error; return { backgroundColor: alpha(color.main, 0.1), color: color.dark }; });

const BloodRequestListPage = () => {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const { data, isLoading, isError, error } = useQuery({ queryKey: ['bloodRequests', paginationModel], queryFn: () => getBloodRequests(paginationModel) });
    const columns = [ { field: 'id', headerName: 'ID', width: 70 }, { field: 'hospitalName', headerName: 'Hospital', flex: 1 }, { field: 'bloodGroup', headerName: 'Blood Group', width: 120 }, { field: 'quantityUnits', headerName: 'Units', width: 100 }, { field: 'urgency', headerName: 'Urgency', width: 120 }, { field: 'status', headerName: 'Status', width: 120, renderCell: (params) => <StatusChip label={params.value} status={params.value} /> }, { field: 'actions', headerName: 'Actions', width: 120, sortable: false, renderCell: (params) => ( <Button variant="outlined" size="small" startIcon={<VisibilityIcon/>} onClick={() => navigate(`/hospital/blood-requests/${params.id}`)}> View </Button> ), }, ];
    if (isError) return <Typography color="error">Error: {error.message}</Typography>;
    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5}}><BloodtypeIcon color="primary" sx={{ fontSize: 32 }} /><Typography variant="h5" fontWeight="600">Blood Requests</Typography></Box>
                <Button variant="contained" startIcon={<AddIcon/>} onClick={() => navigate('/hospital/blood-requests/new')}>New Request</Button>
            </Box>
            <Divider sx={{mb: 3}} />
            <Box sx={{ height: 650, width: '100%' }}>
                <StyledDataGrid rows={data?.content || []} columns={columns} loading={isLoading} rowCount={data?.totalElements || 0} pageSizeOptions={[5, 10, 20]} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} paginationMode="server" />
            </Box>
        </Paper>
    );
};
export default BloodRequestListPage;