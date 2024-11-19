import React, { useState } from 'react';
import '../styles/CityList.css';

function CityList() {
  const [activeButton, setActiveButton] = useState(6);

  const handleButtonClick = (index) => {
    setActiveButton(activeButton === index ? null : index);
  };

  return (
    <div className="city-list">
      <button
        className={activeButton === 1 ? 'blue' : ''}
        onClick={() => handleButtonClick(1)}
      >
        London
      </button>
      <button
        className={activeButton === 2 ? 'blue' : ''}
        onClick={() => handleButtonClick(2)}
      >
        Paris
      </button>
      <button
        className={activeButton === 3 ? 'blue' : ''}
        onClick={() => handleButtonClick(3)}
      >
        Denver
      </button>
      <button
        className={activeButton === 4 ? 'blue' : ''}
        onClick={() => handleButtonClick(4)}
      >
        Miami
      </button>
      <button
        className={activeButton === 5 ? 'blue' : ''}
        onClick={() => handleButtonClick(5)}
      >
        Kyiv
      </button>
      <button
        className={activeButton === 6 ? 'blue' : ''}
        onClick={() => handleButtonClick(6)}
      >
        Kharkiv
      </button>
    </div>
  );
}

export default CityList;