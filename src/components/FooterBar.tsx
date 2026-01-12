import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ThemeToggle } from './ThemeToggle';
import { getGreeting, formatTimeShort } from '../lib/time';

interface FooterBarProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  isKioskMode: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  userName?: string;
  lastUpdated?: string;
  lastUpdatedBy?: string;
}

export function FooterBar({ isEditing, onToggleEdit, isKioskMode, theme, onToggleTheme, userName, lastUpdated, lastUpdatedBy }: FooterBarProps) {
  const [tickerText, setTickerText] = useState('');

  useEffect(() => {
    if (isKioskMode) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'e' || e.key === 'E') {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        onToggleEdit();
      }
      if (e.key === 'Escape' && isEditing) {
        onToggleEdit();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isEditing, onToggleEdit, isKioskMode]);

  useEffect(() => {
    // Generate random hex codes for the ticker
    const generateHexCode = () => {
      return Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0').toUpperCase();
    };

    const generateCommitHash = () => {
      return Math.random().toString(36).substring(2, 9).toUpperCase();
    };

    const updateTicker = () => {
      const items = [
        `0x${generateHexCode()}`,
        `0x${generateHexCode()}`,
        `COMMIT:${generateCommitHash()}`,
        `0x${generateHexCode()}`,
        `STATUS:OK`,
        `0x${generateHexCode()}`,
      ];
      setTickerText(items.join(' // '));
    };

    updateTicker();
    const interval = setInterval(updateTicker, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-transparent z-20">
      <div className="mx-auto max-w-[1800px] px-8 py-3">
        <div className="flex items-center justify-between text-[10px] font-sans text-gray-600 dark:text-neutral-400">
          <div className="flex items-center gap-6">
            {userName && (
              <div>
                <span className="text-gray-600 dark:text-neutral-400 font-medium">
                  {getGreeting(userName)}
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-600 dark:text-neutral-400">work in progress: suggestions welcome</span>
            </div>
            {lastUpdated && lastUpdatedBy && (
              <div>
                <span className="text-gray-600 dark:text-neutral-400">
                  last updated at {formatTimeShort(lastUpdated)} by {lastUpdatedBy}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-hidden ml-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="animate-scroll whitespace-nowrap text-gray-500 dark:text-neutral-400">
                {tickerText} • {tickerText} • {tickerText}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-4">
            {!isKioskMode && (
              <Button
                onClick={onToggleEdit}
                variant="default"
                size="sm"
              >
                {isEditing ? 'Done' : 'Edit'}
              </Button>
            )}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </div>
    </div>
  );
}

