import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="terminal-border p-4 m-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">FLUX CHAT</h1>
          <p className="text-sm text-muted-foreground">AI-Powered Terminal Chat Interface</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="terminal-border">
            Clear Chat
          </Button>
          <Button variant="default" size="sm" className="terminal-border bg-primary hover:bg-primary/90">
            New Chat
          </Button>
        </div>
      </div>
    </header>
  );
}