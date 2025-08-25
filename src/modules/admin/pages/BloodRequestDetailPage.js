import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueries, useMutation, useQueryClient } from '@tanstack/react-query';
import { DataGrid } from '@mui/x-data-grid';
import { Button, CircularProgress } from '@mui/material';

import AllocationCreateModal from '../components/AllocationCreateModal';

import {
  fetchBloodRequestById,
  fetchBloodCandidates,
  findBloodMatches,
  declineMatch,
  acceptMatch,
  getDonorProfileById,
} from '../services/adminApi';

export default function BloodRequestDetailPage() {
  const { id, requestId: requestIdFromRoute } = useParams();
  const requestId = requestIdFromRoute || id;

  const qc = useQueryClient();

  const [allocOpen, setAllocOpen] = useState(false);
  const [allocMatchId, setAllocMatchId] = useState(null);

  const {
    data: bloodRequest,
    isLoading: reqLoading,
    isError: reqError,
    error: reqErr,
  } = useQuery({
    queryKey: ['bloodRequest', requestId],
    queryFn: () => fetchBloodRequestById(requestId),
    enabled: !!requestId,
  });

  const {
    data: candidates,
    isLoading: candLoading,
    isError: candError,
    error: candErr,
  } = useQuery({
    queryKey: ['bloodCandidates', requestId],
    queryFn: () => fetchBloodCandidates(requestId),
    enabled: !!requestId,
  });

  // donor profile enrichment (optional)
  const donorIds = useMemo(
    () => Array.from(new Set((candidates ?? []).map((c) => c?.donorProfileId).filter(Boolean))),
    [candidates]
  );

  const donorQueries = useQueries({
    queries: donorIds.map((did) => ({
      queryKey: ['donorProfile', did],
      queryFn: () => getDonorProfileById(did),
      enabled: !!did,
      staleTime: 5 * 60 * 1000,
    })),
  });

  const donorMap = useMemo(() => {
    const map = new Map();
    donorQueries.forEach((q, idx) => {
      const k = donorIds[idx];
      const d = q?.data;
      if (!k || !d) return;
      const name = d.name || d.fullName || d.displayName || d.email || d.phone || `Donor #${k}`;
      map.set(k, name);
    });
    return map;
  }, [donorQueries, donorIds]);

  // mutations
  const findMatchesMut = useMutation({
    mutationFn: () => findBloodMatches(requestId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bloodCandidates', requestId] });
      qc.invalidateQueries({ queryKey: ['bloodRequest', requestId] });
    },
  });

  const acceptMut = useMutation({
    mutationFn: (matchId) => acceptMatch(matchId),
    onSuccess: (_data, matchId) => {
      qc.invalidateQueries({ queryKey: ['bloodCandidates', requestId] });
      qc.invalidateQueries({ queryKey: ['bloodRequest', requestId] });
      setAllocMatchId(matchId);
      setAllocOpen(true);
    },
    onError: (err) => {
      console.error('acceptMatch failed:', err);
      alert('Accept failed: ' + (err?.message || 'Unknown error'));
    },
  });

  const declineMut = useMutation({
    mutationFn: (matchId) => declineMatch(matchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['bloodCandidates', requestId] });
    },
  });

  // columns (FIXED donor column: no valueGetter → no params undefined crash)
  const columns = [
    { field: 'id', headerName: 'Match ID', width: 110 },
    {
      field: 'donorProfileId',
      headerName: 'Donor',
      width: 300,
      sortable: false,
      renderCell: (params) => {
        const id = params?.row?.donorProfileId ?? params?.value ?? null;
        const name = id ? donorMap.get(id) : null;
        return <span>{name ? `${name} (ID: ${id})` : (id ? `ID: ${id}` : '—')}</span>;
      },
    },
    { field: 'matchScore', headerName: 'Score', width: 100 },
    { field: 'reason', headerName: 'Reason', width: 320 },
    { field: 'status', headerName: 'Status', width: 170 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 260,
      sortable: false,
      renderCell: (params) => {
        const row = params?.row || {};
        const matchId = row.id;
        const isAccepted = row.status === 'ACCEPTED';
        const isDeclined = row.status === 'DECLINED';
        return (
          <>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                if (!matchId) return;
                if (isAccepted) {
                  setAllocMatchId(matchId);
                  setAllocOpen(true);
                } else {
                  acceptMut.mutate(matchId);
                }
              }}
              disabled={!matchId || isDeclined || acceptMut.isLoading}
              sx={{ mr: 1 }}
            >
              {isAccepted ? 'ACCEPTED' : (acceptMut.isLoading ? 'Accepting…' : 'Accept')}
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => matchId && declineMut.mutate(matchId)}
              disabled={!matchId || isAccepted || isDeclined || declineMut.isLoading}
            >
              Decline
            </Button>
          </>
        );
      },
    },
  ];

  if (reqLoading) {
    return (
      <div style={{ padding: 24 }}>
        <CircularProgress />
      </div>
    );
  }
  if (reqError) {
    return (
      <div style={{ padding: 24, color: 'red' }}>
        Failed to load request: {String(reqErr?.message || reqErr)}
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Blood Request Detail (ID: {requestId})</h2>

      {bloodRequest && (
        <div style={{ marginBottom: 16 }}>
          <div><strong>Hospital:</strong> {bloodRequest.hospitalName}</div>
          <div><strong>Blood Group:</strong> {bloodRequest.bloodGroup}</div>
          <div><strong>Status:</strong> {bloodRequest.status}</div>
        </div>
      )}

      <Button
        variant="contained"
        onClick={() => findMatchesMut.mutate()}
        disabled={findMatchesMut.isLoading || !requestId}
        sx={{ mb: 2 }}
      >
        {findMatchesMut.isLoading ? 'Matching…' : 'Find Matches'}
      </Button>

      {candError ? (
        <div style={{ color: 'red' }}>
          Failed to load candidates: {String(candErr?.message || candErr)}
        </div>
      ) : (
        <div style={{ height: 520, width: '100%' }}>
          <DataGrid
            rows={Array.isArray(candidates) ? candidates : []}
            columns={columns}
            loading={candLoading || findMatchesMut.isLoading}
            getRowId={(row) => row?.id}
            disableRowSelectionOnClick
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </div>
      )}

      <AllocationCreateModal
        open={allocOpen}
        onClose={() => setAllocOpen(false)}
        matchId={allocMatchId}
      />
    </div>
  );
}
