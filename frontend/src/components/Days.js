import { useEffect, useState } from 'react';
import '../styles/Days.css';
import Day from './Day';
import api from './axiosConfig';
import { HiOutlineCog6Tooth } from "react-icons/hi2";

const Days = ({ cityId }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!cityId) return;

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
      {loading && <div className='loading'>
        <HiOutlineCog6Tooth className='cog' alt='loading cog' />
        <h1>Loading...</h1>
      </div>
      }
      {error && <h1 style={{ color: 'red' }}>{error}</h1>}
      {!loading && !error && (<h1>Weather for the next four days</h1>)}
      {!loading && !error && (
        <div className='day-table'>
          {weatherData.map((day, index) => (
            <Day
              key={index}
              cityId={cityId}
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
