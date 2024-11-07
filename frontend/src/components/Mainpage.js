import '../styles/Mainpage.css'
import CitySearch from './CitySearch';
import Weekbuttons from './CityList';
import Day from './Day';
import AddCityButton from './AddCityButton';

function Mainpage() {
  return (
    <div className="main-page">
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
      <div className='sun-time'>
        
      </div>
      <div className='map'>
        
      </div>
    </div>
  );
}

export default Mainpage;