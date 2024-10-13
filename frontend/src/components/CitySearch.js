import '../styles/CitySearch.css'
import { IoIosSearch } from "react-icons/io";

function CitySearch() {
    return (
      <div className="CitySearch">
        <input type='text' placeholder='City...'></input>
            <IoIosSearch className='loopa'/>
      </div>
    );
  }
  
  export default CitySearch;