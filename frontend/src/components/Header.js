import '../styles/Header.css';
import logo from '../images/logo.png';

function Header() {
  return (
    <div className="header">
      <img className="logo" src={logo} alt="company-logo"></img>
      <p>Weather Insights</p>
    </div>
  );
}

export default Header;