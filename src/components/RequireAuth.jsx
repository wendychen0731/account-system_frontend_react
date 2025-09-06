// src/components/RequireAuth.jsx
import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getToken } from '../api';

export default function RequireAuth() {
  const token = getToken();
  const skipAuthAlert = sessionStorage.getItem('skipAuthAlert') === '1';

  useEffect(() => {
    if (skipAuthAlert) sessionStorage.removeItem('skipAuthAlert');
  }, [skipAuthAlert]);

  if (!token) {
    if (!skipAuthAlert) alert('請先登入才能使用此功能！');
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
