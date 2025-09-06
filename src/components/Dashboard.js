
// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api';

/**
 * Dashboard 元件
 * 功能：
 *  - 在元件掛載時抓取本月統計數據
 *  - 顯示收入、支出與淨額或錯誤訊息
 */
const Dashboard = () => {
  // 狀態：統計資料與錯誤訊息
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  /**
   * useEffect：只在元件第一次渲染時執行一次
   * fetchSummary：
   *  1. 計算目前年月，格式 "YYYY-MM"（例如 "2025-04"）
   *  2. 向後端 API 發送 GET 請求，取得本月統計
   *  3. 成功時更新 summary，失敗時設定 error
   */
  useEffect(() => {
    const fetchSummary = async () => {
      // 取得目前時間並組成 YYYY-MM 格式
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      try {
        // 發送請求取得統計數據
        const response = await api.get(`/transactions/summary?month=${month}`);
        setSummary(response.data);  // 更新統計狀態
      } catch (err) {
        console.error(err);
        setError('無法取得統計數據');  // 設定錯誤訊息
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      {/* 標題 */}
      <h1>本月統計</h1>

      {/* 顯示錯誤訊息（若有） */}
      {error && <p>{error}</p>}

      {/* 根據 summary 是否存在顯示統計或載入中 */}
      {summary ? (
        <div>
          <p>收入：{summary.total_income}</p>
          <p>支出：{summary.total_expense}</p>
          <p>淨額：{summary.net}</p>
        </div>
      ) : (
        <p>載入中...</p>
      )}
    </div>
  );
};

export default Dashboard;