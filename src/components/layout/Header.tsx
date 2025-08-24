import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useChatContext } from '@/contexts/ChatContext';

export function Header() {
  const { theme, setTheme } = useTheme();
  const { clearSearch, startNewSearch } = useChatContext();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const handleNewSearch = () => {
    startNewSearch();
  };

  return (
    <header className="terminal-border p-4 m-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EASY2RECRUIT</h1>
          <p className="text-sm text-muted-foreground">Get the best candidate leads for your team!</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="terminal-border"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="terminal-border"
            onClick={handleClearSearch}
          >
            Clear Search
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="terminal-border bg-primary hover:bg-primary/90"
            onClick={handleNewSearch}
          >
            New Search
          </Button>
        </div>
      </div>
    </header>
  );
}
