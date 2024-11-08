import React, { useState } from 'react';
import '../styles/Mainpage.css'
import CitySearch from './CitySearch';
import CityList from './CityList';
import Day from './Day';
import AddCityButton from './AddCityButton';
import { GoSun } from "react-icons/go";

function Mainpage() {
  const [activeButton, setActiveButton] = useState('sunrise');

  return (
    <div className="main-page">
      <div className='cities'>
        <AddCityButton />
        <CityList />
      </div>
      <div className='days'>
        <h1>Weather for the next five days</h1>
        <div className='day-table'>
          <Day />
          <Day />
          <Day />
          <Day />
          <Day />
        </div>
      </div>
      <div className='sun-time'>
        <button 
          className={`sun-button ${activeButton === 'sunrise' ? 'active' : ''}`} 
          onClick={() => setActiveButton('sunrise')}
        >
          Sunrise
        </button>
        <button 
          className={`sun-button ${activeButton === 'sunset' ? 'active' : ''}`} 
          onClick={() => setActiveButton('sunset')}
        >
          Sunset
        </button>
        <GoSun className='sun' />
        <h1>19:30</h1>
      </div>
      <div className='map'>
        
      </div>
    </div>
  );
}

export default Mainpage;