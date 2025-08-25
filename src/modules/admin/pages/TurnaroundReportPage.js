import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTurnaroundReport } from '../services/adminApi';
import { Box, Typography, Paper, TextField, Button, Grid, CircularProgress, Divider, alpha } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import TimerIcon from '@mui/icons-material/Timer';
import NumbersIcon from '@mui/icons-material/Numbers';
import FunctionsIcon from '@mui/icons-material/Functions';

const StatCard = ({ title, value, icon, color }) => (
    <Paper
        variant="outlined"
        sx={{
            p: 3,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 2,
            borderColor: alpha(color, 0.3),
            background: `linear-gradient(135deg, ${alpha(color, 0.05)}, transparent)`
        }}
    >
        <Box sx={{
            color: color,
            p: 1.5,
            mr: 2,
            display: 'flex',
        }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="h5" fontWeight="700">{value}</Typography>
            <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
        </Box>
    </Paper>
);


const TurnaroundReportPage = () => {
    const [dateRange, setDateRange] = useState({ from: '', to: '' });
    const [submittedRange, setSubmittedRange] = useState(null);

    const { data, isLoading, isFetching, isError, error } = useQuery({
        queryKey: ['turnaroundReport', submittedRange],
        queryFn: () => getTurnaroundReport(submittedRange),
        enabled: !!submittedRange,
    });

    const handleSearch = () => {
        if (dateRange.from && dateRange.to) {
            setSubmittedRange(dateRange);
        }
    };

    const renderResults = () => {
        if (isLoading || isFetching) {
            return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
        }
        if (isError) {
             return <Typography color="error">Error: {error.message}</Typography>;
        }
        if (!data) {
             return (
                <Box textAlign="center" p={5}>
                    <QueryStatsIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                    <Typography variant="h6" color="text.secondary">Please select a date range and click Search</Typography>
                </Box>
            );
        }
        if (data.count === 0) {
            return (
                 <Box textAlign="center" p={5}>
                    <Typography variant="h6">No allocations found in this date range.</Typography>
                </Box>
            )
        }
        return (
            <Box>
                <Typography variant="h6" gutterBottom>
                    Report for {new Date(submittedRange.from).toLocaleDateString()} to {new Date(submittedRange.to).toLocaleDateString()}
                </Typography>
                <Grid container spacing={3} mt={1}>
                    <Grid item xs={12} md={4}>
                        <StatCard title="Allocations Found" value={data.count} icon={<NumbersIcon sx={{fontSize: 40}}/>} color="#1976d2" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <StatCard title="Average Turnaround" value={`${data.avgMinutes} min`} icon={<TimerIcon sx={{fontSize: 40}}/>} color="#388e3c" />
                    </Grid>
                     <Grid item xs={12} md={4}>
                        <StatCard title="Median Turnaround" value={`${data.medianMinutes} min`} icon={<FunctionsIcon sx={{fontSize: 40}}/>} color="#f57c00" />
                    </Grid>
                </Grid>
            </Box>
        );
    };

    return (
        <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <QueryStatsIcon color="primary" sx={{ fontSize: 40, mr: 2 }}/>
                <Typography variant="h5" component="h1" fontWeight="600">
                    Turnaround Time Report
                </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Grid item><TextField label="From Date" type="date" value={dateRange.from} onChange={e => setDateRange(p => ({ ...p, from: e.target.value }))} InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item><TextField label="To Date" type="date" value={dateRange.to} onChange={e => setDateRange(p => ({ ...p, to: e.target.value }))} InputLabelProps={{ shrink: true }} /></Grid>
                <Grid item><Button variant="contained" size="large" startIcon={<SearchIcon />} onClick={handleSearch}>Search</Button></Grid>
            </Grid>

            {renderResults()}
        </Paper>
    );
};

export default TurnaroundReportPage;