// src/services/myDonorService.js

// Your env already ends with /api, so don't append /api again.
const API_BASE = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

// Generic handler with safe JSON parsing
const apiHandler = async (promise, { allow404Null = false } = {}) => {
  try {
    const res = await promise;

    // Handle expected "missing" cases as null (e.g., profile not created yet)
    if (allow404Null && (res.status === 400 || res.status === 404)) {
      return null;
    }

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

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return res.json();
    return null;
  } catch (err) {
    throw new Error(err?.message || 'Network error');
  }
};

// --- Donor Profile (for the logged-in user) ---
export const getMyProfile = async (id) =>
  apiHandler(fetch(`${API_BASE}/donor-profiles/${id}`), { allow404Null: true });

export const createMyProfile = async (donorData) =>
  apiHandler(
    fetch(`${API_BASE}/donor-profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData),
    })
  );

export const updateMyProfile = async ({ id, donorData }) =>
  apiHandler(
    fetch(`${API_BASE}/donor-profiles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donorData),
    })
  );

// --- Consents ---
export const getMyConsents = async (donorProfileId) =>
  apiHandler(fetch(`${API_BASE}/consent-records?donorProfileId=${encodeURIComponent(donorProfileId)}`));

export const createConsent = async (consentData) =>
  apiHandler(
    fetch(`${API_BASE}/consent-records`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(consentData),
    })
  );

// --- Matches ---
export const getMyMatches = async (donorProfileId) =>
  apiHandler(fetch(`${API_BASE}/matches?donorProfileId=${encodeURIComponent(donorProfileId)}`));

export const acceptMatch = async (matchId) =>
  apiHandler(fetch(`${API_BASE}/matches/${matchId}/accept`, { method: 'POST' }));

export const declineMatch = async (matchId) =>
  apiHandler(fetch(`${API_BASE}/matches/${matchId}/decline`, { method: 'POST' }));

// --- Allocations ---
export const getAllocations = async ({ page = 0, size = 100 } = {}) => {
  const params = new URLSearchParams({ page, size });
  return apiHandler(fetch(`${API_BASE}/allocations?${params.toString()}`));
};

export const getAllocationEvents = async (id) =>
  apiHandler(fetch(`${API_BASE}/allocations/${id}/events`));
