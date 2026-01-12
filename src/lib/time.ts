import { DateTime } from 'luxon';

export function getISOWeekNumber(date: Date = new Date()): string {
  const dt = DateTime.fromJSDate(date);
  const week = dt.weekNumber;
  return `W${week.toString().padStart(2, '0')}`;
}

export function formatDate(date: Date = new Date()): string {
  const dt = DateTime.fromJSDate(date);
  return dt.toFormat('EEE d MMM yyyy');
}

export function formatTime(date: Date, timezone: string): string {
  const dt = DateTime.fromJSDate(date).setZone(timezone);
  return dt.toFormat('HH:mm:ss');
}

export function getTimezoneLabel(timezone: string): string {
  const labels: Record<string, string> = {
    'Europe/Rome': 'TRN',
    'Europe/London': 'LHR',
    'America/New_York': 'JFK',
    'America/Los_Angeles': 'SFO',
  };
  return labels[timezone] || timezone;
}

export function getGreeting(name?: string): string {
  if (!name) return '';
  
  const hour = new Date().getHours();
  let timeGreeting = 'Good Morning';
  
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good Afternoon';
  } else if (hour >= 17 || hour < 5) {
    timeGreeting = 'Good Evening';
  }
  
  return `${timeGreeting} ${name}`;
}

