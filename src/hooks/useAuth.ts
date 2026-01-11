import { useState, useEffect } from 'react';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (from sessionStorage)
    const authenticated = sessionStorage.getItem('mission-control-authenticated') === 'true';
    setIsAuthenticated(authenticated);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('mission-control-authenticated');
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
