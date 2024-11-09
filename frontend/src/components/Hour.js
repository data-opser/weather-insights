import React from 'react';
import '../styles/Hour.css';

function Hour() {
    return (
        <div className="hour-column">
            <div className="hour-header">
                <p className="hour-time">0:00</p>
                <div className="hour-icon">🌧️</div>
                <p className="hour-temp">+2°</p>
            </div>
            <p className="hour-feels">0°</p>
            <p className="hour-pressure">767</p>
            <p className="hour-humidity">49</p>
            <p className="hour-wind">4.1→</p>
            <p className="hour-precipitation">2</p>
        </div>
    );
}

export default Hour;