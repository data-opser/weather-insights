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
      endpoint: "http://localhost:5000/login",
    },
    register: {
      title: "Join us",
      buttonText: "Sign up",
      linkParagraph: "Already have an account?",
      linkText: "Log in",
      linkUrl: "/login",
      endpoint: "http://localhost:5000//register",
    },
  };

  const config = formConfig[type] || formConfig.login;
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleEyeClick = () => {
    setShowPassword(!showPassword);
  };

  const handleLinkClick = () => {
    setFormType(type === 'login' ? 'register' : 'login');
    setName(''); 
    setEmail('');
    setPassword('');
    setError(null);
    setSuccess(null);
  };

  const closeForm = () => {
    setActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: type === 'register' ? name : undefined,
          surname: type === 'register' ? 'test' : undefined,
          email,
          password
        })
      });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      console.log('Success:', data);
      setSuccess("Request successful!");

      setTimeout(() => {
        closeForm();
      }, 1000);

      setName(''); 
      setEmail('');
      setPassword('');
    } catch (error) {
      setError(error.message || 'Failed to submit');
      console.error('Error:', error);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  return (
    <div className='form'>
      <div className='left-column'>
        <img className='form-weather-icon' src={form_weather_icon} alt='form-weather-icon' />
      </div>      
      <div className='right-column'>
        <form className='data-form' onSubmit={handleSubmit}>
          <h1>{config.title}</h1>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {success && <p style={{ color: 'green' }}>{success}</p>}
          {
            type === "register" && (
              <div className='input-field'>
                <IoPersonOutline className='icon' />
                <input type='text' value={name} onChange={(e) => setName(e.target.value)} placeholder='full name' required />
              </div>
            )
          }
          <div className='input-field'>
            <MdOutlineEmail className='icon' />
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='email' required />
          </div>
          <div className='input-field pass-input-field'>
            <LuUnlock className='icon' />
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' required />
            {showPassword ? <FiEyeOff onClick={handleEyeClick} className='icon show-password' /> : <FiEye onClick={handleEyeClick} className='icon show-password' />}
          </div>
          <button type='submit'>{config.buttonText}</button>
          <div className='link'>
            <p>{config.linkParagraph}</p>
            <a href='#' onClick={handleLinkClick}>{config.linkText}</a>
          </div>
        </form>
      </div>
      <img src={google_icon} className='google-icon' alt='google-ref' onClick={handleGoogleAuth}/>
      <button className='return-button' onClick={closeForm}>
        <IoArrowBack className='return-arrow' />
      </button>
    </div>
  );
}

export default Form;