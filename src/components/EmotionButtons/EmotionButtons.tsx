import React, { useState, useEffect } from 'react';
import { emotionService } from '../../services/emotionService';
import { EmotionSummary } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface EmotionButtonsProps {
  targetType: 'Video' | 'Comment';
  targetId: string;
  className?: string;
}

const EmotionButtons: React.FC<EmotionButtonsProps> = ({ targetType, targetId, className }) => {
  const [emotions, setEmotions] = useState<EmotionSummary>({
    like: 0,
    love: 0,
    angry: 0,
    dislike: 0
  });
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEmotions = async () => {
      try {
        const emotionData = await emotionService.getEmotionSummary(targetType, targetId);
        setEmotions(emotionData);
      } catch (error) {
        console.error('Error fetching emotions:', error);
      }
    };

    fetchEmotions();
  }, [targetType, targetId]);

  const fetchEmotions = async () => {
    try {
      const emotionData = await emotionService.getEmotionSummary(targetType, targetId);
      setEmotions(emotionData);
    } catch (error) {
      console.error('Error fetching emotions:', error);
    }
  };

  const handleEmotionClick = async (emotionType: 'like' | 'love' | 'angry' | 'dislike') => {
    if (!currentUser || loading) return;

    setLoading(true);
    try {
      if (emotions.user_emotion === emotionType) {
        // Remove emotion if clicking the same one
        await emotionService.removeEmotion(targetType, targetId);
      } else {
        // Set new emotion
        await emotionService.setEmotion({
          emotion_type: emotionType,
          target_type: targetType,
          target_id: targetId
        });
      }
      await fetchEmotions();
    } catch (error) {
      console.error('Error updating emotion:', error);
    } finally {
      setLoading(false);
    }
  };

  const emotionConfig = [
    { type: 'like' as const, icon: '👍', label: 'Like' },
    { type: 'love' as const, icon: '❤️', label: 'Love' },
    { type: 'angry' as const, icon: '😠', label: 'Angry' },
    { type: 'dislike' as const, icon: '👎', label: 'Dislike' }
  ];

  return (
    <div className={`emotion-buttons ${className || ''}`}>
      {emotionConfig.map(({ type, icon, label }) => (
        <button
          key={type}
          className={`emotion-button ${emotions.user_emotion === type ? 'active' : ''} ${!currentUser ? 'disabled' : ''}`}
          onClick={() => handleEmotionClick(type)}
          disabled={!currentUser || loading}
          title={currentUser ? label : 'Login to react'}
        >
          <span className="emotion-icon">{icon}</span>
          <span className="emotion-count">{emotions[type]}</span>
        </button>
      ))}
    </div>
  );
};

export default EmotionButtons;