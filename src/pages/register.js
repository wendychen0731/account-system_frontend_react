// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState(null);

  // 表單輸入事件
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 表單送出事件
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register', formData);
      // 成功後儲存 token 並導向首頁
      localStorage.setItem('auth_token', response.data.token);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('註冊失敗');
    }
  };

  return (
    <div>
      <h1>使用者註冊</h1>
      {error && <p>{error}</p>}
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