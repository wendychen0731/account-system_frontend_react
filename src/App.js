// src/App.jsx
import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Dashboard        from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import DailyChartPage   from './pages/DailyChartPage';
import LogoutButton     from './components/LogoutButton';
import AuthPage         from './pages/AuthPage';
import RequireAuth      from './components/RequireAuth';
import Settings         from './pages/Settings';

import { getToken } from './api';
import styles from './App.module.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const handleRefresh = () => setRefreshTrigger((prev) => !prev);

  return (
    <Router>
      <div className={styles.container}>
        {isAuthenticated && (
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navItem}><Link to="/dashboard" className={styles.navLink}>統計數據</Link></li>
              <li className={styles.navItem}><Link to="/transactions" className={styles.navLink}>記帳紀錄</Link></li>
              <li className={styles.navItem}><Link to="/daily-chart" className={styles.navLink}>每日統計</Link></li>
              <li className={styles.navItem}><Link to="/settings" className={styles.navLink}>個人設定</Link></li>
              <li className={styles.navItem}><LogoutButton onLogout={handleLogout} className={styles.navLink} /></li>
            </ul>
          </nav>
        )}

        <main className={styles.main}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated
                  ? <Navigate to="/dashboard" replace />
                  : <AuthPage onLoginSuccess={handleLoginSuccess} />
              }
            />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/transactions"
                element={<TransactionsList refreshTrigger={refreshTrigger} onCloseModal={handleRefresh} />}
              />
              <Route path="/daily-chart" element={<DailyChartPage />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
