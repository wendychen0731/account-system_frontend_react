// Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ children, onClose }) => {
  return ReactDOM.createPortal(
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* 右上角的關閉按鈕 */}
        <button style={styles.closeButton} onClick={onClose}>×</button>
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    position: 'relative',
    width: '400px',
    maxWidth: '90%',
  },
  closeButton: {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    fontSize: '1.2rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Modal;
