// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);

  // 處理輸入
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 送出登入請求
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', formData);
      localStorage.setItem('auth_token', response.data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('登入失敗');
    }
  };

  return (
    <div>
      <h1>使用者登入</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="密碼" onChange={handleChange} required />
        <button type="submit">登入</button>
      </form>
    </div>
  );
};

export default Login;