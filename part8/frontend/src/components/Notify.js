export const Notification = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="notification-container">
      <div className="notification-message">
        {message}
      </div>
    </div>
  );
};
