import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAuditLogs } from '../services/organBankApi';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, CircularProgress, Typography, Box, Divider, ListItemIcon } from '@mui/material';
import PolicyIcon from '@mui/icons-material/Policy';
import EventNoteIcon from '@mui/icons-material/EventNote';

const AuditViewerModal = ({ open, onClose, entityType, entityId }) => {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['auditLogs', entityType, entityId],
        queryFn: () => getAuditLogs({ entityType, entityId }),
        enabled: open,
    });

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <PolicyIcon color="primary" />
                    Audit Log: {entityType} #{entityId}
                </Box>
            </DialogTitle>
            <DialogContent>
                {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5}}><CircularProgress /></Box> :
                    logs?.length > 0 ? (
                        <List>
                            {logs.map(log => (
                                <React.Fragment key={log.id}>
                                    <ListItem>
                                        <ListItemIcon sx={{mr: 1}}><EventNoteIcon /></ListItemIcon>
                                        <ListItemText
                                            primary={log.action}
                                            secondary={<>{new Date(log.createdAt).toLocaleString()}<br/>{log.details}</>}
                                        />
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Box textAlign="center" p={5}>
                            <PolicyIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
                            <Typography variant="h6" color="text.secondary" mt={2}>No audit history found.</Typography>
                        </Box>
                    )
                }
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose} variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    );
};
export default AuditViewerModal;