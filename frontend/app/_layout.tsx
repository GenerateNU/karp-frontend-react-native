import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import {
  useFonts,
  JosefinSans_400Regular,
  JosefinSans_300Light,
  JosefinSans_500Medium,
} from '@expo-google-fonts/josefin-sans';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import { LocationProvider } from '@/context/LocationContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync();

function AppContent() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="shop/[itemId]" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="events/[eventId]/info" />
      <Stack.Screen name="events/[eventId]/signup" />
      <Stack.Screen name="events/[eventId]/success" />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="profile/events/past"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="profile/settings" options={{ headerShown: false }} />
      <Stack.Screen
        name="profile/[volunteerId]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const queryClient = new QueryClient();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    JosefinSans_400Regular,
    JosefinSans_300Light,
    JosefinSans_500Medium,
  });

  useEffect(() => {
    async function hideSplash() {
      if (loaded) {
        try {
          await SplashScreen.hideAsync();
        } catch (error) {
          // Ignore splash screen errors - they're non-critical
          console.warn('Splash screen error (non-critical):', error);
        }
      }
    }
    hideSplash();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocationProvider>
            <NotificationProvider>
              <AppContent />
              <StatusBar style="auto" />
            </NotificationProvider>
          </LocationProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
