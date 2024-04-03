import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const ShareForm: React.FC<{ onVideoShared: () => void }> = ({ onVideoShared }) => {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await api.post('/api/v1/videos', { url });
      navigate('/');
      onVideoShared();
    } catch (error) {
      alert("An error occurred while sharing the video.");
    }
  };

  return (
    <div className="share-form">
      <h2>Share a YouTube movie</h2>
      <form onSubmit={handleSubmit}>
        <div className='share-form-url'>
          <label className='label-share-url' htmlFor="youtube-url">YouTube URL:</label>
          <input
            id="youtube-url"
            type="text"
            className="url-input"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="primary">Share</button>
      </form>
    </div>
  );
};

export default ShareForm;
