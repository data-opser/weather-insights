import React, { useState } from 'react';
import './HomePage.css';
import CityList from './cities/CityList';
import AddCityButton from './cities/AddCityButton';
import Days from './days/Days';
import SunTime from './sun-time/SunTime';

const HomePage = () => {
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
      prevCities
        .map((city) =>
          city.id === cityId ? { ...city, is_main: true } : { ...city, is_main: false }
        )
        .sort((a, b) => (b.is_main ? 1 : 0) - (a.is_main ? 1 : 0))
    );
    selectCity(cityId);
  };

  const removeCity = (cityId) => {
    setCityList((prevList) => prevList.filter((city) => city.id !== cityId));
  };

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
          currentCityId={currentCityId}
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
