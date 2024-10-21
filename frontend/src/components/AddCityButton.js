import React, { useState } from 'react';
import { GoPlus } from "react-icons/go";
import '../styles/AddCityButton.css';

function AddCityButton() {
    const [isClicked, setIsClicked] = useState(false);

    // Функція для зміни стану кнопки при натисканні
    const handleClick = () => {
        setIsClicked(!isClicked); // змінюємо стан на протилежний при натисканні
    };

    return (
        <button 
            className={`add-city-button ${isClicked ? 'blue' : ''}`} 
            onClick={handleClick}
        >
            <GoPlus className='plus'/> Add New City
        </button>
    );
}

export default AddCityButton;