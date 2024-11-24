import React, { useState } from 'react';
import './UserPage.css';
import user from './user.jpg';
import { GoPlus } from "react-icons/go";
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
          <img className='user-photo' src={user}></img>
          <GoPlus
            className={`plus-photo ${activeAddPhotoButton ? 'gray' : ''}`}
            onClick={handleAddPhotoButtonClick}
          />
        </div>

        <div className='user-block2'>
          <p className='user-text-bold'>My profile</p>
          <div>
            <p className='user-block2-text-gray'>Last login: Nov. 28, 2024, 15:30</p>
            <p className='user-block2-text-gray'>Location: Kharkiv, Ukraine</p>
          </div>
        </div>

        <div className='form-group'>
          <input className='name-input' placeholder='Anton Reshetniak' />
          <hr className="separator" />
          <p className="user-info">First name, last name</p>

          <input className='name-input' placeholder='******' />
          <hr className="separator" />
          <p className="user-info">Old password</p>
          <input className='name-input' placeholder='******' />
          <hr className="separator" />
          <p className="user-info">New password</p>

          <p className='user-email'>anton.reshetniak@nure.ua</p>
          <hr className="separator" />
          <p className="user-info">Email</p>
        </div>
        <button
          className={`user-button ${activeSaveButton ? 'blue' : ''}`}
          onClick={handleSaveButtonClick}>
          Save
        </button>

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