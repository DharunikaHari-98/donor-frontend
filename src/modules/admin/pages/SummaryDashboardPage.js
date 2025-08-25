import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getSummaryReport } from '../services/adminApi';
import { Box, Typography, Paper, Grid, CircularProgress, useTheme, alpha } from '@mui/material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import OpacityIcon from '@mui/icons-material/Opacity';

ChartJS.register(ArcElement, Tooltip, Legend);

const StatCard = ({ title, value, icon, color }) => (
  <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', borderRadius: 2, boxShadow: 3, height: '100%' }}>
    <Box
      sx={{
        bgcolor: alpha(color, 0.1),
        color: color,
        p: 2,
        borderRadius: '50%',
        mr: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h5" fontWeight="700">{value}</Typography>
      <Typography variant="subtitle1" color="text.secondary">{title}</Typography>
    </Box>
  </Paper>
);

const SummaryDashboardPage = () => {
  const theme = useTheme();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['summaryReport'],
    queryFn: getSummaryReport,
    refetchInterval: 10000,              // refresh every 10s
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isError) return <Typography color="error">Error: {error.message}</Typography>;

  // Lock the order so colors & legends stay consistent
  const STATUS_ORDER = ['OPEN', 'MATCHED', 'ALLOCATED', 'CLOSED', 'CANCELLED'];

  const chartOptions = { responsive: true, plugins: { legend: { position: 'right' } } };
  const chartColors = [
    theme.palette.success.main,    // OPEN
    theme.palette.warning.main,    // MATCHED
    theme.palette.info.main,       // ALLOCATED
    theme.palette.grey[500],       // CLOSED
    theme.palette.error.main,      // CANCELLED
  ];

  const organRequestData = {
    labels: STATUS_ORDER,
    datasets: [
      {
        data: STATUS_ORDER.map((k) => data.organRequests?.[k] ?? 0),
        backgroundColor: chartColors,
        borderColor: theme.palette.background.paper,
        borderWidth: 4,
      },
    ],
  };

  const bloodRequestData = {
    labels: STATUS_ORDER,
    datasets: [
      {
        data: STATUS_ORDER.map((k) => data.bloodRequests?.[k] ?? 0),
        backgroundColor: chartColors,
        borderColor: theme.palette.background.paper,
        borderWidth: 4,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="700" gutterBottom>
        System Summary
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Total Donors"
            value={data?.donors?.total ?? 0}
            icon={<PeopleIcon />}
            color={theme.palette.primary.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Open Organ Requests"
            value={data?.organRequests?.OPEN ?? 0}
            icon={<FavoriteIcon />}
            color={theme.palette.warning.main}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            title="Open Blood Requests"
            value={data?.bloodRequests?.OPEN ?? 0}
            icon={<OpacityIcon />}
            color={theme.palette.error.main}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" align="center" fontWeight={600} gutterBottom>
              Organ Requests by Status
            </Typography>
            <Doughnut options={chartOptions} data={organRequestData} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" align="center" fontWeight={600} gutterBottom>
              Blood Requests by Status
            </Typography>
            <Doughnut options={chartOptions} data={bloodRequestData} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryDashboardPage;
