import React, { useState } from 'react';
import './HomePage.css';
import CityList from './cities/CityList';
import AddCityButton from './cities/AddCityButton';
import Days from './days/Days';
import SunTime from './sun-time/SunTime';

const HomePage = () => {
  const [cityId, setCityId] = useState(null); // former version

  // new version
  const [cityList, setCityList] = useState([]);
  const [currentCityId, setCurrentCityId] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const addCity = (newCity) => {
    setCityList((prevList) => [...prevList, newCity]);
  };

  const selectCity = (cityId) => {
    setCurrentCityId(cityId);
  };

  const setMainCity = (cityId) => {
    setCityList((prevCities) =>
      prevCities.map((city) =>
        city.city_id === cityId ? { ...city, is_main: true } : { ...city, is_main: false }
      )
    );
    setActiveButton(cityList.findIndex((city) => city.city_id === cityId));
    selectCity(cityId);
  }

  const removeCity = (cityId) => {
    setCityList((prevList) => prevList.filter((city) => city.id !== cityId));
  };

  // end new version

  return (
    <div className="home-page">
      <div className='cities'>
        <AddCityButton addCity={addCity} setMainCity={setMainCity} />
        <CityList
          cityList={cityList}
          selectCity={selectCity}
          removeCity={removeCity}
          setMainCity={setMainCity}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          setCityList={setCityList}
        />
      </div>
      <Days cityId={currentCityId} />
      <SunTime cityId={currentCityId} />
      <div className='map'>

      </div>
    </div>
  );
}

export default HomePage;
