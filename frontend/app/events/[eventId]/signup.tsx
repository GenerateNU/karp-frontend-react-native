import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Event } from '@/types/api/event';
import { eventService } from '@/services/eventService';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { EventSignUpForm } from '@/components/events/EventSignUpForm';

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

  const start = event?.startDateTime ? new Date(event.startDateTime) : null;
  const end = event?.endDateTime ? new Date(event.endDateTime) : null;

  const startDate = start
    ? start.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

    const endDate = end
      ? end.toLocaleDateString(undefined, {
          month: 'long',
          day: 'numeric',
          year: 'numeric',
      })
    : '';

    const startTime = start
      ? start.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
      })
    : '';

    const endTime = end
      ? end.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit'
      })
    : '';

  const dateFormatted = start
    ? start.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : 'DD/MM/YYYY';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back Button */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1D0F48" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          {/* Title */}
          <Text style={styles.title}>Sign Up</Text>

          {/* Date Section */}
          <View style={styles.dateSection}>
            <Text style={styles.sectionLabel}>Date:</Text>
            <Text style={styles.dateValue}>Start: {startDate} at {startTime}</Text>
            <Text style={styles.dateValue}>End: {endDate} at {endTime}</Text>
          </View>

          {/* Sign Up Form */}
          <EventSignUpForm event={event!} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDFA',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 39,
    paddingVertical: 15,
    gap: 8,
  },
  backText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '400',
    color: '#1D0F48',
  },
  title: {
    fontFamily: 'Ubuntu',
    fontSize: 44,
    fontWeight: '700',
    color: '#1D0F48',
    paddingHorizontal: 39,
    marginBottom: 24,
  },
  dateSection: {
    paddingHorizontal: 39,
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '700',
    color: '#1D0F48',
    marginBottom: 8,
  },
  dateValue: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '400',
    color: '#1D0F48',
  },
});
