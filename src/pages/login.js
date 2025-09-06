// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setToken, getToken, TOKEN_KEY } from '../api';
import styles from './Login.module.css';

export default function Login({ onSuccess }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [debugToken, setDebugToken] = useState(getToken() || '');

  useEffect(() => {
    setDebugToken(getToken() || '');
  }, []);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // 與後端 SecurityConfig 對齊：/api/auth/login
      const { data } = await api.post('/auth/login', formData);
      if (!data?.token) throw new Error('後端未回 token：' + JSON.stringify(data));

      setToken(data.token);                           // ✅ 統一寫入
      const readBack = getToken();                    // ✅ 立刻讀回驗證
      console.debug('[Login] saved token prefix:', readBack?.slice(0, 20));

      setDebugToken(readBack || '');
      onSuccess?.(data.token);
      navigate('/transactions');
    } catch (err) {
      console.error('Login error', err.response ?? err);
      setError(err.response?.data?.message || err.message || '登入失敗，請檢查帳號密碼');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>使用者登入</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div style={{ fontSize: 12, color: '#666', marginBottom: 8 }}>
        <div>localStorage[{TOKEN_KEY}]：{debugToken ? `${debugToken.slice(0, 14)}…` : '(空)'}</div>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className={styles.input} />
        <input name="password" type="password" placeholder="密碼" value={formData.password} onChange={handleChange} required className={styles.input} />
        <button type="submit" className={styles.button}>登入</button>
      </form>
    </div>
  );
}
