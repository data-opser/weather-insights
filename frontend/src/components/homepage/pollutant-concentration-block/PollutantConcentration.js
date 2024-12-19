import React, { useEffect, useState } from "react";
import './PollutantConcentration.css';
import './ConcentrationBlock.css';
import { GiGooeyMolecule, GiMolecule } from "react-icons/gi";
import { SiMoleculer } from "react-icons/si";
import api from '../../axiosConfig';

const PollutantConcentration = ({ cityId, isCityListEmpty }) => {
  const [pollutionData, setPollutionData] = useState([]);
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
      } catch (error) {
        setError('Failed to fetch pollution data');
        console.error(error.message + error.status);
      } finally {
        setLoading(false);
      }
    };

    fetchPollutionData();
  }, [cityId]);

  return (
    <div className="pollutant-container">
      <p className="header-text">Pollutant concentration</p>
      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && isCityListEmpty && <p className="empty-list-text">Your city list is empty</p>}
      {!loading && !error && !isCityListEmpty && (
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
      )}
    </div>
  );
};

export default PollutantConcentration;
