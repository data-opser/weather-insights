import './PollutionNotifications.css';
import AttentionNotification from './AttentionNotification'

const PollutionNotifications = () => {
    return (
        <div className="PollutionNotifications">
            <AttentionNotification />
            <AttentionNotification />
            <AttentionNotification />
        </div>
    );
}

export default PollutionNotifications;