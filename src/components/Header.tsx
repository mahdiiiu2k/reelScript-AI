
import React from 'react';
import { Video } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Header = () => {
  return (
    <header className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Title, icon, and ThemeToggle grouped */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg flex items-center">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Reel Script AI
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Generate viral Instagram reel scripts</p>
            </div>
            {/* Theme Toggle right beside title */}
            <div className="ml-1 flex-shrink-0">
              <ThemeToggle />
            </div>
          </div>
          {/* Optional: Place for future actions (useful for wider screens) */}
        </div>
      </div>
    </header>
  );
};
