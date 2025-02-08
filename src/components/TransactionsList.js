// src/components/TransactionsList.js
import React, { useEffect, useState } from 'react';
import api from '../api';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get('/transactions');
        setTransactions(response.data);
      } catch (err) {
        console.error(err);
        setError('無法取得記錄');
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>記帳紀錄</h1>
      {error && <p>{error}</p>}
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