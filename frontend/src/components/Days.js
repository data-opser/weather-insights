import { useEffect, useState } from 'react';
import '../styles/Days.css';
import Day from './Day';
import api from './services/axiosConfig';

const Days = ({ cityId }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!cityId) return; // Якщо cityId не вибрано, не робимо запит

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/weatherday/city?city=${cityId}`);
        const filteredData = response.data.slice(0, 4);
        setWeatherData(filteredData);
      } catch (error) {
        setError('Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [cityId]);

  return (
    <div className='days'>
      <h1>Weather for the next four days</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <div className='day-table'>
          {weatherData.map((day, index) => (
            <Day
              key={index}
              date={day.date}
              weather={day.weather}
              tempMin={day.temperature_min}
              tempMax={day.temperature_max}
              humidity={day.humidity}
              wind={day.wind_speed}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Days;
