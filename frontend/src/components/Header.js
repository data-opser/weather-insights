import React, { useState } from 'react';
import '../styles/Header.css';
import logo from '../images/logo.png';

function Header() {
  const [isLoginClicked, setIsLoginClicked] = useState(false);

  // Функція для зміни стану кнопки при натисканні
  const handleLoginClick = () => {
    setIsLoginClicked(!isLoginClicked);
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
        Log in/Sign in
      </button>
    </div>
  );
}

export default Header;