import './Notifications.css';
import { RxCross2 } from "react-icons/rx";

const Notifications = () => {
  return (
    <div className='notifications'>
      <p className='user-text-center'>Scheduled notifications</p>
      <form>
        <div className="notification-city-block">
          <div className='notification-about-city'>
            <p className="notification-about-city-name">апапапапапапап</p>
            <p className="notification-about-city-time">25.12.2024</p>
            <RxCross2 className="close-button" />
          </div>
          <div className='notification-about-city'>
            <p className="notification-about-city-name">Kharkiv</p>
            <p className="notification-about-city-time">25.12.2024</p>
            <RxCross2 className="close-button" />
          </div>
          <div className='notification-about-city'>
            <p className="notification-about-city-name">Kharkiv</p>
            <p className="notification-about-city-time">25.12.2024</p>
            <RxCross2 className="close-button" />
          </div>
          <div className='notification-about-city'>
            <p className="notification-about-city-name">Kharkiv</p>
            <p className="notification-about-city-time">25.12.2024</p>
            <RxCross2 className="close-button" />
          </div>
          <div className='notification-about-city'>
            <p className="notification-about-city-name">Kharkiv</p>
            <p className="notification-about-city-time">25.12.2024</p>
            <RxCross2 className="close-button" />
          </div>
        </div>
        <p className='user-text-center'>Schedule the notification</p>
        <div className='notification-date-block'>
          <p>Date</p>
          <input type='date' className='date-input'></input>
        </div>
        <div className='notification-town-block'>
          <p>City</p>
          <input type='text' className='city-input'></input>
        </div>
        <div className='notification-title-block'>
          <p>Title</p>
          <input type='text' className='title-input'></input>
        </div>
        <p>Reminder Time</p>

        <div className="radio-buttons-block">
          <label>
            <input type="radio" name="radio" value="1 day"></input>
            <span>1 day</span>
          </label>
          <label>
            <input type="radio" name="radio" value="3 days"></input>
            <span>3 days</span>
          </label>
          <label>
            <input type="radio" name="radio" value="5 days"></input>
            <span>5 days</span>
          </label>
          <label>
            <input type="radio" name="radio" value="10 days"></input>
            <span>10 days</span>
          </label>
          <label>
            <input type="radio" name="radio" value="15 days"></input>
            <span>15 days</span>
          </label>
        </div>
        <button className='user-button'>
          Create
        </button>
      </form>
    </div>
  );
};

export default Notifications;