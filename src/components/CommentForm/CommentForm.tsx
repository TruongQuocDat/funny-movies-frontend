import React, { useState } from 'react';
import { commentService } from '../../services/commentService';
import { Comment } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface CommentFormProps {
  videoId: number;
  parentId?: string;
  onCommentAdded: (comment: Comment) => void;
  onCancel?: () => void;
  placeholder?: string;
  submitText?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  videoId,
  parentId,
  onCommentAdded,
  onCancel,
  placeholder = "Write a comment...",
  submitText = "Comment"
}) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || loading || !currentUser) return;

    setLoading(true);
    setError('');

    try {
      const commentData = {
        content: content.trim(),
        video_id: videoId,
        parent_id: parentId
      };

      const newComment = parentId 
        ? await commentService.createReply(commentData)
        : await commentService.createComment(commentData);

      onCommentAdded(newComment);
      setContent('');
      if (onCancel) onCancel();
    } catch (error) {
      console.error('Error creating comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="comment-form-login-prompt">
        <p>Please login to leave a comment.</p>
      </div>
    );
  }

  return (
    <form className="comment-form" onSubmit={handleSubmit}>
      {error && <div className="comment-form-error">{error}</div>}
      <div className="comment-form-input-container">
        <textarea
          className="comment-form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={3}
          disabled={loading}
          required
        />
      </div>
      <div className="comment-form-actions">
        {onCancel && (
          <button
            type="button"
            className="comment-form-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="comment-form-submit"
          disabled={loading || !content.trim()}
        >
          {loading ? 'Posting...' : submitText}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;