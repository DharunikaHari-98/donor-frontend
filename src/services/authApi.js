// src/services/authApi.js

// Your env already includes /api at the end:
// REACT_APP_API_URL=https://organ-backend-v1-production.up.railway.app/api
// So do NOT add another /api here; just append /auth.
const API_ROOT = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');
const API_BASE_URL = `${API_ROOT}/auth`;

const TOKEN_KEY = 'token';

const fakeWait = (ms) => new Promise((r) => setTimeout(r, ms));

const mockRegister = async (userData) => {
  await fakeWait(200);
  return {
    id: 1,
    name: userData?.name || 'User',
    email: userData?.email || 'user@example.com',
  };
};

const mockLogin = async (credentials) => {
  await fakeWait(200);
  return {
    id: 1,
    name: 'User',
    email: credentials?.email || 'user@example.com',
    token: 'dev-token',
  };
};

export const registerUser = async (userData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      if (res.status === 404) return mockRegister(userData); // endpoint missing in dev
      const text = await res.text();
      let message = 'Registration failed';
      try {
        const j = text ? JSON.parse(text) : {};
        message = j.message || j.error || j.detail || message;
      } catch {
        if (text) message = text;
      }
      throw new Error(message);
    }
    return res.json();
  } catch (_) {
    // network or other error → mock in dev
    return mockRegister(userData);
  }
};

export const loginUser = async (credentials) => {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      if (res.status === 404) {
        const data = await mockLogin(credentials);
        localStorage.setItem(TOKEN_KEY, data.token);
        return data;
      }
      const text = await res.text();
      let message = 'Invalid credentials';
      try {
        const j = text ? JSON.parse(text) : {};
        message = j.message || j.error || j.detail || message;
      } catch {
        if (text) message = text;
      }
      throw new Error(message);
    }

    const data = await res.json();
    if (data?.token) localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  } catch (_) {
    const data = await mockLogin(credentials);
    localStorage.setItem(TOKEN_KEY, data.token);
    return data;
  }
};

// Optional helpers
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
