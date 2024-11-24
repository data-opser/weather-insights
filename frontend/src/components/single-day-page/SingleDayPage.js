import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SingleDayPage.css";
import DayList from "./DayList";
import Hour from "./Hour";
import api from "../axiosConfig";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

const SingleDayPage = () => {
  const { date, cityId } = useParams();
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
        <>
          <DayList />
          <div className="hour-table">
            <div className="hour-table-main-text">
              <p>Local time</p>
              <p>East</p>
              <p>West</p>
              <p>It feels</p>
              <p>Pressure, mm</p>
              <p>Humidity, %</p>
              <p>Wind, m/s</p>
              <p>Precipitation probability, %</p>
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
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleDayPage;
