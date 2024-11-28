import './Notifications.css';
import raincloud from './raincloud.jfif'

const Notifications = () => {
  return (
    <div className="notifications">
      <p className='user-text-bold'>Last notifications</p>
      <div className='notification'>
        <div className='notification-weather'>
          <img src={raincloud}></img>
          <p className='notification-name'>Rain Alert</p>
        </div>
        <p className='notification-text'>Expected rain in your area within the next 30 minutes. <span className='notification-text-bold'>Don't forget to bring an umbrella if you're heading out!</span></p>
        <p className='notification-time'>Today, 09:00</p>
      </div>
      <div className='notification'>
        <div className='notification-weather'>
          <img src={raincloud}></img>
          <p className='notification-name'>Rain Alert</p>
        </div>
        <p className='notification-text'>Expected rain in your area within the next 30 minutes. <span className='notification-text-bold'>Don't forget to bring an umbrella if you're heading out!</span></p>
        <p className='notification-time'>Today, 09:00</p>
      </div>
      <div className='notification'>
        <div className='notification-weather'>
          <img src={raincloud}></img>
          <p className='notification-name'>Rain Alert</p>
        </div>
        <p className='notification-text'>Expected rain in your area within the next 30 minutes. <span className='notification-text-bold'>Don't forget to bring an umbrella if you're heading out!</span></p>
        <p className='notification-time'>Today, 09:00</p>
      </div>
      <button className='user-button'>
        View all
      </button>
    </div>
  );
};

export default Notifications;