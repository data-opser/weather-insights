import React, { useEffect, useState } from "react";
import "./SingleDay.css";
import Hour from "./Hour";
import api from "../../axiosConfig";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { FaCity } from "react-icons/fa";

const SingleDay = ({ date, cityId, isCityListEmpty }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHourlyData = async () => {
      if (!date || !cityId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/weather/city/date?city=${cityId}&date=${date}`);
        setHourlyData(response.data);
      } catch (error) {
        setError("Failed to fetch hourly data.");
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHourlyData();
  }, [date, cityId]);

  return (
    <div className="page-hour">
      {loading && (
        <div className="loading">
          <HiOutlineCog6Tooth className="cog" alt="loading cog" />
          <h1>Loading...</h1>
        </div>
      )}
      {!loading && isCityListEmpty &&
        <div className="loading">
          <FaCity className='img' alt='city' />
          <h1>Your city list is empty</h1>
        </div>
      }
      {error && <h1 style={{ color: "red" }}>{error}</h1>}
      {!loading && !error && !isCityListEmpty && (
        <div className="hour-table">
          <div className="hour-table-main-text">
            <p className="hour-table-main-text-time">Time</p>
            <p className="hour-table-main-text-type">Weather</p>
            <p className="hour-table-main-text-degree">Degree</p>
            <p className="hour-table-main-text-feels">It feels</p>
            <p className="hour-table-main-text-pressure">Pressure, hPa</p>
            <p className="hour-table-main-text-humidity">Humidity</p>
            <p className="hour-table-main-text-wind">Wind, m/s</p>
            <p className="hour-table-main-text-precipitation">Precipitation, mm</p>
          </div>
          <div className="hour-columns">
            {hourlyData.map((hour, index) => (
              <Hour
                key={index}
                time={hour.time}
                temperature={hour.temperature}
                temperature_feels_like={hour.temperature_feels_like}
                pressure_ground_level={hour.pressure_ground_level}
                humidity={hour.humidity}
                wind_speed={hour.wind_speed}
                rain_precipitation={hour.rain_precipitation}
                snow_precipitation={hour.snow_precipitation}
                weather={hour.weather}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleDay;
