
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full transition-all duration-500 ease-in-out shadow-lg hover:shadow-xl border-2 border-gray-300 dark:border-gray-600 overflow-hidden hover:scale-105 active:scale-95"
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
          {/* Clouds with subtle animation */}
          <div className="absolute top-1 right-2 w-2 h-1 bg-white rounded-full opacity-80 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute top-2 right-4 w-1.5 h-1 bg-white rounded-full opacity-60 animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-1.5 right-1 w-2.5 h-1 bg-white rounded-full opacity-70 animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
        </>
      )}
      
      {/* Background elements for night mode */}
      {theme === 'dark' && (
        <>
          {/* Twinkling stars */}
          <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
          <div className="absolute top-3 left-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-2 left-1 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
          <div className="absolute top-2 left-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDuration: '1.8s', animationDelay: '1.5s' }} />
          
          {/* Animated sparkles */}
          <div className="absolute top-1.5 left-3 text-white text-xs opacity-80 animate-pulse" style={{ animationDuration: '3s' }}>✦</div>
          <div className="absolute bottom-1 left-5 text-white text-xs opacity-60 animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1s' }}>✧</div>
        </>
      )}
      
      {/* Toggle circle (sun/moon) with enhanced styling */}
      <div
        className={`absolute top-0.5 w-7 h-7 rounded-full transition-all duration-500 ease-in-out transform shadow-lg hover:shadow-xl ${
          theme === 'light' 
            ? 'left-0.5 bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-yellow-200' 
            : 'left-8 bg-gradient-to-br from-gray-200 to-gray-400 shadow-gray-300'
        }`}
      >
        {/* Enhanced sun rays for light mode */}
        {theme === 'light' && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-0 left-1/2 w-0.5 h-1.5 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1.5 opacity-80" />
            <div className="absolute bottom-0 left-1/2 w-0.5 h-1.5 bg-yellow-400 rounded-full transform -translate-x-1/2 translate-y-1.5 opacity-80" />
            <div className="absolute left-0 top-1/2 w-1.5 h-0.5 bg-yellow-400 rounded-full transform -translate-x-1.5 -translate-y-1/2 opacity-80" />
            <div className="absolute right-0 top-1/2 w-1.5 h-0.5 bg-yellow-400 rounded-full transform translate-x-1.5 -translate-y-1/2 opacity-80" />
            {/* Diagonal rays */}
            <div className="absolute top-1 right-1 w-0.5 h-1 bg-yellow-400 rounded-full transform rotate-45 translate-x-0.5 -translate-y-0.5 opacity-60" />
            <div className="absolute top-1 left-1 w-0.5 h-1 bg-yellow-400 rounded-full transform -rotate-45 -translate-x-0.5 -translate-y-0.5 opacity-60" />
            <div className="absolute bottom-1 right-1 w-0.5 h-1 bg-yellow-400 rounded-full transform -rotate-45 translate-x-0.5 translate-y-0.5 opacity-60" />
            <div className="absolute bottom-1 left-1 w-0.5 h-1 bg-yellow-400 rounded-full transform rotate-45 -translate-x-0.5 translate-y-0.5 opacity-60" />
          </div>
        )}
        
        {/* Enhanced moon craters for dark mode */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-1.5 left-2 w-1.5 h-1.5 bg-gray-500 rounded-full opacity-40" />
            <div className="absolute bottom-2 left-1 w-1 h-1 bg-gray-500 rounded-full opacity-30" />
            <div className="absolute top-3 right-1.5 w-0.5 h-0.5 bg-gray-500 rounded-full opacity-50" />
            <div className="absolute top-2 left-3 w-0.5 h-0.5 bg-gray-400 rounded-full opacity-35" />
          </>
        )}
      </div>
      
      {/* Subtle glow effect */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
        theme === 'light' 
          ? 'shadow-inner shadow-blue-200/30' 
          : 'shadow-inner shadow-blue-900/50'
      }`} />
    </button>
  );
};
