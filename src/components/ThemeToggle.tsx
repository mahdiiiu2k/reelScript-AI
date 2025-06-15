
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all duration-200 border border-transparent hover:border-gray-200 dark:hover:border-slate-600"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 text-gray-600 hover:text-gray-800 transition-colors" />
      ) : (
        <Sun className="h-4 w-4 text-yellow-400 hover:text-yellow-300 transition-colors" />
      )}
    </Button>
  );
};
