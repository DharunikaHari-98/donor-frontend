import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acceptMatch, declineMatch } from '../services/adminApi';
import { Box, Button, Paper, Tooltip, Chip, Typography, alpha } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import AllocationCreateModal from './AllocationCreateModal';

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: 'none',
  borderRadius: '20px',
  background: `linear-gradient(135deg,
      ${alpha(theme.palette.background.paper, 0.95)},
      ${alpha(theme.palette.primary.light, 0.02)})`,
  backdropFilter: 'blur(10px)',
  boxShadow: `0 12px 40px ${alpha(theme.palette.common.black, 0.1)}`,
  '& .MuiDataGrid-columnHeaders': {
    background: `linear-gradient(135deg,
        ${alpha(theme.palette.primary.main, 0.1)},
        ${alpha(theme.palette.secondary.main, 0.05)})`,
    borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    borderRadius: '20px 20px 0 0',
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 700,
      color: theme.palette.primary.main,
    }
  },
  '& .MuiDataGrid-row': {
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.05)}`,
    transition: 'all 0.2s ease',
    '&:hover': {
      background: `linear-gradient(135deg,
          ${alpha(theme.palette.primary.main, 0.05)},
          ${alpha(theme.palette.secondary.main, 0.02)})`,
      transform: 'translateY(-1px)',
    }
  },
  '& .MuiDataGrid-cell': { borderBottom: 'none' }
}));

const StyledActionButton = styled(Button)(({ theme, actiontype }) => ({
  borderRadius: '12px',
  padding: '8px 16px',
  fontWeight: 600,
  textTransform: 'none',
  minWidth: '80px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  ...(actiontype === 'accept' && {
    background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
    color: 'white',
    boxShadow: `0 4px 15px ${alpha(theme.palette.success.main, 0.3)}`,
    '&:hover': {
      transform: 'translateY(-2px) scale(1.05)',
      boxShadow: `0 8px 25px ${alpha(theme.palette.success.main, 0.4)}`,
    }
  }),
  ...(actiontype === 'decline' && {
    border: `2px solid ${theme.palette.error.main}`,
    color: theme.palette.error.main,
    background: alpha(theme.palette.error.main, 0.05),
    '&:hover': {
      transform: 'translateY(-2px)',
      background: alpha(theme.palette.error.main, 0.1),
      boxShadow: `0 8px 25px ${alpha(theme.palette.error.main, 0.3)}`,
    }
  }),
  '&:disabled': { opacity: 0.6, transform: 'none' }
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color, bg;
  if (status === 'PENDING_DONOR_CONFIRM') {
    color = theme.palette.warning.main;
    bg = alpha(theme.palette.warning.main, 0.1);
  } else if (status === 'ACCEPTED') {
    color = theme.palette.success.main;
    bg = alpha(theme.palette.success.main, 0.1);
  } else {
    color = theme.palette.error.main;
    bg = alpha(theme.palette.error.main, 0.1);
  }
  return {
    background: bg,
    color,
    fontWeight: 600,
    border: `1px solid ${color}`,
    '& .MuiChip-icon': { color },
  };
});

export default function MatchCandidatesTable({ candidates }) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);

  const acceptMutation = useMutation({
    mutationFn: acceptMatch, // mutate(matchId)
    onSuccess: (_data, matchId) => {
      queryClient.invalidateQueries();
      setSelectedMatchId(matchId);
      setModalOpen(true);
    },
  });

  const declineMutation = useMutation({
    mutationFn: declineMatch,
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });

  const columns = [
    {
      field: 'id',
      headerName: 'Match ID',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="600" color="primary">
          #{params.value}
        </Typography>
      )
    },
    {
      field: 'matchScore',
      headerName: 'Compatibility Score',
      width: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 40,
              height: 8,
              borderRadius: 4,
              background: `linear-gradient(90deg,
                ${params.value > 80 ? '#4caf50' : params.value > 60 ? '#ff9800' : '#f44336'} 0%,
                ${params.value > 80 ? '#81c784' : params.value > 60 ? '#ffb74d' : '#e57373'} 100%)`
            }}
          />
          <Typography variant="body2" fontWeight="600">
            {params.value}%
          </Typography>
        </Box>
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 180,
      renderCell: (params) => (
        <StatusChip
          label={params.value.replace(/_/g, ' ')}
          size="small"
          status={params.value}
          icon={
            params.value === 'PENDING_DONOR_CONFIRM'
              ? <HourglassEmptyIcon />
              : params.value === 'ACCEPTED'
                ? <CheckCircleIcon />
                : <CancelIcon />
          }
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 240,
      sortable: false,
      renderCell: (params) => {
        const row = params.row;
        const isAccepted = row.status === 'ACCEPTED';
        return (
          <Box sx={{ display: 'flex', gap: 1, py: 1 }}>
            <Tooltip title="Accept this match" arrow>
              <span>
                <StyledActionButton
                  actiontype="accept"
                  size="small"
                  disabled={isAccepted || acceptMutation.isLoading}
                  onClick={() =>
                    isAccepted
                      ? (setSelectedMatchId(row.id), setModalOpen(true))
                      : acceptMutation.mutate(row.id)
                  }
                  startIcon={<CheckCircleIcon />}
                >
                  {isAccepted ? 'ACCEPTED' : 'ACCEPT'}
                </StyledActionButton>
              </span>
            </Tooltip>
            <Tooltip title="Decline this match" arrow>
              <span>
                <StyledActionButton
                  actiontype="decline"
                  size="small"
                  disabled={isAccepted || declineMutation.isLoading}
                  onClick={() => declineMutation.mutate(row.id)}
                  startIcon={<CancelIcon />}
                >
                  Decline
                </StyledActionButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper elevation={0} sx={{ mt: 3, borderRadius: '20px', overflow: 'hidden', background: 'transparent' }}>
      <Box sx={{ height: 450, width: '100%' }}>
        <StyledDataGrid
          rows={Array.isArray(candidates) ? candidates : []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          getRowHeight={() => 70}
          getRowId={(row) => row?.id}
        />
      </Box>

      {selectedMatchId && (
        <AllocationCreateModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          matchId={selectedMatchId}
        />
      )}
    </Paper>
  );
}
