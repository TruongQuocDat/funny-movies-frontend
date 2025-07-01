import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentForm from '../CommentForm';
import { commentService } from '../../../services/commentService';
import { useAuth } from '../../../contexts/AuthContext';

// Mock the services and context
jest.mock('../../../services/commentService');
jest.mock('../../../contexts/AuthContext');

const mockCommentService = commentService as jest.Mocked<typeof commentService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('CommentForm', () => {
  const mockOnCommentAdded = jest.fn();
  const mockOnCancel = jest.fn();

  const mockComment = {
    id: '1',
    content: 'Test comment',
    user: { id: '1', email: 'test@example.com' },
    video_id: 1,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    mockCommentService.createComment.mockResolvedValue(mockComment);
    mockCommentService.createReply.mockResolvedValue(mockComment);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('shows login prompt when user is not logged in', () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      login: jest.fn(),
      logout: jest.fn()
    });

    render(
      <CommentForm
        videoId={1}
        onCommentAdded={mockOnCommentAdded}
      />
    );

    expect(screen.getByText('Please login to leave a comment.')).toBeInTheDocument();
  });

  it('renders comment form when user is logged in', () => {
    mockUseAuth.mockReturnValue({
      currentUser: { id: '1', email: 'test@example.com' },
      login: jest.fn(),
      logout: jest.fn()
    });

    render(
      <CommentForm
        videoId={1}
        onCommentAdded={mockOnCommentAdded}
      />
    );

    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Comment' })).toBeInTheDocument();
  });

  it('submits comment when form is filled and submitted', async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      currentUser: { id: '1', email: 'test@example.com' },
      login: jest.fn(),
      logout: jest.fn()
    });

    render(
      <CommentForm
        videoId={1}
        onCommentAdded={mockOnCommentAdded}
      />
    );

    const textarea = screen.getByPlaceholderText('Write a comment...');
    const submitButton = screen.getByRole('button', { name: 'Comment' });

    await user.type(textarea, 'This is a test comment');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCommentService.createComment).toHaveBeenCalledWith({
        content: 'This is a test comment',
        video_id: 1,
        parent_id: undefined
      });
      expect(mockOnCommentAdded).toHaveBeenCalledWith(mockComment);
    });
  });

  it('creates reply when parentId is provided', async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      currentUser: { id: '1', email: 'test@example.com' },
      login: jest.fn(),
      logout: jest.fn()
    });

    render(
      <CommentForm
        videoId={1}
        parentId="parent-comment-id"
        onCommentAdded={mockOnCommentAdded}
        onCancel={mockOnCancel}
        placeholder="Write a reply..."
        submitText="Reply"
      />
    );

    const textarea = screen.getByPlaceholderText('Write a reply...');
    const submitButton = screen.getByRole('button', { name: 'Reply' });

    await user.type(textarea, 'This is a test reply');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockCommentService.createReply).toHaveBeenCalledWith({
        content: 'This is a test reply',
        video_id: 1,
        parent_id: 'parent-comment-id'
      });
      expect(mockOnCommentAdded).toHaveBeenCalledWith(mockComment);
      expect(mockOnCancel).toHaveBeenCalled();
    });
  });
});