import React, { useState } from 'react';
import '../styles/Form.css';
import form_weather_icon from '../images/form-weather-icon.png';
import google_icon from '../images/google-icon.png';
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { LuUnlock } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Form({ type, setActive }) {
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
  const handleClick = () => {
    setShowPassword(!showPassword);
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
                <input type='text' placeholder='full name'></input>
              </div>
            )
          }
          <div className='input-field'>
            <MdOutlineEmail className='icon' />
            <input type='email' placeholder='email'></input>
          </div>
          <div className='input-field pass-input-field'>
            <LuUnlock className='icon' />
            <input type={showPassword ? "text" : "password"} placeholder='password'></input>
            {showPassword ? <FiEyeOff onClick={handleClick} className='icon show-password' /> : <FiEye onClick={handleClick} className='icon show-password' />}
          </div>
          <button type='submit'>{config.buttonText}</button>
          <div className='link'>
            <p>{config.linkParagraph}</p>
            <a href='#'>{config.linkText}</a>
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