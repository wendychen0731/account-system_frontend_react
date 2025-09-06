// src/pages/TransactionForm.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';
import './TransactionForm.css';

/** type 對應的 category 清單（值用後端的 slug；標籤給使用者看） */
const CATEGORY_OPTIONS = {
  expense: [
    { value: 'food',      label: '食' },
    { value: 'clothing',  label: '衣' },
    { value: 'housing',   label: '住' },
    { value: 'transport', label: '行' },
    { value: 'other',     label: '其他支出' },
  ],
  income: [
    { value: 'salary',     label: '薪資' },
    { value: 'investment', label: '投資收益' },
    { value: 'other',      label: '其他收入' },
  ],
};

const TransactionForm = ({ transaction = null, onClose }) => {
  // 預設 type=expense → 預設 category 取 expense 第一個
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    type: 'expense',
    category: CATEGORY_OPTIONS.expense[0].value, // ← 新增
    description: '',
  });
  const [error, setError] = useState(null);

  // 編輯時預填；若現有 category 不屬於該 type，改用該 type 的第一個選項
  useEffect(() => {
    if (transaction) {
      const tType = transaction.type || 'expense';
      const allowed = CATEGORY_OPTIONS[tType].map(o => o.value);
      const cat = allowed.includes(transaction.category)
        ? transaction.category
        : allowed[0];

      setFormData({
        date: transaction.date,
        amount: transaction.amount,
        type: tType,
        category: cat,               // ← 新增
        description: transaction.description || '',
      });
    }
  }, [transaction]);

  // 依 type 取得該型別的類別清單
  const currentCategoryOptions = CATEGORY_OPTIONS[formData.type];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 當 type 改變時，若原本的 category 不屬於新型別，重設為該型別第一個
    if (name === 'type') {
      const allowed = CATEGORY_OPTIONS[value].map(o => o.value);
      setFormData(prev => ({
        ...prev,
        type: value,
        category: allowed.includes(prev.category) ? prev.category : allowed[0],
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 最後防呆：保證 category 與 type 一致
      const allowed = CATEGORY_OPTIONS[formData.type].map(o => o.value);
      const payload = {
        ...formData,
        category: allowed.includes(formData.category) ? formData.category : allowed[0],
      };

      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, payload);
      } else {
        await api.post('/transactions', payload);
      }
      onClose?.();
    } catch (err) {
      console.error(err);
      setError('操作失敗，請檢查輸入');
    }
  };

  return (
    <div className="transaction-form">
      <h1>{transaction ? '編輯交易' : '新增交易'}</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="date">日期：</label>
          <input
            id="date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="amount">金額：</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="type">類型：</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
        </div>

        {/* 依照 type 顯示對應的 category 選項 */}
        <div className="field">
          <label htmlFor="category">類別：</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {currentCategoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="description">描述：</label>
          <input
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="button">
          {transaction ? '更新' : '新增'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
