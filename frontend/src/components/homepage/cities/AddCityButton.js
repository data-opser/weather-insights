import React, { useState, useRef } from 'react';
import { GoPlus } from "react-icons/go";
import { LiaExchangeAltSolid } from "react-icons/lia";
import './AddCityButton.css';
import SelectCityForm from './SelectCityForm';
import Modal from '../../Modal';
import { useAuth } from '../../authContext';

function AddCityButton({ addCity, setMainCity, changeDefaultCity }) {
  const { isLoggedIn } = useAuth();
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
        {isLoggedIn ? (
          <>
            <GoPlus className={`plus ${modalActive ? 'icon-blue' : ''}`} />
            <span className='add-city-button-text'>add new city</span>
          </>) : ( <>
            <LiaExchangeAltSolid className={`plus ${modalActive ? 'icon-blue' : ''}`} />
            <span className='add-city-button-text'>change city</span>
          </>)}
      </button>
      <Modal active={modalActive} setActive={setModalActive} onClose={handleModalClose}>
        <SelectCityForm
          ref={formRef}
          onClose={handleModalClose}
          addCity={addCity}
          setMainCity={setMainCity}
          changeDefaultCity={changeDefaultCity}
          isLoggedIn={isLoggedIn}
        />
      </Modal>
    </>
  );
}

export default AddCityButton;
