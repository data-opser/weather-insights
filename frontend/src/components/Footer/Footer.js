import './Footer.css';
import logo from '../Header/AuthForm/form-weather-icon.png';
import { BsQrCode } from "react-icons/bs";
import { LuPhoneCall } from "react-icons/lu";
import { BsEnvelope } from "react-icons/bs";

function Footer() {
  return (
    <div className="footer">
      <div className='footer-info'>
        <div className='footer-logo'>
          <img className="logo" src={logo} alt="company-logo"></img>
          <p className='lastblock'>&copy; 2024 Weather Insights</p>
        </div>
        <div className='mobile-app'>
          <p>Mobile application</p>
          <BsQrCode className='app-qrcode' />
        </div>
        <div className='phone-number'>
          <LuPhoneCall />
          <p>+380667751067</p>
        </div>
        <div className='our-email'>
          <BsEnvelope />
          <p>jekaaega228@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;