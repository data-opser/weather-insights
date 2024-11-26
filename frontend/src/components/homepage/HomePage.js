import React, { useState } from 'react';
import './HomePage.css';
import CityList from '../CityList';
import AddCityButton from '../AddCityButton';
import Days from '../Days';
import SunTime from './sun-time/SunTime';

const HomePage = () => {
  const [cityId, setCityId] = useState(null);

  return (
    <div className="home-page">
      <div className='cities'>
        <AddCityButton />
        <CityList setCityId={setCityId} />
      </div>
      <Days cityId={cityId} />
      <SunTime cityId={cityId} />
      <div className='map'>

      </div>
    </div>
  );
}

export default HomePage;
