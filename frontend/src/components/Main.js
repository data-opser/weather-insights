import '../styles/Main.css'
import CitySearch from './CitySearch';
import Weekbuttons from './Weekbuttons';
import Dayweather from './Dayweather';
import AddCityButton from './AddCityButton';

function Main() {
  return (
    <div className="Main">
      <div className='top-elements'>
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
      <AddCityButton />            
    </div>
  );
}

export default Main;