import React from "react";
import "./Hour.css";

function Hour({ time, temperature, temperature_feels_like, pressure, humidity, wind_speed, precipitation }) {
  return (
    <div className="hour-column">
      <div className="hour-header">
        <p className="hour-time">{time}</p>
        <div className="hour-icon">🌧️</div>
        <p className="hour-temp">{temperature}°</p>
      </div>
      <p className="hour-feels">{temperature_feels_like}°</p>
      <p className="hour-pressure">{pressure}</p>
      <p className="hour-humidity">{humidity}%</p>
      <p className="hour-wind">{wind_speed}</p>
      <p className="hour-precipitation">{precipitation}</p>
    </div>
  );
}

export default Hour;
