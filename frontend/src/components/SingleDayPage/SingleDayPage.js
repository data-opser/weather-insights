import React from 'react';
import './SingleDayPage.css';
import DayList from './DayList';
import Hour from './Hour';

function SingleDayPage() {
  return (
    <div className='page-hour'>
      <DayList />
      <div className='hour-table'>
        <div className='hour-table-main-text'>
          <p>Local time</p>
          <p>East</p>
          <p>West</p>
          <p>It feels</p>
          <p>Pressure, mm</p>
          <p>Humidity, %</p>
          <p>Wind, m/s</p>
          <p>Precipitation probability, %</p>
        </div>
        <div className="hour-columns">
          {Array.from({ length: 24 }).map((_, index) => (
            <Hour key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SingleDayPage;