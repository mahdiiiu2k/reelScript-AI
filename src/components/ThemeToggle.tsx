
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full transition-all duration-500 ease-in-out shadow-lg border-2 border-gray-300 dark:border-gray-600 overflow-hidden"
      style={{
        background: theme === 'light' 
          ? 'linear-gradient(135deg, #87CEEB 0%, #98D8E8 50%, #B0E0E6 100%)' 
          : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Background elements for day mode */}
      {theme === 'light' && (
        <>
          {/* Clouds */}
          <div className="absolute top-1 right-2 w-2 h-1 bg-white rounded-full opacity-80" />
          <div className="absolute top-2 right-4 w-1.5 h-1 bg-white rounded-full opacity-60" />
          <div className="absolute bottom-1.5 right-1 w-2.5 h-1 bg-white rounded-full opacity-70" />
        </>
      )}
      
      {/* Background elements for night mode */}
      {theme === 'dark' && (
        <>
          {/* Stars */}
          <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
          <div className="absolute top-3 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-2 left-1 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-2 left-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
          
          {/* Sparkles */}
          <div className="absolute top-1.5 left-3 text-white text-xs opacity-80">✦</div>
          <div className="absolute bottom-1 left-5 text-white text-xs opacity-60">✧</div>
        </>
      )}
      
      {/* Toggle circle (sun/moon) */}
      <div
        className={`absolute top-0.5 w-7 h-7 rounded-full transition-all duration-500 ease-in-out transform shadow-md ${
          theme === 'light' 
            ? 'left-0.5 bg-gradient-to-br from-yellow-300 to-yellow-500' 
            : 'left-8 bg-gradient-to-br from-gray-200 to-gray-400'
        }`}
      >
        {/* Sun rays for light mode */}
        {theme === 'light' && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-0 left-1/2 w-0.5 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1" />
            <div className="absolute bottom-0 left-1/2 w-0.5 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2 translate-y-1" />
            <div className="absolute left-0 top-1/2 w-1 h-0.5 bg-yellow-400 rounded-full transform -translate-x-1 -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 w-1 h-0.5 bg-yellow-400 rounded-full transform translate-x-1 -translate-y-1/2" />
          </div>
        )}
        
        {/* Moon craters for dark mode */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-1.5 left-2 w-1.5 h-1.5 bg-gray-500 rounded-full opacity-50" />
            <div className="absolute bottom-2 left-1 w-1 h-1 bg-gray-500 rounded-full opacity-40" />
            <div className="absolute top-3 right-1.5 w-0.5 h-0.5 bg-gray-500 rounded-full opacity-60" />
          </>
        )}
      </div>
    </button>
  );
};
