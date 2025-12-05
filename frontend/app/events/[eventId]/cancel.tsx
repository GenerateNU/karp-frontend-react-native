import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Event } from '@/types/api/event';
import { eventService } from '@/services/eventService';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import {
  getEventRegistrations,
  unregister as unregisterRegistration,
} from '@/services/registrationService';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

export default function EventCancelPage() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const { volunteer } = useAuth();
  const queryClient = useQueryClient();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelled, setCancelled] = useState(false);

  useEffect(() => {
    const performCancellation = async () => {
      try {
        const eventData = await eventService.getEventById(eventId as string);
        setEvent(eventData);

        if (volunteer?.id && eventData?.id) {
          const registrations = await getEventRegistrations(eventData.id);
          const myRegistration = registrations.find(
            r => r.volunteerId === volunteer.id
          );
          if (myRegistration) {
            await unregisterRegistration(myRegistration.id);
            await queryClient.invalidateQueries({
              queryKey: ['registration', 'events', volunteer.id, 'upcoming'],
            });
            setCancelled(true);
          }
        }
      } catch (error) {
        console.log('Error cancelling event:', error);
        Alert.alert(
          'Error',
          'Failed to cancel registration. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };

    performCancellation();
  }, [eventId, volunteer?.id]);

  if (loading) {
    return <LoadingScreen text="Cancelling registration..." />;
  }

  if (!event || !cancelled) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Unable to cancel registration</Text>
      </SafeAreaView>
    );
  }

  const start = event.startDateTime ? new Date(event.startDateTime) : null;
  const end = event.endDateTime ? new Date(event.endDateTime) : null;

  const dateFormatted = start
    ? start.toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
      })
    : '';

  const timeFormatted =
    start && end
      ? `${start.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        })} - ${end.toLocaleTimeString(undefined, {
          hour: 'numeric',
          minute: '2-digit',
        })}`
      : '';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Image
              source={require('@/assets/images/ship-wheel.svg')}
              style={styles.wheelIcon}
              contentFit="contain"
            />
          </View>

          <Text style={styles.title}>Course Changed...</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={18} color="#1D0F48" />
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{dateFormatted}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={18} color="#1D0F48" />
              <Text style={styles.infoLabel}>Time:</Text>
              <Text style={styles.infoValue}>{timeFormatted}</Text>
            </View>
          </View>

          <Text style={styles.cancelMessage}>
            Your sign-up is successfully cancelled.
          </Text>

          <Text style={styles.apologyMessage}>
            We&apos;re sorry to see you go.{'\n'}
            Hopefully we&apos;ll see you next time!
          </Text>

          <Pressable
            style={styles.myEventsButton}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.myEventsButtonText}>Go To My Events</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDFA',
  },
  content: {
    flex: 1,
    paddingHorizontal: 33,
    paddingTop: 60,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelIcon: {
    width: 109,
    height: 109,
  },
  title: {
    fontFamily: 'Ubuntu',
    fontSize: 48,
    fontWeight: '700',
    color: '#1D0F48',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 60,
  },
  infoSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  infoLabel: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0F48',
  },
  infoValue: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '400',
    color: '#1D0F48',
  },
  cancelMessage: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '700',
    color: '#1D0F48',
    textAlign: 'center',
    marginBottom: 16,
  },
  apologyMessage: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#1D0F48',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 138,
  },
  myEventsButton: {
    backgroundColor: '#74C0EB',
    borderRadius: 16.333,
    paddingVertical: 13,
    paddingHorizontal: 33,
    alignItems: 'center',
  },
  myEventsButtonText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0F48',
  },
  errorText: {
    fontFamily: 'Inter',
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
});
