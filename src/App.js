// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// 引入頁面元件
import Register from './pages/register';
import Login from './pages/login';
import LogoutButton from './components/logoutButton';

// 引入記帳相關元件
import Dashboard from './components/Dashboard';
import TransactionsList from './components/TransactionsList';
import TransactionForm from './components/TransactionForm';

// 如果你還沒有 Home 頁面，可以先定義一個簡單的首頁元件
const Home = () => {
  return (
    <div>
      <h1>歡迎使用記帳系統</h1>
      <p>這是首頁內容</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div>
        {/* 導覽列 */}
        <nav>
          <ul>
            <li>
              <Link to="/">首頁</Link>
            </li>
            <li>
              <Link to="/dashboard">統計數據</Link>
            </li>
            <li>
              <Link to="/transactions">記帳紀錄</Link>
            </li>
            <li>
              <Link to="/transactions/new">新增交易</Link>
            </li>
            <li>
              <Link to="/login">登入</Link>
            </li>
            <li>
              <Link to="/register">註冊</Link>
            </li>
            <li>
              {/* LogoutButton 可直接嵌入導覽列 */}
              <LogoutButton />
            </li>
          </ul>
        </nav>

        {/* 路由設定 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<TransactionsList />} />
          <Route path="/transactions/new" element={<TransactionForm />} />
          {/* 如有需要編輯功能，可考慮加入如下路由，並在 TransactionForm 根據 URL 參數處理編輯邏輯 */}
          {/* <Route path="/transactions/edit/:id" element={<TransactionForm />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
