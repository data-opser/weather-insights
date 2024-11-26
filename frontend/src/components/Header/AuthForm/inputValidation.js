import { useState, useEffect } from 'react';

export const useValidation = (value, validations) => {
  const [isEmpty, setEmpty] = useState(true);
  const [minLengthError, setMinLengthError] = useState(false);
  const [maxLengthError, setMaxLengthError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [inputValid, setInputValid] = useState(false);

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'isEmpty':
          value ? setEmpty(false) : setEmpty(true);
          break;
        case 'minLength':
          value.length < validations[validation] ? setMinLengthError(true) : setMinLengthError(false);
          break;
        case 'maxLength':
          value.length > validations[validation] ? setMaxLengthError(true) : setMaxLengthError(false);
          break;
        case 'isEmail':
          const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
          regex.test(String(value).toLowerCase()) ? setEmailError(false) : setEmailError(true);
          break;
        default:
          break;
      }
    }
  }, [value]);

  useEffect(() => {
    if (isEmpty || minLengthError || maxLengthError || emailError) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  }, [isEmpty, minLengthError, maxLengthError, emailError]);

  return {
    isEmpty,
    minLengthError,
    maxLengthError,
    emailError,
    inputValid
  };
};

export const useInput = (initialValue, validations) => {
  const [value, setValue] = useState(initialValue);
  const [isDirty, setDirty] = useState(false);
  const valid = useValidation(value, validations);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onBlur = (e) => {
    setDirty(true);
  };

  const setDirtyState = (dirty) => setDirty(dirty);

  return {
    value,
    onChange,
    onBlur,
    setDirty: setDirtyState,
    isDirty,
    ...valid
  };
};