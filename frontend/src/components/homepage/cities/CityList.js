import React, { useEffect, useState } from 'react';
import './CityList.css';
import api from '../../axiosConfig';
import Flag from 'react-world-flags';

function CityList({ isLoggedIn, cityList, selectCity, setMainCity, removeCity, setCityList, currentCityId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState({ isVisible: false, x: 0, y: 0, cityId: null });

  const handleButtonClick = (cityId) => {
    selectCity(cityId);
  };

  const handleContextMenu = (e, cityId) => {
    e.preventDefault();
    setContextMenu({ isVisible: true, x: e.clientX, y: e.clientY, cityId });
  };

  const closeContextMenu = () => {
    setContextMenu({ isVisible: false, x: 0, y: 0, cityId: null });
  };

  const handleDeleteCity = async (cityId) => {
    try {
      const response = await api.post(`delete_user_city/city?city=${cityId}`);
      console.log(response.data);
      removeCity(cityId);
      closeContextMenu();
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  const handleSetMainCity = async (cityId) => {
    try {
      const response = await api.put(`/set_main_user_city/city?city=${cityId}`);
      console.log(response.data);
      setMainCity(cityId);
      closeContextMenu();
    } catch (error) {
      console.error('Error setting main city:', error);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return; // Пропускаємо фетчинг для незалогіненого користувача

    const fetchCities = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/user_cities');
        if (response.data && response.data.cities) {
          setCityList(response.data.cities);
          const mainCity = response.data.cities.find((city) => city.is_main);
          if (mainCity) {
            selectCity(mainCity.id);
          }
        }
      } catch (error) {
        setError('Failed to load cities');
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();

    document.addEventListener('click', closeContextMenu);
    return () => {
      document.removeEventListener('click', closeContextMenu);
    };
  }, [isLoggedIn, setCityList]);

  return (
    <div className="city-list">
      {isLoggedIn && loading && (
        <div className="loading">
          <p>Loading cities...</p>
        </div>
      )}
      {isLoggedIn && error && (
        <div className="error">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}
      {!isLoggedIn && cityList.length > 0 && (
        cityList.map((city) => (
          <button
            key={city.id}
            className={currentCityId === city.id ? 'blue' : ''}
            onClick={() => handleButtonClick(city.id)}
          >
            {city.city}
            <div className="flag-container">
              <Flag className="flag" code={city.iso2} />
            </div>
          </button>
        ))
      )}
      {isLoggedIn && !loading && !error && cityList.length > 0 && (
        cityList.map((city) => (
          <button
            key={city.id}
            className={currentCityId === city.id ? 'blue' : ''}
            onClick={() => handleButtonClick(city.id)}
            onContextMenu={(e) => handleContextMenu(e, city.id)}
          >
            {city.city}
            <div className="flag-container">
              <Flag className="flag" code={city.iso2} />
            </div>
          </button>
        ))
      )}
      {!isLoggedIn && cityList.length === 0 && (
        <div className="no-cities">
          <h1>No cities found</h1>
        </div>
      )}

      {contextMenu.isVisible && (
        <div
          className="context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          {!cityList.find(city => city.id === contextMenu.cityId)?.is_main && (
            <button onClick={() => handleSetMainCity(contextMenu.cityId)}>Set as main</button>
          )}
          <button onClick={() => handleDeleteCity(contextMenu.cityId)}>Delete</button>
        </div>
      )}
    </div>
  );
}

export default CityList;
