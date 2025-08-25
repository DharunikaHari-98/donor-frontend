import React from 'react';
import {
  AppBar, Box, CssBaseline, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, IconButton,
  Avatar, Menu, MenuItem, Divider
} from '@mui/material';
import { NavLink, Outlet } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { useAuth } from '../../../context/AuthContext';

import SearchIcon from '@mui/icons-material/Search';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import Logout from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidth = 260;

const StyledNavLink = styled(NavLink)(({ theme }) => ({
    textDecoration: 'none',
    color: theme.palette.text.secondary,
    display: 'block',
    '&.active': {
        color: theme.palette.primary.main,
        '& .MuiListItemIcon-root': {
            color: theme.palette.primary.main,
        },
        '& .MuiListItemButton-root': {
            backgroundColor: theme.palette.action.selected,
        },
    },
}));

const OrganBankLayout = () => {
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const openUserMenu = Boolean(anchorEl);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const menuItems = [
        { text: 'Donor Lookup', icon: <SearchIcon />, path: '/organ-bank/donors' },
        { text: 'Organ Requests', icon: <MedicalServicesIcon />, path: '/organ-bank/organ-requests' },
        { text: 'Allocations', icon: <AssignmentTurnedInIcon />, path: '/organ-bank/allocations' },
        { text: 'Reports', icon: <AssessmentIcon />, path: '/organ-bank/reports/summary' },
    ];

    const drawerContent = (
        <>
            <Toolbar sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h5" color="primary" fontWeight="700">Vitalink</Typography>
            </Toolbar>
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <StyledNavLink to={item.path} key={item.text} onClick={() => mobileOpen && setMobileOpen(false)}>
                        <ListItem disablePadding>
                            <ListItemButton>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    </StyledNavLink>
                ))}
            </List>
        </>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: 'background.paper',
                    color: 'text.primary',
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Toolbar>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                        Organ Bank Portal
                    </Typography>
                    <IconButton onClick={handleMenu} size="small" sx={{ ml: 2 }}>
                        <Avatar sx={{ width: 32, height: 32 }}>{user?.username.charAt(0).toUpperCase()}</Avatar>
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={openUserMenu}
                        onClose={handleClose}
                        onClick={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <Box sx={{ p: 2, pb: 1 }}>
                            <Typography fontWeight="500">{user?.username}</Typography>
                            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={logout} sx={{ mt: 1 }}>
                            <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }}}>
                    {drawerContent}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }}} open>
                    {drawerContent}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, bgcolor: '#f4f6f8', p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, minHeight: '100vh' }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};
export default OrganBankLayout;