import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllocations } from '../services/adminApi';
import { Box, Typography, Paper, Button, Chip, alpha, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled, keyframes } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListIcon from '@mui/icons-material/List';

const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
`;

const GlassPaper = styled(Paper)(({ theme }) => ({
    background: `linear-gradient(135deg,
        ${alpha(theme.palette.background.paper, 0.95)},
        ${alpha(theme.palette.primary.light, 0.02)})`,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.1)}`,
    overflow: 'hidden',
    position: 'relative',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg,
        ${alpha(theme.palette.primary.main, 0.08)},
        ${alpha(theme.palette.secondary.main, 0.04)})`,
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    padding: '32px',
    position: 'relative',
}));

// Premium DataGrid
const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none',
    borderRadius: '16px',
    background: `linear-gradient(135deg,
        ${alpha(theme.palette.background.paper, 0.95)},
        ${alpha(theme.palette.primary.light, 0.02)})`,
    backdropFilter: 'blur(10px)',
    boxShadow: `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,

    '& .MuiDataGrid-columnHeaders': {
        background: `linear-gradient(135deg,
            ${alpha(theme.palette.primary.main, 0.1)},
            ${alpha(theme.palette.secondary.main, 0.05)})`,
        borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: '16px 16px 0 0',

        '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 700,
            color: theme.palette.primary.main,
        }
    },

    '& .MuiDataGrid-row': {
        borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
        transition: 'all 0.2s ease',

        '&:hover': {
            background: `linear-gradient(135deg,
                ${alpha(theme.palette.primary.main, 0.05)},
                ${alpha(theme.palette.secondary.main, 0.02)})`,
            transform: 'translateY(-1px)',
        }
    },

    '& .MuiDataGrid-cell': {
        borderBottom: 'none',
        padding: '16px',
    }
}));

const ActionButton = styled(Button)(({ theme }) => ({
    borderRadius: '12px',
    padding: '8px 20px',
    fontWeight: 600,
    textTransform: 'none',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: 'white',
    boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

    '&:hover': {
        transform: 'translateY(-2px) scale(1.05)',
        boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
    }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
    const getStatusColor = () => {
        switch (status?.toLowerCase()) {
            case 'completed': return theme.palette.success.main;
            case 'in_transit': return theme.palette.info.main; // Changed from in_progress
            case 'scheduled': return theme.palette.warning.main; // Changed from pending
            case 'cancelled': return theme.palette.error.main;
            default: return theme.palette.grey[500];
        }
    };

    const color = getStatusColor();

    return {
        background: alpha(color, 0.1),
        color: color,
        border: `1px solid ${color}`,
        fontWeight: 600,
    };
});

const AllocationListPage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

    const { data, isLoading } = useQuery({
        queryKey: ['allocations', paginationModel],
        queryFn: () => getAllocations(paginationModel),
    });

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight="600" color="primary">
                    #{params.value}
                </Typography>
            )
        },
        {
            field: 'requestType',
            headerName: 'Type',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.value}
                    size="small"
                    sx={{
                        background: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        fontWeight: 600,
                    }}
                />
            )
        },
        {
            field: 'requestId',
            headerName: 'Request ID',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight="500">
                    REQ-{params.value}
                </Typography>
            )
        },
        {
            field: 'donorProfileId',
            headerName: 'Donor ID',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" fontWeight="500">
                    D-{params.value}
                </Typography>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            renderCell: (params) => (
                <StatusChip
                    label={params.value?.replace('_', ' ').toUpperCase()}
                    status={params.value}
                />
            )
        },
        {
            field: 'transportMode',
            headerName: 'Transport',
            width: 130,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {params.value === 'AMBULANCE' ? '🚑' : '🚗'}
                    <Typography variant="body2" fontWeight="500">
                        {params.value}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 140,
            sortable: false,
            renderCell: (params) => (
                <ActionButton
                    size="small"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/admin/allocations/${params.id}`)}
                >
                    View
                </ActionButton>
            ),
        },
    ];

    return (
        <GlassPaper sx={{ p: 0 }}>
            <HeaderSection>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box
                        sx={{
                            width: 50,
                            height: 50,
                            borderRadius: '12px',
                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: `${float} 2s ease-in-out infinite`,
                        }}
                    >
                        <ListIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                    </Box>

                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 800,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                                mb: 1,
                            }}
                        >
                            All Allocations
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            Manage and track all allocation records
                        </Typography>
                    </Box>
                </Box>
            </HeaderSection>

            <Box sx={{ p: 3 }}>
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
                        getRowHeight={() => 70}
                        disableSelectionOnClick
                    />
                </Box>
            </Box>
        </GlassPaper>
    );
};

export default AllocationListPage;