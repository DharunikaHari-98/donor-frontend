// src/modules/hospital/pages/SummaryDashboardPage.js
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSummaryReport } from '../services/hospitalApi';
import { Box, Typography, Paper, Grid, CircularProgress, useTheme, alpha, Divider } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpacityIcon from '@mui/icons-material/Opacity';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';

ChartJS.register(ArcElement, Tooltip, Legend);
const StatCard = ({ title, value, icon, color }) => ( <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 2, boxShadow: 3, height: '100%' }}> <Box sx={{ bgcolor: alpha(color, 0.1), color: color, p: 2, borderRadius: '50%', mr: 2, display: 'flex' }}>{icon}</Box> <Box><Typography variant="h5" fontWeight="700">{value}</Typography><Typography variant="subtitle1" color="text.secondary">{title}</Typography></Box> </Paper> );
const SummaryDashboardPage = () => {
    const theme = useTheme();
    const { data, isLoading, isError, error } = useQuery({ queryKey: ['summaryReport'], queryFn: getSummaryReport });
    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (isError) return <Typography color="error">Error: {error.message}</Typography>;
    const chartOptions = { responsive: true, plugins: { legend: { position: 'right' } } };
    const chartColors = [theme.palette.success.main, theme.palette.info.main, theme.palette.warning.main, theme.palette.error.main];
    const totalOrgan = Object.values(data.organRequests).reduce((a, b) => a + b, 0);
    const totalBlood = Object.values(data.bloodRequests).reduce((a, b) => a + b, 0);
    const allocationData = { labels: Object.keys(data.allocations), datasets: [{ data: Object.values(data.allocations), backgroundColor: chartColors, borderColor: theme.palette.background.paper, borderWidth: 4 }] };
    return (
        <Box>
            <Typography variant="h4" fontWeight="700" gutterBottom>Hospital Reports</Typography>
            <Divider sx={{mb: 3}} />
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}><StatCard title="Total Organ Requests" value={totalOrgan} icon={<FavoriteIcon/>} color={theme.palette.warning.main} /></Grid>
                <Grid item xs={12} md={4}><StatCard title="Total Blood Requests" value={totalBlood} icon={<OpacityIcon/>} color={theme.palette.error.main} /></Grid>
                <Grid item xs={12} md={4}><StatCard title="Completed Allocations" value={data.allocations.COMPLETED || 0} icon={<AssignmentTurnedInIcon/>} color={theme.palette.success.main} /></Grid>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                        <Typography variant="h6" align="center" fontWeight={600} gutterBottom>Allocations by Status</Typography>
                        <Doughnut options={chartOptions} data={allocationData} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};
export default SummaryDashboardPage;