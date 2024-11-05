import React, { useState } from 'react';
import '../styles/Header.css';
import logo from '../images/logo.png';
import { CiLogin } from "react-icons/ci";
import Modal from './Modal';
import Form from './Form';

function Header() {
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const [modalActive, setModalActive] = useState(false);

  const handleLoginClick = () => {
    setIsLoginClicked(!isLoginClicked);
    setModalActive(true);
  };

  return (
    <div className="header">
      <div className='block-with-logo'>
        <img className="logo" src={logo} alt="company-logo"></img>
        <p>Weather Insights</p>
      </div>   
      <button 
        className={`login-button ${isLoginClicked ? 'blue' : ''}`} 
        onClick={handleLoginClick}
      >
        <CiLogin className={`icon-button-login ${isLoginClicked ? 'white' : ''}`}/>
        Log in
      </button>
      <Modal active={modalActive} setActive={setModalActive}>
        <Form type='login' setActive={setModalActive} />
      </Modal>
    </div>
  );
}

export default Header;