import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import axios from 'axios';
import DonorRegistrationForm from '../components/DonorRegistrationForm';
import OrganAvailabilityComponent from '../components/OrganAvailabilityComponent';
import OrganRequestDashboard from '../components/OrganRequestDashboard';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

// Mock console warnings
const originalWarn = console.warn;
const originalError = console.error;
beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

describe('Organ Management Components Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // DonorRegistrationForm Tests (4 tests)
  test('DonorRegistrationForm renders all form fields correctly', () => {
    render(<DonorRegistrationForm />);
    
    expect(screen.getByText('Register asOrgan Donor')).toBeInTheDocument();
    expect(screen.getByTestId('name-input')).toBeInTheDocument();
    expect(screen.getByTestId('age-input')).toBeInTheDocument();
    expect(screen.getByTestId('gender-select')).toBeInTheDocument();
    expect(screen.getByTestId('Organtype-select')).toBeInTheDocument();
    expect(screen.getByTestId('contact-input')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('address-input')).toBeInTheDocument();
    expect(screen.getByTestId('lastdonation-input')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('DonorRegistrationForm shows validation errors for invalid input', async () => {
    render(<DonorRegistrationForm />);
    
    const nameInput = screen.getByTestId('name-input');
    const ageInput = screen.getByTestId('age-input');
    const emailInput = screen.getByTestId('email-input');

    // Enter invalid data
    fireEvent.change(nameInput, { target: { value: 'Jo' } }); // Too short
    fireEvent.change(ageInput, { target: { value: '16' } }); // Too young
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } }); // Invalid email

    // Trigger blur to show validation errors
    fireEvent.blur(nameInput);
    fireEvent.blur(ageInput);
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 3 characters')).toBeInTheDocument();
      expect(screen.getByText('Donor must be at least 18')).toBeInTheDocument();
      expect(screen.getByText('Must be a valid email address')).toBeInTheDocument();
    });
  });

  test('DonorRegistrationForm submits successfully with valid data', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: { id: 1, name: 'John Doe' } });

    render(<DonorRegistrationForm />);

    // Fill form with valid data
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('age-input'), { target: { value: '25' } });
    fireEvent.change(screen.getByTestId('gender-select'), { target: { value: 'Male' } });
    fireEvent.change(screen.getByTestId('Organtype-select'), { target: { value: 'A+' } });
    fireEvent.change(screen.getByTestId('contact-input'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('address-input'), { target: { value: '123 Main St' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
    });

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:8080/api/donors', {
        name: 'John Doe',
        age: 25,
        gender: 'Male',
        OrganType: 'A+',
        contactNumber: '1234567890',
        email: 'john@example.com',
        address: '123 Main St',
        lastDonationDate: null
      });
    });

    await waitFor(() => {
      expect(screen.getByText('Registration successful!')).toBeInTheDocument();
    });
  });

  test('DonorRegistrationForm handles API error gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Registration failed' } }
    });

    render(<DonorRegistrationForm />);

    // Fill form with valid data
    fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('age-input'), { target: { value: '25' } });
    fireEvent.change(screen.getByTestId('gender-select'), { target: { value: 'Male' } });
    fireEvent.change(screen.getByTestId('Organtype-select'), { target: { value: 'A+' } });
    fireEvent.change(screen.getByTestId('contact-input'), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByTestId('email-input'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('address-input'), { target: { value: '123 Main St' } });

    await act(async () => {
      fireEvent.click(screen.getByTestId('submit-button'));
    });

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });

  // OrganAvailabilityComponent Tests (3 tests)
  test('OrganAvailabilityComponent loads and displays availability data', async () => {
    const mockData = {
      availability: {
        'A+': 15,
        'A-': 8,
        'B+': 12,
        'B-': 3,
        'AB+': 7,
        'AB-': 2,
        'O+': 20,
        'O-': 5
      },
      lastUpdated: '2023-12-01T10:00:00Z'
    };

    mockedAxios.get.mockResolvedValueOnce({ data: mockData });

    render(<OrganAvailabilityComponent />);

    await waitFor(() => {
      expect(screen.getByText('Organ Availability')).toBeInTheDocument();
      expect(screen.getByTestId('Organtype-A+')).toBeInTheDocument();
      expect(screen.getByTestId('Organtype-B+')).toBeInTheDocument();
      expect(screen.getByTestId('Organtype-O+')).toBeInTheDocument();
    });

    // Check for low stock indicators
    await waitFor(() => {
      expect(screen.getByText('3 units')).toBeInTheDocument(); // B-
      expect(screen.getByText('2 units')).toBeInTheDocument(); // AB-
    });
  });

  test('OrganAvailabilityComponent displays error when API fails', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<OrganAvailabilityComponent />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load Organ availability')).toBeInTheDocument();
    });
  });

  // OrganRequestDashboard Tests (3 tests)
  test('OrganRequestDashboard loads and displays request data', async () => {
    const mockRequests = [
      {
        id: 1,
        hospitalName: 'City Hospital',
        OrganType: 'A+',
        unitsRequired: 2,
        urgency: 'HIGH',
        requestDate: '2023-12-01',
        status: 'PENDING',
        patientName: 'John Patient'
      },
      {
        id: 2,
        hospitalName: 'General Hospital',
        OrganType: 'B+',
        unitsRequired: 1,
        urgency: 'MEDIUM',
        requestDate: '2023-12-02',
        status: 'FULFILLED',
        patientName: 'Jane Patient'
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockRequests });

    render(<OrganRequestDashboard />);

    await waitFor(() => {
      expect(screen.getByText('Organ Requests')).toBeInTheDocument();
      expect(screen.getByTestId('requests-table')).toBeInTheDocument();
      expect(screen.getByText('City Hospital')).toBeInTheDocument();
      expect(screen.getByText('General Hospital')).toBeInTheDocument();
      expect(screen.getByTestId('request-row-1')).toBeInTheDocument();
      expect(screen.getByTestId('request-row-2')).toBeInTheDocument();
    });
  });

  test('OrganRequestDashboard filters requests by organ type and status', async () => {
    const mockRequests = [
      {
        id: 1,
        hospitalName: 'City Hospital',
        OrganType: 'A+',
        unitsRequired: 2,
        urgency: 'HIGH',
        requestDate: '2023-12-01',
        status: 'PENDING',
        patientName: 'John Patient'
      },
      {
        id: 2,
        hospitalName: 'General Hospital',
        OrganType: 'B+',
        unitsRequired: 1,
        urgency: 'MEDIUM',
        requestDate: '2023-12-02',
        status: 'FULFILLED',
        patientName: 'Jane Patient'
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockRequests });

    render(<OrganRequestDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('requests-table')).toBeInTheDocument();
    });

    // Filter by organ type
    await act(async () => {
      fireEvent.change(screen.getByTestId('Organtype-filter'), { target: { value: 'A+' } });
    });

    await waitFor(() => {
      expect(screen.getByText('City Hospital')).toBeInTheDocument();
      expect(screen.queryByText('General Hospital')).not.toBeInTheDocument();
    });

    // Filter by status
    await act(async () => {
      fireEvent.change(screen.getByTestId('Organtype-filter'), { target: { value: '' } }); // Reset organ type filter
      fireEvent.change(screen.getByTestId('status-filter'), { target: { value: 'FULFILLED' } });
    });

    await waitFor(() => {
      expect(screen.queryByText('City Hospital')).not.toBeInTheDocument();
      expect(screen.getByText('General Hospital')).toBeInTheDocument();
    });
  });

  test('OrganRequestDashboard sorts requests by different criteria', async () => {
    const mockRequests = [
      {
        id: 1,
        hospitalName: 'Hospital A',
        OrganType: 'A+',
        unitsRequired: 2,
        urgency: 'LOW',
        requestDate: '2023-12-01',
        status: 'PENDING',
        patientName: 'Patient A'
      },
      {
        id: 2,
        hospitalName: 'Hospital B',
        OrganType: 'B+',
        unitsRequired: 1,
        urgency: 'HIGH',
        requestDate: '2023-12-03',
        status: 'PENDING',
        patientName: 'Patient B'
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockRequests });

    render(<OrganRequestDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId('sort-select')).toBeInTheDocument();
    });

    // Sort by urgency
    await act(async () => {
      fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'urgency' } });
    });

    await waitFor(() => {
      const urgencyCells = screen.getAllByTestId('urgency-cell');
      expect(urgencyCells[0]).toHaveTextContent('HIGH');
      expect(urgencyCells[1]).toHaveTextContent('LOW');
    });

    // Sort by date ascending
    await act(async () => {
      fireEvent.change(screen.getByTestId('sort-select'), { target: { value: 'date_asc' } });
    });

    // Verify sorting has changed (Hospital A should be first as it has earlier date)
    await waitFor(() => {
      const rows = screen.getAllByTestId(/request-row-/);
      expect(rows[0]).toHaveAttribute('data-testid', 'request-row-1');
      expect(rows[1]).toHaveAttribute('data-testid', 'request-row-2');
    });
  });
});