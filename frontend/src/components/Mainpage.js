import React, { useState } from 'react';
import '../styles/Mainpage.css';
import CityList from './CityList';
import AddCityButton from './AddCityButton';
import Days from './Days';
import SunTime from './SunTime';

function MainPage() {
  const [cityId, setCityId] = useState(null);

  return (
    <div className="main-page">
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

export default MainPage;
