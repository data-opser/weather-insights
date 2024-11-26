import React from 'react';
import '../styles/Modal.css';

function Modal({ active, setActive, onClose, children }) {
  const handleBackgroundClick = () => {
    if (onClose) onClose();
    setActive(false);
  };

  return (
    <div className={active ? 'modal active' : 'modal'} onClick={handleBackgroundClick}>
      <div className={active ? 'modal-content active' : 'modal-content'} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

export default Modal;