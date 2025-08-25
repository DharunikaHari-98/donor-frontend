import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Badge,
  Divider,
  IconButton,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PolicyIcon from '@mui/icons-material/Policy';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';

import { useQuery } from '@tanstack/react-query';
import { getSummaryReport } from '../services/adminApi';

const drawerWidth = 260;

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Pull counts from your summary endpoint (already used for sidebar badges)
  const { data } = useQuery({
    queryKey: ['summaryReport'],
    queryFn: getSummaryReport,
    refetchInterval: 10000,              // refresh every 10s
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
    staleTime: 0,
  });

  const donorsTotal = data?.donors?.total ?? 0;
  const organOpen = data?.organRequests?.OPEN ?? 0;
  const bloodOpen = data?.bloodRequests?.OPEN ?? 0;

  // 🔔 Notification count shown on the bell
  const notifCount = organOpen + bloodOpen;

  const menuItems = [
    { text: 'Dashboard',        icon: <DashboardIcon />,        path: '/admin',                    badge: null },
    { text: 'Manage Donors',    icon: <PeopleIcon />,           path: '/admin/donors',             badge: donorsTotal || null },
    { text: 'Organ Requests',   icon: <MedicalServicesIcon />,  path: '/admin/organ-requests',     badge: organOpen || null },
    { text: 'Blood Requests',   icon: <BloodtypeIcon />,        path: '/admin/blood-requests',     badge: bloodOpen || null },
    { text: 'Allocations',      icon: <AssignmentTurnedInIcon />, path: '/admin/allocations',      badge: null },
    { text: 'Reports',          icon: <AssessmentIcon />,       path: '/admin/reports/summary',    badge: null },
    { text: 'Audit Viewer',     icon: <PolicyIcon />,           path: '/admin/audit',              badge: null },
  ];

  const NavItem = ({ item }) => {
    const selected =
      location.pathname === item.path || location.pathname.startsWith(item.path + '/');

    return (
      <ListItem disablePadding>
        <ListItemButton
          component={Link}
          to={item.path}
          selected={selected}
          sx={{ borderRadius: 1.5, mx: 1, my: 0.5 }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
          {item.badge ? (
            <Badge color="error" badgeContent={item.badge} sx={{ '& .MuiBadge-badge': { right: -2 } }} />
          ) : null}
        </ListItemButton>
      </ListItem>
    );
  };

  // ── Bell dropdown (quick actions) ──────────────────────────────────────────────
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleBellClick = (e) => setAnchorEl(e.currentTarget);
  const handleBellClose = () => setAnchorEl(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Navbar */}
      <AppBar
        position="static"
        sx={{
          background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
          boxShadow: '0 6px 14px rgba(0,0,0,0.15)',
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            Healthcare Admin
          </Typography>

          {/* 🔔 Live badge uses organOpen + bloodOpen */}
          <Tooltip title={notifCount ? `${notifCount} new request(s)` : 'No new requests'}>
            <IconButton color="inherit" size="large" sx={{ mr: 1 }} onClick={handleBellClick}>
              {notifCount > 0 ? (
                <Badge color="error" badgeContent={notifCount}>
                  <NotificationsIcon />
                </Badge>
              ) : (
                <Badge color="default" variant="dot">
                  <NotificationsIcon />
                </Badge>
              )}
            </IconButton>
          </Tooltip>

          {/* Dropdown content */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleBellClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={() => { handleBellClose(); navigate('/admin/organ-requests'); }}>
              Organ Requests: {organOpen}
            </MenuItem>
            <MenuItem onClick={() => { handleBellClose(); navigate('/admin/blood-requests'); }}>
              Blood Requests: {bloodOpen}
            </MenuItem>
            <Divider />
            <MenuItem
              disabled={notifCount === 0}
              onClick={() => { handleBellClose(); navigate('/admin/organ-requests'); }}
            >
              View all new requests
            </MenuItem>
          </Menu>

          <IconButton color="inherit" size="large" sx={{ mr: 1 }}>
            <SettingsIcon />
          </IconButton>

          <Button
            color="inherit"
            variant="outlined"
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)' }}
            onClick={() => navigate('/login')}
          >
            LOGOUT
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1 }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', p: 1.5 },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List sx={{ px: 0.5 }}>
              {menuItems.map((item) => (
                <NavItem key={item.text} item={item} />
              ))}
            </List>
            <Divider sx={{ my: 1.5 }} />
          </Box>
        </Drawer>

        {/* Main content */}
        <Container maxWidth="lg" sx={{ flexGrow: 1, py: 3 }}>
          <Outlet />
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 2, textAlign: 'center', bgcolor: 'grey.200', mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} Organ Donation Management System
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminLayout;
