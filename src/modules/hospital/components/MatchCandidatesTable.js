import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptMatch, declineMatch } from '../services/hospitalApi';
import { Box, Button, CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled, alpha } from '@mui/material/styles';
import AllocationCreateModal from './AllocationCreateModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    border: 'none',
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: alpha(theme.palette.primary.light, 0.1),
    },
}));

const MatchCandidatesTable = ({ candidates, requestType, requestId }) => {
    const queryClient = useQueryClient();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMatchId, setSelectedMatchId] = useState(null);

    const updateMatchStatus = useMutation({
        mutationFn: ({ matchId, action }) => action === 'accept' ? acceptMatch(matchId) : declineMatch(matchId),
        onSuccess: (data, vars) => {
            const queryKey = requestType === 'ORGAN' ? 'organRequestCandidates' : 'bloodRequestCandidates';
            queryClient.invalidateQueries({ queryKey: [queryKey, requestId] });
            if (vars.action === 'accept') {
                const id = data?.id ?? vars.matchId;
                setSelectedMatchId(id);
                setModalOpen(true);
            }
        },
    });

    const columns = [
        { field: 'donorProfileId', headerName: 'Donor ID', width: 120 },
        { field: 'matchScore', headerName: 'Score', width: 100 },
        { field: 'status', headerName: 'Status', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 240,
            sortable: false,
            renderCell: (params) => {
                const isActionable = params.row.status === 'PENDING_HOSPITAL_CONFIRM';
                const isLoading = updateMatchStatus.isPending && updateMatchStatus.variables?.matchId === params.id;

                return (
                    <Box>
                        <Button
                            variant="contained" color="success" size="small" sx={{ mr: 1 }}
                            disabled={!isActionable || isLoading}
                            startIcon={isLoading && updateMatchStatus.variables?.action === 'accept' ? <CircularProgress size={20} color="inherit"/> : <CheckCircleIcon/>}
                            onClick={() => updateMatchStatus.mutate({ matchId: params.id, action: 'accept' })}
                        > Accept </Button>
                        <Button
                            variant="outlined" color="error" size="small"
                            disabled={!isActionable || isLoading}
                            startIcon={isLoading && updateMatchStatus.variables?.action === 'decline' ? <CircularProgress size={20} color="inherit"/> : <CancelIcon/>}
                            onClick={() => updateMatchStatus.mutate({ matchId: params.id, action: 'decline' })}
                        > Decline </Button>
                    </Box>
                )
            },
        },
    ];

    return (
        <>
            <Box sx={{ height: 400, width: '100%', mt: 2 }}>
                <StyledDataGrid rows={candidates} columns={columns} disableRowSelectionOnClick />
            </Box>
            {selectedMatchId != null && (
                <AllocationCreateModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    matchId={selectedMatchId}
                />
            )}
        </>
    );
};
export default MatchCandidatesTable;