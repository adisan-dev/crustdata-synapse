# API Integration Guide

This document explains how the chat functionality integrates with the backend API service.

## Overview

The application uses a service layer (`src/services/api.ts`) to handle API communications for chat messages. Currently, it returns mock responses but is structured to easily switch to real API endpoints. **Conversation history and management are handled locally in the frontend for this demo.**

## API Service Structure

### Main Service Class: `ApiService`

Located in `src/services/api.ts`, this service handles:
- Chat message sending with conversation history
- Error handling and retry logic
- Environment-based configuration

### Key Interfaces

```typescript
interface ChatRequest {
  messages: ChatMessage[];
  currentMessage: string;
}

interface ChatResponse {
  message: string;
  candidates?: Candidate[];
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  skills: string[];
  matchScore: number;
  summary: string;
  contact?: {
    email?: string;
    linkedin?: string;
    phone?: string;
  };
}
```

## Configuration

### Environment Variables

Create a `.env.local` file (already created) with:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_API_KEY=your_api_key_here
NODE_ENV=development
```

### API Endpoint

When ready to connect to real API, the service expects this endpoint:

**POST /chat** - Send chat message with conversation history
- Request: `ChatRequest` (includes full conversation history + current message)
- Response: `ChatResponse` (AI response + optional candidate data)

## Current Implementation

### Mock Response System

The service currently uses `getMockResponse()` which:
- Simulates realistic API delays (1-3 seconds)
- Returns varied, realistic candidate data
- Provides different response formats for variety
- Includes proper error handling structure

### Switching to Real API

To switch from mock to real API:

1. Ensure your backend API is running on the configured URL
2. In `src/services/api.ts`, uncomment the real API call in `sendChatMessage()`
3. Comment out or remove the mock response call

## Usage in Components

### ChatInterface Component

The `ChatInterface` component uses the API service like this:

```typescript
import { apiService } from '@/services/api';

// In handleSend function:
const response = await apiService.sendChatMessage({
  messages: messages, // Full conversation history
  currentMessage: messageContent, // Current user message
});
```

### Local Conversation Management

- **Chat History**: Stored locally using React Context (`ChatContext`)
- **New/Clear Search**: Handled locally by clearing the messages array
- **Conversation Persistence**: Uses browser's local storage (if implemented)

### Error Handling

The service includes comprehensive error handling:
- Network errors
- API response errors
- Timeout handling
- User-friendly error messages via toast notifications

## Mock Data Features

The current mock implementation includes:
- 3 realistic candidate profiles
- Varied response formats (bullet points, analysis, summaries)
- Realistic skills and experience data
- Contact information structure
- Match scoring system

## Future Enhancements

When integrating with real API, consider adding:
- Request caching
- Offline support
- Request queuing
- Advanced error recovery
- Analytics tracking
- Rate limiting handling

## Testing

The mock system allows for easy testing of:
- UI responsiveness during loading states
- Error handling flows
- Different response formats
- Candidate data display
- Conversation management

## Security Considerations

- API keys are handled via environment variables
- All requests include proper headers
- Error messages don't expose sensitive information
- CORS configuration will be needed for production
