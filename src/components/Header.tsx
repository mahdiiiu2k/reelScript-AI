
import React from 'react';
import { Video } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Header = () => {
  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-200/50 dark:border-slate-700/50 sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Logo and title */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 rounded-xl shadow-lg flex items-center">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                Reel Script AI
              </h1>
              <p className="text-sm text-gray-600 dark:text-slate-400">Generate viral Instagram reel scripts</p>
            </div>
          </div>
          
          {/* Right side: Theme Toggle */}
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
