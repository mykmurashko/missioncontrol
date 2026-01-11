import { memo } from 'react';
import { formatDate, getISOWeekNumber } from '../lib/time';
import { useWorldClocks } from '../hooks/useWorldClocks';

export const TopBar = memo(() => {
  const clocks = useWorldClocks();
  const currentDate = formatDate().toUpperCase();
  const weekNumber = getISOWeekNumber();

  return (
    <>
      <div className="w-full border-b border-gray-200 dark:border-white/10 bg-white dark:bg-transparent">
        <div className="mx-auto max-w-[1800px] flex h-16">
          {/* Cell 1: Date */}
          <div className="w-1/5 border-r border-gray-200 dark:border-white/10 flex items-center px-8">
            <div className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide">
              {currentDate}
            </div>
          </div>
          
          {/* Cell 2: Week Counter */}
          <div className="w-20 border-r border-gray-200 dark:border-white/10 flex items-center justify-center px-4">
            <div className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide">
              {weekNumber}
            </div>
          </div>
          
          {/* Cell 3: Slogan */}
          <div className="flex-1 border-r border-gray-200 dark:border-white/10 flex items-center justify-center px-8">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-500">
              IT'S TIME TO BUILD
            </div>
          </div>
          
          {/* Cell 3: World Clocks - Split into 4 sections */}
          <div className="w-1/3 grid grid-cols-4 divide-x divide-gray-200 dark:divide-white/10">
            {clocks.map((clock) => {
              const [hours, minutes, seconds] = clock.time.split(':');
              const timeDisplay = `${hours}:${minutes}`;
              return (
                <div key={clock.timezone} className="flex items-center justify-center px-4">
                  <div className="text-center">
                    <div className="text-[10px] text-gray-400 dark:text-neutral-400 font-bold mb-0.5">{clock.label}</div>
                    <div className="font-mono text-sm text-gray-900 dark:text-white">
                      {timeDisplay}
                      <span className="text-gray-400 dark:text-neutral-400">:{seconds}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
});
TopBar.displayName = 'TopBar';

