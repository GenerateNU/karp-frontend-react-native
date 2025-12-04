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
  unregister as unregisterRegistration,
} from '@/services/registrationService';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EventAttendeesCarousel } from '@/components/events/EventAttendeesCarousel';
import EventInfoTable from '@/components/ui/EventInfoFull';
import { Ionicons } from '@expo/vector-icons';

export default function EventInfoPage() {
  const { eventId, source } = useLocalSearchParams<{
    eventId: string;
    source?: 'feed' | 'profile';
  }>();
  const router = useRouter();
  const { isAuthenticated, isGuest, clearGuestMode, volunteer } = useAuth();
  const queryClient = useQueryClient();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [unregistering, setUnregistering] = useState(false);
  const [registeredCount, setRegisteredCount] = useState(0);

  const isProfileView = source === 'profile';

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
    if (!event?.id || !volunteer?.id) return;
    try {
      setUnregistering(true);
      const registrations = await getEventRegistrations(event.id);
      const myRegistration = registrations.find(
        r => r.volunteerId === volunteer.id
      );
      if (!myRegistration) {
        setMessage("We couldn't find your registration for this event.");
        return;
      }
      await unregisterRegistration(myRegistration.id);
      setIsRegistered(false);
      setMessage('You have been unregistered from this event.');
      await queryClient.invalidateQueries({
        queryKey: ['registration', 'events', volunteer.id, 'upcoming'],
      });
    } catch (err) {
      console.log(err);
      setMessage('Failed to unregister. Please try again.');
    } finally {
      setUnregistering(false);
    }
  };

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
          {/* Back Button */}
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1D0F48" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          {/* EventInfoTable Component */}
          <EventInfoTable 
            {...event} 
            registeredCount={registeredCount}
          />

          {/* Cancel Sign Up Button (only in profile view) */}
          {isProfileView && (
            <View style={styles.cancelButtonContainer}>
              <Pressable
                style={styles.cancelButton}
                onPress={handleUnregister}
                disabled={unregistering}
              >
                <Text style={styles.cancelButtonText}>
                  {unregistering ? 'Cancelling...' : 'Cancel Sign Up'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* Conditional rendering based on source */}
          {isProfileView ? (
            <View style={styles.profileViewSection}>
              <EventAttendeesCarousel eventId={eventId as string} />

              <View style={styles.checkInOutButtons}>
                <Pressable
                  style={styles.checkInButton}
                  onPress={() => router.push('/scan?type=check-in')}
                >
                  <Text style={styles.checkInButtonText}>Check In</Text>
                </Pressable>
                <Pressable
                  style={styles.checkOutButton}
                  onPress={() => router.push('/scan?type=checkout')}
                >
                  <Text style={styles.checkOutButtonText}>Check Out</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View style={styles.signUpSection}>
              <Pressable
                style={[styles.signUpButton, isRegistered && styles.unregisterButton]}
                onPress={isRegistered ? handleUnregister : handleSignUp}
                disabled={unregistering}
              >
                <Text style={styles.signUpButtonText}>
                  {unregistering ? 'PROCESSING...' : isRegistered ? 'UNREGISTER' : 'SIGN UP'}
                </Text>
              </Pressable>

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
  cancelButtonContainer: {
    paddingHorizontal: 24,
    marginTop: 12,
    alignItems: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#FF4444',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400',
    color: '#FF4444',
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
  checkInButton: {
    flex: 1,
    backgroundColor: '#90D0CD',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkInButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#1D0F48',
  },
  checkOutButton: {
    flex: 1,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkOutButtonText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  signUpSection: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  signUpButton: {
    width: '100%',
    backgroundColor: '#90D0CD',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  unregisterButton: {
    backgroundColor: '#FF6B6B',
  },
  signUpButtonText: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '600',
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
