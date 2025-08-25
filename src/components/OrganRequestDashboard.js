import React, { useState, useEffect } from 'react';
import http from '../services/http';

const OrganRequestDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [organTypeFilter, setOrganTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // ask a larger page so you see data without pagination UI
        const res = await http.get('/api/organ-requests', { params: { page: 0, size: 100 } });
        const page = res.data || {};
        const items = Array.isArray(page) ? page : (page.content || []);
        setRequests(items);
        setFiltered(items);
      } catch (e) {
        setRequests([]);
        setFiltered([]);
      }
    })();
  }, []);

  useEffect(() => {
    let temp = [...requests];

    if (organTypeFilter) {
      temp = temp.filter((r) => r.organType === organTypeFilter);
    }
    if (statusFilter) {
      temp = temp.filter((r) => r.status === statusFilter);
    }

    if (sortBy === 'urgency') {
      const priority = { HIGH: 1, MEDIUM: 2, LOW: 3 };
      temp.sort((a, b) => (priority[a.urgency] || 99) - (priority[b.urgency] || 99));
    } else if (sortBy === 'date_asc') {
      const getDate = (x) => new Date(x?.createdAt || x?.neededBy || x?.requestDate || 0).getTime();
      temp.sort((a, b) => getDate(a) - getDate(b));
    } else if (sortBy === 'date_desc') {
      const getDate = (x) => new Date(x?.createdAt || x?.neededBy || x?.requestDate || 0).getTime();
      temp.sort((a, b) => getDate(b) - getDate(a));
    }

    setFiltered(temp);
  }, [organTypeFilter, statusFilter, sortBy, requests]);

  return (
    <div>
      <h2>Organ Requests</h2>

      <select value={organTypeFilter} onChange={(e) => setOrganTypeFilter(e.target.value)}>
        <option value="">All Organ Types</option>
        <option value="KIDNEY">Kidney</option>
        <option value="LIVER">Liver</option>
        <option value="HEART">Heart</option>
        <option value="LUNG">Lung</option>
        <option value="PANCREAS">Pancreas</option>
        <option value="CORNEA">Cornea</option>
      </select>

      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All Status</option>
        {/* Keep options broad; backend uses RequestStatusV3 (OPEN, MATCHED, ALLOCATED, etc.) */}
        <option value="OPEN">OPEN</option>
        <option value="MATCHED">MATCHED</option>
        <option value="ALLOCATED">ALLOCATED</option>
        <option value="FULFILLED">FULFILLED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>

      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Sort</option>
        <option value="urgency">Urgency</option>
        <option value="date_asc">Date Ascending</option>
        <option value="date_desc">Date Descending</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Hospital</th>
            <th>Organ Type</th>
            <th>Blood Group</th>
            <th>Urgency</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((req) => (
            <tr key={req.id}>
              <td>{req.hospitalName}</td>
              <td>{req.organType}</td>
              <td>{req.bloodGroup}</td>
              <td>{req.urgency}</td>
              <td>{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrganRequestDashboard;
