import React, { useState } from 'react';
import '../styles/Header.css';
import logo from '../images/logo.png';
import { CiLogin } from "react-icons/ci";
import Modal from './Modal';
import Form from './Form';

function Header() {
  const [modalActive, setModalActive] = useState(false);

  const handleLoginClick = () => {
    setModalActive(true);
  };

  return (
    <div className="header">
      <div className='block-with-logo'>
        <img className="logo" src={logo} alt="company-logo"></img>
        <p>Weather Insights</p>
      </div>   
      <button 
        className={`login-button ${modalActive ? 'blue' : ''}`}
        onClick={handleLoginClick}
      >
        <CiLogin className={`icon-button-login ${modalActive ? 'white' : ''}`}/>
        Log in
      </button>
      <Modal active={modalActive} setActive={setModalActive}>
        <Form type='login' setActive={setModalActive} />
      </Modal>
    </div>
  );
}

export default Header;