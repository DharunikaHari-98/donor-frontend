// src/services/apiSlice.js

// Your env already ends with /api
// REACT_APP_API_URL=https://organ-backend-v1-production.up.railway.app/api
// So we DO NOT append another /api here.
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

const apiHandler = async (requestPromise) => {
  try {
    const response = await requestPromise;

    if (!response.ok) {
      const text = await response.text();
      let errorMessage = `HTTP ${response.status} ${response.statusText}`;
      try {
        const json = text ? JSON.parse(text) : {};
        errorMessage =
          json.message ||
          json.error ||
          json.detail ||
          (Array.isArray(json.errors) ? json.errors.join(', ') : errorMessage);
      } catch {
        if (text) errorMessage = text;
      }
      throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    const contentType = response.headers.get("content-type") || "";
    return contentType.includes("application/json") ? response.json() : null;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
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
   Organ Requests
   ========================= */
export const getOrganRequests = ({ page = 0, pageSize = 10 } = {}) => {
  const params = new URLSearchParams({ page, size: pageSize });
  return apiHandler(fetch(`${API_BASE}/organ-requests?${params.toString()}`));
};

export const getOrganRequestById = (id) =>
  apiHandler(fetch(`${API_BASE}/organ-requests/${encodeURIComponent(id)}`));

export const createOrganRequest = (data) =>
  apiHandler(fetch(`${API_BASE}/organ-requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));

export const findOrganMatches = (id) =>
  apiHandler(fetch(`${API_BASE}/organ-requests/${encodeURIComponent(id)}/match`, { method: 'POST' }));

export const getOrganRequestCandidates = (id) =>
  apiHandler(fetch(`${API_BASE}/organ-requests/${encodeURIComponent(id)}/candidates`));

/* =========================
   Matches
   ========================= */
export const acceptMatch = (matchId) =>
  apiHandler(fetch(`${API_BASE}/matches/${encodeURIComponent(matchId)}/accept`, { method: 'POST' }));

export const declineMatch = (matchId) =>
  apiHandler(fetch(`${API_BASE}/matches/${encodeURIComponent(matchId)}/decline`, { method: 'POST' }));

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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));

export const getAllocationEvents = (id) =>
  apiHandler(fetch(`${API_BASE}/allocations/${encodeURIComponent(id)}/events`));

/* =========================
   Reports & Audit
   ========================= */
export const getSummaryReport = () =>
  apiHandler(fetch(`${API_BASE}/reports/summary`));

export const getAuditLogs = ({ entityType, entityId }) => {
  const params = new URLSearchParams();
  if (entityType) params.set('entityType', entityType);
  if (entityId != null) params.set('entityId', String(entityId));
  return apiHandler(fetch(`${API_BASE}/audit?${params.toString()}`));
};
