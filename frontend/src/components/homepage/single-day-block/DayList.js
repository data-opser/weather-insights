import React, { useState } from 'react';
import './DayList.css';

function DayList() {
  const [activeButton, setActiveButton] = useState(6);

  const handleButtonClick = (index) => {
    setActiveButton(activeButton === index ? null : index);
  };

  return (
    <div className="day-list">
      <button
        className={activeButton === 1 ? 'blue' : ''}
        onClick={() => handleButtonClick(1)}
      >
        Day 1
      </button>
      <button
        className={activeButton === 2 ? 'blue' : ''}
        onClick={() => handleButtonClick(2)}
      >
        Day 2
      </button>
      <button
        className={activeButton === 3 ? 'blue' : ''}
        onClick={() => handleButtonClick(3)}
      >
        Day 3
      </button>
      <button
        className={activeButton === 4 ? 'blue' : ''}
        onClick={() => handleButtonClick(4)}
      >
        Day 4
      </button>
      <button
        className={activeButton === 5 ? 'blue' : ''}
        onClick={() => handleButtonClick(5)}
      >
        Day 5
      </button>
      <button
        className={activeButton === 6 ? 'blue' : ''}
        onClick={() => handleButtonClick(6)}
      >
        Week
      </button>
    </div>
  );
}

export default DayList;