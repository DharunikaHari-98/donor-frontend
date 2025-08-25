import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDonors } from '../services/organBankApi';
import { Box, Typography, Paper, Button, Chip, alpha, Divider } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SearchIcon from '@mui/icons-material/Search';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({ border: 'none', '& .MuiDataGrid-columnHeaders': { backgroundColor: alpha(theme.palette.primary.light, 0.1) } }));

const DonorSearchPage = () => {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const { data, isLoading, isError, error } = useQuery({ queryKey: ['organBankDonors', paginationModel], queryFn: () => getDonors(paginationModel) });
    const columns = [ { field: 'id', headerName: 'ID', width: 70 }, { field: 'name', headerName: 'Name', flex: 1 }, { field: 'bloodGroup', headerName: 'Blood Group', width: 130, renderCell: (params) => ( <Chip label={params.value} color="primary" variant="outlined" size="small" /> ) }, { field: 'city', headerName: 'City', width: 150 }, { field: 'state', headerName: 'State', width: 150 }, { field: 'actions', headerName: 'Actions', width: 120, sortable: false, renderCell: (params) => ( <Button variant="outlined" size="small" startIcon={<VisibilityIcon/>} onClick={() => navigate(`/organ-bank/donors/${params.id}`)}> View </Button> ), }, ];
    if (isError) return <Typography color="error">Error: {error.message}</Typography>;
    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}><SearchIcon color="primary" sx={{ fontSize: 32 }} /><Typography variant="h5" fontWeight="600">Donor Lookup</Typography></Box>
            <Divider sx={{mb: 3}} />
            <Box sx={{ height: 650, width: '100%' }}><StyledDataGrid rows={data?.content || []} columns={columns} loading={isLoading} rowCount={data?.totalElements || 0} pageSizeOptions={[5, 10, 20]} paginationModel={paginationModel} onPaginationModelChange={setPaginationModel} paginationMode="server" /></Box>
        </Paper>
    );
};
export default DonorSearchPage;