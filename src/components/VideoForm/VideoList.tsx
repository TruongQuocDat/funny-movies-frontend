import React from 'react';
import VideoItem from './VideoItem';

interface VideoListProps {
  videos: Array<{
    id: number;
    title: string;
    user: string;
    description: string;
    url: string;
  }>;
}

const VideoList: React.FC<VideoListProps> = ({ videos }) => {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <VideoItem
          key={video.id}
          title={video.title}
          sharedBy={video.user}
          description={video.description}
          youtubeURL={video.url}
        />
      ))}
    </div>
  );
};

export default VideoList;
