// src/App.js

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Typography } from '@mui/material';

// --- Our Context and Data Fetching Setup ---
import { AuthProvider, useAuth } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// --- Our Main Pages and Components ---
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

// --- Admin Module Imports (with Aliases) ---
import AdminLayout from './modules/admin/components/AdminLayout';
import AdminDonorSearchPage from './modules/admin/pages/DonorSearchPage';
import AdminDonorProfileViewPage from './modules/admin/pages/DonorProfileViewPage';
import AdminDonorProfileFormPage from './modules/admin/pages/DonorProfileFormPage';
import AdminOrganRequestListPage from './modules/admin/pages/OrganRequestListPage';
import AdminOrganRequestFormPage from './modules/admin/pages/OrganRequestFormPage';
import AdminOrganRequestDetailPage from './modules/admin/pages/OrganRequestDetailPage';
import AdminBloodRequestListPage from './modules/admin/pages/BloodRequestListPage';
import AdminBloodRequestFormPage from './modules/admin/pages/BloodRequestFormPage';
import AdminBloodRequestDetailPage from './modules/admin/pages/BloodRequestDetailPage';
import AdminAllocationListPage from './modules/admin/pages/AllocationListPage';
import AdminAllocationDetailPage from './modules/admin/pages/AllocationDetailPage';
import AdminSummaryDashboardPage from './modules/admin/pages/SummaryDashboardPage';
import AdminTurnaroundReportPage from './modules/admin/pages/TurnaroundReportPage';
import AdminAuditViewerPage from './modules/admin/pages/AuditViewerPage';

// --- Hospital Module Imports (with Aliases) ---
import HospitalLayout from './modules/hospital/components/HospitalLayout';
import HospitalDonorSearchPage from './modules/hospital/pages/DonorSearchPage';
import HospitalDonorProfileViewPage from './modules/hospital/pages/DonorProfileViewPage';
import HospitalOrganRequestListPage from './modules/hospital/pages/OrganRequestListPage';
import HospitalOrganRequestFormPage from './modules/hospital/pages/OrganRequestFormPage';
import HospitalOrganRequestDetailPage from './modules/hospital/pages/OrganRequestDetailPage';
import HospitalBloodRequestListPage from './modules/hospital/pages/BloodRequestListPage';
import HospitalBloodRequestFormPage from './modules/hospital/pages/BloodRequestFormPage';
import HospitalBloodRequestDetailPage from './modules/hospital/pages/BloodRequestDetailPage';
import HospitalAllocationListPage from './modules/hospital/pages/AllocationListPage';
import HospitalAllocationDetailPage from './modules/hospital/pages/AllocationDetailPage';
import HospitalSummaryDashboardPage from './modules/hospital/pages/SummaryDashboardPage';

// --- Organ Bank Module Imports (with Aliases) ---
import OrganBankLayout from './modules/organ-bank/components/OrganBankLayout';
import OrganBankDonorSearchPage from './modules/organ-bank/pages/DonorSearchPage';
import OrganBankDonorProfileViewPage from './modules/organ-bank/pages/DonorProfileViewPage';
import OrganBankOrganRequestListPage from './modules/organ-bank/pages/OrganRequestListPage';
import OrganBankOrganRequestFormPage from './modules/organ-bank/pages/OrganRequestFormPage';
import OrganBankOrganRequestDetailPage from './modules/organ-bank/pages/OrganRequestDetailPage';
import OrganBankAllocationListPage from './modules/organ-bank/pages/AllocationListPage';
import OrganBankAllocationDetailPage from './modules/organ-bank/pages/AllocationDetailPage';
import OrganBankSummaryDashboardPage from './modules/organ-bank/pages/SummaryDashboardPage';

// --- Donor Module Imports (with Aliases) ---
import DonorLayout from './modules/donor/components/DonorLayout';
import DonorProfilePage from './modules/donor/pages/DonorProfilePage';
import DonorConsentsPage from './modules/donor/pages/DonorConsentsPage';
import DonorMatchesPage from './modules/donor/pages/DonorMatchesPage';
import MyAllocationsPage from './modules/donor/pages/MyAllocationsPage';
import DonorAllocationDetailPage from './modules/donor/pages/AllocationDetailPage';


// Create a client for React Query
const queryClient = new QueryClient();

// This is the component that decides where to redirect after login
const Dashboard = () => {
  const { user } = useAuth();
  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to="/admin" />;
    case 'HOSPITAL':
      return <Navigate to="/hospital" />;
    case 'ORGAN_BANK':
      return <Navigate to="/organ-bank" />;
    case 'DONOR':
      return <Navigate to="/donor" />;
    default:
      return <Navigate to="/login" />;
  }
};

