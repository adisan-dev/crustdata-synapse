import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Clock, 
  User, 
  Bot,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  messageCount: number;
  lastMessage: string;
  status: 'completed' | 'in-progress' | 'draft';
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { 
    chatHistory, 
    currentSessionId, 
    loadChatSession, 
    deleteChatSession 
  } = useChatContext();

  const getStatusColor = (status: ChatSession['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'draft':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 24 * 7) {
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-background border-r border-border transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '320px' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="terminal-border p-4 m-4 mb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h2 className="font-semibold">Chat History</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Chat Sessions List */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2">
              {chatHistory.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No chat history yet
                </div>
              ) : (
                chatHistory.map((session) => (
                  <div
                    key={session.id}
                    className={`terminal-border p-3 cursor-pointer transition-colors hover:bg-accent/50 group ${
                      currentSessionId === session.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => loadChatSession(session.id)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-medium text-sm line-clamp-2 flex-1">
                        {session.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs px-2 py-0.5 ${getStatusColor(session.status)}`}
                      >
                        {session.status}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {session.lastMessage}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(session.timestamp)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {session.messageCount}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChatSession(session.id);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="terminal-border p-4 m-4 mt-2">
            <div className="text-xs text-muted-foreground text-center">
              {chatHistory.length} chat sessions
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button (when sidebar is closed) */}
      {!isOpen && (
        <Button
          variant="outline"
          size="sm"
          className="fixed left-4 top-1/2 -translate-y-1/2 z-30 terminal-border"
          onClick={onToggle}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}
