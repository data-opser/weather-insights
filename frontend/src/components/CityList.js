import React, { useEffect, useState } from 'react';
import '../styles/CityList.css';
import api from './axiosConfig';
import Flag from 'react-world-flags';

function CityList({ setCityId }) {
  const [activeButton, setActiveButton] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState({ isVisible: false, x: 0, y: 0, cityId: null });

  const handleButtonClick = (index, cityId) => {
    setActiveButton(index);
    setCityId(cityId);
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
      console.log(response.data.message);
      setCities((prevCities) => prevCities.filter((city) => city.city_id !== cityId));
      closeContextMenu();
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  };

  const handleSetMainCity = async (cityId) => {
    try {
      const response = await api.put(`/set_main_user_city/city?city=${cityId}`);
      console.log(response.data.message);
      setCities((prevCities) =>
        prevCities.map((city) =>
          city.city_id === cityId ? { ...city, is_main: true } : { ...city, is_main: false }
        )
      );
      setActiveButton(cities.findIndex((city) => city.city_id === cityId));
      setCityId(cityId);
      closeContextMenu();
    } catch (error) {
      console.error('Error setting main city:', error);
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get('/user_cities');
        if (response.data && response.data.cities) {
          setCities(response.data.cities);
          const mainCity = response.data.cities.find((city) => city.is_main);
          if (mainCity) {
            const mainCityIndex = response.data.cities.findIndex((city) => city.city_id === mainCity.city_id);
            setActiveButton(mainCityIndex);
            setCityId(mainCity.city_id);
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Error loading cities');
        setLoading(false);
      }
    };

    fetchCities();

    document.addEventListener('click', closeContextMenu);
    return () => {
      document.removeEventListener('click', closeContextMenu);
    };
  }, [setCityId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="city-list">
      {cities.length > 0 ? (
        cities.map((city, index) => (
          <button
            key={city.city_id}
            className={activeButton === index ? 'blue' : ''}
            onClick={() => handleButtonClick(index, city.city_id)}
            onContextMenu={(e) => handleContextMenu(e, city.city_id)}
          >
            {city.city_name}
            <div className="flag-container">
              <Flag className='flag' code={city.iso2} />
            </div>
          </button>
        ))
      ) : (
        <div>No cities found</div>
      )}

      {contextMenu.isVisible && (
        <div
          className="context-menu"
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
        >
          {!cities.find(city => city.city_id === contextMenu.cityId)?.is_main && (
            <button onClick={() => handleSetMainCity(contextMenu.cityId)}>Set as main</button>
          )}
          <button onClick={() => handleDeleteCity(contextMenu.cityId)}>Delete</button>
        </div>
      )}

    </div>
  );
}

export default CityList;
