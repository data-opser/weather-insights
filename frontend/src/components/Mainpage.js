import React from 'react';
import '../styles/MainPage.css'
import CityList from './CityList';
import AddCityButton from './AddCityButton';
import Days from './Days';
import SunTime from './SunTime';

function MainPage() {
  return (
    <div className="main-page">
      <div className='cities'>
        <AddCityButton />
        <CityList />
      </div>
      <Days />
      <SunTime />
      <div className='map'>

      </div>
    </div>
  );
}

export default MainPage;
