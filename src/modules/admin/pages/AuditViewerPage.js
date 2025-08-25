import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../services/adminApi';
import {
    Box, Typography, Paper, TextField, Button, Grid,
    List, ListItem, ListItemText, CircularProgress, alpha,
    ListItemIcon, InputAdornment, Fade, Chip, useTheme
} from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PolicyIcon from '@mui/icons-material/Policy';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';

// Animations and Styled Components
const float = keyframes`
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-6px); }
`;

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
}));

const SearchButton = styled(Button)(({ theme }) => ({
    borderRadius: '16px', padding: '12px 32px', fontWeight: 600, textTransform: 'none',
    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
    color: 'white', boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.3)}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': { transform: 'translateY(-2px) scale(1.05)', boxShadow: `0 12px 35px ${alpha(theme.palette.primary.main, 0.4)}` }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    '& .MuiOutlinedInput-root': {
        borderRadius: '16px', background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)}, ${alpha(theme.palette.primary.light, 0.02)})`,
        backdropFilter: 'blur(10px)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}` },
        '&.Mui-focused': { transform: 'translateY(-2px)', boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}` }
    }
}));

const AuditLogItem = styled(ListItem)(({ theme }) => ({
    borderRadius: '16px', marginBottom: '12px', background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)}, ${alpha(theme.palette.primary.light, 0.02)})`,
    backdropFilter: 'blur(10px)', border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`, transition: 'all 0.3s ease',
    '&:hover': { transform: 'translateY(-2px)', boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}` }
}));

const AuditViewerPage = () => {
    const theme = useTheme();
    const [params, setParams] = useState({ entityType: '', entityId: '' });
    const [submittedParams, setSubmittedParams] = useState(null);

    const { data: logs, isLoading, isFetching } = useQuery({
        queryKey: ['auditLogs', submittedParams],
        queryFn: () => getAuditLogs(submittedParams),
        enabled: !!submittedParams,
    });

    const handleSearch = () => setSubmittedParams(params);

    return (
        <GlassPaper sx={{ p: 0 }}>
            <HeaderSection>
                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Box sx={{
                        width: 50, height: 50, borderRadius: '12px',
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: `${float} 2s ease-in-out infinite`,
                    }}>
                        <PolicyIcon sx={{ color: 'white', fontSize: '1.5rem' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`, backgroundClip: 'text', WebkitBackgroundClip: 'text', color: 'transparent', mb: 1 }}>
                            Audit Log Viewer
                        </Typography>
                        <Typography variant="body1" color="text.secondary" fontWeight={500}>
                            Search and analyze system audit trails
                        </Typography>
                    </Box>
                </Box>
            </HeaderSection>

            <Box sx={{ p: 4 }}>
                <Paper sx={{ p: 3, mb: 4, borderRadius: '20px', background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.02)})`, border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}` }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}><StyledTextField label="Entity Type" value={params.entityType} onChange={e => setParams(p => ({ ...p, entityType: e.target.value }))} placeholder="e.g., ALLOCATION_V3" fullWidth InputProps={{ startAdornment: (<InputAdornment position="start"><DescriptionIcon color="primary" /></InputAdornment>), }} /></Grid>
                        <Grid item xs={12} md={4}><StyledTextField label="Entity ID" type="number" value={params.entityId} onChange={e => setParams(p => ({ ...p, entityId: e.target.value }))} fullWidth InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon color="primary" /></InputAdornment>), }} /></Grid>
                        <Grid item xs={12} md={4}><SearchButton variant="contained" onClick={handleSearch} startIcon={<SearchIcon />} fullWidth size="large">Search Logs</SearchButton></Grid>
                    </Grid>
                </Paper>

                {(isLoading || isFetching) && <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>}

                {logs && (
                    <Fade in timeout={600}>
                        <Box>
                            {logs.length === 0 ? (
                                <Typography>No audit logs found.</Typography>
                            ) : (
                                <List sx={{ p: 0 }}>
                                    {logs.map((log) => (
                                        <AuditLogItem key={log.id}>
                                            <ListItemIcon>
                                                <Box sx={{ width: 40, height: 40, borderRadius: '8px', background: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.light})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <EventIcon sx={{ color: 'white', fontSize: '1.2rem' }} />
                                                </Box>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                                        <Typography variant="h6" fontWeight={600} color="primary">{log.action}</Typography>
                                                        <Chip label={log.entityType} size="small" sx={{ background: alpha(theme.palette.secondary.main, 0.1), color: theme.palette.secondary.main, fontWeight: 600 }} />
                                                        <Chip label={`#${log.entityId}`} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{log.details}</Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <EventIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                                                            <Typography variant="caption" color="text.secondary" fontWeight={500}>{new Date(log.createdAt).toLocaleString()}</Typography>
                                                        </Box>
                                                    </Box>
                                                }
                                            />
                                        </AuditLogItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    </Fade>
                )}
            </Box>
        </GlassPaper>
    );
};

export default AuditViewerPage;