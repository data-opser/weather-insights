import './AttentionNotification.css';
import { BiSolidError } from "react-icons/bi";

const AttentionNotification = ({ message }) => {
  const { pollutant, details, status } = message;

  return (
    <div className='AttentionNotification'>
      <BiSolidError className="attention-img" />
      <div className="attention-info">
        <p className="attention-info-title">
          <span className="pollution-type">{status}</span>
          <span className="pollution-element">{pollutant}</span>
          Level
        </p>
        <p className="attention-info-main">{details}</p>
      </div>
    </div>
  );
};

export default AttentionNotification;
