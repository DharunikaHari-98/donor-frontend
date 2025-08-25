import React from 'react';
import {
  AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, IconButton,
  Avatar, Menu, MenuItem, Divider
} from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import DonorAssistantBot from './DonorAssistantBot';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import Logout from '@mui/icons-material/Logout';

import { useAuth } from '../../../context/AuthContext';

const drawerWidth = 260;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.secondary,
  display: 'block',
  '&.active': {
    color: theme.palette.primary.main,
    '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
    '& .MuiListItemButton-root': { backgroundColor: theme.palette.action.selected },
  },
}));

const DonorLayout = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const menuItems = [
    { text: 'My Profile', icon: <AccountCircleIcon />, path: '/donor/profile' },
    { text: 'My Consents', icon: <FactCheckIcon />, path: '/donor/consents' },
    { text: 'My Matches', icon: <FavoriteIcon />, path: '/donor/matches' },
    { text: 'My Allocations', icon: <AssignmentTurnedInIcon />, path: '/donor/allocations' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Donor Portal
          </Typography>
          <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }}>
            <Avatar sx={{ width: 32, height: 32 }}>
              {(user?.username?.[0] || 'U').toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={logout}>
              <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{ width: drawerWidth, flexShrink: 0, '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' } }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ p: 2 }}>
          <Typography variant="h5" color="primary" fontWeight="700">Vitalink</Typography>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <StyledNavLink to={item.path} key={item.text}>
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            </StyledNavLink>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: '#f4f6f8', p: 3, width: `calc(100% - ${drawerWidth}px)`, minHeight: '100vh' }}
      >
        <Toolbar />
        <Outlet />

        {/* 👇 Bot must be inside the returned JSX */}
        <DonorAssistantBot />
      </Box>
    </Box>
  );
};

export default DonorLayout;
