import React from "react";
import "./Hour.css";
import { GoSun } from "react-icons/go";
function Hour({ time, temperature, temperature_feels_like, pressure, humidity, wind_speed, precipitation }) {
  
  const checkValue = (value) => (value ? value : 0);

  return (
    <div className="hour-column">
      <div className="hour-header">
        <p className="hour-time">{time}</p>
        <div className="hour-icon-container">
          <GoSun className="hour-icon" />
        </div>
        <p className="hour-temp">{Math.round(temperature)}°</p>
      </div>
      <p className="hour-feels">{Math.round(temperature_feels_like)}°</p>
      <p className="hour-pressure">{checkValue(pressure)}</p>
      <p className="hour-humidity">{humidity}%</p>
      <p className="hour-wind">{Math.round(wind_speed)}</p>
      <p className="hour-precipitation">{checkValue(precipitation)}</p>
    </div>
  );
}

export default Hour;
