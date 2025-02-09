import React, { useEffect, useState } from 'react';
import api from '../api';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  // 預設 selectedMonth 為空，代表顯示全部記錄
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        let response;
        // 若有選擇月份則呼叫 filter 端點，否則顯示全部記錄
        if (selectedMonth) {
          response = await api.get('/transactions/filter', {
            params: { month: selectedMonth }
          });
        } else {
          response = await api.get('/transactions');
        }
        setTransactions(response.data);
      } catch (err) {
        console.error(err);
        setError('無法取得記錄');
      }
    };

    fetchTransactions();
  }, [selectedMonth]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // 點擊按鈕可清除月份篩選，顯示全部記錄
  const handleShowAll = () => {
    setSelectedMonth('');
  };

  return (
    <div>
      <h1>記帳紀錄</h1>
      <div>
        <label htmlFor="month-picker">選擇月份：</label>
        <input
          id="month-picker"
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
        />
        <button onClick={handleShowAll}>顯示全部</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {transactions.map((tx) => (
          <li key={tx.id}>
            日期: {tx.date}｜金額: {tx.amount}｜類型: {tx.type}｜描述: {tx.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionsList;
