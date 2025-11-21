import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { EventSignUpForm } from '@/components/events/EventSignUpForm';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Event } from '@/types/api/event';
import { BackHeader } from '@/components/common/BackHeader';
import { eventService } from '@/services/eventService';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function EventSignUpPage() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    const fetchEventDetails = async () => {
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

  if (loading) {
    return <LoadingScreen text="Loading event sign-up details..." />;
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <BackHeader />
          <ThemedView style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              Sign Up
            </ThemedText>
            <ThemedText type="title" style={styles.infoConfirmationTitle}>
              Info Confirmation:
            </ThemedText>
            <EventSignUpForm event={event!} />
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
  },
  title: {
    fontFamily: 'JosefinSans_400Regular',
    fontSize: 44,
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 44,
    paddingBottom: 21,
  },
  infoConfirmationTitle: {
    color: Colors.light.text,
    fontFamily: 'JosefinSans_300Light',
    fontSize: 20,
    fontStyle: 'normal',
    fontWeight: 300,
    paddingBottom: 5,
  },
});
