import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types/api/event';
import { RegistrationStatus } from '@/types/api/registration';
import { eventService } from '@/services/eventService';
import {
  getEventsByVolunteer,
  getEventRegistrations,
} from '@/services/registrationService';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EventAttendeesCarousel } from '@/components/events/EventAttendeesCarousel';
import EventInfoTable from '@/components/ui/EventInfoFull';
import { Ionicons } from '@expo/vector-icons';

export default function EventInfoPage() {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();
  const router = useRouter();
  const { isAuthenticated, isGuest, clearGuestMode, volunteer } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);

  const showRegisteredView = isRegistered;

  useEffect(() => {
    if (!isAuthenticated && !isGuest) {
      router.replace('/login');
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const eventData = await eventService.getEventById(eventId as string);
        setEvent(eventData);

        const registrations = await getEventRegistrations(eventId as string);
        setRegisteredCount(registrations.length);
      } catch (error) {
        console.log('Error fetching event details:', error);
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, isAuthenticated, router]);

  useEffect(() => {
    const checkRegistration = async () => {
      try {
        if (!volunteer?.id || !eventId) return;
        const events = await getEventsByVolunteer(
          volunteer.id,
          RegistrationStatus.UPCOMING
        );
        setIsRegistered(events.some(e => e.id === (eventId as string)));
      } catch {
        setIsRegistered(false);
      }
    };
    checkRegistration();
  }, [volunteer?.id, eventId]);

  const handleSignUp = async () => {
    if (isGuest) {
      setMessage('You need an account to sign up for events!');
      return;
    }
    if (event?.id) {
      router.push(`/events/${event.id}/signup`);
    }
  };

  const handleSignIn = () => {
    clearGuestMode();
    router.push('/login');
  };

  const handleUnregister = async () => {
    if (!event?.id) return;
    router.push({
      pathname: '/events/[eventId]/cancel',
      params: {
        eventId: event.id,
      },
    });
  };

  const spotsRemaining = (event?.maxVolunteers ?? 0) - registeredCount;

  if (loading) {
    return <LoadingScreen text="Loading event info details..." />;
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1D0F48" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <EventInfoTable
            {...event}
            spotsRemaining={spotsRemaining}
            showCancelButton={showRegisteredView}
            onCancelSignUp={handleUnregister}
          />

          {showRegisteredView ? (
            <View style={styles.profileViewSection}>
              <EventAttendeesCarousel eventId={eventId as string} />

              <View style={styles.checkInOutButtons}>
                <Pressable
                  style={styles.checkInOutButton}
                  onPress={() => router.push('/scan?type=check-in')}
                >
                  <Text style={styles.checkInOutButtonText}>Check In</Text>
                </Pressable>
                <Pressable
                  style={styles.checkInOutButton}
                  onPress={() => router.push('/scan?type=checkout')}
                >
                  <Text style={styles.checkInOutButtonText}>Check Out</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.signUpSection}>
              {spotsRemaining > 0 &&
                Date.now() < new Date(event.endDateTime).getTime() && (
                  <Pressable
                    style={[
                      styles.signUpButton,
                      isRegistered && styles.unregisterButton,
                    ]}
                    onPress={isRegistered ? handleUnregister : handleSignUp}
                  >
                    <Text style={styles.signUpButtonText}>
                      {isRegistered ? 'UNREGISTER' : 'SIGN UP'}
                    </Text>
                  </Pressable>
                )}

              {message ? (
                <View style={styles.messageBox}>
                  <Text style={styles.errorText}>{message}</Text>
                  {isGuest ? (
                    <Pressable onPress={handleSignIn}>
                      <Text style={styles.signInLink}>Sign In Now</Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </View>
          )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  backText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '400',
    color: '#1D0F48',
  },
  profileViewSection: {
    marginTop: 24,
    paddingHorizontal: 24,
  },
  checkInOutButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  checkInOutButton: {
    flex: 1,
    backgroundColor: '#74C0EB',
    borderRadius: 16.333,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkInOutButtonText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0F48',
  },
  signUpSection: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  signUpButton: {
    width: 195,
    backgroundColor: '#74C0EB',
    borderRadius: 16.333,
    paddingVertical: 12,
    paddingHorizontal: 35,
    alignItems: 'center',
  },
  unregisterButton: {
    backgroundColor: '#FF6B6B',
  },
  signUpButtonText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '700',
    color: '#1D0F48',
  },
  messageBox: {
    marginTop: 12,
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  signInLink: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#1D0F48',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
});
