import React, { useEffect, useState } from 'react';
import { Clock, Sun, Moon } from 'lucide-react';
import { getBusinessStatus, BusinessStatus } from '../../utils/businessHours';

interface BusinessHoursBadgeProps {
  variant?: 'compact' | 'prominent' | 'card' | 'counter-bar';
  showDetails?: boolean;
  className?: string;
}

export const BusinessHoursBadge: React.FC<BusinessHoursBadgeProps> = ({
  variant = 'compact',
  showDetails = true,
  className = '',
}) => {
  const [status, setStatus] = useState<BusinessStatus>(() => getBusinessStatus());

  useEffect(() => {
    // Refresh status every 30 seconds
    const interval = setInterval(() => {
      setStatus(getBusinessStatus());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur-md border transition-all ${
          status.isOpen
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
        } ${className}`}
        title={`Physical Office: ${status.statusText} (${status.hoursDisplay})`}
        role="status"
        aria-label={`Office status: ${status.statusText}. Hours: ${status.hoursDisplay}`}
      >
        <span className="relative flex h-2 w-2" aria-hidden="true">
          {status.isOpen && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              status.isOpen ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          ></span>
        </span>
        <span className="font-semibold uppercase tracking-wider">{status.statusText}</span>
        <span className="text-zinc-500" aria-hidden="true">·</span>
        <span className="text-zinc-300 hidden sm:inline">7:00 AM – 9:00 PM</span>
      </div>
    );
  }

  if (variant === 'counter-bar') {
    return (
      <div
        className={`flex items-center justify-between px-4 py-2 rounded-xl border ${
          status.isOpen
            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
            : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
        } ${className}`}
        role="status"
      >
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            {status.isOpen && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                status.isOpen ? 'bg-emerald-400' : 'bg-amber-400'
              }`}
            ></span>
          </span>
          <div>
            <span className="font-bold tracking-wide uppercase text-xs mr-2">{status.statusText}</span>
            <span className="text-xs text-zinc-300">
              Physical Counter Hours: <strong>7:00 AM – 9:00 PM</strong> (Daily)
            </span>
          </div>
        </div>
        <div className="text-xs font-mono text-zinc-400 hidden md:flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Time: {status.currentFormattedTime}</span>
          <span className="text-zinc-500">({status.nextEventText})</span>
        </div>
      </div>
    );
  }

  // Variant: Prominent / Card
  return (
    <div
      className={`rounded-2xl border p-4 backdrop-blur-md transition-all ${
        status.isOpen
          ? 'bg-gradient-to-br from-emerald-950/40 via-zinc-900/80 to-zinc-950 border-emerald-600/30 shadow-lg shadow-emerald-950/20'
          : 'bg-gradient-to-br from-amber-950/30 via-zinc-900/80 to-zinc-950 border-amber-600/30 shadow-lg shadow-amber-950/20'
      } ${className}`}
      role="region"
      aria-label="Physical Office Operating Hours"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
              status.isOpen
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
            }`}
            aria-hidden="true"
          >
            {status.isOpen ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  status.isOpen
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {status.statusText}
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {status.currentFormattedTime}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white mt-1">
              Physical Business Hours: 7:00 AM – 9:00 PM
            </h4>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <div className="text-xs text-zinc-400">Open 7 Days a Week</div>
          <div className="text-xs font-medium text-emerald-400/90">{status.nextEventText}</div>
        </div>
      </div>
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-zinc-800/80 text-xs text-zinc-400 flex flex-wrap items-center justify-between gap-2">
          <span className="text-zinc-300">
            Counter Staff on Duty for Walk-In Rentals & Online Pickups
          </span>
          <span className="text-zinc-500 font-mono text-[11px]">
            Colombo Standard Time (07:00 – 21:00)
          </span>
        </div>
      )}
    </div>
  );
};
