
import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from '@/components/UserMenu';
import { FeatherIcon } from '@/components/FeatherIcon';

export const Header = () => {
  return (
    <header className="w-full border-b border-gray-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg">
            <FeatherIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Script Expert
            </h1>
            <p className="text-sm text-gray-600 dark:text-slate-400">
              Generate viral scripts with AI expertise
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};
