import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getOrganRequests } from '../services/adminApi';
import { Box, Typography, Paper, Button, Chip, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
    '& .MuiDataGrid-cell': {
        borderBottom: `1px solid ${theme.palette.divider}`
    }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
    const color = status === 'OPEN' ? theme.palette.success : theme.palette.error;
    return {
        backgroundColor: alpha(color.main, 0.1),
        color: color.dark,
        fontWeight: 600,
    };
});

const OrganRequestListPage = () => {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['organRequests', paginationModel],
        queryFn: () => getOrganRequests(paginationModel),
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'hospitalName', headerName: 'Hospital', flex: 1 },
        { field: 'organType', headerName: 'Organ', width: 120 },
        { field: 'bloodGroup', headerName: 'Blood Group', width: 120 },
        { field: 'urgency', headerName: 'Urgency', width: 120 },
        {
            field: 'status',
            headerName: 'Status',
            width: 120,
            renderCell: (params) => <StatusChip label={params.value} status={params.value} />,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<VisibilityIcon/>}
                  onClick={() => navigate(`/admin/organ-requests/${params.id}`)}
                >
                    View
                </Button>
            ),
        },
    ];

    if (isError) return <Typography color="error">Error: {error.message}</Typography>;

    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="600">
                    Organ Requests
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon/>}
                  onClick={() => navigate('/admin/organ-requests/new')}
                >
                    New Request
                </Button>
            </Box>
            <Box sx={{ height: 650, width: '100%' }}>
                <StyledDataGrid
                    rows={data?.content || []}
                    columns={columns}
                    loading={isLoading}
                    rowCount={data?.totalElements || 0}
                    pageSizeOptions={[5, 10, 20]}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    paginationMode="server"
                />
            </Box>
        </Paper>
    );
};

export default OrganRequestListPage;