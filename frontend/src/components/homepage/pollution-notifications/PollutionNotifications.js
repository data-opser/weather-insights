import './PollutionNotifications.css';
import AttentionNotification from './AttentionNotification';

const PollutionNotifications = ({ active, messages = [], pollutionData = [] }) => {
  const formattedMessages = messages.map((msg) => {
    const [pollutant, details] = Object.entries(msg)[0];

    const normalizedPollutant = pollutant.replace(/₂/g, "2");
    const pollutantData = pollutionData.find((data) => data.name.replace(/₂/g, "2") === normalizedPollutant);
    const status = pollutantData ? pollutantData.status : "Unknown";

    return {
      pollutant: pollutantData ? pollutantData.name : pollutant,
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
