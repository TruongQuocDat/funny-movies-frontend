// FlashMessage.tsx
import React, { useEffect, useState } from 'react';
import './flash.css';

interface FlashMessageProps {
  message: string;
  duration?: number;
}

const FlashMessage: React.FC<FlashMessageProps> = ({ message, duration = 5000 }) => {
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className='flash-message'>
      {message}
    </div>
  );
};

export default FlashMessage;
