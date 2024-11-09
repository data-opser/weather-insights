import React from 'react';
import '../styles/PageHour.css';
import DayList from './DayList';
import Hour from './Hour';

function PageHour() {
    return(
        <div className='page-hour'>
            <DayList />
            <div className='hour-table'>
                <div className='hour-table-main-text'>
                    <p>Local time</p>
                    <p>East</p>
                    <p>West</p>
                    <p>It feels</p>
                    <p>Presure, mm</p>
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

export default PageHour;