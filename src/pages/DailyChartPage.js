// src/pages/DailyChartPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../api';
import './DailyChartPage.css';

// 引入 Chart.js 的核心與所需模組
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// 註冊所需的 Chart.js 元件，以便在 React 中使用
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DailyChartPage = () => {
  // 取得當前月份，格式為 YYYY-MM
  const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

  // 狀態：選擇的月份、圖表資料、載入中、錯誤訊息
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 使用 useCallback 包裝資料抓取函式
   * 加上 selectedMonth 作為依賴，以便在月份改變時重新建立函式
   */
  const fetchDailySummary = useCallback(async () => {
    setLoading(true);      // 開始載入
    setError(null);        // 重置錯誤
    try {
      // 向後端 API 發送 GET 請求，帶入選擇的月份參數
      const response = await api.get(
        `/statistics/daily-summary?month=${selectedMonth}`
      );
      const data = response.data;
      // 將後端回傳的陣列拆解為圖表所需的標籤與數據陣列
      const labels      = data.map(item => item.day);
      const incomeData  = data.map(item => item.total_income);
      const expenseData = data.map(item => item.total_expense);
      const netData     = data.map(item => item.net);

      // 組成 Chart.js 所需的資料物件
      setChartData({
        labels,
        datasets: [
          {
            label: '收入',
            data: incomeData,
            fill: false,
            borderColor: 'green',
            tension: 0.1
          },
          {
            label: '支出',
            data: expenseData,
            fill: false,
            borderColor: 'red',
            tension: 0.1
          },
          {
            label: '淨額',
            data: netData,
            fill: false,
            borderColor: 'blue',
            tension: 0.1
          }
        ]
      });
    } catch (err) {
      console.error(err);
      setError('取得資料錯誤'); // 設定錯誤訊息
    } finally {
      setLoading(false);    // 結束載入
    }
  }, [selectedMonth]);

  // 使用 useEffect 在元件掛載與 fetchDailySummary 變動時呼叫資料抓取
  useEffect(() => {
    fetchDailySummary();
  }, [fetchDailySummary]);

  // Chart.js 圖表選項設定
  const options = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      tooltip: {
        callbacks: {
          // 自訂提示框文字格式
          label: context =>
            `${context.label} - ${context.dataset.label}: $${context.parsed.y}`
        }
      },
      title: { display: true, text: '每日收支統計圖表' }
    },
    scales: {
      x: { title: { display: true, text: '日期' } },
      y: { title: { display: true, text: '金額' } }
    }
  };

  return (
    <div className="chart-page">
      {/* 標題 */}
      <h2>每日收支統計圖表</h2>

      {/* 月份選擇控制項 */}
      <div className="controls">
        <label>
          選擇月份:{' '}
          <input
            type="month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(e.target.value)} // 更新選擇的月份
          />
        </label>
      </div>

      {/* 根據狀態顯示載入中、錯誤、圖表或無資料 */}
      {loading ? (
        <p className="loading">載入中...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : chartData ? (
        <div className="chart-container">
          {/* 使用 react-chartjs-2 的 Line 元件繪製折線圖 */}
          <Line data={chartData} options={options} />
        </div>
      ) : (
        <p className="no-data">無資料</p>
      )}
    </div>
  );
};

export default DailyChartPage;
