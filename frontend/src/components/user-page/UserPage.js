import React, { useState } from 'react';
import api from '../axiosConfig';
import { useInput } from '../Header/AuthForm/inputValidation';
import { useAuth } from '../authContext';
import './UserPage.css';
import { GoPlus } from "react-icons/go";
import { BsPerson } from "react-icons/bs";
import { AiOutlineDown } from "react-icons/ai";
import raincloud from './raincloud.jfif'

const UserPage = () => {
  const [activeSaveButton, setActiveSaveButton] = useState(false);
  const [activeViewButton, setActiveViewButton] = useState(false);
  const [activeAddPhotoButton, setActiveAddPhotoButton] = useState(false);

  const handleSaveButtonClick = () => {
    setActiveSaveButton(true);
  };

  const handleViewButtonClick = () => {
    setActiveViewButton(true);
  };

  const handleAddPhotoButtonClick = () => {
    setActiveAddPhotoButton(true);
  }

  const { userData, setUserData } = useAuth();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const name = useInput(userData?.name || '', { isEmpty: true, minLength: 3, maxLength: 119 });
  const birthday = useInput(userData?.birthday || '', { isEmpty: true });
  const oldPassword = useInput('', { isEmpty: true, minLength: 8 });
  const newPassword = useInput('', { isEmpty: true, minLength: 8 });

  const handleSubmit = async (field) => {
    setError(null);
    setSuccess(null);

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
        setError('Invalid input');
        return;
      }
      let response;
      if (field === 'password') {
        response = await api.get('/update_password', payload);
      } else {
        response = await api.put('/update_profile', payload);
      }
      setSuccess(response.data.message || 'Profile updated successfully');
      console.log(response.data.message);

      if (field === 'name') setUserData((prev) => ({ ...prev, name: name.value }));
      if (field === 'birthday') setUserData((prev) => ({ ...prev, birthday: birthday.value }));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update profile');
      console.log(error.message);
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
            <label className='faq-title' for='faq_1'>
              <p className='faq-title-type'>Name</p>
              <p className='faq-title-text'>{userData ? userData.name : 'no information'}</p>
            </label>
            <label className='faq-label-arrow-top' for="faq_1">
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
              </div>
            </form>

          </div>

          <div className='faq-item'>
            <input className='faq-input' type='checkbox' id='faq_2'></input>
            <label className='faq-title' for='faq_2'>
              <p className='faq-title-type'>Date of birth</p>
              <p className='faq-title-text padding-left'>
                {userData && userData.birthday
                  ? new Date(userData.birthday).toLocaleDateString('en-GB')
                  : 'no information'}
              </p>            </label>
            <label className='faq-label-arrow-top' for="faq_2">
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
                {birthday.isDirty && birthday.isEmpty && <p className="error-text">Birthday cannot be empty</p>}
              </div>
            </form>
          </div>

          <div className='faq-item'>
            <input className='faq-input' type='checkbox' id='faq_3'></input>
            <label className='faq-title' for='faq_3'><p className='faq-title-type'>Password</p></label>
            <label className='faq-label-arrow-top' for="faq_3">
              <AiOutlineDown className="faq-arrow-top" />
            </label>

            <form className="faq-text" onSubmit={(e) => { e.preventDefault(); handleSubmit('password'); }}>
              <input
                type="password"
                value={oldPassword.value}
                onChange={oldPassword.onChange}
                onBlur={oldPassword.onBlur}
                placeholder="Old password"
              />
              <div>
                <input
                  type="password"
                  value={newPassword.value}
                  onChange={newPassword.onChange}
                  onBlur={newPassword.onBlur}
                  placeholder="New password"
                />
                <button
                  type='submit'
                  className={`user-button ${activeSaveButton ? 'blue' : ''}`}
                  onClick={handleSaveButtonClick}
                  disabled={!oldPassword.inputValid || !newPassword.inputValid}>
                  Save
                </button>
                <div className='faq-status'>
                  {oldPassword.isDirty && oldPassword.isEmpty && <p className="error-text">Old password cannot be empty</p>}
                  {newPassword.isDirty && newPassword.isEmpty && <p className="error-text">New password cannot be empty</p>}
                </div>
              </div>

            </form>
          </div>  
        </div>
      </div>

      <div className="notifications">
        <p className='user-text-bold'>Last notifications</p>
        <div className='notification'>
          <div className='notification-weather'>
            <img src={raincloud}></img>
            <p className='notification-name'>Rain Alert</p>
          </div>
          <p className='notification-text'>Expected rain in your area within the next 30 minutes. <span className='notification-text-bold'>Don’t forget to bring an umbrella if you're heading out!</span></p>
          <p className='notification-time'>Today, 09:00</p>
        </div>
        <div className='notification'>
          <div className='notification-weather'>
            <img src={raincloud}></img>
            <p className='notification-name'>Rain Alert</p>
          </div>
          <p className='notification-text'>Expected rain in your area within the next 30 minutes. <span className='notification-text-bold'>Don't forget to bring an umbrella if you're heading out!</span></p>
          <p className='notification-time'>Today, 09:00</p>
        </div>
        <button
          className={`user-button ${activeViewButton ? 'blue' : ''} `}
          onClick={handleViewButtonClick}>
          View all
        </button>
      </div>

    </div>
  );
}

export default UserPage;