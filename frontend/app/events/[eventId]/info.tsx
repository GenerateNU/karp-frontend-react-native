import React, { useState, useEffect } from 'react';
import { ScrollView, View, StyleSheet, Pressable } from 'react-native';
import { Button } from '@/components/common/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import EventInfoTable from '@/components/ui/EventInfoFull';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { Event } from '@/types/api/event';
import { RegistrationStatus } from '@/types/api/registration';
import { eventService } from '@/services/eventService';
import {
  getEventsByVolunteer,
  getEventRegistrations,
  unregister as unregisterRegistration,
} from '@/services/registrationService';
import { useQueryClient } from '@tanstack/react-query';
import { BackHeader } from '@/components/common/BackHeader';
import { LoadingScreen } from '@/components/LoadingScreen';
import { EventAttendeesCarousel } from '@/components/events/EventAttendeesCarousel';

export default function EventSignUpPage() {
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
      // Invalidate upcoming events for this volunteer, so profile refreshes
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
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <BackHeader />
          <ThemedView style={styles.content}>
            <EventInfoTable {...event!} registeredCount={registeredCount} />

            {isProfileView ? (
              <View style={styles.profileViewSection}>
                <EventAttendeesCarousel eventId={eventId as string} />

                <View style={styles.checkInOutButtons}>
                  <Button
                    text="CHECK IN"
                    onPress={() => router.push('/scan?type=check-in')}
                    buttonsStyle={styles.checkInButton}
                  />
                  <Button
                    text="CHECK OUT"
                    onPress={() => router.push('/scan?type=checkout')}
                    buttonsStyle={styles.checkOutButton}
                  />
                </View>
              </View>
            ) : (
              <View style={styles.signUpSection}>
                {!isRegistered ? (
                  <Button
                    text="SIGN UP"
                    onPress={handleSignUp}
                    loading={false}
                    disabled={false}
                  />
                ) : (
                  <Button
                    text="UNREGISTER"
                    onPress={handleUnregister}
                    loading={unregistering}
                    disabled={unregistering}
                  />
                )}

                {message ? (
                  <View style={styles.messageBox}>
                    <ThemedText style={styles.errorText}>{message}</ThemedText>
                    {isGuest ? (
                      <Pressable onPress={handleSignIn}>
                        <ThemedText style={styles.signUpLink}>
                          Sign In Now
                        </ThemedText>
                      </Pressable>
                    ) : null}
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
  profileViewSection: {
    marginBottom: 24,
  },
  checkInOutButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 16,
  },
  checkInButton: {
    flex: 1,
    backgroundColor: Colors.light.primary,
  },
  checkOutButton: {
    flex: 1,
    backgroundColor: '#ff0000aa',
  },
  messageBox: {
    width: '100%',
    paddingHorizontal: 8,
  },
  errorText: {
    color: Colors.light.errorText,
  },
  signUpLink: {
    color: Colors.light.text,
    textDecorationLine: 'underline',
  },
});
