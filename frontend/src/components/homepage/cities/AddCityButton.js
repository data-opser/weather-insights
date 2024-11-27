import React, { useState, useRef } from 'react';
import { GoPlus } from "react-icons/go";
import './AddCityButton.css';
import SelectCityForm from './SelectCityForm';
import Modal from '../../Modal';

function AddCityButton( { addCity, setMainCity } ) {
  const [modalActive, setModalActive] = useState(false);
  const formRef = useRef();

  const handleClick = () => {
    setModalActive(true);
  };

  const handleModalClose = () => {
    if (formRef.current) {
      formRef.current.clearForm();
    }
    setModalActive(false);
  };

  return (
    <>
      <button
        className={`add-city-button ${modalActive ? 'blue' : ''}`}
        onClick={handleClick}
      >
        <GoPlus className={`plus ${modalActive ? 'icon-blue' : ''}`} />
        <span className='add-city-button-text'>add new city</span>
      </button>
      <Modal active={modalActive} setActive={setModalActive} onClose={handleModalClose}>
        <SelectCityForm ref={formRef} onClose={handleModalClose} addCity={addCity} setMainCity={setMainCity} />
      </Modal>
    </>
  );
}

export default AddCityButton;
