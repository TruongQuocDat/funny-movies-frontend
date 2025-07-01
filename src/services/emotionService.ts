import api from '../utils/api';
import { Emotion, EmotionRequest, EmotionSummary } from '../types';

export const emotionService = {
  // Get emotion summary for a target (video or comment)
  getEmotionSummary: async (targetType: 'Video' | 'Comment', targetId: string): Promise<EmotionSummary> => {
    const endpoint = targetType === 'Video' 
      ? `/api/v1/videos/${targetId}/emotions/summary`
      : `/api/v1/comments/${targetId}/emotions/summary`;
    const response = await api.get(endpoint);
    return response.data;
  },

  // Create or update emotion
  setEmotion: async (emotionData: EmotionRequest): Promise<Emotion> => {
    const endpoint = emotionData.target_type === 'Video'
      ? `/api/v1/videos/${emotionData.target_id}/emotions`
      : `/api/v1/comments/${emotionData.target_id}/emotions`;
    
    const response = await api.post(endpoint, {
      emotion: {
        emotion_type: emotionData.emotion_type
      }
    });
    return response.data;
  },

  // Remove emotion
  removeEmotion: async (targetType: 'Video' | 'Comment', targetId: string): Promise<void> => {
    const endpoint = targetType === 'Video'
      ? `/api/v1/videos/${targetId}/emotions`
      : `/api/v1/comments/${targetId}/emotions`;
    
    await api.delete(endpoint);
  }
};