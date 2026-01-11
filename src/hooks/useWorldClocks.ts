import { useState, useEffect } from 'react';
import { formatTime, getTimezoneLabel } from '../lib/time';

const TIMEZONES = [
  'Europe/Rome',
  'Europe/London',
  'America/New_York',
  'America/Los_Angeles',
] as const;

export interface Clock {
  timezone: string;
  label: string;
  time: string;
}

export function useWorldClocks(): Clock[] {
  const [clocks, setClocks] = useState<Clock[]>(() =>
    TIMEZONES.map((tz) => ({
      timezone: tz,
      label: getTimezoneLabel(tz),
      time: formatTime(new Date(), tz),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setClocks(
        TIMEZONES.map((tz) => ({
          timezone: tz,
          label: getTimezoneLabel(tz),
          time: formatTime(new Date(), tz),
        }))
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return clocks;
}

