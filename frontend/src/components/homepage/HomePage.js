import React, { useState, useEffect } from 'react';
import { useAuth } from '../authContext';
import { useCookies } from 'react-cookie';
import './HomePage.css';
import CityList from './cities/CityList';
import AddCityButton from './cities/AddCityButton';
import Days from './days/Days';
import SunTime from './sun-time/SunTime';
import SingleDay from './single-day-block/SingleDay';

const HomePage = () => {
  const { isLoggedIn } = useAuth();
  const [cityList, setCityList] = useState([]);
  const [currentCityId, setCurrentCityId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const defaultCity = {
    city: "London",
    country: "United Kingdom",
    id: 1826645935,
    is_main: true,
    iso2: "GB"
  };

  const [cookies, setCookie] = useCookies(['defaultCity']);

  useEffect(() => {
    if (!isLoggedIn) {
      if (cookies.defaultCity) {
        setCityList([cookies.defaultCity]);
        setCurrentCityId(cookies.defaultCity.id);
      } else {
        setCityList([defaultCity]);
        setCurrentCityId(defaultCity.id);
      }
    } else {
      setCityList([]);
      setCurrentCityId(null);
    }
  }, [isLoggedIn, cookies.defaultCity]);  

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

  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  const changeDefaultCity = (city) => {
    setCookie('defaultCity', city, { path: '/', maxAge: 604800 });
    setCityList([city]);
    setCurrentCityId(city.id);
  };

  return (
    <div className="home-page">
      <div className='cities'>
        <AddCityButton addCity={addCity} setMainCity={setMainCity} changeDefaultCity={changeDefaultCity} />
        <CityList
          isLoggedIn={isLoggedIn}
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
      <Days cityId={currentCityId} onDayClick={handleDayClick} />
      <SunTime cityId={currentCityId} />
      <div className='map'>

      </div>
      <SingleDay cityId={currentCityId} date={selectedDate} />
    </div>
  );
}

export default HomePage;
