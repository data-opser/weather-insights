import React, { useState } from 'react';
import api from '../axiosConfig';
import { useInput } from '../Header/AuthForm/inputValidation';
import { useAuth } from '../authContext';
import './UserPage.css';
import { GoPlus } from "react-icons/go";
import { BsPerson } from "react-icons/bs";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { AiOutlineDown } from "react-icons/ai";
import Notifications from './Notifications';

const UserPage = () => {
  const [activeSaveButton, setActiveSaveButton] = useState(false);
  const [activeAddPhotoButton, setActiveAddPhotoButton] = useState(false);

  const handleSaveButtonClick = () => {
    setActiveSaveButton(true);
  };

  const handleAddPhotoButtonClick = () => {
    setActiveAddPhotoButton(true);
  }

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const { userData, setUserData } = useAuth();

  const [nameError, setNameError] = useState(null);
  const [birthdayError, setBirthdayError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [nameSuccess, setNameSuccess] = useState(null);
  const [birthdaySuccess, setBirthdaySuccess] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);

  const name = useInput('', { isEmpty: true, minLength: 3, maxLength: 119 });
  const birthday = useInput('', { isEmpty: true });
  const oldPassword = useInput('', { isEmpty: true, minLength: 8 });
  const newPassword = useInput('', { isEmpty: true, minLength: 8 });

  const handleOldPasswordEyeClick = () => setShowOldPassword(!showOldPassword);
  const handleNewPasswordEyeClick = () => setShowNewPassword(!showNewPassword);

  const handleSubmit = async (field) => {
    if (field === 'name') {
      setNameError(null);
      setNameSuccess(null);
    } else if (field === 'birthday') {
      setBirthdayError(null);
      setBirthdaySuccess(null);
    } else if (field === 'password') {
      setPasswordError(null);
      setPasswordSuccess(null);
    }

    try {
      const payload = {};
      if (field === 'name' && name.inputValid) {
        payload.name = name.value;
      } else if (field === 'birthday' && birthday.inputValid) {
        payload.birthday = birthday.value;
      } else if (field === 'password' && oldPassword.inputValid && newPassword.inputValid) {
        payload.old_password = oldPassword.value;
        payload.new_password = newPassword.value;
      } else {
        throw new Error('Invalid input');
      }

      let response;
      if (field === 'password') {
        console.log(payload);
        response = await api.get('/update_password', payload);
      } else {
        response = await api.put('/update_profile', payload);
      }

      if (response.status === 200) {
        if (field === 'name') setNameSuccess('Name updated successfully');
        if (field === 'birthday') setBirthdaySuccess('Birthday updated successfully');
        if (field === 'password') setPasswordSuccess('Password updated successfully');

        if (field === 'name') setUserData((prev) => ({ ...prev, name: name.value }));
        if (field === 'birthday') setUserData((prev) => ({ ...prev, birthday: birthday.value }));
      }
      setTimeout(() => {
        if (field === 'name') setNameSuccess(null);
        if (field === 'birthday') setBirthdaySuccess(null);
        if (field === 'password') setPasswordSuccess(null);
      }, 3000);
    } catch (error) {
      if (field === 'name') setNameError('Failed to update name');
      if (field === 'birthday') setBirthdayError('Failed to update birthday');
      if (field === 'password') setPasswordError('Failed to update password');
    }
  };

  return (
    <div className="user-page">
      <div className="user">
        <div className='user-block1'>
          <BsPerson className='user-photo' />
          <GoPlus
            className={`plus-photo ${activeAddPhotoButton ? 'gray' : ''}`}
            onClick={handleAddPhotoButtonClick}
          />
        </div>
        <div className='profile-info'>
          <p className='user-text-bold'>My profile</p>
          <p className='user-block2-text-gray'>Created at: {userData ? new Date(userData.created_at).toLocaleString() : 'no information'}</p>
        </div>
        <div className='faq'>
          <div className='faq-item'>
            <label className='faq-title-email'>
              <p className='faq-title-type'>Email</p>
              <p className='faq-title-text'>{userData ? userData.email : 'no information'}</p>
            </label>
          </div>
          <div className='faq-item'>
            <input className='faq-input' type='checkbox' id='faq_1'></input>
            <label className='faq-title' htmlFor='faq_1'>
              <p className='faq-title-type'>Name</p>
              <p className='faq-title-text'>{userData ? userData.name : 'no information'}</p>
            </label>
            <label className='faq-label-arrow-top' htmlFor="faq_1">
              <AiOutlineDown className="faq-arrow-top" />
            </label>

            <form className='faq-text' onSubmit={(e) => { e.preventDefault(); handleSubmit('name'); }}>
              <input
                type="text"
                value={name.value}
                onChange={name.onChange}
                onBlur={name.onBlur}
                placeholder="new name"
              />
              <button
                type='submit'
                className={`user-button ${activeSaveButton ? 'blue' : ''}`}
                onClick={handleSaveButtonClick}
                disabled={!name.inputValid}>
                Save
              </button>
              <div className='faq-status'>
                {name.isDirty && name.isEmpty && <p className="error-text">Name cannot be empty</p>}
                {name.isDirty && !name.isEmpty && name.minLengthError && <p className="error-text">Name is too small</p>}
                {nameError && <p className='error-text'>{nameError}</p>}
                {nameSuccess && <p className='success-text'>{nameSuccess}</p>}
              </div>
            </form>
          </div>
          <div className='faq-item'>
            <input className='faq-input' type='checkbox' id='faq_2'></input>
            <label className='faq-title' htmlFor='faq_2'>
              <p className='faq-title-type'>Birthday</p>
              <p className='faq-title-text padding-left'>
                {userData && userData.birthday
                  ? new Date(userData.birthday).toLocaleDateString('en-GB')
                  : 'no information'}
              </p>            
            </label>
            <label className='faq-label-arrow-top' htmlFor="faq_2">
              <AiOutlineDown className="faq-arrow-top" />
            </label>
            <form className="faq-text" onSubmit={(e) => { e.preventDefault(); handleSubmit('birthday'); }}>
              <input
                type="date"
                value={birthday.value}
                onChange={birthday.onChange}
                onBlur={birthday.onBlur}
              />
              <button
                type='submit'
                className={`user-button ${activeSaveButton ? 'blue' : ''}`}
                onClick={handleSaveButtonClick}
                disabled={!birthday.inputValid}>
                Save
              </button>
              <div className='faq-status'>
                {birthday.isDirty && birthday.isEmpty && <p className="error-text">Select your birthday</p>}
                {birthdayError && <p className='error-text'>{birthdayError}</p>}
                {birthdaySuccess && <p className='success-text'>{birthdaySuccess}</p>}
              </div>
            </form>
          </div>
          <div className='faq-item'>
            <input className='faq-input' type='checkbox' id='faq_3'></input>
            <label className='faq-title' htmlFor='faq_3'><p className='faq-title-type'>Password</p></label>
            <label className='faq-label-arrow-top' htmlFor="faq_3">
              <AiOutlineDown className="faq-arrow-top" />
            </label>
            <form className="faq-text" onSubmit={(e) => { e.preventDefault(); handleSubmit('password'); }}>
              <div className='field'>
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword.value}
                  onChange={oldPassword.onChange}
                  onBlur={oldPassword.onBlur}
                  placeholder="old password"
                />
                {showOldPassword ? (
                  <FiEyeOff onClick={handleOldPasswordEyeClick} className='icon show-password' />
                ) : (
                  <FiEye onClick={handleOldPasswordEyeClick} className='icon show-password' />
                )}
              </div>
              <div className='field'>
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword.value}
                  onChange={newPassword.onChange}
                  onBlur={newPassword.onBlur}
                  placeholder="new password"
                />
                {showNewPassword ? (
                  <FiEyeOff onClick={handleNewPasswordEyeClick} className='icon show-password' />
                ) : (
                  <FiEye onClick={handleNewPasswordEyeClick} className='icon show-password' />
                )}
              </div>
              <button
                type='submit'
                className={`user-button ${activeSaveButton ? 'blue' : ''}`}
                onClick={handleSaveButtonClick}
                disabled={!oldPassword.inputValid || !newPassword.inputValid}>
                Save
              </button>
              <div className='faq-status'>
                  {oldPassword.isDirty && oldPassword.isEmpty ? (
                    <p className="error-text">Old password cannot be empty</p>
                  ) : (
                    <>
                      {oldPassword.isDirty && oldPassword.minLengthError && <p className="error-text">Old password is too short</p>}
                    </>
                  )}
                  {newPassword.isDirty && newPassword.isEmpty ? (
                    <p className="error-text">New password cannot be empty</p>
                  ) : (
                    <>
                      {newPassword.isDirty && newPassword.minLengthError && <p className="error-text">New password is too short</p>}
                    </>
                  )}
                  {passwordError && <p className='error-text'>{passwordError}</p>}
                  {passwordSuccess && <p className='success-text'>{passwordSuccess}</p>}  
                </div>
            </form>
          </div>
        </div>
      </div>
      <Notifications />
    </div>
  );
};

export default UserPage;
