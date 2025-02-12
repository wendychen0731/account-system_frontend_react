// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import TransactionForm from './components/TransactionForm';
import Modal from './components/Modal';
import Login from './pages/login';
import Register from './pages/register';
import LogoutButton from './components/logoutButton';
import DailyChartPage from './pages/DailyChartPage'; // 新增每日統計頁面的 import

const Home = () => (
  <div>
    <h1>歡迎使用記帳系統</h1>
    <p>這是首頁內容</p>
  </div>
);

function App() {
  // 控制 Modal 顯示的 state
  const [showModal, setShowModal] = useState(false);
  // 透過 refreshTrigger 來通知 TransactionsList 重新取得資料
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    // 在關閉 Modal 時觸發 refreshTrigger 改變，進而重新取得交易資料
    setRefreshTrigger((prev) => !prev);
  };

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">首頁</Link></li>
            <li><Link to="/dashboard">統計數據</Link></li>
            <li><Link to="/transactions">記帳紀錄</Link></li>
            <li><Link to="/daily-chart">每日統計</Link></li> {/* 新增每日統計連結 */}
            <li><Link to="/login">登入</Link></li>
            <li><Link to="/register">註冊</Link></li>
            <li><LogoutButton /></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsList refreshTrigger={refreshTrigger} />} />
          <Route path="/daily-chart" element={<DailyChartPage />} /> {/* 新增每日統計頁面路由 */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>

        {showModal && (
          <Modal onClose={closeModal}>
            {/* 將 closeModal 傳入 TransactionForm，操作成功後會關閉 Modal，同時刷新列表 */}
            <TransactionForm onClose={closeModal} />
          </Modal>
        )}
      </div>
    </Router>
  );
}

export default App;
