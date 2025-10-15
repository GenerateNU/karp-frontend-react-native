import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { EventSignUpForm } from '@/components/forms/EventSignUpForm';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Event, EventStatus } from '@/types/api/event';

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
      // MOCK EVENT DATA FOR NOW
      setEvent({
        id: eventId as string,
        name: 'Sample Event',
        address: '123 Main St, Anytown, USA',
        location: null,
        start_date_time: new Date().toISOString(),
        end_date_time: new Date(Date.now() + 3600000).toISOString(),
        organization_id: '123',
        status: EventStatus.PUBLISHED,
        max_volunteers: 100,
        coins: 100,
        created_at: new Date().toISOString(),
        created_by: '123',
        value: 0,
        spotsRemaining: 100,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 3600000).toISOString(),
      });
      setLoading(false);
    };

    fetchEventDetails();
  }, [eventId, isAuthenticated, router]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>
          Loading event details...
        </ThemedText>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <ThemedView style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              Sign Up
            </ThemedText>
            <ThemedText type="title" style={styles.infoConfirmationTitle}>
              Info Confirmation:
            </ThemedText>
            <EventSignUpForm eventId={eventId as string} event={event!} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.light.text,
  },
});
