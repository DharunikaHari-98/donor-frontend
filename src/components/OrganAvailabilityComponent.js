import React, { useEffect, useState } from 'react';
import http from '../services/http';

const LOW_STOCK_THRESHOLD = 5;

const OrganAvailabilityComponent = () => {
  const [availability, setAvailability] = useState({});
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data } = await http.get('/api/organ-availability');
        setAvailability(data.availability || {});
        setLastUpdated(data.lastUpdated || new Date().toISOString());
      } catch (err) {
        setError('Failed to load organ availability');
      }
    };
    fetchAvailability();
  }, []);

  if (error) return <div>{error}</div>;
  if (!availability || Object.keys(availability).length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h2>Organ Availability</h2>
      <table>
        <thead>
          <tr>
            <th>Organ Type</th>
            <th>Units Available</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(availability).map(([type, units]) => (
            <tr key={type}>
              <td>{type}</td>
              <td>{units} units</td>
              <td style={{ color: units < LOW_STOCK_THRESHOLD ? 'red' : 'green' }}>
                {units < LOW_STOCK_THRESHOLD ? 'Low Stock' : 'Sufficient'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>Last updated on: {new Date(lastUpdated).toLocaleString()}</p>
    </div>
  );
};

export default OrganAvailabilityComponent;