// --- Other Placeholders ---
const AdminDashboard = () => <Typography variant="h4">Admin Dashboard</Typography>;
const UnauthorizedPage = () => <div><h1>403 - Unauthorized</h1><p>You do not have permission to view this page.</p></div>;


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* --- Public Routes (No Layout) --- */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* --- Dashboard Redirect --- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'HOSPITAL', 'ORGAN_BANK', 'DONOR']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* --- Admin Protected Routes --- */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminLayout /></ProtectedRoute>}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/donors" element={<AdminDonorSearchPage />} />
              <Route path="/admin/donors/new" element={<AdminDonorProfileFormPage />} />
              <Route path="/admin/donors/:id" element={<AdminDonorProfileViewPage />} />
              <Route path="/admin/donors/:id/edit" element={<AdminDonorProfileFormPage />} />
              <Route path="/admin/organ-requests" element={<AdminOrganRequestListPage />} />
              <Route path="/admin/organ-requests/new" element={<AdminOrganRequestFormPage />} />
              <Route path="/admin/organ-requests/:id" element={<AdminOrganRequestDetailPage />} />
              <Route path="/admin/blood-requests" element={<AdminBloodRequestListPage />} />
              <Route path="/admin/blood-requests/new" element={<AdminBloodRequestFormPage />} />
              <Route path="/admin/blood-requests/:id" element={<AdminBloodRequestDetailPage />} />
              <Route path="/admin/allocations" element={<AdminAllocationListPage />} />
              <Route path="/admin/allocations/:id" element={<AdminAllocationDetailPage />} />
              <Route path="/admin/reports/summary" element={<AdminSummaryDashboardPage />} />
              <Route path="/admin/reports/turnaround" element={<AdminTurnaroundReportPage />} />
              <Route path="/admin/audit" element={<AdminAuditViewerPage />} />
            </Route>

            {/* --- Hospital Protected Routes --- */}
            <Route element={<ProtectedRoute allowedRoles={['HOSPITAL']}><HospitalLayout /></ProtectedRoute>}>
              <Route path="/hospital" element={<Navigate to="/hospital/donors" />} />
              <Route path="/hospital/donors" element={<HospitalDonorSearchPage />} />
              <Route path="/hospital/donors/:id" element={<HospitalDonorProfileViewPage />} />
              <Route path="/hospital/organ-requests" element={<HospitalOrganRequestListPage />} />
              <Route path="/hospital/organ-requests/new" element={<HospitalOrganRequestFormPage />} />
              <Route path="/hospital/organ-requests/:id" element={<HospitalOrganRequestDetailPage />} />
              <Route path="/hospital/blood-requests" element={<HospitalBloodRequestListPage />} />
              <Route path="/hospital/blood-requests/new" element={<HospitalBloodRequestFormPage />} />
              <Route path="/hospital/blood-requests/:id" element={<HospitalBloodRequestDetailPage />} />
              <Route path="/hospital/allocations" element={<HospitalAllocationListPage />} />
              <Route path="/hospital/allocations/:id" element={<HospitalAllocationDetailPage />} />
              <Route path="/hospital/reports/summary" element={<HospitalSummaryDashboardPage />} />
            </Route>

            {/* --- Organ Bank Protected Routes --- */}
            <Route element={<ProtectedRoute allowedRoles={['ORGAN_BANK']}><OrganBankLayout /></ProtectedRoute>}>
              <Route path="/organ-bank" element={<Navigate to="/organ-bank/donors" />} />
              <Route path="/organ-bank/donors" element={<OrganBankDonorSearchPage />} />
              <Route path="/organ-bank/donors/:id" element={<OrganBankDonorProfileViewPage />} />
              <Route path="/organ-bank/organ-requests" element={<OrganBankOrganRequestListPage />} />
              <Route path="/organ-bank/organ-requests/new" element={<OrganBankOrganRequestFormPage />} />
              <Route path="/organ-bank/organ-requests/:id" element={<OrganBankOrganRequestDetailPage />} />
              <Route path="/organ-bank/allocations" element={<OrganBankAllocationListPage />} />
              <Route path="/organ-bank/allocations/:id" element={<OrganBankAllocationDetailPage />} />
              <Route path="/organ-bank/reports/summary" element={<OrganBankSummaryDashboardPage />} />
            </Route>

            {/* --- Donor Protected Routes (Wrapped in DonorLayout) --- */}
            <Route
              element={
                <ProtectedRoute allowedRoles={['DONOR']}>
                  <DonorLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/donor" element={<Navigate to="/donor/profile" />} />
              <Route path="/donor/profile" element={<DonorProfilePage />} />
              <Route path="/donor/consents" element={<DonorConsentsPage />} />
              <Route path="/donor/matches" element={<DonorMatchesPage />} />
              <Route path="/donor/allocations" element={<MyAllocationsPage />} />
              <Route path="/donor/allocations/:id" element={<DonorAllocationDetailPage />} />
            </Route>

            {/* --- Fallback Route --- */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
