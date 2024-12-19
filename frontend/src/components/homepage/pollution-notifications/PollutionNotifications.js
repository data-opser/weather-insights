import './PollutionNotifications.css';
import AttentionNotification from './AttentionNotification';

const PollutionNotifications = ({ active }) => {
  return (
    <div className={`PollutionNotifications ${active ? 'active' : ''}`}>
      <AttentionNotification />
      <AttentionNotification />
      <AttentionNotification />
    </div>
  );
}

export default PollutionNotifications;