import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllocationEvents } from '../services/adminApi';
import {
    Box, Typography, Paper, CircularProgress, IconButton,
    Breadcrumbs, Link, Chip, useTheme, alpha, Fade
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import EventTimeline from '../components/Timeline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TimelineIcon from '@mui/icons-material/Timeline';
import AssignmentIcon from '@mui/icons-material/Assignment';


const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
`;

const shimmer = keyframes`
    0% { background-position: -200px 0; }
    100% { background-position: calc(200px + 100%) 0; }
`;

// Styled Components
const GlassPaper = styled(Paper)(({ theme }) => ({
    background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)}, ${alpha(theme.palette.primary.light, 0.02)})`,
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.1)}`,
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
        content: '""', position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    }
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.04)})`,
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    padding: '32px',
    position: 'relative',
    '&::after': {
        content: '""', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.common.white, 0.05)}, transparent)`,
        animation: `${shimmer} 3s infinite linear`,
        pointerEvents: 'none',
    }
}));

// Main Component
const AllocationDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const { data: events, isLoading, isError, error } = useQuery({
        queryKey: ['allocationEvents', id],
        queryFn: () => getAllocationEvents(id),
    });

    if (isLoading) return <CircularProgress />;
    if (isError) return <Typography color="error">Error: {error.message}</Typography>;

    return (
        <Fade in timeout={600}>
            <GlassPaper sx={{ p: 0 }}>
                <HeaderSection>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                        <IconButton onClick={() => navigate('/admin/allocations')}
                            sx={{
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                color: 'white', boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
                                '&:hover': { transform: 'translateY(-2px) scale(1.05)', boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}` }
                            }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Box sx={{ flexGrow: 1 }}>
                            <Breadcrumbs sx={{ mb: 1 }}>
                                <Link component="button" onClick={() => navigate('/admin')} color="inherit" sx={{ textDecoration: 'none' }}>Dashboard</Link>
                                <Link component="button" onClick={() => navigate('/admin/allocations')} color="inherit" sx={{ textDecoration: 'none' }}>Allocations</Link>
                                <Typography color="text.primary">Timeline</Typography>
                            </Breadcrumbs>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Box sx={{
                                    width: 50, height: 50, borderRadius: '12px',
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    animation: `${float} 2s ease-in-out infinite`,
                                }}>
                                    <TimelineIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{
                                        fontWeight: 800, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', mb: 1,
                                    }}>
                                        Allocation Timeline
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Chip icon={<AssignmentIcon />} label={`ID: ${id}`}
                                            sx={{
                                                background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, color: theme.palette.primary.main, fontWeight: 600,
                                            }}
                                        />
                                        <Chip label={`${events?.length || 0} Events`} size="medium"
                                            sx={{
                                                background: alpha(theme.palette.success.main, 0.1), color: theme.palette.success.main,
                                                border: `1px solid ${theme.palette.success.main}`, fontWeight: 600,
                                            }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </HeaderSection>

                <Box sx={{ p: 4 }}>
                    <EventTimeline events={events} />
                </Box>
            </GlassPaper>
        </Fade>
    );
};

export default AllocationDetailPage;