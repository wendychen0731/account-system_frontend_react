// TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

const TransactionForm = ({ transaction = null, onClose }) => {
  // 初始化表單資料
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    type: 'expense',  // 預設為支出
    description: '',
  });
  const [error, setError] = useState(null);

  // 若為編輯模式，將傳入的交易資料填入表單
  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        amount: transaction.amount,
        type: transaction.type,
        description: transaction.description || '',
      });
    }
  }, [transaction]);

  // 處理輸入變更
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 表單提交處理
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (transaction) {
        // 編輯模式：更新交易
        await api.put(`/transactions/${transaction.id}`, formData);
      } else {
        // 新增模式：建立新交易
        await api.post('/transactions', formData);
      }
      // 操作成功後，若有提供 onClose，則呼叫關閉彈窗
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error(err);
      setError('操作失敗，請檢查輸入');
    }
  };

  return (
    <div>
      <h1>{transaction ? '編輯交易' : '新增交易'}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>日期：</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>金額：</label>
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>類型：</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
        </div>
        <div>
          <label>描述：</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{transaction ? '更新' : '新增'}</button>
      </form>
    </div>
  );
};

export default TransactionForm;
