import React, { useState } from 'react';
import { Comment } from '../../types';
import { commentService } from '../../services/commentService';
import { useAuth } from '../../contexts/AuthContext';
import CommentForm from '../CommentForm/CommentForm';
import EmotionButtons from '../EmotionButtons/EmotionButtons';

interface CommentItemProps {
  comment: Comment;
  videoId: number;
  onCommentAdded: (comment: Comment) => void;
  onCommentDeleted: (commentId: string) => void;
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  videoId,
  onCommentAdded,
  onCommentDeleted,
  level = 0
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReplyAdded = (reply: Comment) => {
    onCommentAdded(reply);
    setShowReplyForm(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    setIsDeleting(true);
    try {
      await commentService.deleteComment(videoId, comment.id);
      onCommentDeleted(comment.id);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const canDelete = comment.can_delete || 
    (currentUser && currentUser.id === comment.user.id);

  return (
    <div className={`comment-item ${level > 0 ? 'comment-reply' : ''}`} style={{ marginLeft: `${level * 20}px` }}>
      <div className="comment-header">
        <span className="comment-author">{comment.user.name || comment.user.email}</span>
        <span className="comment-date">{formatDate(comment.created_at)}</span>
        {canDelete && (
          <button
            className="comment-delete-btn"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete comment"
          >
            {isDeleting ? '...' : '🗑️'}
          </button>
        )}
      </div>
      
      <div className="comment-content">
        {comment.content}
      </div>

      <div className="comment-actions">
        <EmotionButtons 
          targetType="Comment" 
          targetId={comment.id}
          className="comment-emotions"
        />
        
        {currentUser && (
          <button
            className="comment-reply-btn"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            Reply
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="comment-reply-form">
          <CommentForm
            videoId={videoId}
            parentId={comment.id}
            onCommentAdded={handleReplyAdded}
            onCancel={() => setShowReplyForm(false)}
            placeholder="Write a reply..."
            submitText="Reply"
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              videoId={videoId}
              onCommentAdded={onCommentAdded}
              onCommentDeleted={onCommentDeleted}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;