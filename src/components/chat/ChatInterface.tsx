import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant. How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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
    setInput('');
    setIsLoading(true);

    try {
      // Simulate AI response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `I understand you said: "${userMessage.content}". This is a demo response. In a real implementation, this would connect to an LLM API.`,
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
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
            className={`flex items-start gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <div className="terminal-border p-2 bg-accent">
                <Bot className="h-4 w-4 text-accent-foreground" />
              </div>
            )}
            
            <div
              className={`max-w-[70%] p-3 ${
                message.role === 'user' ? 'message-user' : 'message-assistant'
              }`}
            >
              <p className="text-sm font-medium leading-relaxed">
                {message.content}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>

            {message.role === 'user' && (
              <div className="terminal-border p-2 bg-muted">
                <User className="h-4 w-4" />
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
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="terminal-border p-4 m-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 terminal-border bg-input"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            variant="default"
            size="icon"
            className="terminal-border bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}