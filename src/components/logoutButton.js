// src/components/LogoutButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem('auth_token');
    try {
      await api.post('/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error(err);
    }
    localStorage.removeItem('auth_token');
    navigate('/login');
  };

  return <button onClick={handleLogout}>登出</button>;
};

export default LogoutButton;
