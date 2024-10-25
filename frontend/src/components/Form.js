import React, { useState } from 'react';
import '../styles/Form.css';
import form_weather_icon from '../images/form-weather-icon.png';
import google_icon from '../images/google-icon.png';
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsPersonFill } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";

function Form({ type }) {
  const formConfig = {
    Login: {
      title: "Welcome back",
      buttonText: "Login",
      linkParagraph: "Haven't got an account?",
      linkText: "Sign up",
      linkUrl: "/register",
    },
    Register: {
      title: "Join us",
      buttonText: "Sign up",
      linkParagraph: "Already have an account?",
      linkText: "Log in",
      linkUrl: "/login",
    },
  };

  const config = formConfig[type] || formConfig.Login;
  const [show, setShow] = useState(false);
  const handleClick = () => {
    setShow(!show);
  };

  return (
    <div className='form'>
      <div className='left-column'>
        <img className='form-weather-icon' src={form_weather_icon} alt='form-weather-icon'></img>
      </div>
      <button className='return-button'>
        <IoArrowBack className='return-arrow' />
      </button>
      <div className='right-column'>
        <form className='data-form'>
          <h1>{config.title}</h1>
          {
            type === "Register" && (
              <div className='input-field'>
                <BsPersonFill className='icon' />
                <input type='text' placeholder='full name'></input>
              </div>
            )
          }
          <div className='input-field'>
            <MdOutlineEmail className='icon' />
            <input type='email' placeholder='email'></input>
          </div>
          <div className='input-field'>
            <RiLockPasswordLine className='icon' />
            <input type={show ? "text" : "password"} placeholder='password'></input>
            {show ? <FiEyeOff onClick={handleClick} className='icon show-password' /> : <FiEye onClick={handleClick} className='icon show-password' />}
          </div>
          <button type='submit'>{config.buttonText}</button>
          <div className='link'>
            <p>{config.linkParagraph}</p>
            <a href='#'>{config.linkText}</a>
          </div>
        </form>
      </div>
      <img src={google_icon} className='google-icon'></img>
    </div>
  );
}

export default Form;