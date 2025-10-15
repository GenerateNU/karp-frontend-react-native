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
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (params: { username: string; password: string }) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(
    async ({ username, password }: { username: string; password: string }) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/user/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Failed to sign in');
        }

        const data = (await response.json()) as {
          access_token: string;
          token_type: string;
          user: {
            id: string;
            email?: string;
            username: string;
            first_name?: string;
            last_name?: string;
            user_type?: string;
            entity_id?: string | null;
          };
        };

        const u = data.user;
        setUser({
          id: u.id,
          username: u.username,
          email: u.email,
          firstName: u.first_name,
          lastName: u.last_name,
          userType: u.user_type,
          entityId: u.entity_id ?? null,
        });
        setToken(data.access_token);
        // Persist on web to survive page refresh
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          try {
            window.localStorage.setItem('auth_token', data.access_token);
            window.localStorage.setItem(
              'auth_user',
              JSON.stringify({
                id: u.id,
                username: u.username,
                email: u.email,
                firstName: u.first_name,
                lastName: u.last_name,
                userType: u.user_type,
                entityId: u.entity_id ?? null,
              })
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
    setToken(null);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('auth_token');
        window.localStorage.removeItem('auth_user');
      } catch {}
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      isLoading,
      signIn,
      signOut,
    }),
    [user, token, isLoading, signIn, signOut]
  );

  useEffect(() => {
    setAuthToken(token ?? null);
  }, [token]);

  // Hydrate auth state on mount (web)
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    try {
      const storedToken = window.localStorage.getItem('auth_token');
      const storedUser = window.localStorage.getItem('auth_user');
      if (storedToken) setToken(storedToken);
      if (storedUser) setUser(JSON.parse(storedUser) as AuthUser);
    } catch {}
  }, []);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
