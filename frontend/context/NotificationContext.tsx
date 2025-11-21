import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { deviceTokenService } from '@/services/deviceTokenService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationContextValue = {
  expoPushToken: string | null;
};

const NotificationContext = createContext<NotificationContextValue | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, token } = useAuth();
  const router = useRouter();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    async function registerForPushNotificationsAsync() {
      if (!Device.isDevice) {
        return;
      }

      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        return;
      }

      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        setExpoPushToken(pushTokenString);
      } catch {
        // Failed to get push token
      }
    }

    registerForPushNotificationsAsync();
  }, []);

  useEffect(() => {
    async function registerTokenWithBackend() {
      if (!isAuthenticated || !expoPushToken || !token) {
        return;
      }

      try {
        await deviceTokenService.registerDeviceToken(expoPushToken);
      } catch {
        // Failed to register token, but don't block the app
      }
    }

    registerTokenWithBackend();
  }, [isAuthenticated, expoPushToken, token]);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener(() => {
        // Notification received while app is in foreground
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        if (data?.eventId) {
          router.push(`/events/${data.eventId}/info`);
        }
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [router]);

  const value: NotificationContextValue = {
    expoPushToken,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error(
      'useNotifications must be used within NotificationProvider'
    );
  }
  return ctx;
}
