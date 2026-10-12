import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-xs', sub: 'text-[9px]' },
    md: { icon: 'w-9 h-9 sm:w-10 sm:h-10', text: 'text-sm sm:text-base', sub: 'text-[9px] sm:text-[10px]' },
    lg: { icon: 'w-11 h-11', text: 'text-base sm:text-lg', sub: 'text-xs' },
    xl: { icon: 'w-14 h-14', text: 'text-xl sm:text-2xl', sub: 'text-xs' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Metallic Emerald & Gold Car Emblem Badge */}
      <div
        className={`${currentSize.icon} relative rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-900 p-[1.5px] shadow-lg shadow-emerald-950/60 transition-transform group-hover:scale-105 shrink-0`}
        aria-hidden="true"
      >
        <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4/5 h-4/5 text-emerald-400 drop-shadow-md"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="ruwanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#34d399" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
            <path
              d="M20 4L34 9V20C34 27.5 28 34.2 20 36.5C12 34.2 6 27.5 6 20V9L20 4Z"
              stroke="url(#ruwanGrad)"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="rgba(16, 185, 129, 0.08)"
            />
            <path
              d="M13 14H27M15 11H25"
              stroke="url(#goldAccent)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M15 15V27M15 15H21C23.2091 15 25 16.7909 25 19C25 21.2091 23.2091 23 21 23H15M20.5 23L25.5 27"
              stroke="url(#ruwanGrad)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="20" cy="31" r="1.5" fill="#34d399" />
          </svg>
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className={`font-black tracking-wider uppercase text-white ${currentSize.text}`}>
            RUWAN
          </span>
          <span className={`font-bold tracking-widest uppercase text-emerald-400 mt-0.5 ${currentSize.sub}`}>
            CAR RENTALS
          </span>
        </div>
      )}
    </div>
  );
};
