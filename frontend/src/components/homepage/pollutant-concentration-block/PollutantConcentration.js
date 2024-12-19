import React, { useEffect, useState } from "react";
import './PollutantConcentration.css';
import { GiGooeyMolecule, GiMolecule } from "react-icons/gi";
import { SiMoleculer } from "react-icons/si";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { FaCity } from "react-icons/fa";
import api from '../../axiosConfig';

const PollutantConcentration = ({ cityId, isCityListEmpty, pollutionData, setPollutionData, setMessages }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPollutionData = async () => {
      if (!cityId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/airpollution/city?city=${cityId}`);
        const data = response.data.pollution_data;

        const formattedData = [
          { name: 'SO₂', concentration: data.SO2[0], status: data.SO2[1], icon: <GiGooeyMolecule /> },
          { name: 'NO₂', concentration: data.NO2[0], status: data.NO2[1], icon: <GiMolecule /> },
          { name: 'CO', concentration: data.CO[0], status: data.CO[1], icon: <SiMoleculer /> },
        ];

        setPollutionData(formattedData);
        setMessages(response.data.messages);
      } catch (error) {
        setError('Failed to fetch pollution data');
        console.error(error.message + error.status);
      } finally {
        setLoading(false);
      }
    };

    fetchPollutionData();
  }, [cityId]);

  if (isCityListEmpty) {
    return (
      <div className='pollutant-container'>
        <div className="loading">
          <FaCity className='img' alt='city' />
          <h1>Your city list is empty</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="pollutant-container">
      {loading && (
        <div className='loading'>
          <HiOutlineCog6Tooth className='cog' alt='loading cog' />
          <h1>Loading...</h1>
        </div>)
      }
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && !isCityListEmpty && (
        <>
          <p className="header-text">Pollutant concentration</p>
          <div className="concentration-block">
            {pollutionData.map((pollutant, index) => (
              <div key={index} className={`pollutant-card ${pollutant.status.toLowerCase()}`}>
                <div className="main-text">
                  <div className="icon">
                    {pollutant.icon}
                  </div>
                  <p className="name-text">{pollutant.name}</p>
                  <p className="concentration-text">{pollutant.concentration} µg/m³</p>
                  <p className="status-text">{pollutant.status}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PollutantConcentration;
