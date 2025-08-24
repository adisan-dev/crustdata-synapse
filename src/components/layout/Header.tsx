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
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">SYNAPSE</h1>
          <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">The best talent. At the Speed of Thought.</p>
        </div>
        
        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="terminal-border p-2 sm:px-3"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="terminal-border px-2 sm:px-3"
            onClick={handleClearSearch}
          >
            <span className="hidden sm:inline">Clear Search</span>
            <span className="sm:hidden">Clear</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="terminal-border bg-primary hover:bg-primary/90 px-2 sm:px-3"
            onClick={handleNewSearch}
          >
            <span className="hidden sm:inline">New Search</span>
            <span className="sm:hidden">New</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
