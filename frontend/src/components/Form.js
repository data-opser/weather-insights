import '../styles/Form.css';
import form_weather_icon from '../images/form-weather-icon.png';
import google_icon from '../images/google-icon.png';
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

function Form() {
  return (
    <div className='form'>
      <div className='column'>
        <button className='return-button'>
          <IoArrowBack className='return-arrow' />
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
            <RiLockPasswordLine className='icon' />
            <input type='password' placeholder='password'></input>
          </div>
          <button type='submit'>Login</button>
          <div className='link'>
            <p>Haven't got an account?</p> 
            <a href='#'>Sign up</a> 
          </div>          
        </form>        
      </div>
      <img src={google_icon} className='google-icon'></img>
    </div>
  );
}

export default Form;