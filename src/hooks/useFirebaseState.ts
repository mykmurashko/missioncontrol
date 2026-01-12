import { useState, useEffect, useCallback, useRef } from 'react';
import { getFirebaseDatabase } from '../lib/firebase';
import { ref, onValue, set, get } from 'firebase/database';
import type { AppState } from '../types';
import { DEFAULT_STATE } from '../types';

const STATE_PATH = 'mission-control-state';

export function useFirebaseState() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const isInitializedRef = useRef(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLocalUpdateRef = useRef(false);

  // Initialize Firebase connection
  useEffect(() => {
    if (isInitializedRef.current) return;

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.warn('Firebase connection timeout - using default state');
        setIsLoading(false);
        setIsConnected(false);
        setState(DEFAULT_STATE);
      }
    }, 10000); // 10 second timeout

    try {
      const database = getFirebaseDatabase();
      const stateRef = ref(database, STATE_PATH);

      console.log('Attempting to connect to Firebase...');
      console.log('Database path:', STATE_PATH);

      // Set up real-time listener
      const unsubscribe = onValue(
        stateRef,
        (snapshot) => {
          clearTimeout(timeoutId);
          
          // Only update if this isn't a local update we just made
          if (isLocalUpdateRef.current) {
            isLocalUpdateRef.current = false;
            // Still mark as loaded even if we skip the update
            setIsLoading(false);
            setIsConnected(true);
            return;
          }

          console.log('Firebase connected, data received:', snapshot.exists());

          if (snapshot.exists()) {
            const data = snapshot.val();
            // Validate that data has the expected structure
            if (data && data.orgs) {
              setState(data as AppState);
            } else {
              console.warn('Invalid data structure, using default state');
              setState(DEFAULT_STATE);
            }
            setIsLoading(false);
            setIsConnected(true);
          } else {
            // No data exists, initialize with default state
            console.log('No data found, initializing with default state');
            setState(DEFAULT_STATE); // Set state immediately so UI can render
            setIsLoading(false);
            setIsConnected(true);
            // Write to Firebase in the background
            set(stateRef, DEFAULT_STATE).catch((error) => {
              console.error('Failed to initialize default state:', error);
            });
          }
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error('Firebase connection error:', error);
          if (error && typeof error === 'object' && 'code' in error) {
            console.error('Error code:', (error as { code: string }).code);
          }
          if (error instanceof Error) {
            console.error('Error message:', error.message);
          }
          setIsConnected(false);
          setIsLoading(false);
          // Fallback to default state on error
          setState(DEFAULT_STATE);
        }
      );

      unsubscribeRef.current = unsubscribe;
      isInitializedRef.current = true;

      // Check initial connection status and load data if listener doesn't fire
      get(stateRef)
        .then((snapshot) => {
          console.log('Firebase connection check successful');
          setIsConnected(true);
          
          // If listener hasn't fired after 2 seconds, use one-time read as fallback
          setTimeout(() => {
            if (isLoading) {
              console.log('Listener not fired, using one-time read fallback');
              if (snapshot.exists()) {
                const data = snapshot.val();
                if (data && data.orgs) {
                  setState(data as AppState);
                } else {
                  setState(DEFAULT_STATE);
                }
              } else {
                setState(DEFAULT_STATE);
                // Try to write default state
                set(stateRef, DEFAULT_STATE).catch((error) => {
                  console.error('Failed to write default state:', error);
                });
              }
              setIsLoading(false);
            }
          }, 2000);
        })
        .catch((error) => {
          console.error('Firebase connection check failed:', error);
          setIsConnected(false);
          setIsLoading(false);
          setState(DEFAULT_STATE);
        });
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Failed to initialize Firebase:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      setIsLoading(false);
      setIsConnected(false);
      setState(DEFAULT_STATE);
    }

    return () => {
      clearTimeout(timeoutId);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isLoading]);

  const debouncedSave = useCallback((newState: AppState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const database = getFirebaseDatabase();
        const stateRef = ref(database, STATE_PATH);
        isLocalUpdateRef.current = true;
        set(stateRef, newState).catch((error) => {
          console.error('Failed to save state to Firebase:', error);
          isLocalUpdateRef.current = false;
        });
      } catch (error) {
        console.error('Failed to save state to Firebase:', error);
        isLocalUpdateRef.current = false;
      }
      saveTimeoutRef.current = null;
    }, 500);
  }, []);

  const updateState = useCallback(
    (updater: (prev: AppState) => AppState) => {
      setState((prev) => {
        const next = updater(prev);
        debouncedSave(next);
        return next;
      });
    },
    [debouncedSave]
  );

  // Save on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        try {
          const database = getFirebaseDatabase();
          const stateRef = ref(database, STATE_PATH);
          isLocalUpdateRef.current = true;
          set(stateRef, state).catch((error) => {
            console.error('Failed to save state on unmount:', error);
          });
        } catch (error) {
          console.error('Failed to save state on unmount:', error);
        }
      }
    };
  }, [state]);

  return [state, updateState, { isLoading, isConnected }] as const;
}
