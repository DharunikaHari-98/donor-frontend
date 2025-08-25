import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createConsent } from '../services/donorApi';
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl, InputLabel, Select, MenuItem, Box, Typography, CircularProgress
} from '@mui/material';
import FactCheckIcon from '@mui/icons-material/FactCheck';

const AddConsentModal = ({ open, onClose, donorProfileId }) => {
    const queryClient = useQueryClient();
    const [consentType, setConsentType] = useState('BLOOD');

    const mutation = useMutation({
        mutationFn: createConsent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myConsents', donorProfileId] });
            onClose();
        },
    });

    const handleSubmit = () => {
        mutation.mutate({
            donorProfileId,
            consentType,
            status: 'ACCEPTED',
        });
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <FactCheckIcon color="primary" />
                    Add New Consent
                </Box>
            </DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Please select the type of donation you wish to consent to. This action will be recorded and can be managed later.
                </Typography>
                <FormControl fullWidth>
                    <InputLabel>Consent Type</InputLabel>
                    <Select value={consentType} label="Consent Type" onChange={(e) => setConsentType(e.target.value)}>
                        <MenuItem value="BLOOD">Blood Donation</MenuItem>
                        <MenuItem value-="POSTHUMOUS">Posthumous Organ Donation</MenuItem>
                        <MenuItem value="LIVING">Living Organ Donation</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: '16px 24px' }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={mutation.isPending}
                    startIcon={mutation.isPending ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {mutation.isPending ? 'Adding...' : 'Add Consent'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
export default AddConsentModal;