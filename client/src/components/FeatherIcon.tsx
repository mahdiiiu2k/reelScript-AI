import React from 'react';

interface FeatherIconProps {
  className?: string;
}

export const FeatherIcon: React.FC<FeatherIconProps> = ({ className = "h-6 w-6" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line 
        x1="16" 
        y1="8" 
        x2="2" 
        y2="22" 
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line 
        x1="17.5" 
        y1="15" 
        x2="9" 
        y2="15" 
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};