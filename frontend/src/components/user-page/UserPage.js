import React, { useState } from 'react';
import './UserPage.css';
import { GoPlus } from "react-icons/go";
import { BsPerson } from "react-icons/bs";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
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
          <p className='user-block2-text-gray'>Created at: Nov. 28, 2024, 15:30</p>
        </div>



        <div className='faq'>
          <div className='faq-item'>
            <label className='faq-title-email'><p className='faq-title-type'>Email</p><p className='faq-title-text'>anton.reshetniak@nure.ua</p></label>
          </div>

          <div className='faq-item'>
            <input className='faq-input' type='checkbox' id='faq_1'></input>
            <label className='faq-title' for='faq_1'><p className='faq-title-type'>Name</p><p className='faq-title-text'>Anton Reshetniak</p></label>
            <label className='faq-label-arrow-top' for="faq_1">
              <AiOutlineDown className="faq-arrow-top" />
            </label>

            <form className='faq-text'>
              <input placeholder='Enter your new name'></input>
              <button
                type='submit'
                className={`user-button ${activeSaveButton ? 'blue' : ''}`}
                onClick={handleSaveButtonClick}>
                Save
              </button>
              <div className='faq-status'>
                <p>Successfully</p>
              </div>
            </form>

          </div>

          <div className='faq-item'>
            <input className='faq-input' type='checkbox' id='faq_2'></input>
            <label className='faq-title' for='faq_2'><p className='faq-title-type'>Date of birth</p><p className='faq-title-text padding-left'>03.04.2005</p></label>
            <label className='faq-label-arrow-top' for="faq_2">
              <AiOutlineDown className="faq-arrow-top" />
            </label>

            <form className='faq-text'>
              <input placeholder='Enter your new date of birth'></input>
              <button
                type='submit'
                className={`user-button ${activeSaveButton ? 'blue' : ''}`}
                onClick={handleSaveButtonClick}>
                Save
              </button>
              <div className='faq-status'>
                <p>Successfully</p>
              </div>
            </form>
          </div>



          <div className='faq-item'>
            <input className='faq-input' type='checkbox' id='faq_3'></input>
            <label className='faq-title' for='faq_3'><p className='faq-title-type'>Password</p></label>
            <label className='faq-label-arrow-top' for="faq_3">
              <AiOutlineDown className="faq-arrow-top" />
            </label>

            <form className='faq-text'>
              <input placeholder='Enter your old password'></input>
              <div>
                <input placeholder='Enter your new password'></input>
                <button
                  type='submit'
                  className={`user-button ${activeSaveButton ? 'blue' : ''}`}
                  onClick={handleSaveButtonClick}>
                  Save
                </button>
                <div className='faq-status'>
                  <p>Successfully</p>
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