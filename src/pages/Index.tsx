import { Header } from '@/components/layout/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatProvider } from '@/contexts/ChatContext';
import { useChatContext } from '@/contexts/ChatContext';

const IndexContent = () => {
  const { isSidebarOpen, toggleSidebar } = useChatContext();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-80' : 'ml-0'}`}>
        <Header />
        <main className="h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)]">
          <div className="terminal-border mx-2 sm:mx-4 h-full">
            <ChatInterface />
          </div>
        </main>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <ChatProvider>
      <IndexContent />
    </ChatProvider>
  );
};

export default Index;
