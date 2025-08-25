import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDonors } from '../services/donorAdminApi';
import { Box, Typography, Paper, Button, Chip, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    '& .MuiDataGrid-row': {
        '&:hover': {
            backgroundColor: alpha(theme.palette.primary.light, 0.05),
        },
    },
}));

const DonorSearchPage = () => {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['donors', paginationModel],
        queryFn: () => getDonors(paginationModel),
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', flex: 1 },
        {
            field: 'bloodGroup',
            headerName: 'Blood Group',
            width: 150,
            renderCell: (params) => (
                <Chip
                    icon={<BloodtypeIcon />}
                    label={params.value}
                    color="primary"
                    variant="outlined"
                    size="small"
                />
            ),
        },
        { field: 'city', headerName: 'City', width: 180 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/admin/donors/${params.id}`)}
                        sx={{ mr: 1 }}
                    >
                        View
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="secondary"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/admin/donors/${params.id}/edit`)}
                    >
                        Edit
                    </Button>
                </Box>
            ),
        },
    ];

    if (isError) return <Typography color="error">Error: {error.message}</Typography>;

    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1" fontWeight="600">
                    Manage Donors
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/admin/donors/new')}
                >
                    Add Donor
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

export default DonorSearchPage;