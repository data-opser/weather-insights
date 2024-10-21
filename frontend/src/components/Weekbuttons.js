import React, { useState } from 'react';
import '../styles/Weekbuttons.css'

function Weekbuttons() {
    // Створюємо стан для збереження стану кнопок
    const [activeButton, setActiveButton] = useState(null);

    // Функція для обробки натискання на кнопку
    const handleButtonClick = (index) => {
        // Якщо кнопка вже активна, знімаємо виділення, інакше активуємо її
        setActiveButton(activeButton === index ? null : index);
    };

    return (
        <div className="week-buttons">
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

export default Weekbuttons;