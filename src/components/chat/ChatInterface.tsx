import { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChatContext } from '@/contexts/ChatContext';
import { apiService, type ChatMessage } from '@/services/api';

// Use the ChatMessage interface from the API service
type Message = ChatMessage;

export function ChatInterface() {
  const { messages, setMessages, input, setInput, isLoading, setIsLoading } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Call the API service with conversation history
      const response = await apiService.sendChatMessage({
        messages: messages,
        currentMessage: messageContent,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('Chat API error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-2 sm:gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="terminal-border p-1.5 sm:p-2 bg-accent flex-shrink-0">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-accent-foreground" />
              </div>
            )}
            
            <div
              className={`max-w-[85%] sm:max-w-[70%] p-2 sm:p-3 ${
                message.role === 'user' ? 'message-user' : 'message-assistant'
              }`}
            >
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {message.content}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="terminal-border p-1.5 sm:p-2 bg-muted flex-shrink-0">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="terminal-border p-2 bg-accent">
              <Bot className="h-4 w-4 text-accent-foreground animate-pulse" />
            </div>
            <div className="message-assistant p-3">
              <p className="text-sm">Searching for candidates...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="terminal-border p-2 sm:p-4 m-2 sm:m-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Describe your ideal candidate (e.g., 'Senior React developer with 5+ years experience in San Francisco')...or just dump the Job Description here ;)"
            disabled={isLoading}
            className="flex-1 terminal-border bg-input text-sm"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            variant="default"
            size="icon"
            className="terminal-border bg-primary hover:bg-primary/90 flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
