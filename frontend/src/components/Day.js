import { GoSun } from "react-icons/go";
import { BsSnow } from "react-icons/bs";
import { BsCloudRainHeavy } from "react-icons/bs";
import { BsCloudsFill } from "react-icons/bs";
import { WiRaindrop } from "react-icons/wi";
import '../styles/Day.css';

function Day({ date, weather, tempMin, tempMax, humidity, wind }) {
  const getWeatherIcon = () => {
    switch (weather) {
      case 'Snow':
        return <BsSnow className="weather-icon snow" title="snowy weather" />;
      case 'Clouds':
        return <BsCloudsFill className="weather-icon clouds" title="cloudy weather" />;
      case 'Rain':
        return <BsCloudRainHeavy className="weather-icon rain" title="rainy weather" />;
      default:
        return <GoSun className="weather-icon clear" title="sunny weather" />;
    }
  };

  const formatTemperature = (temp) => (temp !== undefined ? Math.round(temp) : 'N/A');

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    const date = new Date(dateString).toLocaleDateString('en-US', options);
    return date.replace(/([a-zA-Z]+)(?=\s)/, '$1.');
  };

  return (
    <div className={`day ${weather.toLowerCase()}`}>
      <p>{formatDate(date)}</p>
      {getWeatherIcon()}
      <p>{formatTemperature(tempMin)}° / {formatTemperature(tempMax)}°</p>
      <div className="rain">
        <WiRaindrop className="raindrop" />
        <p>{humidity !== undefined ? `${Math.round(humidity)}%` : 'N/A'}</p>
      </div>
      <p>{wind !== undefined ? `${Math.round(wind)} m/s` : 'N/A'}</p>
    </div>
  );
}

export default Day;
