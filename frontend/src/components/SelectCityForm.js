import React, { forwardRef, useEffect, useState, useCallback } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { MdOutlinePlace } from "react-icons/md";
import '../styles/SelectCityForm.css';
import api from './services/axiosConfig';
import debounce from 'lodash/debounce';

const SelectCityForm = forwardRef((props, ref) => {
  const [cities, setCities] = useState([]);
  const [value, setValue] = useState('');

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

  const handleInputChange = useCallback(
    debounce((inputValue) => setValue(inputValue), 300),
    []
  );

  const filteredCities = cities.filter(city =>
    city.city.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <form className='city-form'>
      <div className='search-field'>
        <MdOutlinePlace className='icon' />
        <input
          type="text"
          placeholder="Enter city"
          onChange={(e) => handleInputChange(e.target.value)}
        />
      </div>
      {value && (
        <div className='cities'>
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <div className='city' key={index}>{city.city || 'Unknown City'}</div>
            ))
          ) : (
            <div className='city'>No cities found</div>
          )}
        </div>
      )}
      <button type="submit">Add</button>
      <button type="button" className='return-button' onClick={props.onClose}>
        <IoArrowBack className='return-arrow' />
      </button>
    </form>
  );
});

export default SelectCityForm;
