import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Notification } from './types';
import { subscribeToNotifications } from './services/webSocketService';
import Header from './components/HeaderForm/Header';
import VideoList from './components/VideoForm/VideoList';
import ShareForm from './components/ShareForm/ShareForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import NotificationComponent from './components/Notification/NotificationComponent';

const App: React.FC = () => {
  const [videos, setVideos] = useState([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const fetchVideos = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/v1/videos`)
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => console.error('Error fetching videos:', error));
  };

  const handleHideNotification = (index: number) => {
    setNotifications(prevNotifications => prevNotifications.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchVideos();

    const isLoggedIn = localStorage.getItem('jwtToken');

    if (isLoggedIn) {
      subscribeToNotifications((notification: Notification) => {
        setNotifications(prev => [...prev, notification]);
      });
    }
  }, []);

  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/" element={<VideoList videos={videos} />} />
          <Route path="/share" element={<ShareForm onVideoShared={fetchVideos} />} />
        </Routes>

        {notifications.map((notif, index) => (
          <NotificationComponent
            key={index}
            notification={notif}
            onHide={() => handleHideNotification(index)}
          />
        ))}
      </div>
    </Router>
  );
};

export default App;
