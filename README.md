# Funny Movies Frontend

A React TypeScript application for sharing and discussing funny YouTube videos.

## Features

### Core Features
- **User Authentication**: Login/logout/registration with JWT tokens
- **Video Sharing**: Share YouTube videos with title and description
- **Video List**: Browse all shared videos with embedded YouTube players
- **Real-time Notifications**: WebSocket-based notifications for new shares

### Comment & Reply System
- **Nested Comments**: Tree-structured comment system with unlimited reply depth
- **Real-time Updates**: Comments update in real-time as they're added
- **Permission-based Deletion**: Users can delete their own comments, admins and video owners can delete any comments
- **Contextual Actions**: Reply forms appear inline with cancel functionality

### Emotion System
- **Multi-emotion Support**: Like (👍), Love (❤️), Angry (😠), and Dislike (👎) reactions
- **Video & Comment Reactions**: Apply emotions to both videos and individual comments  
- **One Emotion per Target**: Users can have only one active emotion per video/comment
- **Real-time Counts**: Emotion counts update immediately with visual feedback
- **Guest Limitations**: Non-logged-in users can view emotions but cannot react

## Technical Architecture

### Frontend Stack
- **React 18** with TypeScript for type safety
- **React Router** for client-side routing
- **Axios** with interceptors for API communication
- **ActionCable** for WebSocket real-time features
- **Context API** for authentication state management

### Component Structure
```
src/
├── components/
│   ├── CommentForm/        # Comment/reply creation forms
│   ├── CommentItem/        # Individual comment display with actions
│   ├── CommentList/        # Comment tree container with loading states
│   ├── EmotionButtons/     # Emotion reaction buttons with counts
│   ├── VideoForm/          # Video listing and individual video items
│   ├── LoginForm/          # Authentication forms
│   └── ShareForm/          # Video sharing form
├── services/
│   ├── commentService.ts   # Comment/reply API operations
│   ├── emotionService.ts   # Emotion API operations
│   └── webSocketService.ts # Real-time notification handling
├── contexts/
│   └── AuthContext.tsx     # User authentication state
└── types/
    └── index.tsx           # TypeScript type definitions
```

### API Integration
- **RESTful API**: Standard CRUD operations for videos, comments, and emotions
- **JWT Authentication**: Secure token-based authentication with automatic header injection
- **Error Handling**: Comprehensive error states with retry mechanisms
- **Loading States**: Visual feedback for all async operations

### Permission System
- **Comment Deletion**: Users can delete their own comments, video owners and admins can delete any comments on their videos
- **Emotion Reactions**: Only authenticated users can add/remove emotions
- **Reply Creation**: Only authenticated users can reply to comments
- **Video Actions**: Full comment/emotion functionality available on all videos

### User Experience Features
- **Optimistic UI**: Immediate visual feedback before server confirmation
- **Nested Reply Threads**: Visual indentation and threading for reply conversations
- **Toggle Comments**: Collapsible comment sections to reduce clutter
- **Responsive Design**: Mobile-friendly interface with touch-optimized interactions
- **Loading Indicators**: Clear loading states for all async operations
- **Error Recovery**: Retry mechanisms and clear error messaging

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Environment Variables

Create a `.env` file in the root directory with:

```
REACT_APP_API_URL=http://localhost:3001
```

Replace with your backend API URL.

## Development

### Adding New Features
1. Define TypeScript types in `src/types/index.tsx`
2. Create API service functions in `src/services/`
3. Build React components with proper error handling
4. Add comprehensive tests for new functionality
5. Update this README with feature documentation

### Testing Strategy
- **Unit Tests**: Component testing with React Testing Library
- **Integration Tests**: API service testing with mocked responses
- **User Experience Tests**: Authentication flows and permission checks
- **Error Scenarios**: Network failures and edge cases

### Code Quality
- **TypeScript**: Strict type checking for runtime safety
- **ESLint**: Code quality and consistency enforcement
- **React Hooks**: Proper dependency arrays and effect cleanup
- **Performance**: Optimized renders and efficient state updates

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).