import React, { useEffect, useState } from 'react';
import { Notification } from '../../types/index';

interface NotificationProps {
  notification: Notification;
  onHide: () => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({ notification, onHide }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onHide();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onHide]);

  if (!isVisible) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed', bottom: '20px', right: '20px', backgroundColor: 'lightblue',
      padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,.3)'
    }}>
      {notification.title} shared by {notification.user}
    </div>
  );
};

export default NotificationComponent;
