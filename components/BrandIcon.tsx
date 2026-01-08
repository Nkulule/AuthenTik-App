import React from 'react';

export const BrandIcon: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        <defs>
          <linearGradient id="blueCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" /> {/* Blue 500 */}
            <stop offset="100%" stopColor="#1d4ed8" /> {/* Blue 700 */}
          </linearGradient>
          <filter id="iconSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feOffset dx="0" dy="1" result="offsetBlur" />
            <feComposite in="SourceGraphic" in2="offsetBlur" operator="over" />
          </filter>
        </defs>
        
        {/* The Blue Circle Base */}
        <circle cx="50" cy="50" r="48" fill="url(#blueCircleGradient)" />
        
        {/* The "Icon" (Shield) inside the circle */}
        <path
          d="M50 22L32 30V45C32 58 41 71 50 76C59 71 68 58 68 45V30L50 22Z"
          fill="white"
          style={{ filter: 'url(#iconSoftShadow)' }}
        />
        
        {/* The "Tik" (White Checkmark) */}
        <path
          d="M42 48L48 54L58 42"
          stroke="#1d4ed8" /* Brand Blue */
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* The Requested Black Dot */}
        <circle cx="78" cy="22" r="6" fill="black" stroke="white" strokeWidth="2" />
        
        {/* Small subtle inner ring for depth */}
        <circle cx="50" cy="50" r="46" stroke="white" strokeOpacity="0.1" strokeWidth="1" />
      </svg>
    </div>
  );
};
