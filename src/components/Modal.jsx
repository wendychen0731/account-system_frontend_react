// src/components/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Modal 元件
 * 功能：
 *  - 在畫面中央顯示一個浮層 (portal) 的對話框
 *  - 點擊背景遮罩或右上角按鈕可關閉對話框
 * Props：
 *  - children: 顯示在 Modal 內的內容
 *  - onClose: 關閉時呼叫的回調函式
 */
const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    // Overlay 遮罩層，覆蓋整個視窗
    <div style={styles.overlay} onClick={onClose}>
      {/* Modal 本體，點擊內容區域時阻止冒泡，避免觸發 overlay 的 onClick */}
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* 右上角的關閉按鈕，點擊時呼叫 onClose */}
        <button
          style={styles.closeButton}
          onClick={onClose}
          aria-label="關閉"
        >
          ×
        </button>
        {/* 顯示傳入的子元件內容 */}
        {children}
      </div>
    </div>,
    // 指定掛載到 public/index.html 中 id 為 modal-root 的 DOM 元素上
    document.getElementById('modal-root')
  );
};

// 內聯樣式設定
const styles = {
  overlay: {
    position: 'fixed',        // 固定定位覆蓋全螢幕
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)', // 半透明黑色背景
    display: 'flex',
    alignItems: 'center',     // 垂直置中
    justifyContent: 'center', // 水平置中
    zIndex: 1000,             // 確保在最上層
  },
  modal: {
    backgroundColor: '#fff',  // 白色背景
    padding: '1rem',          // 內邊距
    borderRadius: '8px',      // 圓角
    position: 'relative',     // 相對定位，以放置關閉按鈕
    width: '400px',
    maxWidth: '90%',          // 在小螢幕時自動縮放
  },
  closeButton: {
    position: 'absolute',     // 絕對定位放在 modal 右上
    top: '0.5rem',
    right: '0.5rem',
    fontSize: '1.2rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',         // 游標顯示為可點擊
  },
};

export default Modal;