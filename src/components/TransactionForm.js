// 引入 React 以及相關 Hook
import React, { useState, useEffect } from 'react';
// 引入自定義的 api 實例（例如：使用 axios 建立的 API 客戶端）
import api from '../api';
// 引入 useNavigate 用於路由導航（react-router-dom 提供的 Hook）
import { useNavigate } from 'react-router-dom';

// TransactionForm 組件，接收一個 transaction prop，預設為 null
// 當 transaction 不為 null 時，表示此表單為編輯模式，否則為新增模式
const TransactionForm = ({ transaction = null }) => {
  // 建立 useNavigate 的實例，用於操作導航，例如提交表單後跳轉路由
  const navigate = useNavigate();

  // 使用 useState 建立表單資料的 state
  // 初始化表單欄位：日期 (date)、金額 (amount)、類型 (type)、描述 (description)
  const [formData, setFormData] = useState({
    date: '',
    amount: '',
    type: 'expense',  // 預設類型為支出
    description: '',
  });

  // 用來存放錯誤訊息的 state，預設為 null
  const [error, setError] = useState(null);

  // useEffect 用於組件掛載後或 transaction prop 改變時執行
  // 如果 transaction 不為 null，則將現有交易資料填入表單
  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,               // 將原有的日期帶入表單
        amount: transaction.amount,           // 將原有的金額帶入表單
        type: transaction.type,               // 將原有的交易類型帶入表單
        description: transaction.description || '',  // 將描述帶入，如無則預設為空字串
      });
    }
  }, [transaction]);  // 當 transaction 變化時，重新執行 effect

  // 處理表單中各個輸入欄位變更時的事件
  // 根據輸入欄位的 name 更新對應的 formData 屬性
  const handleChange = (e) => {
    const { name, value } = e.target; // 取得觸發事件的元素的 name 和 value
    setFormData(prev => ({ ...prev, [name]: value }));  // 更新表單資料 state
  };

  // 處理表單提交事件
  const handleSubmit = async (e) => {
    // 防止表單預設的提交行為（例如頁面重整）
    e.preventDefault();

    try {
      if (transaction) {
        // 編輯模式：使用 PUT 方法更新現有交易
        // API 路徑中包含交易的 id
        await api.put(`/transactions/${transaction.id}`, formData);
      } else {
        // 新增模式：使用 POST 方法新增一筆交易
        await api.post('/transactions', formData);
      }
      // 操作成功後，使用 navigate 跳轉到交易列表頁面
      navigate('/transactions');
    } catch (err) {
      // 若發生錯誤，將錯誤訊息存入 error state 並輸出到 console
      console.error(err);
      setError('操作失敗，請檢查輸入');
    }
  };

  return (
    <div>
      {/* 根據是否為編輯模式，顯示不同的標題 */}
      <h1>{transaction ? '編輯交易' : '新增交易'}</h1>
      {/* 如果 error state 有內容，則顯示錯誤訊息 */}
      {error && <p>{error}</p>}
      {/* 表單元素，綁定 handleSubmit 作為提交事件處理 */}
      <form onSubmit={handleSubmit}>
        {/* 日期欄位 */}
        <div>
          <label>日期：</label>
          {/* type="date" 提供日期選擇器，綁定 formData.date，且 required 表示必填 */}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        {/* 金額欄位 */}
        <div>
          <label>金額：</label>
          {/* type="number" 並設定 step 為 0.01，允許小數點數值 */}
          <input
            type="number"
            step="0.01"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        {/* 類型選擇欄位 */}
        <div>
          <label>類型：</label>
          {/* select 元素提供下拉選單，綁定 formData.type */}
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            {/* 下拉選單的選項：收入和支出 */}
            <option value="income">收入</option>
            <option value="expense">支出</option>
          </select>
        </div>
        {/* 描述欄位 */}
        <div>
          <label>描述：</label>
          {/* type="text" 輸入框，綁定 formData.description */}
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        {/* 根據編輯或新增模式，按鈕文字分別顯示「更新」或「新增」 */}
        <button type="submit">{transaction ? '更新' : '新增'}</button>
      </form>
    </div>
  );
};

// 將 TransactionForm 組件匯出，供其他檔案引入使用
export default TransactionForm;
