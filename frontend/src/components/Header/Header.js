import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import logo from './logo.png';
import { CiLogin } from "react-icons/ci";
import Modal from '../Modal';
import AuthForm from './AuthForm/AuthForm';
import api from '../axiosConfig';

function Header() {
  const [modalActive, setModalActive] = useState(false);
  const [formType, setFormType] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const formRef = useRef();

  const handleModalClose = () => {
    if (formRef.current) {
      formRef.current.clearForm();
    }
  };

  const handleLogin = () => {
    setModalActive(true);
    setFormType('login');
  };

  const handleLogout = async () => {
    try {
      const response = await api.post('/logout');
      console.log(response.data.message);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await api.get('/profile');
        console.log(response.data.message);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    }

    checkLoginStatus();
  }, []);

  return (
    <div className="header">
      <div className='block-with-logo'>
        <img className="logo" src={logo} alt="company-logo"></img>
        <p>Weather Insights</p>
      </div>
      {isLoggedIn ? (
        <button
          className="login-button"
          onClick={handleLogout}>
          <CiLogin className="icon-button-login" />
          Log out
        </button>
      ) : (
        <button
          className={`login-button ${!modalActive ? 'blue' : ''}`}
          onClick={handleLogin}>
          <CiLogin className={`icon-button-login ${!modalActive ? 'white' : ''}`} />
          Log in
        </button>
      )}

      <Modal active={modalActive} setActive={setModalActive} onClose={handleModalClose}>
        <AuthForm
          ref={formRef}
          type={formType}
          setActive={setModalActive}
          setFormType={setFormType}
          onLoginSuccess={() => setIsLoggedIn(true)}
        />
      </Modal>

    </div>
  );
}

export default Header;