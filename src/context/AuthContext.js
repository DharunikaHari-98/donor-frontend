// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser } from '../services/authApi';
//mport { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('authUser');
    }
  }, []);

  // ## CHANGE 1: Accept 'navigate' as a second argument here
  const login = async (credentials, navigate) => {
    const userData = await loginUser(credentials);
    setUser(userData);
    localStorage.setItem('authUser', JSON.stringify(userData));

    // ## CHANGE 2: Use 'navigate' to redirect after successful login
    switch (userData.role) {
      case 'ADMIN':
        navigate('/admin');
        break;
      case 'DONOR':
        navigate('/donor');
        break;
      case 'HOSPITAL':
        navigate('/hospital');
        break;
      case 'ORGAN_BANK':
        navigate('/organ-bank');
        break;
      default:
        navigate('/'); // Default page after login
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
    // This hard refresh works, but using navigate is smoother.
    // You could update your layouts to pass navigate to the logout function too.
    window.location.href = '/login';
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};