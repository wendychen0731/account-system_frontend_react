// src/components/LogoutButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import api, { clearToken } from '../api';

const LogoutButton = ({ onLogout, className }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // 可選：呼叫後端登出；攔截器會自動帶 Authorization
      await api.post('/auth/logout', {}); // 若沒有此端點可省略
    } catch (err) {
      console.error(err);
    }

    sessionStorage.setItem('skipAuthAlert', '1');
    onLogout?.();
    navigate('/', { replace: true });

    setTimeout(() => {
      clearToken();
    }, 0);
  };

  return (
    <button onClick={handleLogout} className={className}>
      登出
    </button>
  );
};

export default LogoutButton;
