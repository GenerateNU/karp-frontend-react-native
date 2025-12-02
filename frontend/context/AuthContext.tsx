import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { setAuthToken } from '@/api';
import { Alert, Platform } from 'react-native';
import { volunteerService } from '@/services/volunteerService';
import { userService } from '@/services/userService';
import { Volunteer } from '@/types/api/volunteer';
import { AuthUser } from '@/types/api/user';

type AuthContextValue = {
  user: AuthUser | null;
  volunteer: Volunteer | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  signIn: (params: { username: string; password: string }) => Promise<void>;
  signOut: () => void;
  continueAsGuest: () => void;
  clearGuestMode: () => void;
  fetchUserEntity: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      setIsLoading(true);
      try {
        const { user: userResponse, accessToken } = await userService.login({
          username,
          password,
        });

        setAuthToken(accessToken);

        setUser(userResponse);
        setToken(accessToken);
        setIsGuest(false);

        // Persist on web to survive page refresh
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem('auth_token', accessToken);
            window.localStorage.setItem(
              'auth_user',
              JSON.stringify(userResponse)
            );
            window.localStorage.removeItem('is_guest');
          } catch {}
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        Alert.alert('Sign in failed', message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('is_guest', 'true');
      } catch {}
    }
  }, []);

  const clearGuestMode = useCallback(() => {
    setIsGuest(false);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('is_guest');
      } catch {}
    }
  }, []);

  const fetchUserEntity = useCallback(async () => {
    if (!user?.entityId) return;

    // only fetch volunteer for now
    const volunteerResponse = await volunteerService.getSelf();
    setVolunteer(volunteerResponse);
  }, [user?.entityId]); // Keep this dependency

  const signOut = useCallback(() => {
    userService.logout();
    
    setUser(null);
    setVolunteer(null);
    setToken(null);
    setIsGuest(false); // Clear guest mode on sign out

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('auth_token');
        window.localStorage.removeItem('auth_user');
        window.localStorage.removeItem('volunteer');
        window.localStorage.removeItem('is_guest');
      } catch {}
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      volunteer,
      token,
      isAuthenticated: !!token,
      isGuest,
      isLoading,
      signIn,
      signOut,
      continueAsGuest,
      clearGuestMode,
      fetchUserEntity,
    }),
    [user, volunteer, token, isGuest, isLoading]
  );

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      const storedToken = window.localStorage.getItem('auth_token');
      const storedUser = window.localStorage.getItem('auth_user');
      const storedVolunteer = window.localStorage.getItem('volunteer');
      const storedIsGuest = window.localStorage.getItem('is_guest');
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser) as AuthUser);
      if (storedVolunteer)
        setVolunteer(JSON.parse(storedVolunteer) as Volunteer);
      if (storedIsGuest === 'true') setIsGuest(true);
    } catch {}
  }, []);

  // Change this useEffect - remove fetchUserEntity from dependencies
  useEffect(() => {
    if (user?.entityId && !volunteer && token) {
      fetchUserEntity();
    }
  }, [user?.entityId, volunteer, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
