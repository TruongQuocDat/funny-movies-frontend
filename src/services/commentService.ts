import api from '../utils/api';
import { Comment, CommentRequest } from '../types';

export const commentService = {
  // Get comments for a video
  getComments: async (videoId: number): Promise<Comment[]> => {
    const response = await api.get(`/api/v1/videos/${videoId}/comments`);
    return response.data;
  },

  // Create a new comment
  createComment: async (commentData: CommentRequest): Promise<Comment> => {
    const response = await api.post(`/api/v1/videos/${commentData.video_id}/comments`, {
      comment: commentData
    });
    return response.data;
  },

  // Create a reply to a comment
  createReply: async (commentData: CommentRequest): Promise<Comment> => {
    const response = await api.post(`/api/v1/videos/${commentData.video_id}/comments`, {
      comment: commentData
    });
    return response.data;
  },

  // Delete a comment
  deleteComment: async (videoId: number, commentId: string): Promise<void> => {
    await api.delete(`/api/v1/videos/${videoId}/comments/${commentId}`);
  },

  // Update a comment
  updateComment: async (videoId: number, commentId: string, content: string): Promise<Comment> => {
    const response = await api.patch(`/api/v1/videos/${videoId}/comments/${commentId}`, {
      comment: { content }
    });
    return response.data;
  }
};