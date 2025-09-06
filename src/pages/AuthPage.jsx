// AuthPage.jsx（修正版：login 不帶 name；register 送 email+password；name 只在註冊時必填）
import React, { useState } from 'react';
import styles from './AuthPage.module.css';
import { login, register } from '../services/auth';

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      if (mode === 'login') {
        await login(email, password);          // ✅ 修正：login(email, password)
      } else {
        await register(name, email, password);       // ✅ 若後端只收 email/password，就這樣
        // 若你已改後端要求 name，請改成：await register(name, email, password)
      }
      onLoginSuccess?.();
    } catch (error) {
      const s = error?.response?.status;
      if (mode === 'login') {
        setErr(s === 401 ? '帳號或密碼錯誤' : '登入失敗，請稍後再試');
      } else {
        if (s === 409) setErr('Email 已存在');
        else if (s === 400) {
          const apiMsg = error?.response?.data?.errors?.[0]?.defaultMessage;
          setErr(apiMsg || '格式不符（Email 需有效、密碼 8~64 字）'); // ✅ 對齊後端
        } else setErr('註冊失敗，請稍後再試');
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.sidePanel} ${styles.panelLeft} ${mode === 'register' ? styles.hidden : ''}`}>
        <h2 className={styles.title}>還沒有帳號嗎?</h2>
        <p className={styles.desc}>請點擊下方按鈕前往註冊!</p>
        <button className={styles.sideBtn} onClick={() => setMode('register')}>SIGN UP</button>
      </div>

      <div className={`${styles.sidePanel} ${styles.panelRight} ${mode === 'login' ? styles.hidden : ''}`}>
        <h2 className={styles.title}>已經申請過帳號了嗎?</h2>
        <p className={styles.desc}>點擊下方按鈕前往登入!</p>
        <button className={styles.sideBtn} onClick={() => setMode('login')}>SIGN IN</button>
      </div>

      <div className={`${styles.card} ${mode === 'register' ? styles.toLeft : ''}`}>
        <form onSubmit={onSubmit} className={styles.form}>
          <h3 className={styles.formTitle}>{mode === 'login' ? '登入' : '註冊'}</h3>

          {mode === 'register' && (               /* ✅ 名稱只在註冊時顯示且必填 */
            <label>
              名稱
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                minLength={2}
                maxLength={50}
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </label>

          <label>
            密碼
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              minLength={8}         /* ✅ 對齊後端 8~64 */
              maxLength={64}
              required
            />
          </label>

          {err && <div className={styles.error}>{err}</div>}

          <button type="submit" className={styles.primaryBtn}>
            {mode === 'login' ? '登入' : '註冊'}
          </button>
        </form>
      </div>
    </div>
  );
}
