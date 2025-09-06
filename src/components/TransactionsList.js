// src/components/TransactionsList.jsx
import React, { useEffect, useState, useCallback } from 'react';
import api from '../api';
import Modal from './Modal';
import TransactionForm from './TransactionForm';
import styles from './TransactionsList.module.css';

/**
 * 抽出清單：因為後端可能回傳 []、{ data: [] }、{ content: [] }、{ items: [] }
 */
function pickList(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;       // Laravel 常見
  if (payload && Array.isArray(payload.content)) return payload.content; // Spring Page
  if (payload && Array.isArray(payload.items)) return payload.items;
  return [];
}

/**
 * TransactionsList 元件
 * 功能：
 *  - 顯示所有或依月份篩選的交易記錄
 *  - 新增、編輯、刪除交易
 *  - 顯示交易總計
 */
const TransactionsList = () => {
  // 狀態：交易陣列、錯誤訊息
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  // 狀態：選擇的月份（空字串代表不篩選）
  const [selectedMonth, setSelectedMonth] = useState('');

  // 編輯狀態：目前編輯的交易 id 與表單資料（含 category，避免更新時遺失）
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    date: '',
    amount: '',
    type: 'income',
    category: '',         // ← 保留類別值（本列表不改它）
    description: '',
  });

  // 控制 "新增交易" Modal 顯示
  const [showAddModal, setShowAddModal] = useState(false);

  /**
   * fetchTransactions：
   *  - 如果選擇月份，呼叫 /transactions/filter?month=
   *  - 否則呼叫 /transactions
   *  - 回傳格式做通用解析，確保 setTransactions 接到的是陣列
   */
  const fetchTransactions = useCallback(async () => {
    try {
      const res = selectedMonth
        ? await api.get('/transactions/filter', { params: { month: selectedMonth } })
        : await api.get('/transactions');

      const list = pickList(res.data);
      setTransactions(Array.isArray(list) ? list : []);
      setError(null);
    } catch (e) {
      console.error(e);
      setError('無法取得記錄');
      setTransactions([]); // 保險：後續 map/filter 不會炸
    }
  }, [selectedMonth]);

  // 掛載與篩選改變時抓資料
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // 處理月份選擇
  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleShowAll = () => setSelectedMonth('');

  // 刪除交易
  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions(); // 刪除後重抓
    } catch (e) {
      console.error(e);
      setError('刪除記錄失敗');
    }
  };

  // 點擊編輯按鈕：設定編輯 id 並預填資料（包含 category）
  const handleEditClick = (tx) => {
    setEditingId(tx.id);
    setEditForm({
      date: tx.date,
      amount: tx.amount,
      type: tx.type,
      category: tx.category || '',
      description: tx.description || '',
    });
  };

  // 編輯表單欄位變更
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // 取消編輯
  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({ date: '', amount: '', type: 'income', category: '', description: '' });
  };

  // 儲存編輯後資料（不在此改 category，保持原值送回後端）
  const handleEditSave = async (id) => {
    try {
      await api.put(`/transactions/${id}`, editForm);
      setEditingId(null);
      fetchTransactions(); // 更新後重抓
    } catch (e) {
      console.error(e);
      setError('更新記錄失敗');
    }
  };

  // 保險：確保一定是陣列
  const list = Array.isArray(transactions) ? transactions : [];

  /**
   * 計算總額：
   *  - totalIncome: 所有收入
   *  - totalExpense: 所有支出
   *  - totalAmount: 收入 + 支出
   *  - netAmount: 收入 - 支出
   */
  const asNumber = (v) => Number(v ?? 0);
  const totalIncome = list
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + asNumber(t.amount), 0);
  const totalExpense = list
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + asNumber(t.amount), 0);
  const totalAmount = totalIncome + totalExpense;
  const netAmount = totalIncome - totalExpense;

  // 控制新增 Modal
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => {
    setShowAddModal(false);
    fetchTransactions(); // 新增後重抓
  };

  return (
    <div className={styles.container}>
      {/* 標題與新增按鈕 */}
      <div className={styles.header}>
        <h1>記帳紀錄</h1>
        <button className={styles.addBtn} onClick={openAddModal}>
          新增交易
        </button>
      </div>

      {/* 篩選月份 */}
      <div className={styles.filter}>
        <label htmlFor="month-picker">選擇月份：</label>
        <input id="month-picker" type="month" value={selectedMonth} onChange={handleMonthChange} />
        <button onClick={handleShowAll}>顯示全部</button>
      </div>

      {/* 顯示錯誤訊息 */}
      {error && <p className={styles.error}>{error}</p>}

      {/* 交易清單表格 */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>日期</th>
              <th>金額</th>
              <th>類型</th>
              <th>類別</th>
              <th>描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {list.map((tx) => (
              <tr key={tx.id}>
                {/* 編輯模式 */}
                {editingId === tx.id ? (
                  <>
                    <td>
                      <input type="date" name="date" value={editForm.date} onChange={handleEditChange} />
                    </td>
                    <td>
                      <input type="number" name="amount" value={editForm.amount} onChange={handleEditChange} />
                    </td>
                    <td>
                      <select name="type" value={editForm.type} onChange={handleEditChange}>
                        <option value="income">收入</option>
                        <option value="expense">支出</option>
                      </select>
                    </td>
                    <td>{tx.category || '-'}</td>
                    <td>
                      <input
                        type="text"
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                      />
                    </td>
                    <td>
                      <button
                        className={`${styles.actionBtn} ${styles.saveBtn}`}
                        onClick={() => handleEditSave(tx.id)}
                      >
                        儲存
                      </button>
                      <button className={`${styles.actionBtn} ${styles.cancelBtn}`} onClick={handleEditCancel}>
                        取消
                      </button>
                    </td>
                  </>
                ) : (
                  /* 顯示模式 */
                  <>
                    <td>{tx.date}</td>
                    <td>{tx.amount}</td>
                    <td>{tx.type === 'income' ? '收入' : '支出'}</td>
                    <td>{tx.category || '-'}</td>
                    <td>{tx.description}</td>
                    <td>
                      <button className={styles.actionBtn} onClick={() => handleEditClick(tx)}>
                        編輯
                      </button>
                      <button className={styles.actionBtn} onClick={() => handleDelete(tx.id)}>
                        刪除
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6">
                總金額: {totalAmount} ｜ 總收入: {totalIncome} ｜ 總支出: {totalExpense} ｜ 淨額: {netAmount}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 新增交易 Modal */}
      {showAddModal && (
        <Modal onClose={closeAddModal}>
          <TransactionForm onClose={closeAddModal} />
        </Modal>
      )}
    </div>
  );
};

export default TransactionsList;
