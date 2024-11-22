import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { MdOutlinePlace } from "react-icons/md";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import '../styles/SelectCityForm.css';
import api from './services/axiosConfig';
import Flag from 'react-world-flags';

const SelectCityForm = forwardRef(({ onClose }, ref) => {
  const [cities, setCities] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const getCities = async () => {
    try {
      const response = await api.get('/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  useEffect(() => {
    getCities();
  }, []);

  const filteredCities = searchValue
    ? cities.filter(city =>
        city.city.toLowerCase().includes(searchValue.toLowerCase())
      )
    : cities;

  const toggleDropdown = () => {
    setIsDropdownVisible((prevState) => !prevState);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
  
    try {
      const cityId = cities.find(city => city.city === searchValue)?.id;
      if (!cityId) {
        setMessage('City not found');
        setMessageType('error');
        return;
      }
  
      const response = await api.post(`add_user_city/city?city=${cityId}`);
      console.log(response.data.message);
  
      setMessage(`${searchValue} added successfully!`);
      setMessageType('success');
      clearForm(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage('Failed to add city');
      setMessageType('error');
    }
  };
  
  const clearForm = (isFull = true) => {
    setSearchValue('');
    setIsDropdownVisible(false);
    if (isFull) {
      setMessage('');
      setMessageType('');
    }    
  };

  const closeForm = () => {
    clearForm();
    if (onClose) onClose();
  };

  useImperativeHandle(ref, () => ({
    clearForm
  }));

  return (
    <form className="city-form" onSubmit={handleSubmit}>
      <div className="search-field">
        <MdOutlinePlace className="icon" />
        <input
          type="text"
          placeholder="Enter city"
          value={searchValue}
          onChange={handleInputChange}
        />
        <div
          className="dropdown-icon"
          onClick={toggleDropdown}
        >
          {isDropdownVisible ? <AiOutlineUp className='icon-tr' /> : <AiOutlineDown className='icon-tr' />}
        </div>
      </div>

      {isDropdownVisible && (
        <div className="cities">
          {filteredCities.length > 0 ? (
            filteredCities.map((city) => (
              <div
                className="city"
                key={city.id}
                onClick={() => {
                  setSearchValue(city.city);
                }}
              >
                {city.city} <div className='country'><p>{city.country}</p> <Flag className='city-flag' code={city.iso2}/></div> 
              </div>
            ))
          ) : (
            <div className="city">No cities found</div>
          )}
        </div>
      )}

      {message && (
        <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <button type="submit">Add</button>
      <button type="button" className="return-button" onClick={closeForm}>
        <IoArrowBack className="return-arrow" />
      </button>
    </form>
  );
});

export default SelectCityForm;
