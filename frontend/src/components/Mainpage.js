import '../styles/Mainpage.css'
import CitySearch from './CitySearch';
import Weekbuttons from './CityList';
import Day from './Day';
import AddCityButton from './AddCityButton';

function Mainpage() {
  return (
    <div className="main-page">
      {/*<div className='top-elements'>
        <CitySearch />
        <Weekbuttons />
      </div>
      <div className='day-elements'>
        <Dayweather />
        <Dayweather /> 
        <Dayweather /> 
        <Dayweather /> 
        <Dayweather />
      </div>
      <AddCityButton />*/}
      <div className='cities'>
        <AddCityButton />
        <Weekbuttons />
      </div>
      <div className='days'>
        <h1>Weather for the next five days</h1>
        <div className='day-table'>
          <Day />
          <Day />
          <Day />
          <Day />
          <Day />
        </div>
      </div>
    </div>
  );
}

export default Mainpage;