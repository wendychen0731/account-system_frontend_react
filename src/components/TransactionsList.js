// src/components/TransactionsList.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import Modal from './Modal';
import TransactionForm from './TransactionForm';

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  // 篩選月份
  const [selectedMonth, setSelectedMonth] = useState('');
  // 追蹤編輯中的記錄 id，若為 null 則表示非編輯模式
  const [editingId, setEditingId] = useState(null);
  // 編輯用的表單資料
  const [editForm, setEditForm] = useState({
    date: '',
    amount: '',
    type: 'income',
    description: ''
  });
  // 控制新增交易彈窗顯示的 state
  const [showAddModal, setShowAddModal] = useState(false);

  // 取得交易資料
  const fetchTransactions = async () => {
    try {
      let response;
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

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth]);

  // 當月份變更時
  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  // 顯示全部記錄
  const handleShowAll = () => {
    setSelectedMonth('');
  };

  // 刪除交易
  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError('刪除記錄失敗');
    }
  };

  // 進入編輯模式，並將該筆交易資料填入編輯表單
  const handleEditClick = (transaction) => {
    setEditingId(transaction.id);
    setEditForm({
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description || ''
    });
  };

  // 編輯表單資料變更
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // 取消編輯模式
  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({
      date: '',
      amount: '',
      type: 'income',
      description: ''
    });
  };

  // 儲存編輯更新
  const handleEditSave = async (id) => {
    try {
      await api.put(`/transactions/${id}`, editForm);
      setEditingId(null);
      fetchTransactions();
    } catch (err) {
      console.error(err);
      setError('更新記錄失敗');
    }
  };

  // 計算統計資料（此處假設 amount 為正值）
  const totalIncome = transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpense = transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalAmount = totalIncome + totalExpense;
  const netAmount = totalIncome - totalExpense;

  // 開啟新增交易彈窗
  const openAddModal = () => setShowAddModal(true);
  // 關閉新增交易彈窗並刷新列表資料
  const closeAddModal = () => {
    setShowAddModal(false);
    fetchTransactions();
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

      {/* 將「新增交易」按鈕放在列表內 */}
      <div style={{ marginTop: '1rem' }}>
        <button onClick={openAddModal}>新增交易</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* 用表格顯示交易資料 */}
      <table border="1" cellPadding="8" cellSpacing="0" style={{ marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>日期</th>
            <th>金額</th>
            <th>類型</th>
            <th>描述</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx.id}>
              {editingId === tx.id ? (
                <>
                  <td>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      name="amount"
                      value={editForm.amount}
                      onChange={handleEditChange}
                    />
                  </td>
                  <td>
                    <select
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                    >
                      <option value="income">收入</option>
                      <option value="expense">支出</option>
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      name="description"
                      value={editForm.description}
                      onChange={handleEditChange}
                      placeholder="描述"
                    />
                  </td>
                  <td>
                    <button onClick={() => handleEditSave(tx.id)}>儲存</button>
                    <button onClick={handleEditCancel}>取消</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{tx.date}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.type === 'income' ? '收入' : '支出'}</td>
                  <td>{tx.description}</td>
                  <td>
                    <button onClick={() => handleEditClick(tx)}>編輯</button>
                    <button onClick={() => handleDelete(tx.id)}>刪除</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="5" style={{ textAlign: 'center', fontWeight: 'bold' }}>
              總金額: {totalAmount} ｜ 總收入: {totalIncome} ｜ 總支出: {totalExpense} ｜ 淨額: {netAmount}
            </td>
          </tr>
        </tfoot>
      </table>

      {/* 新增交易的 Modal */}
      {showAddModal && (
        <Modal onClose={closeAddModal}>
          {/* 傳入 closeAddModal 作為 onClose，新增成功後會自動刷新列表 */}
          <TransactionForm onClose={closeAddModal} />
        </Modal>
      )}
    </div>
  );
};

export default TransactionsList;
