export interface Notification {
  title: string;
  user: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Video {
  id: number;
  title: string;
  user: string;
  description: string;
  url: string;
  user_id?: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  video_id: number;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
  can_delete?: boolean;
}

export interface CommentRequest {
  content: string;
  video_id: number;
  parent_id?: string;
}

export interface Emotion {
  id: string;
  emotion_type: 'like' | 'love' | 'angry' | 'dislike';
  user: User;
  target_type: 'Video' | 'Comment';
  target_id: string;
  created_at: string;
}

export interface EmotionRequest {
  emotion_type: 'like' | 'love' | 'angry' | 'dislike';
  target_type: 'Video' | 'Comment';
  target_id: string;
}

export interface EmotionSummary {
  like: number;
  love: number;
  angry: number;
  dislike: number;
  user_emotion?: 'like' | 'love' | 'angry' | 'dislike';
}
