import React from 'react';
import { Video } from 'lucide-react';
export const Header = () => {
  return <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Reel Script AI
              </h1>
              <p className="text-sm text-muted-foreground">Generate viral Instagram reel scripts</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            
          </div>
        </div>
      </div>
    </header>;
};