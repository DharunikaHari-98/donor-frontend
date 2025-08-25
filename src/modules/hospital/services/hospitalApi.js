// src/services/organBloodApi.js

// Your env already includes /api:
// REACT_APP_API_URL=https://organ-backend-v1-production.up.railway.app/api
// So DO NOT append another /api.
export const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

/** Attach Authorization header if you store a token */
function authHeader() {
  const t = localStorage.getItem('token'); // adjust to your storage key if needed
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** Common handler: errors + JSON parsing */
const apiHandler = async (requestPromise) => {
  try {
    const res = await requestPromise;

    if (!res.ok) {
      const text = await res.text();
      let message = `HTTP ${res.status} ${res.statusText}`;
      try {
        const json = text ? JSON.parse(text) : {};
        message =
          json.message ||
          json.error ||
          json.detail ||
          (Array.isArray(json.errors) ? json.errors.join(', ') : message);
      } catch {
        if (text) message = text;
      }
      throw new Error(message);
    }

    if (res.status === 204) return null;

    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : null;
  } catch (err) {
    console.error('API Error:', err?.message || err);
    throw err;
  }
};

/* =========================
   Donor Profiles
   ========================= */
export const getDonors = ({ page = 0, pageSize = 10 } = {}) => {
  const params = new URLSearchParams({ page, size: pageSize });
  return apiHandler(fetch(`${API_BASE}/donor-profiles?${params.toString()}`));
};

export const getDonorById = (id) =>
  apiHandler(fetch(`${API_BASE}/donor-profiles/${encodeURIComponent(id)}`));

/* =========================
   Organ Requests (Hospital “my” + admin)
   ========================= */
export async function getMyOrganRequests({ page = 0, size = 10, status, city, state } = {}) {
  const qs = new URLSearchParams({ page, size });
  if (status) qs.append('status', status);
  if (city)   qs.append('city', city);
  if (state)  qs.append('state', state);
  const res = await fetch(`${API_BASE}/organ-requests/my?${qs}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error('Failed to fetch my organ requests');
  return res.json();
}

export const getOrganRequests = ({ page = 0, pageSize = 10 } = {}) => {
  const params = new URLSearchParams({ page, size: pageSize });
  return apiHandler(fetch(`${API_BASE}/organ-requests?${params.toString()}`));
};

export const getOrganRequestById = (id) =>
  apiHandler(fetch(`${API_BASE}/organ-requests/${encodeURIComponent(id)}`));

export const createOrganRequest = (data) =>
  apiHandler(fetch(`${API_BASE}/organ-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  }));

export const findOrganMatches = (id) =>
  apiHandler(fetch(`${API_BASE}/organ-requests/${encodeURIComponent(id)}/match`, {
    method: 'POST',
    headers: { ...authHeader() },
  }));

export const getOrganRequestCandidates = (id) =>
  apiHandler(fetch(`${API_BASE}/organ-requests/${encodeURIComponent(id)}/candidates`, {
    headers: { ...authHeader() },
  }));

/* =========================
   Blood Requests (Hospital “my” + admin)
   ========================= */
export async function getMyBloodRequests({ page = 0, size = 10, status, city, state } = {}) {
  const qs = new URLSearchParams({ page, size });
  if (status) qs.append('status', status);
  if (city)   qs.append('city', city);
  if (state)  qs.append('state', state);
  const res = await fetch(`${API_BASE}/blood-requests/my?${qs}`, { headers: { ...authHeader() } });
  if (!res.ok) throw new Error('Failed to fetch my blood requests');
  return res.json();
}

export const getBloodRequests = ({ page = 0, pageSize = 10 } = {}) => {
  const params = new URLSearchParams({ page, size: pageSize });
  return apiHandler(fetch(`${API_BASE}/blood-requests?${params.toString()}`));
};

export const getBloodRequestById = (id) =>
  apiHandler(fetch(`${API_BASE}/blood-requests/${encodeURIComponent(id)}`));

export const createBloodRequest = (data) =>
  apiHandler(fetch(`${API_BASE}/blood-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  }));

export const findBloodMatches = (id) =>
  apiHandler(fetch(`${API_BASE}/blood-requests/${encodeURIComponent(id)}/match`, {
    method: 'POST',
    headers: { ...authHeader() },
  }));

export const getBloodRequestCandidates = (id) =>
  apiHandler(fetch(`${API_BASE}/blood-requests/${encodeURIComponent(id)}/candidates`, {
    headers: { ...authHeader() },
  }));

/* =========================
   Matches (accept / decline)
   ========================= */
export const acceptMatch = (matchId) =>
  apiHandler(fetch(`${API_BASE}/matches/${encodeURIComponent(matchId)}/accept`, {
    method: 'POST',
    headers: { ...authHeader() },
  }));

export const declineMatch = (matchId) =>
  apiHandler(fetch(`${API_BASE}/matches/${encodeURIComponent(matchId)}/decline`, {
    method: 'POST',
    headers: { ...authHeader() },
  }));

/* =========================
   Allocations
   ========================= */
export const getAllocations = ({ page = 0, pageSize = 10 } = {}) => {
  const params = new URLSearchParams({ page, size: pageSize });
  return apiHandler(fetch(`${API_BASE}/allocations?${params.toString()}`));
};

export const createAllocation = (data) =>
  apiHandler(fetch(`${API_BASE}/allocations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  }));

export const updateAllocation = ({ id, updateData }) =>
  apiHandler(fetch(`${API_BASE}/allocations/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(updateData),
  }));

export const getAllocationEvents = (id) =>
  apiHandler(fetch(`${API_BASE}/allocations/${encodeURIComponent(id)}/events`, {
    headers: { ...authHeader() },
  }));

export const addAllocationEvent = ({ id, eventData }) =>
  apiHandler(fetch(`${API_BASE}/allocations/${encodeURIComponent(id)}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(eventData),
  }));

/* =========================
   Reports & Audit
   ========================= */
export const getSummaryReport = () =>
  apiHandler(fetch(`${API_BASE}/reports/summary`, { headers: { ...authHeader() } }));

export const getTurnaroundReport = ({ from, to }) => {
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to)   params.set('to', to);
  return apiHandler(fetch(`${API_BASE}/reports/turnaround?${params.toString()}`, {
    headers: { ...authHeader() },
  }));
};

export const getAuditLogs = ({ entityType, entityId }) => {
  const params = new URLSearchParams();
  if (entityType) params.set('entityType', entityType);
  if (entityId != null) params.set('entityId', String(entityId));
  return apiHandler(fetch(`${API_BASE}/audit?${params.toString()}`, {
    headers: { ...authHeader() },
  }));
};
