import React from "react";
import "./Hour.css";
import { GoSun } from "react-icons/go";
import { BsSnow, BsCloudRainHeavy, BsCloudsFill } from "react-icons/bs";

function Hour({ time, temperature, temperature_feels_like, pressure_ground_level, humidity, wind_speed, snow_precipitation, rain_precipitation, weather }) {

  const checkValue = (value) => (value ? value : 0);

  const getWeatherIcon = () => {
    switch(weather) {
      case "Snow":
        return <BsSnow className="hour-icon snow" title="snowy weather" />;
      case "Clouds":
        return <BsCloudsFill className="hour-icon clouds" title="cloudy weather" />;
      case "Rain":
        return <BsCloudRainHeavy className="hour-icon rain" title="rainy weather" />;
      default:
        return <GoSun className="hour-icon clear" title="sunny weather" />;
    }
  };

  return (
    <div className="hour-column">
      <div className={`hour-header ${weather.toLowerCase()}`}>
        <p className="hour-time">{time}</p>
        <div className="hour-icon-container">
          {getWeatherIcon()}
        </div>
        <p className="hour-temp">{Math.round(temperature)}°</p>
      </div>
      <p className="hour-feels">{Math.round(temperature_feels_like)}°</p>
      <p className="hour-pressure">{checkValue(pressure_ground_level)}</p>
      <p className="hour-humidity">{humidity}%</p>
      <p className="hour-wind">{Math.round(wind_speed)}</p>
      <p className="hour-precipitation">{rain_precipitation + snow_precipitation}</p>
    </div>
  );
}

export default Hour;
