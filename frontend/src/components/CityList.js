import React, { useEffect, useState } from 'react';
import '../styles/CityList.css';
import api from './services/axiosConfig';

function CityList({ setCityId }) {
  const [activeButton, setActiveButton] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleButtonClick = (index, cityId) => {
    setActiveButton(index);
    setCityId(cityId); // Оновлюємо cityId в MainPage
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get('/user_cities');
        if (response.data && response.data.cities) {
          setCities(response.data.cities);
          const mainCity = response.data.cities.find(city => city.is_main);
          if (mainCity) {
            const mainCityIndex = response.data.cities.findIndex(city => city.city_id === mainCity.city_id);
            setActiveButton(mainCityIndex); // Встановлюємо індекс головного міста
            setCityId(mainCity.city_id); // Встановлюємо cityId для початкового міста
          }
        }
        setLoading(false);
      } catch (err) {
        setError('Error loading cities');
        setLoading(false);
      }
    };

    fetchCities();
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
            onClick={() => handleButtonClick(index, city.city_id)} // Передаємо city_id
          >
            {city.city_name}
          </button>
        ))
      ) : (
        <div>No cities found</div>
      )}
    </div>
  );
}

export default CityList;
