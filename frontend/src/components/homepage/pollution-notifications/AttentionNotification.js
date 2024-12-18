import './AttentionNotification.css';
import { RxCross2 } from "react-icons/rx";
import { BiSolidError } from "react-icons/bi";

const AttentionNotification = () => {
  return (
    <div className='AttentionNotification'>
      <BiSolidError className="attention-img" />
      <div className="attention-info">
        <p className="attention-info-title">
          <span className="pollution-type">Poor</span>
          <span className="pollution-element">SO₂</span>
          Level
        </p>
        <p className="attention-info-main">The sulfur dioxide
          <span className="pollution-element">SO₂</span>
          level has reached
          <span className="pollution-quantity">300</span>
          µg/m³ — air quality is
          <span className="pollution-type">Poor</span>
          .
        </p>
        <p className="attention-info-tip">Avoid outdoor activities if you have respiratory conditions.</p>
      </div>
      <RxCross2 className="cross" />
    </div>
  );
}
export default AttentionNotification