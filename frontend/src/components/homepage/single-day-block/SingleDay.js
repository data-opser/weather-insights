import React, { useEffect, useState } from "react";
import "./SingleDay.css";
import Hour from "./Hour";
import api from "../../axiosConfig";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

const SingleDay = ({ date, cityId }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHourlyData = async () => {
      if (!date || !cityId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/weather/date/city?date=${date}&city=${cityId}`);
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
      {error && <h1 style={{ color: "red" }}>{error}</h1>}
      {!loading && !error && (
        <div className="hour-table">
          <div className="hour-table-main-text">
            <p className="hour-table-main-text-time">Time</p>
            <p className="hour-table-main-text-type">Weather</p>
            <p className="hour-table-main-text-degree">Degree, °</p>
            <p className="hour-table-main-text-feels">It feels</p>
            <p className="hour-table-main-text-pressure">Pressure, mm</p>
            <p className="hour-table-main-text-humidity">Humidity, %</p>
            <p className="hour-table-main-text-wind">Wind, m/s</p>
            <p className="hour-table-main-text-precipitation">Precipitation probability, %</p>
          </div>
          <div className="hour-columns">
            {hourlyData.map((hour, index) => (
              <Hour
                key={index}
                time={hour.time}
                temperature={hour.temperature}
                temperature_feels_like={hour.temperature_feels_like}
                pressure={hour.pressure}
                humidity={hour.humidity}
                wind_speed={hour.wind_speed}
                precipitation={hour.precipitation}
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
