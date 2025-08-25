// src/modules/admin/services/adminApi.js

// IMPORTANT: Your env already has /api at the end.
// REACT_APP_API_URL=https://organ-backend-v1-production.up.railway.app/api
// So we DO NOT append /api again here.
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

async function apiHandler(promise) {
  try {
    const res = await promise;
    const text = await res.text();

    if (!res.ok) {
      try {
        const json = text ? JSON.parse(text) : {};
        const msg =
          json.message ||
          json.error ||
          json.detail ||
          (Array.isArray(json.errors) ? json.errors.join(', ') : '') ||
          `HTTP ${res.status} ${res.statusText}`;
        throw new Error(msg);
      } catch {
        throw new Error(text || `HTTP ${res.status} ${res.statusText}`);
      }
    }

    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return text; // non-JSON payloads
    }
  } catch (err) {
    // Network/parse errors
    throw new Error(err?.message || 'Network error');
  }
}

/* =========================
   Matches (accept / decline)
   ========================= */
export const acceptMatch = (matchId) =>
  apiHandler(fetch(`${API_BASE}/matches/${matchId}/accept`, { method: 'POST' }));

export const declineMatch = (matchId) =>
  apiHandler(fetch(`${API_BASE}/matches/${matchId}/decline`, { method: 'POST' }));

/* =========================
   Allocations
   ========================= */
export const getAllocations = ({ page = 0, pageSize = 10, status } = {}) => {
  const params = new URLSearchParams({ page, size: pageSize });
  if (status) params.set('status', status);
  return apiHandler(fetch(`${API_BASE}/allocations?${params.toString()}`));
};

export const getAllocationById = (id) =>
  apiHandler(fetch(`${API_BASE}/allocations/${id}`));

export const getAllocationEvents = (id) =>
  apiHandler(fetch(`${API_BASE}/allocations/${id}/events`));

export const createAllocation = (data) =>
  apiHandler(
    fetch(`${API_BASE}/allocations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  );

export const updateAllocation = (id, data) =>
  apiHandler(
    fetch(`${API_BASE}/allocations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  );

/* =========================
   Blood Requests
   ========================= */
export const getBloodRequests = ({ page = 0, pageSize = 10, status, city, state } = {}) => {
  const params = new URLSearchParams({ page, size: pageSize });
  if (status) params.set('status', status);
  if (city) params.set('city', city);
  if (state) params.set('state', state);
  return apiHandler(fetch(`${API_BASE}/blood-requests?${params.toString()}`));
};

export const fetchBloodRequestById = (id) =>
  apiHandler(fetch(`${API_BASE}/blood-requests/${id}`));

export const createBloodRequest = (payload) =>
  apiHandler(
    fetch(`${API_BASE}/blood-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

export const findBloodMatches = (id) =>
  apiHandler(fetch(`${API_BASE}/blood-requests/${id}/match`, { method: 'POST' }));

export const fetchBloodCandidates = (id) =>
  apiHandler(fetch(`${API_BASE}/blood-requests/${id}/candidates`));

/* =========================
   Organ Requests
   ========================= */
export const getOrganRequests = ({ page = 0, pageSize = 10, status, city, state } = {}) => {
  const params = new URLSearchParams({ page, size: pageSize });
  if (status) params.set('status', status);
  if (city) params.set('city', city);
  if (state) params.set('state', state);
  return apiHandler(fetch(`${API_BASE}/organ-requests?${params.toString()}`));
};

export const getOrganRequestById = (id) =>
  apiHandler(fetch(`${API_BASE}/organ-requests/${id}`));

export const createOrganRequest = (payload) =>
  apiHandler(
    fetch(`${API_BASE}/organ-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  );

export const findOrganMatches = (id) =>
  apiHandler(fetch(`${API_BASE}/organ-requests/${id}/match`, { method: 'POST' }));

export const getOrganRequestCandidates = (id) =>
  apiHandler(fetch(`${API_BASE}/organ-requests/${id}/candidates`));

/* =========================
   Donors / Profiles
   ========================= */
export const getDonorProfileById = (id) =>
  apiHandler(fetch(`${API_BASE}/donors/${id}`));

/* =========================
   Audit logs
   ========================= */
export const getAuditLogs = ({ entityType, entityId }) => {
  const params = new URLSearchParams();
  if (entityType) params.set('entityType', entityType);
  if (entityId != null) params.set('entityId', String(entityId));
  return apiHandler(fetch(`${API_BASE}/audit?${params.toString()}`));
};

/* =========================
   Reports (Summary / TAT)
   ========================= */
export const getSummaryReport = (args = {}) => {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(args)) {
    if (v != null && v !== '') params.set(k, v);
  }
  const url = params.toString()
    ? `${API_BASE}/reports/summary?${params.toString()}`
    : `${API_BASE}/reports/summary`;
  return apiHandler(fetch(url));
};

export const getTurnaroundReport = (args = {}) => {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(args)) {
    if (v != null && v !== '') params.set(k, v);
  }
  const url = params.toString()
    ? `${API_BASE}/reports/turnaround?${params.toString()}`
    : `${API_BASE}/reports/turnaround`;
  return apiHandler(fetch(url));
};
