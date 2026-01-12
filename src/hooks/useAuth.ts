import { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';

export interface UserInfo {
  name: string;
  email: string;
  picture?: string;
}

const ALLOWED_DOMAINS = ['@maestro-tech.com', '@opcode.systems'];

function isEmailAllowed(email: string): boolean {
  return ALLOWED_DOMAINS.some(domain => email.endsWith(domain));
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already authenticated (from sessionStorage)
    const authData = sessionStorage.getItem('mission-control-auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        if (parsed.userInfo && isEmailAllowed(parsed.userInfo.email)) {
          setIsAuthenticated(true);
          setUserInfo(parsed.userInfo);
        } else {
          // Invalid domain, clear auth
          sessionStorage.removeItem('mission-control-auth');
        }
      } catch {
        sessionStorage.removeItem('mission-control-auth');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (accessToken: string) => {
    setError(null);
    try {
      // Fetch user info from Google
      const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userData = await response.json();
      
      // Check if email domain is allowed
      if (!isEmailAllowed(userData.email)) {
        throw new Error(`Access denied. Only @maestro-tech.com and @opcode.systems email addresses are allowed.`);
      }

      const user: UserInfo = {
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        picture: userData.picture,
      };

      setUserInfo(user);
      setIsAuthenticated(true);
      sessionStorage.setItem('mission-control-auth', JSON.stringify({ userInfo: user }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', error);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('mission-control-auth');
    setIsAuthenticated(false);
    setUserInfo(null);
    setError(null);
  };

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      login(tokenResponse.access_token);
    },
    onError: () => {
      setError('Google login failed. Please try again.');
      console.error('Google login failed');
    },
  });

  return { 
    isAuthenticated, 
    userInfo,
    isLoading,
    error,
    login: googleLogin, 
    logout 
  };
}
