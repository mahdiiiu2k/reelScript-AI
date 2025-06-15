
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full transition-all duration-500 ease-in-out bg-white/20 dark:bg-slate-800/30 backdrop-blur-md border border-gray-200/30 dark:border-slate-600/30 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 overflow-hidden"
      style={{
        background: theme === 'light' 
          ? 'linear-gradient(135deg, rgba(135, 206, 235, 0.3) 0%, rgba(152, 216, 232, 0.4) 50%, rgba(176, 224, 230, 0.3) 100%)' 
          : 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(51, 65, 85, 0.8) 50%, rgba(71, 85, 105, 0.7) 100%)'
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Background elements for day mode */}
      {theme === 'light' && (
        <>
          {/* Soft clouds with glassmorphism */}
          <div className="absolute top-1 right-2 w-2 h-1 bg-white/60 rounded-full opacity-80 animate-pulse backdrop-blur-sm" style={{ animationDuration: '3s' }} />
          <div className="absolute top-2 right-4 w-1.5 h-1 bg-white/50 rounded-full opacity-70 animate-pulse backdrop-blur-sm" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-1.5 right-1 w-2.5 h-1 bg-white/70 rounded-full opacity-60 animate-pulse backdrop-blur-sm" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />
        </>
      )}
      
      {/* Background elements for night mode */}
      {theme === 'dark' && (
        <>
          {/* Subtle twinkling stars */}
          <div className="absolute top-1 left-2 w-0.5 h-0.5 bg-white/80 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
          <div className="absolute top-3 left-4 w-0.5 h-0.5 bg-white/70 rounded-full animate-pulse" style={{ animationDuration: '1.5s', animationDelay: '0.5s' }} />
          <div className="absolute bottom-2 left-1 w-0.5 h-0.5 bg-white/60 rounded-full animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1s' }} />
          <div className="absolute top-2 left-6 w-0.5 h-0.5 bg-white/75 rounded-full animate-pulse" style={{ animationDuration: '1.8s', animationDelay: '1.5s' }} />
          
          {/* Soft sparkles */}
          <div className="absolute top-1.5 left-3 text-white/60 text-xs animate-pulse" style={{ animationDuration: '3s' }}>✦</div>
          <div className="absolute bottom-1 left-5 text-white/50 text-xs animate-pulse" style={{ animationDuration: '2.5s', animationDelay: '1s' }}>✧</div>
        </>
      )}
      
      {/* Toggle circle with glassmorphism styling */}
      <div
        className={`absolute top-0.5 w-7 h-7 rounded-full transition-all duration-500 ease-in-out transform backdrop-blur-md border border-white/20 dark:border-slate-400/20 ${
          theme === 'light' 
            ? 'left-0.5 bg-gradient-to-br from-yellow-200/80 to-yellow-400/90 shadow-lg shadow-yellow-200/30' 
            : 'left-8 bg-gradient-to-br from-slate-200/90 to-slate-300/95 shadow-lg shadow-slate-300/20'
        }`}
      >
        {/* Refined sun rays for light mode */}
        {theme === 'light' && (
          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-0 left-1/2 w-0.5 h-1.5 bg-yellow-300/70 rounded-full transform -translate-x-1/2 -translate-y-1.5 opacity-80" />
            <div className="absolute bottom-0 left-1/2 w-0.5 h-1.5 bg-yellow-300/70 rounded-full transform -translate-x-1/2 translate-y-1.5 opacity-80" />
            <div className="absolute left-0 top-1/2 w-1.5 h-0.5 bg-yellow-300/70 rounded-full transform -translate-x-1.5 -translate-y-1/2 opacity-80" />
            <div className="absolute right-0 top-1/2 w-1.5 h-0.5 bg-yellow-300/70 rounded-full transform translate-x-1.5 -translate-y-1/2 opacity-80" />
            {/* Diagonal rays */}
            <div className="absolute top-1 right-1 w-0.5 h-1 bg-yellow-300/60 rounded-full transform rotate-45 translate-x-0.5 -translate-y-0.5 opacity-60" />
            <div className="absolute top-1 left-1 w-0.5 h-1 bg-yellow-300/60 rounded-full transform -rotate-45 -translate-x-0.5 -translate-y-0.5 opacity-60" />
            <div className="absolute bottom-1 right-1 w-0.5 h-1 bg-yellow-300/60 rounded-full transform -rotate-45 translate-x-0.5 translate-y-0.5 opacity-60" />
            <div className="absolute bottom-1 left-1 w-0.5 h-1 bg-yellow-300/60 rounded-full transform rotate-45 -translate-x-0.5 translate-y-0.5 opacity-60" />
          </div>
        )}
        
        {/* Subtle moon craters for dark mode */}
        {theme === 'dark' && (
          <>
            <div className="absolute top-1.5 left-2 w-1.5 h-1.5 bg-slate-400/30 rounded-full opacity-40" />
            <div className="absolute bottom-2 left-1 w-1 h-1 bg-slate-400/25 rounded-full opacity-30" />
            <div className="absolute top-3 right-1.5 w-0.5 h-0.5 bg-slate-400/35 rounded-full opacity-50" />
            <div className="absolute top-2 left-3 w-0.5 h-0.5 bg-slate-300/30 rounded-full opacity-35" />
          </>
        )}
      </div>
      
      {/* Soft inner glow effect matching page style */}
      <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
        theme === 'light' 
          ? 'shadow-inner shadow-blue-200/20' 
          : 'shadow-inner shadow-blue-900/30'
      }`} />
    </button>
  );
};
