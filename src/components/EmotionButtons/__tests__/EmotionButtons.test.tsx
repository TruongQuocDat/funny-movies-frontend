import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmotionButtons from '../EmotionButtons';
import { emotionService } from '../../../services/emotionService';
import { useAuth } from '../../../contexts/AuthContext';

// Mock the services and context
jest.mock('../../../services/emotionService');
jest.mock('../../../contexts/AuthContext');

const mockEmotionService = emotionService as jest.Mocked<typeof emotionService>;
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('EmotionButtons', () => {
  const mockEmotionSummary = {
    like: 5,
    love: 2,
    angry: 1,
    dislike: 0,
    user_emotion: undefined
  };

  beforeEach(() => {
    mockEmotionService.getEmotionSummary.mockResolvedValue(mockEmotionSummary);
    mockEmotionService.setEmotion.mockResolvedValue({} as any);
    mockEmotionService.removeEmotion.mockResolvedValue();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders emotion buttons with counts', async () => {
    mockUseAuth.mockReturnValue({
      currentUser: { id: '1', email: 'test@example.com' },
      login: jest.fn(),
      logout: jest.fn()
    });

    render(<EmotionButtons targetType="Video" targetId="1" />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument(); // like count
      expect(screen.getByText('2')).toBeInTheDocument(); // love count
      expect(screen.getByText('1')).toBeInTheDocument(); // angry count
      expect(screen.getByText('0')).toBeInTheDocument(); // dislike count
    });
  });

  it('disables buttons when user is not logged in', async () => {
    mockUseAuth.mockReturnValue({
      currentUser: null,
      login: jest.fn(),
      logout: jest.fn()
    });

    render(<EmotionButtons targetType="Video" targetId="1" />);

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });
  });

  it('handles emotion click when user is logged in', async () => {
    const user = userEvent.setup();
    mockUseAuth.mockReturnValue({
      currentUser: { id: '1', email: 'test@example.com' },
      login: jest.fn(),
      logout: jest.fn()
    });

    render(<EmotionButtons targetType="Video" targetId="1" />);

    await waitFor(() => {
      expect(screen.getByText('5')).toBeInTheDocument();
    });

    const likeButton = screen.getByTitle('Like');
    await user.click(likeButton);

    expect(mockEmotionService.setEmotion).toHaveBeenCalledWith({
      emotion_type: 'like',
      target_type: 'Video',
      target_id: '1'
    });
  });
});