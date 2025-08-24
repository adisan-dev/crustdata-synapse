import { Header } from '@/components/layout/Header';
import { ChatInterface } from '@/components/chat/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="h-[calc(100vh-120px)]">
        <div className="terminal-border mx-4 h-full">
          <ChatInterface />
        </div>
      </main>
    </div>
  );
};

export default Index;
