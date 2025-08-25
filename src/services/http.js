// src/services/http.js
import axios from 'axios';

// Normalize root URL, trim trailing slash
// Your env already has /api at the end:
// REACT_APP_API_URL=https://organ-backend-v1-production.up.railway.app/api
const root = (process.env.REACT_APP_API_URL || 'http://localhost:8080/api').replace(/\/+$/, '');
const baseURL = root;

const http = axios.create({ baseURL });

if (process.env.NODE_ENV === 'development') {
  console.log('[HTTP] baseURL =', baseURL);
}

export default http;
