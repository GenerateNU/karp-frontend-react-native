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
import { getSelf } from '@/services/volunteerService';
import { login } from '@/services/userService';
import { Volunteer } from '@/types/api/volunteer';

type AuthUser = {
  id: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  entityId?: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  volunteer: Volunteer | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (params: { username: string; password: string }) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      setIsLoading(true);
      try {
        const { user: userResponse, accessToken } = await login({
          username,
          password,
        });

        setAuthToken(accessToken);

        const volunteerResponse = await getSelf();

        setUser(userResponse);
        setToken(accessToken);
        setVolunteer(volunteerResponse);

        // Persist on web to survive page refresh
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem('auth_token', accessToken);
            window.localStorage.setItem(
              'auth_user',
              JSON.stringify(userResponse)
            );
            window.localStorage.setItem(
              'volunteer',
              JSON.stringify(volunteerResponse)
            );
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

  const signOut = useCallback(() => {
    setUser(null);
    setVolunteer(null);
    setToken(null);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('auth_token');
        window.localStorage.removeItem('auth_user');
        window.localStorage.removeItem('volunteer');
      } catch {}
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      volunteer,
      token,
      isAuthenticated: !!token,
      isLoading,
      signIn,
      signOut,
    }),
    [user, volunteer, token, isLoading, signIn, signOut]
  );

  // Hydrate auth state on mount (web)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      const storedToken = window.localStorage.getItem('auth_token');
      const storedUser = window.localStorage.getItem('auth_user');
      const storedVolunteer = window.localStorage.getItem('volunteer');
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser) as AuthUser);
      if (storedVolunteer)
        setVolunteer(JSON.parse(storedVolunteer) as Volunteer);
    } catch {}
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
