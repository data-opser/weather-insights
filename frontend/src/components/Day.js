import { GoSun } from "react-icons/go";
import { WiRaindrop } from "react-icons/wi";
import '../styles/Day.css';

function Day({ date, weather, tempMin, tempMax, humidity, wind }) {
  const getWeatherIcon = () => {
    switch (weather) {
      case 'Snow':
        return <GoSun className="sun snow" title="Snow" />;
      case 'Clouds':
        return <GoSun className="sun clouds" title="Clouds" />;
      case 'Rain':
        return <WiRaindrop className="raindrop rain" title="Rain" />;
      default:
        return <GoSun className="sun default" title="Default weather" />;
    }
  };

  const formatTemperature = (temp) => (temp !== undefined ? Math.round(temp) : 'N/A');

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short' };
    const date = new Date(dateString).toLocaleDateString('en-US', options);
    return date.replace(/([a-zA-Z]+)(?=\s)/, '$1.');
  };

  return (
    <div className="day">
      <p>{formatDate(date)}</p>
      <GoSun className="sun" title="Default weather" />
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
