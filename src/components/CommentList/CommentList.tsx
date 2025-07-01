import React, { useState, useEffect } from 'react';
import { Comment } from '../../types';
import { commentService } from '../../services/commentService';
import CommentItem from '../CommentItem/CommentItem';
import CommentForm from '../CommentForm/CommentForm';

interface CommentListProps {
  videoId: number;
}

const CommentList: React.FC<CommentListProps> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError('');
      try {
        const fetchedComments = await commentService.getComments(videoId);
        // Organize comments into tree structure
        const organizedComments = organizeCommentsTree(fetchedComments);
        setComments(organizedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [videoId]);

  const fetchComments = async () => {
    setLoading(true);
    setError('');
    try {
      const fetchedComments = await commentService.getComments(videoId);
      // Organize comments into tree structure
      const organizedComments = organizeCommentsTree(fetchedComments);
      setComments(organizedComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const organizeCommentsTree = (flatComments: Comment[]): Comment[] => {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // First pass: create map of all comments with empty replies array
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: organize into tree structure
    flatComments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id);
      if (!commentWithReplies) return;

      if (comment.parent_id) {
        // This is a reply, add it to parent's replies
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(commentWithReplies);
        }
      } else {
        // This is a root comment
        rootComments.push(commentWithReplies);
      }
    });

    return rootComments;
  };

  const handleCommentAdded = (newComment: Comment) => {
    // Refresh comments to get the updated tree structure
    fetchComments();
  };

  const handleCommentDeleted = (deletedCommentId: string) => {
    // Remove the comment and its replies from the state
    const removeCommentFromTree = (comments: Comment[]): Comment[] => {
      return comments
        .filter(comment => comment.id !== deletedCommentId)
        .map(comment => ({
          ...comment,
          replies: comment.replies ? removeCommentFromTree(comment.replies) : []
        }));
    };

    setComments(prevComments => removeCommentFromTree(prevComments));
  };

  if (loading) {
    return <div className="comments-loading">Loading comments...</div>;
  }

  if (error) {
    return (
      <div className="comments-error">
        <p>{error}</p>
        <button onClick={fetchComments} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="comment-list">
      <div className="comments-header">
        <h3>Comments ({comments.length})</h3>
      </div>

      <div className="comment-form-container">
        <CommentForm
          videoId={videoId}
          onCommentAdded={handleCommentAdded}
        />
      </div>

      <div className="comments-container">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              videoId={videoId}
              onCommentAdded={handleCommentAdded}
              onCommentDeleted={handleCommentDeleted}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentList;