import React, { useEffect, useState } from "react";
import './ConcentrationBlock.css';
import { GiGooeyMolecule } from "react-icons/gi";
import { GiMolecule } from "react-icons/gi";
import { SiMoleculer } from "react-icons/si";

function ConcentrationBlock() {

    const pollutans = [
        {name: 'S0₂', concentration: 15, status: 'Good', icon: <GiGooeyMolecule />},
        {name: 'N0₂', concentration: 41, status: 'Fair', icon: <GiMolecule />},
        {name: 'CO', concentration: 12450, status: 'Moderate', icon: <SiMoleculer />},
    ];

    return (
        <div className="concentration-block">
            {pollutans.map((pollutant, index) => (
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
    )
}

export default ConcentrationBlock;