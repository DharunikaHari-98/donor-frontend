import React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import { Typography, Paper } from '@mui/material';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EventIcon from '@mui/icons-material/Event';

const getEventVisuals = (eventType) => {
    switch (eventType) {
        case 'ALLOCATION_CREATED': return { icon: <PlaylistAddCheckIcon />, color: 'primary' };
        case 'IN_TRANSIT': return { icon: <LocalShippingIcon />, color: 'info' };
        case 'COMPLETED': return { icon: <CheckCircleIcon />, color: 'success' };
        case 'CANCELLED': return { icon: <HighlightOffIcon />, color: 'error' };
        default: return { icon: <EventIcon />, color: 'grey' };
    }
};

const EventTimeline = ({ events }) => {
    if (!events || events.length === 0) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
                <EventIcon sx={{ fontSize: 50, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">No events logged for this allocation.</Typography>
            </Paper>
        );
    }
    return (
        <Timeline position="alternate">
            {events.map((event, index) => {
                const { icon, color } = getEventVisuals(event.eventType);
                return (
                    <TimelineItem key={event.id}>
                        <TimelineOppositeContent color="text.secondary" sx={{ m: 'auto 0' }}>{new Date(event.createdAt).toLocaleString()}</TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineConnector />
                            <TimelineDot color={color} variant="outlined">{icon}</TimelineDot>
                            {index < events.length - 1 && <TimelineConnector />}
                        </TimelineSeparator>
                        <TimelineContent sx={{ py: '12px', px: 2 }}>
                            <Paper elevation={3} sx={{ p: 2 }}>
                                <Typography variant="h6" component="span">{event.eventType.replace('_', ' ')}</Typography>
                                <Typography color="text.secondary">{event.notes}</Typography>
                            </Paper>
                        </TimelineContent>
                    </TimelineItem>
                )
            })}
        </Timeline>
    );
};
export default EventTimeline;