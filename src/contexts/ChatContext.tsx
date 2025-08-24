import { createContext, useContext, useState, ReactNode } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
  lastMessage: string;
  status: 'completed' | 'in-progress' | 'draft';
  messages: Message[];
}

interface ChatContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  input: string;
  setInput: (input: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  clearSearch: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  chatHistory: ChatSession[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  currentSessionId: string | null;
  setCurrentSessionId: (id: string | null) => void;
  startNewSearch: () => void;
  loadChatSession: (sessionId: string) => void;
  deleteChatSession: (sessionId: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const initialMessage: Message = {
  id: '1',
  content: 'Welcome to Synapse! I\'m your AI recruitment assistant. Describe your ideal candidate requirements (skills, experience, location, etc.) and I\'ll help you find just the perfect candidates! What type of candidate are you looking for?',
  role: 'assistant',
  timestamp: new Date(),
};

// Mock initial chat history
const mockInitialHistory: ChatSession[] = [
  {
    id: '1',
    title: 'Senior React Developer Search',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    messageCount: 8,
    lastMessage: 'Found 15 qualified candidates matching your requirements...',
    status: 'completed',
    messages: [
      {
        id: '1',
        content: 'Welcome to Synapse! 🎯 I\'m your AI recruitment assistant.',
        role: 'assistant',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        id: '2',
        content: 'Looking for a senior React developer with 5+ years experience',
        role: 'user',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 60000),
      }
    ]
  },
  {
    id: '2',
    title: 'Full Stack Engineer - Remote',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    messageCount: 12,
    lastMessage: 'Here are the top 3 candidates from your search...',
    status: 'completed',
    messages: [
      {
        id: '1',
        content: 'Welcome to Synapse! 🎯 I\'m your AI recruitment assistant.',
        role: 'assistant',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      }
    ]
  }
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>(mockInitialHistory);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const clearSearch = () => {
    setMessages([initialMessage]);
    setInput('');
    setIsLoading(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const generateSessionTitle = (messages: Message[]): string => {
    // Find the first user message to generate a title
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      // Take first 50 characters and add ellipsis if longer
      const title = firstUserMessage.content.slice(0, 50);
      return title.length < firstUserMessage.content.length ? `${title}...` : title;
    }
    return 'New Search';
  };

  const getSessionStatus = (messages: Message[]): ChatSession['status'] => {
    if (messages.length <= 1) return 'draft';
    const lastMessage = messages[messages.length - 1];
    return lastMessage.role === 'assistant' ? 'completed' : 'in-progress';
  };

  const startNewSearch = () => {
    // Save current session to history if it has more than just the initial message
    if (messages.length > 1) {
      const sessionId = Date.now().toString();
      const lastMessage = messages[messages.length - 1];
      
      const newSession: ChatSession = {
        id: sessionId,
        title: generateSessionTitle(messages),
        timestamp: new Date(),
        messageCount: messages.length,
        lastMessage: lastMessage.content.slice(0, 100) + (lastMessage.content.length > 100 ? '...' : ''),
        status: getSessionStatus(messages),
        messages: [...messages]
      };

      setChatHistory(prev => [newSession, ...prev]);
    }

    // Start new chat
    setMessages([initialMessage]);
    setInput('');
    setIsLoading(false);
    setCurrentSessionId(null);
    setIsSidebarOpen(true);
  };

  const loadChatSession = (sessionId: string) => {
    const session = chatHistory.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      setInput('');
      setIsLoading(false);
      setIsSidebarOpen(false);
    }
  };

  const deleteChatSession = (sessionId: string) => {
    setChatHistory(prev => prev.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      setMessages([initialMessage]);
      setCurrentSessionId(null);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        input,
        setInput,
        isLoading,
        setIsLoading,
        clearSearch,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        chatHistory,
        setChatHistory,
        currentSessionId,
        setCurrentSessionId,
        startNewSearch,
        loadChatSession,
        deleteChatSession,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
