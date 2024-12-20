import './Notifications.css';
import { RxCross2 } from "react-icons/rx";
import { useState, useEffect } from 'react';
import { GrStatusGood } from "react-icons/gr";
import { GrCircleAlert } from "react-icons/gr";
import api from '../axiosConfig';

const Notifications = () => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationDate, setNotificationDate] = useState('');
  const [cityId, setCityId] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedDays, setSelectedDays] = useState([0]);
  const [message, setMessage] = useState('');
  const [cities, setCities] = useState([]);
  const [isCityValid, setIsCityValid] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get('/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      const filtered = cities.filter(city =>
        city.city.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);

      const isValid = filtered.some(city => city.city.toLowerCase() === value.toLowerCase());
      setIsCityValid(isValid);

      if (isValid) {
        const validCity = filtered.find(city => city.city.toLowerCase() === value.toLowerCase());
        setCityId(validCity.id);
      } else {
        setCityId(null);
      }
    } else {
      setFilteredCities([]);
      setIsCityValid(false);
      setCityId(null);
    }
  };

  const handleCheckboxChange = (day) => {
    setSelectedDays((prevSelectedDays) => {
      if (prevSelectedDays.includes(day)) {
        return prevSelectedDays.filter((selectedDay) => selectedDay !== day);
      } else {
        return [...prevSelectedDays, day];
      }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!isCityValid) {
      setMessage('Selected city not found');
      return;
    }

    const payload = {
      notification_title: notificationTitle,
      notification_date: notificationDate,
      city_id: cityId,
      notify_in_days: selectedDays,
    };

    try {
      const response = await api.post('/add_user_scheduled_notifications', payload);
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error creating notifications:', error, 'status: ', error.status);
      setMessage('Failed to create notification');
    }
  };

  return (
    <div className='notifications'>
      <p className='user-text-center'>Scheduled notifications</p>
      <div className="notification-city-block">
        <div className='notification-about-city'>
          <p className="notification-about-city-name">апапапапапапап</p>
          <p className="notification-about-city-time">25.12.2024</p>
          <RxCross2 className="close-button" />
        </div>
        <div className='notification-about-city'>
          <p className="notification-about-city-name">Kharkiv</p>
          <p className="notification-about-city-time">25.12.2024</p>
          <RxCross2 className="close-button" />
        </div>
      </div>
      <form onSubmit={handleFormSubmit}>
        <p className='user-text-center'>Schedule the notification</p>
        <div className='notification-date-block'>
          <p>Date</p>
          <input
            type='date'
            className='date-input'
            value={notificationDate}
            onChange={(e) => setNotificationDate(e.target.value)}
            required
          />
        </div>
        <div className='notification-town-block'>
          <p>City</p>
          <input
            type='text'
            className='city-input'
            value={searchValue}
            onChange={handleSearchChange}
            required
          />
          {searchValue && (
            isCityValid
              ? <GrStatusGood className='status-icon good' />
              : <GrCircleAlert className='status-icon bad' />
          )}
        </div>
        <div className='notification-title-block'>
          <p>Title</p>
          <input
            type='text'
            className='title-input'
            value={notificationTitle}
            onChange={(e) => setNotificationTitle(e.target.value)}
            required
          />
        </div>
        <p>When to remind</p>
        <div className="radio-buttons-block">
          {[0, 1, 3, 5, 10, 15].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                checked={selectedDays.includes(day)}
                onChange={() => handleCheckboxChange(day)}
              />
              <span>
                {day === 0 ? 'today' : `${day} day${day > 1 ? 's' : ''}`}
              </span>
            </label>
          ))}
        </div>

        <button type='submit' className='user-button'>
          Create
        </button>
      </form>
      {message && <p className='status'>{message}</p>}
    </div>
  );
};

export default Notifications;
