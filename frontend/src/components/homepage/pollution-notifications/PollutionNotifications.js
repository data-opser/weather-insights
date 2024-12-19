import './PollutionNotifications.css';
import AttentionNotification from './AttentionNotification';

const PollutionNotifications = ({ active, messages = [], pollutionData = {} }) => {
  const formattedMessages = messages.map((msg) => {
    const [pollutant, details] = Object.entries(msg)[0];

    // Перевірка, чи є такий ключ у pollutionData
    const status = pollutionData[pollutant]?.[1] || "Unknown";

    return {
      pollutant,
      details,
      status,
    };
  });

  return (
    <div className={`PollutionNotifications ${active ? 'active' : ''}`}>
      {formattedMessages.length > 0 ? (
        formattedMessages.map((message, index) => (
          <AttentionNotification key={index} message={message} />
        ))
      ) : (
        <p>No alerts</p>
      )}
    </div>
  );
};

export default PollutionNotifications;
