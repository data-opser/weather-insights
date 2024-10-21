import '../styles/Form.css';
import form_weather_icon from '../images/form-weather-icon.png';
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";

function Form() {
  return (
    <div className='form'>
      <div className='column'>
        <button className='return-button'>
          <IoArrowBack className='button' />
        </button>
        <img className='form-weather-icon' src={form_weather_icon} alt='form-weather-icon'></img>
      </div>
      <div className='column'>
        <form className='data-form'>
          <h1>Welcome back</h1>          
          <div className='input-field'>
            <MdOutlineEmail className='icon' />
            <input type='email' placeholder='email'></input>
          </div>
          <div className='input-field'>
            <MdOutlineEmail className='icon' />
            <input type='password' placeholder='password'></input>
          </div>
          <button type='submit'>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Form;