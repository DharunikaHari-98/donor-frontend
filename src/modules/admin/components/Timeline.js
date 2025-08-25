import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Typography, Paper, Box, Chip, useTheme, alpha } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

// Stunning animations
const pulse = keyframes`
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
`;

const slideIn = keyframes`
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
`;

const StyledTimeline = styled(Timeline)(({ theme }) => ({
    padding: 0,
    '& .MuiTimelineItem-root': {
        '&::before': {
            display: 'none',
        }
    }
}));

const StyledTimelineContent = styled(TimelineContent)(({ theme }) => ({
    padding: '16px 24px',
    margin: '8px 0',
    background: `linear-gradient(135deg,
        ${alpha(theme.palette.background.paper, 0.9)},
        ${alpha(theme.palette.primary.light, 0.02)})`,
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
    transition: 'all 0.3s ease',
    position: 'relative',

    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.15)}`,
    },

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        borderRadius: '16px 16px 0 0',
    }
}));

const StyledTimelineDot = styled(TimelineDot)(({ theme, eventtype }) => {
    const getEventConfig = () => {
        switch (eventtype) {
            case 'CREATED':
                return {
                    bg: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                    icon: <EventIcon />
                };
            case 'CONFIRMED':
                return {
                    bg: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.light})`,
                    icon: <CheckCircleIcon />
                };
            case 'WARNING':
                return {
                    bg: `linear-gradient(45deg, ${theme.palette.warning.main}, ${theme.palette.warning.light})`,
                    icon: <WarningIcon />
                };
            default:
                return {
                    bg: `linear-gradient(45deg, ${theme.palette.info.main}, ${theme.palette.info.light})`,
                    icon: <InfoIcon />
                };
        }
    };

    const config = getEventConfig();

    return {
        background: config.bg,
        border: `3px solid ${alpha(theme.palette.background.paper, 0.8)}`,
        boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.3)}`,
        width: 50,
        height: 50,
        animation: `${pulse} 2s ease-in-out infinite`,

        '& .MuiSvgIcon-root': {
            color: 'white',
            fontSize: '1.2rem'
        }
    };
});

const StyledTimelineConnector = styled(TimelineConnector)(({ theme }) => ({
    background: `linear-gradient(180deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.3)})`,
    width: 3,
    borderRadius: 2,
}));

const EventTimeline = ({ events }) => {
    const theme = useTheme();

    if (!events || events.length === 0) {
        return (
            <Paper
                sx={{
                    p: 4,
                    textAlign: 'center',
                    borderRadius: '20px',
                    background: `linear-gradient(135deg,
                        ${alpha(theme.palette.background.paper, 0.9)},
                        ${alpha(theme.palette.primary.light, 0.05)})`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                }}
            >
                <EventIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    No events logged for this allocation yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Events will appear here as the allocation progresses
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            sx={{
                borderRadius: '24px',
                background: 'transparent',
                boxShadow: 'none',
                p: 2
            }}
        >
            <StyledTimeline position="alternate">
                {events.map((event, index) => {
                    const isLast = index === events.length - 1;
                    const eventDate = new Date(event.createdAt);

                    return (
                        <TimelineItem key={event.id}>
                            <TimelineOppositeContent
                                sx={{
                                    m: 'auto 0',
                                    flex: 0.3,
                                    px: 2
                                }}
                            >
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        background: `linear-gradient(135deg,
                                            ${alpha(theme.palette.primary.main, 0.08)},
                                            ${alpha(theme.palette.secondary.main, 0.04)})`,
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography variant="caption" color="primary" fontWeight={600}>
                                        {eventDate.toLocaleDateString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                                        {eventDate.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </Typography>
                                </Paper>
                            </TimelineOppositeContent>

                            <TimelineSeparator>
                                <StyledTimelineDot
                                    eventtype={event.eventType}
                                    sx={{
                                        animationDelay: `${index * 0.2}s`
                                    }}
                                >
                                    {event.eventType === 'CREATED' && <EventIcon />}
                                    {event.eventType === 'CONFIRMED' && <CheckCircleIcon />}
                                    {event.eventType === 'WARNING' && <WarningIcon />}
                                    {!['CREATED', 'CONFIRMED', 'WARNING'].includes(event.eventType) && <InfoIcon />}
                                </StyledTimelineDot>
                                {!isLast && <StyledTimelineConnector />}
                            </TimelineSeparator>

                            <StyledTimelineContent
                                sx={{
                                    animationDelay: `${index * 0.15}s`,
                                    animation: `${slideIn} 0.5s ease-out both`
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                    <Typography
                                        variant="h6"
                                        component="span"
                                        sx={{
                                            fontWeight: 700,
                                            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                            backgroundClip: 'text',
                                            WebkitBackgroundClip: 'text',
                                            color: 'transparent',
                                        }}
                                    >
                                        {event.eventType.replace('_', ' ').toLowerCase()
                                            .split(' ')
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(' ')}
                                    </Typography>

                                    <Chip
                                        label={`Step ${index + 1}`}
                                        size="small"
                                        sx={{
                                            background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                            color: theme.palette.primary.main,
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>

                                {event.notes && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{
                                            lineHeight: 1.6,
                                            fontWeight: 500,
                                        }}
                                    >
                                        {event.notes}
                                    </Typography>
                                )}

                                <Box
                                    sx={{
                                        mt: 2,
                                        pt: 2,
                                        borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 8,
                                            height: 8,
                                            borderRadius: '50%',
                                            background: theme.palette.success.main,
                                            animation: `${pulse} 1.5s ease-in-out infinite`,
                                        }}
                                    />
                                    <Typography variant="caption" color="text.secondary">
                                        Event logged automatically
                                    </Typography>
                                </Box>
                            </StyledTimelineContent>
                        </TimelineItem>
                    );
                })}
            </StyledTimeline>

            {/* Summary Stats */}
            <Box
                sx={{
                    mt: 4,
                    p: 3,
                    borderRadius: '20px',
                    background: `linear-gradient(135deg,
                        ${alpha(theme.palette.primary.main, 0.05)},
                        ${alpha(theme.palette.secondary.main, 0.02)})`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    backdropFilter: 'blur(10px)',
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: theme.palette.primary.main,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                    }}
                >
                    <EventIcon />
                    Timeline Summary
                </Typography>

                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary" fontWeight={700}>
                            {events.length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Total Events
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="success.main" fontWeight={700}>
                            {events.filter(e => e.eventType === 'CONFIRMED').length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Confirmed
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="warning.main" fontWeight={700}>
                            {events.filter(e => e.eventType === 'WARNING').length}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Warnings
                        </Typography>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="text.primary" fontWeight={700}>
                            {events.length > 0 ?
                                Math.round((Date.now() - new Date(events[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))
                                : 0}d
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Duration
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

export default EventTimeline;