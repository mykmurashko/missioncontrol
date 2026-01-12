import { useState, useEffect, useCallback, useRef } from 'react';
import { getFirebaseDatabase } from '../lib/firebase';
import { ref, onValue, set } from 'firebase/database';
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
  const lastWriteTimeRef = useRef<number>(0);
  const isLoadingRef = useRef(true);

  // Initialize Firebase connection - only run once
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoadingRef.current) {
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
      // onValue fires immediately with current data, then on every change
      const unsubscribe = onValue(
        stateRef,
        (snapshot) => {
          clearTimeout(timeoutId);
          
          // Skip updates that happen within 100ms of a local write
          // This prevents the echo effect when we write locally
          const timeSinceLastWrite = Date.now() - lastWriteTimeRef.current;
          if (timeSinceLastWrite < 100) {
            console.log('Skipping local update echo');
            setIsLoading(false);
            setIsConnected(true);
            return;
          }

          console.log('Firebase listener fired, data received:', snapshot.exists());

          if (snapshot.exists()) {
            const data = snapshot.val();
            // Validate that data has the expected structure
            if (data && data.orgs) {
              setState(data as AppState);
            } else {
              console.warn('Invalid data structure, using default state');
              setState(DEFAULT_STATE);
            }
            isLoadingRef.current = false;
            setIsLoading(false);
            setIsConnected(true);
          } else {
            // No data exists, initialize with default state
            console.log('No data found, initializing with default state');
            setState(DEFAULT_STATE);
            isLoadingRef.current = false;
            setIsLoading(false);
            setIsConnected(true);
            // Write to Firebase in the background (but mark as local write)
            lastWriteTimeRef.current = Date.now();
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
          isLoadingRef.current = false;
          setIsLoading(false);
          // Fallback to default state on error
          setState(DEFAULT_STATE);
        }
      );

      unsubscribeRef.current = unsubscribe;
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Failed to initialize Firebase:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      isLoadingRef.current = false;
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
  }, []); // Empty dependency array - only run once

  const debouncedSave = useCallback((newState: AppState) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const database = getFirebaseDatabase();
        const stateRef = ref(database, STATE_PATH);
        // Mark the write time to prevent echo in listener
        lastWriteTimeRef.current = Date.now();
        set(stateRef, newState).catch((error) => {
          console.error('Failed to save state to Firebase:', error);
        });
      } catch (error) {
        console.error('Failed to save state to Firebase:', error);
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
          lastWriteTimeRef.current = Date.now();
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
