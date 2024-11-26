import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './AuthForm.css';
import form_weather_icon from './form-weather-icon.png';
import google_icon from './google-icon.png';
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { LuUnlock } from "react-icons/lu";
import { IoPersonOutline } from "react-icons/io5";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useInput } from './inputValidation';
import api from '../../axiosConfig';

const AuthForm = forwardRef(({ type, setActive, setFormType, onLoginSuccess }, ref) => {
  const formConfig = {
    login: {
      title: "Welcome back",
      buttonText: "Login",
      linkParagraph: "Haven't got an account?",
      linkText: "Sign up",
      endpoint: "/login",
    },
    register: {
      title: "Join us",
      buttonText: "Sign up",
      linkParagraph: "Already have an account?",
      linkText: "Log in",
      endpoint: "/register",
    },
  };

  const config = formConfig[type] || formConfig.login;
  const [showPassword, setShowPassword] = useState(false);
  const handleEyeClick = () => setShowPassword(!showPassword);

  const name = useInput('', { isEmpty: true, minLength: 3, maxLength: 119 });
  const email = useInput('', { isEmpty: true, isEmail: true });
  const password = useInput('', { isEmpty: true, minLength: 8 });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const clearForm = () => {
    setError(null);
    setSuccess(null);
    name.onChange({ target: { value: '' } });
    email.onChange({ target: { value: '' } });
    password.onChange({ target: { value: '' } });
    name.setDirty(false);
    email.setDirty(false);
    password.setDirty(false);
  };

  useImperativeHandle(ref, () => ({
    clearForm
  }));

  const handleLinkClick = () => {
    setFormType(type === 'login' ? 'register' : 'login');
    clearForm();
  };

  const closeForm = () => {
    setActive(false);
    clearForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        email: email.value,
        password: password.value,
      };

      if (type === 'register') {
        payload.name = name.value;
      }

      const response = await api.post(config.endpoint, payload);
      console.log(response.data.message);

      if (type === 'register') {
        setSuccess('Registration successful! Please confirm your email to login.');
        setFormType('login');
        return;
      }

      setSuccess('Login successful!');
      onLoginSuccess?.();
      
      setTimeout(() => {
        closeForm();
      }, 700);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit');
      console.error('Error:', error);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = api.defaults.baseURL + '/auth/google';
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

          {type === "register" && (
            <div>
              <div className='input-field'>
                <IoPersonOutline className='icon' />
                <input
                  type='text'
                  value={name.value}
                  onChange={name.onChange}
                  onBlur={name.onBlur}
                  placeholder='full name'
                  required
                />
              </div>
              {name.isDirty && name.isEmpty ? (
                <p className="error-text">Name cannot be empty</p>
              ) : (
                <>
                  {name.isDirty && name.minLengthError && <p className="error-text">Name is too short</p>}
                  {name.isDirty && name.maxLengthError && <p className="error-text">Name is too long</p>}
                </>
              )}
            </div>
          )}

          <div>
            <div className='input-field'>
              <MdOutlineEmail className='icon' />
              <input
                type='email'
                value={email.value}
                onChange={email.onChange}
                onBlur={email.onBlur}
                placeholder='email'
                required
              />
            </div>
            {email.isDirty && email.isEmpty ? (
              <p className="error-text">Email cannot be empty</p>
            ) : (
              <>
                {email.isDirty && email.emailError && <p className="error-text">Invalid email format</p>}
              </>
            )}
          </div>

          <div>
            <div className='input-field pass-input-field'>
              <LuUnlock className='icon' />
              <input
                type={showPassword ? "text" : "password"}
                value={password.value}
                onChange={password.onChange}
                onBlur={password.onBlur}
                placeholder='password'
                required
              />
              {showPassword ? (
                <FiEyeOff onClick={handleEyeClick} className='icon show-password' />
              ) : (
                <FiEye onClick={handleEyeClick} className='icon show-password' />
              )}
            </div>
            {password.isDirty && password.isEmpty ? (
              <p className="error-text">Password cannot be empty</p>
            ) : (
              <>
                {password.isDirty && password.minLengthError && <p className="error-text">Password is too short</p>}
              </>
            )}
          </div>

          <button
            type='submit'
            disabled={
              (type === 'login' && (!email.inputValid || !password.inputValid)) ||
              (type === 'register' && (!name.inputValid || !email.inputValid || !password.inputValid))
            }
          >
            {config.buttonText}
          </button>

          <div className='link'>
            <p>{config.linkParagraph}</p>
            <button type='button' onClick={handleLinkClick}>{config.linkText}</button>
          </div>
        </form>
      </div>
      <img src={google_icon} className='google-icon' alt='google-ref' onClick={handleGoogleAuth} style={{ display: type === 'register' ? 'none' : 'block' }} />
      <button className='return-button' onClick={closeForm}>
        <IoArrowBack className='return-arrow' />
      </button>
    </div>
  );
});

export default AuthForm;
