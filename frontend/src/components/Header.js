import React, { useState } from 'react';
import '../styles/Header.css';
import logo from '../images/logo.png';
import { CiLogin } from "react-icons/ci";

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
        <CiLogin className={`icon-button-login ${isLoginClicked ? 'white' : ''}`}/>
        Log in
      </button>
    </div>
  );
}

export default Header;