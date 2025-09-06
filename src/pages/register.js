// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setToken } from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', password_confirmation: '',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/register', formData);
      if (data?.token) setToken(data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || '註冊失敗');
    }
  };

  return (
    <div>
      <h1>使用者註冊</h1>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" placeholder="姓名" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="密碼" onChange={handleChange} required />
        <input name="password_confirmation" type="password" placeholder="確認密碼" onChange={handleChange} required />
        <button type="submit">註冊</button>
      </form>
    </div>
  );
};

export default Register;
