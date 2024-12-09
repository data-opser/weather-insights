import { useEffect, useState } from 'react';
import './SunTime.css';
import { GoSun } from "react-icons/go";
import api from '../../axiosConfig';
import { FaCloud } from "react-icons/fa";

const SunTime = ({ cityId, isCityListEmpty }) => {
  const [activeButton, setActiveButton] = useState('sunrise');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSunTime = async () => {
      if (!cityId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/suntimes/city?city=${cityId}`);
        setData(response.data);
      } catch (error) {
        setError('Failed to fetch sun time');
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSunTime();
  }, [cityId]);

  const timeToDisplay = activeButton === 'sunrise' ? data?.sunrise_local_time : data?.sunset_local_time;

  return (
    <div className='sun-time'>
      <button
        className={`sun-button ${activeButton === 'sunrise' ? 'active' : ''}`}
        onClick={() => setActiveButton('sunrise')}
      >
        Sunrise
      </button>
      <button
        className={`sun-button ${activeButton === 'sunset' ? 'active' : ''}`}
        onClick={() => setActiveButton('sunset')}
      >
        Sunset
      </button>
      <div className='sun-block'>
        <GoSun className={`sun ${loading ? 'spinning' : ''}`} />
        <FaCloud className={`cloud ${activeButton === 'sunrise' ? 'not-to-show' : 'show'}`} />
      </div>
      {loading &&
        <div className='loading'>
          <h1>Loading...</h1>
        </div>
      }
      {!loading && isCityListEmpty &&
        <div className='loading'>
          <h1>Your city list is empty</h1>
        </div>
      }
      {error && <h1 style={{ color: 'red' }}>{error}</h1>}
      {data && !loading && !error && !isCityListEmpty && timeToDisplay && <h1>{timeToDisplay}</h1>}
    </div>
  );
};

export default SunTime;
