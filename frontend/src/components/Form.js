import React, { useState } from 'react';
import '../styles/Form.css';
import form_weather_icon from '../images/form-weather-icon.png';
import google_icon from '../images/google-icon.png';
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { LuUnlock } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Form({ type, setActive, setFormType }) {
  const formConfig = {
    login: {
      title: "Welcome back",
      buttonText: "Login",
      linkParagraph: "Haven't got an account?",
      linkText: "Sign up",
      linkUrl: "/register",
    },
    register: {
      title: "Join us",
      buttonText: "Sign up",
      linkParagraph: "Already have an account?",
      linkText: "Log in",
      linkUrl: "/login",
    },
  };

  const config = formConfig[type] || formConfig.login;
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEyeClick = () => {
    setShowPassword(!showPassword);
  };

  const handleLinkClick = () => {
    setFormType(type === 'login' ? 'register' : 'login');
    setFullName(''); 
    setEmail('');
    setPassword('');
  };

  const closeForm = () => {
    setActive(false);
  };

  return (
    <div className='form'>
      <div className='left-column'>
        <img className='form-weather-icon' src={form_weather_icon} alt='form-weather-icon'></img>
      </div>      
      <div className='right-column'>
        <form className='data-form'>
          <h1>{config.title}</h1>
          {
            type === "register" && (
              <div className='input-field'>
                <IoPersonOutline className='icon' />
                <input type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder='full name'></input>
              </div>
            )
          }
          <div className='input-field'>
            <MdOutlineEmail className='icon' />
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email'></input>
          </div>
          <div className='input-field pass-input-field'>
            <LuUnlock className='icon' />
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password'></input>
            {showPassword ? <FiEyeOff onClick={handleEyeClick} className='icon show-password' /> : <FiEye onClick={handleEyeClick} className='icon show-password' />}
          </div>
          <button type='submit'>{config.buttonText}</button>
          <div className='link'>
            <p>{config.linkParagraph}</p>
            <a href='#' onClick={handleLinkClick}>{config.linkText}</a>
          </div>
        </form>
      </div>
      <img src={google_icon} className='google-icon' alt='google-ref'></img>
      <button className='return-button' onClick={closeForm} >
        <IoArrowBack className='return-arrow' />
      </button>
    </div>
  );
}

export default Form;