import React, { useState } from 'react';
import EmotionButtons from '../EmotionButtons/EmotionButtons';
import CommentList from '../CommentList/CommentList';

interface VideoItemProps {
  id: number;
  title: string;
  sharedBy: string;
  description: string;
  youtubeURL: string;
}

const VideoItem: React.FC<VideoItemProps> = ({ id, title, sharedBy, description, youtubeURL }) => {
  const [showComments, setShowComments] = useState(false);

  const getYouTubeID = (url: string | undefined | null): string | null => {
    if (typeof url !== 'string') {
      console.error('getYouTubeID was called without a url string:', url);
      return null;
    }
  
    const regExp = /^.*(youtu\.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#&?]*).*/;
    const match = url.match(regExp);
  
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoID = getYouTubeID(youtubeURL);

  const embedURL = `https://www.youtube.com/embed/${videoID}`;

  return (
    <div className="video-item">
      <div className="video-thumbnail">
        <iframe
          width="auto"
          height="315"
          src={embedURL}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className="video-info">
        <h2>{title}</h2>
        <p>Shared by: {sharedBy}</p>
        <div className="description">{description}</div>
        
        <div className="video-actions">
          <EmotionButtons 
            targetType="Video" 
            targetId={id.toString()}
            className="video-emotions"
          />
          
          <button 
            className="toggle-comments-btn"
            onClick={() => setShowComments(!showComments)}
          >
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
        </div>

        {showComments && (
          <div className="video-comments">
            <CommentList videoId={id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoItem;
