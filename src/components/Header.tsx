
import React from 'react';
import { Video } from 'lucide-react';

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-sm">
              <Video className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Reel Script AI
              </h1>
              <p className="text-sm text-gray-500">Generate viral Instagram reel scripts</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
