import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button } from '@/components/common/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import EventInfoTable from '@/components/ui/EventInfoFull';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { Event } from '@/types/api/event';
import { eventService } from '@/services/eventService';
import { BackHeader } from '@/components/common/BackHeader';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function EventSignUpPage() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated, isGuest } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!isAuthenticated && !isGuest) {
      router.replace('/login');
      return;
    }

    const fetchEventDetails = async () => {
      console.log('Event ID for Info:', eventId);
      try {
        const eventData = await eventService.getEventById(eventId as string);
        setEvent(eventData);
      } catch (error) {
        console.log('Error fetching event details:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, isAuthenticated, router]);

  const handleSignUp = async () => {
    if (false) {
      setMessage('Sorry, this event has no spots left.');
      return;
    }
    if (event?.id) {
      router.push(`/events/${event.id}/signup`);
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading event info details..." />;
  }
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <BackHeader />
          <ThemedView style={styles.content}>
            <EventInfoTable {...event!} />

            {isGuest ? (
              <View style={styles.messageBox}>
                <ThemedText style={styles.guestText}>
                  Sign in or make an account to sign up for this event.
                </ThemedText>
              </View>
            ) : (
              <View style={styles.signUpSection}>
                <Button
                  text="SIGN UP"
                  onPress={handleSignUp}
                  loading={false}
                  disabled={false}
                />

                {message ? (
                  <View style={styles.messageBox}>
                    <ThemedText style={styles.errorText}>{message}</ThemedText>
                  </View>
                ) : null}
              </View>
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    paddingLeft: 34,
    paddingRight: 46,
    gap: 16,
    backgroundColor: Colors.light.background,
  },
  signUpSection: {
    marginBottom: 24,
    alignItems: 'center',
    gap: 12,
  },
  messageBox: {
    width: '100%',
    paddingHorizontal: 8,
  },
  errorText: {
    color: Colors.light.errorText,
  },
  guestText: {
    color: Colors.light.text,
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 8,
  },
});
