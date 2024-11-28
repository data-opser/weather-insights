import { useState, useRef } from 'react';
import { useAuth } from '../authContext';
import { Link, useLocation } from "react-router-dom";
import './Header.css';
import logo from './AuthForm/form-weather-icon.png';
import { CiLogin } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import Modal from '../Modal';
import AuthForm from './AuthForm/AuthForm';
import api from '../axiosConfig';

function Header() {
  const [modalActive, setModalActive] = useState(false);
  const [formType, setFormType] = useState('login');
  const { isLoggedIn, login, logout } = useAuth();
  const location = useLocation();

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
      logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="header">
      <Link to={'/'} className='block-with-logo'>
        <img className="logo" src={logo} alt="company-logo"></img>
        <p>Weather Insights</p>
      </Link>
      {isLoggedIn ? (
        location.pathname === '/profile' ? (
          <button
            className="login-button"
            onClick={handleLogout}>
            <CiLogin className="icon-button-login" />
            Log out
          </button>
        ) : (
          <Link to="/profile" className="profile-link">
            <button
              className="login-button">
              <CgProfile className="icon-button-login" />
              Profile
            </button>
          </Link>
        )
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
          onLoginSuccess={login}
        />
      </Modal>

    </div>
  );
}

export default Header;