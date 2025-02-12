// src/pages/DailyChartPage.js
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../api'; // 引入事先設定好的 axios 實例，用於 API 請求

// 引入 Chart.js 需要的元件（Chart.js v3 以上需要先註冊相關元件）
import {
  Chart as ChartJS,
  CategoryScale,   // x 軸的分類尺度
  LinearScale,     // y 軸的線性尺度
  PointElement,    // 圖表中的單一點元素
  LineElement,     // 用於繪製線條
  Title,           // 圖表標題元件
  Tooltip,         // 提示工具元件
  Legend           // 圖例元件
} from 'chart.js';

// 註冊 Chart.js 的元件，這樣 Chart.js 才能正常使用這些功能
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
  // 定義一個函式來取得當前月份，格式為 "YYYY-MM"
  const getCurrentMonth = () => {
    const now = new Date();
    // 將目前日期轉成 ISO 字串後取前 7 個字元，即 "YYYY-MM"
    return now.toISOString().slice(0, 7);
  };

  // React 狀態：目前所選的月份，初始值設定為當前月份
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonth());
  // 狀態用於儲存從 API 取得的圖表資料
  const [chartData, setChartData] = useState(null);
  // 狀態用於表示目前是否正在載入資料
  const [loading, setLoading] = useState(false);
  // 狀態用於儲存錯誤訊息（若 API 請求失敗）
  const [error, setError] = useState(null);

  // 定義一個非同步函式來向後端 API 請求每日統計資料
  const fetchDailySummary = async () => {
    setLoading(true); // 請求開始前，設置 loading 為 true
    setError(null);   // 清除之前的錯誤訊息
    try {
      // 向後端 API 請求每日統計資料，傳入所選月份作為 query 參數
      const response = await api.get(`/statistics/daily-summary?month=${selectedMonth}`);
      const data = response.data; // 從回傳結果中取得資料
      // 假設 API 回傳的資料格式為：[{ day, total_income, total_expense, net }, ...]
      
      // 依據回傳的資料取出 x 軸標籤（日期）
      const labels = data.map(item => item.day);
      // 取出「收入」資料陣列
      const incomeData = data.map(item => item.total_income);
      // 取出「支出」資料陣列
      const expenseData = data.map(item => item.total_expense);
      // 取出「淨額」資料陣列（收入 - 支出）
      const netData = data.map(item => item.net);

      // 設定 Chart.js 所需的資料格式
      setChartData({
        labels: labels, // 設定 x 軸標籤
        datasets: [
          {
            label: '收入',         // 資料集標籤
            data: incomeData,       // 對應的數值陣列
            fill: false,            // 線條下方不填充顏色
            borderColor: 'green',   // 線條顏色設定為綠色
            tension: 0.1            // 線條曲率（0 表示直線）
          },
          {
            label: '支出',
            data: expenseData,
            fill: false,
            borderColor: 'red',     // 線條顏色設定為紅色
            tension: 0.1
          },
          {
            label: '淨額',
            data: netData,
            fill: false,
            borderColor: 'blue',    // 線條顏色設定為藍色
            tension: 0.1
          }
        ]
      });
    } catch (err) {
      // 若請求失敗，印出錯誤訊息並設置 error 狀態
      console.error(err);
      setError('取得資料錯誤'); // 中文說明：取得資料失敗
    } finally {
      // 請求結束後，不論成功或失敗，都將 loading 設為 false
      setLoading(false);
    }
  };

  // 使用 useEffect 當 selectedMonth 狀態改變時呼叫 fetchDailySummary() 重新取得資料
  useEffect(() => {
    fetchDailySummary();
  }, [selectedMonth]);

  // Chart.js 的選項設定，用於自訂圖表外觀與互動行為
  const options = {
    responsive: true, // 圖表會隨著容器大小自動調整
    interaction: {
      mode: 'index',    // 當滑鼠移動時，根據 x 軸的 index 顯示 tooltip
      intersect: false  // 即使滑鼠沒有直接位於數據點上也顯示 tooltip
    },
    plugins: {
      tooltip: {
        // 自訂 tooltip 顯示內容的回呼函式
        callbacks: {
          label: (context) => {
            // context.dataset.label 為資料集的名稱，例如 "淨額"
            // context.label 為 x 軸的標籤（日期）
            // context.parsed.y 為對應的 y 軸數值
            const label = context.dataset.label || '';
            const date = context.label;
            const value = context.parsed.y;
            // 組合 tooltip 顯示字串，例如 "2025-02-15 - 淨額: $123.45"
            return `${date} - ${label}: $${value}`;
          }
        }
      },
      title: {
        display: true,              // 顯示圖表標題
        text: '每日收支統計圖表'      // 圖表標題內容
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '日期'  // x 軸標題
        }
      },
      y: {
        title: {
          display: true,
          text: '金額'  // y 軸標題
        }
      }
    }
  };

  // JSX 部分：渲染整個頁面內容
  return (
    <div style={{ padding: '20px' }}>
      {/* 頁面標題 */}
      <h2>每日收支統計圖表</h2>
      
      {/* 日期（月份）選擇器 */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          選擇月份:{' '}
          <input
            type="month" // HTML5 的月份選擇輸入框
            value={selectedMonth} // 綁定目前所選的月份
            onChange={(e) => setSelectedMonth(e.target.value)} // 當使用者更改時更新狀態
          />
        </label>
      </div>

      {/* 根據不同狀態顯示對應內容 */}
      {loading ? (
        <p>載入中...</p> // 若正在載入，顯示「載入中...」
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p> // 若有錯誤，顯示錯誤訊息（紅色文字）
      ) : chartData ? (
        // 若有資料，顯示圖表；Line 組件接收 data 與 options 參數
        <Line data={chartData} options={options} />
      ) : (
        <p>無資料</p> // 若資料為空，顯示「無資料」
      )}
    </div>
  );
};

export default DailyChartPage;
