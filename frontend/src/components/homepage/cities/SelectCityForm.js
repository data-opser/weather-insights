import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { IoArrowBack } from "react-icons/io5";
import { MdOutlinePlace } from "react-icons/md";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import './SelectCityForm.css';
import api from '../../axiosConfig';
import Flag from 'react-world-flags';

const SelectCityForm = forwardRef(({ onClose, addCity, setMainCity }, ref) => {
  const [cities, setCities] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMain, setIsMain] = useState(false);
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
      city.city.toLowerCase().includes(searchValue.toLowerCase()) ||
      city.country.toLowerCase().includes(searchValue.toLowerCase())
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
      const city = cities.find(city => city.city === searchValue);
      if (!city) {
        setMessage('City not found');
        setMessageType('error');
        return;
      }

      const response = await api.post(`/add_user_city/city?city=${city.id}`);
      city.admin_name = undefined;
      city.iso3 = undefined;
      city.is_main = isMain;
      addCity(city);
      if (isMain) {
        await api.put(`/set_main_user_city/city?city=${city.id}`);
        setMainCity(city.id);
      }
      console.log(response.data.message);

      setMessage(`${searchValue} ${isMain ? 'set as main and ' : ''}added successfully!`);
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
    setIsMain(false);
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
      <div className='row-first'>
        <button type="button" className="back-button" onClick={closeForm}>
          <IoArrowBack className="arrow" />
        </button>
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
      </div>


      {isDropdownVisible && (
        <div className='city-block'>
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
                  {city.city}
                  <div className='country'>
                    <p>{city.country}</p>
                    <div className='flag-container'>
                      <Flag className='city-flag' code={city.iso2} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="city">No cities found</div>
            )}
          </div>
          <div className="checkbox-field">
            <label>
              <input
                type="checkbox"
                checked={isMain}
                onChange={(e) => setIsMain(e.target.checked)}
              />
              set as main
            </label>
          </div>
          <div className="form-buttons">
            <button type="submit">Add</button>

          </div>
        </div>
      )}
      {message && (
        <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </form>
  );
});

export default SelectCityForm;
