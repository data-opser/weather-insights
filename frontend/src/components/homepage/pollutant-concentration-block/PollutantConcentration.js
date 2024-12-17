import React, { useEffect, useState } from "react";
import './PollutantConcentration.css';
import ConcentrationBlock from "./ConcentrationBlock";

function PollutantConcentration() {
    return(
        <div className="pollutant-container">
            <p className="header-text">Pollutant concentration</p>
            <ConcentrationBlock />
        </div>
    )
} 

export default PollutantConcentration;