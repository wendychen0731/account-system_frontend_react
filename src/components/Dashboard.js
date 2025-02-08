// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import api from '../api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      // 取得目前年月，格式 "YYYY-MM"（例如 "2025-02"）
      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
      try {
        const response = await api.get(`/summary?month=${month}`);
        setSummary(response.data);
      } catch (err) {
        console.error(err);
        setError('無法取得統計數據');
      }
    };

    fetchSummary();
  }, []);

  return (
    <div>
      <h1>本月統計</h1>
      {error && <p>{error}</p>}
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