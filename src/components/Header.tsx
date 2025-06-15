import React from 'react';
import { Video, Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white/90 backdrop-blur-xl border-b border-purple-100/50 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl blur-sm opacity-75 animate-pulse"></div>
              <div className="relative p-3 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-lg">
                <Video className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Reel Script AI
              </h1>
              <p className="text-sm text-gray-600 font-medium">Generate viral Instagram reel scripts with AI</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200/50">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">AI Powered</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};