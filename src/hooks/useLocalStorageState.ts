import { useState, useEffect, useCallback, useRef } from 'react';
import type { AppState } from '../types';
import { DEFAULT_STATE } from '../types';

const STORAGE_KEY = 'mission-control-state';
const STORAGE_VERSION = '1.1.0';

function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.version === STORAGE_VERSION) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to load state from localStorage:', error);
  }
  return DEFAULT_STATE;
}

function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to localStorage:', error);
  }
}

export function useLocalStorageState() {
  const [state, setState] = useState<AppState>(loadState);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debouncedSave = useCallback((newState: AppState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveState(newState);
      saveTimeoutRef.current = null;
    }, 500);
  }, []);

  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      debouncedSave(next);
      return next;
    });
  }, [debouncedSave]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveState(state);
      }
    };
  }, [state]);

  return [state, updateState] as const;
}

