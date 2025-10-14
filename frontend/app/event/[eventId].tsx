import React, { useState, useEffect } from 'react';
import { Image } from 'expo-image';
import {
  ScrollView,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Button } from '@/components/common/Button';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import EventInfoTable from '@/components/ui/EventInfoFull';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/Colors';
import { EventInfo } from '@/types/api/event';
import { getEventById } from '@/services/eventService';

export default function EventSignUpPage() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<EventInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.replace('/login');
    //   return;
    // }

    const fetchEventDetails = async () => {
      try {
        console.log('Event id:', eventId);
        const eventData = await getEventById(eventId as string);
        console.log('Fetched item data:', eventData);
        setEvent({
          id: eventData.id,
          name: eventData.name,
          value: eventData.value,
          address: eventData.address,
          description: eventData.description || 'Need to include description',
          spotsRemaining: eventData.spotsRemaining || 10,
          startTime: eventData.startTime,
          endTime: eventData.endTime,
          organization: eventData.organization || 'Boston Public Library',
          timeSlots: eventData.timeSlots || ['12:00', '1:00', '2:30', '3:30'],
        });
      } catch (error) {
        console.log('Error fetching event:', error);
        // handle error, e.g. set error message
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, isAuthenticated, router]);

  const handleSignUp = async () => {
    if ((event?.spotsRemaining ?? 0) < 1) {
      setMessage('Sorry, this event has no spots left.');
      return;
    }
    if (event?.id) {
      router.push({
        pathname: '/event/signup/[eventId]',
        params: { eventId: event.id },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.messageText}>
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
          <View style={styles.headerRow}>
            <Pressable
              onPress={() => router.back()}
              style={styles.backButtonContainer}
            >
              <Image
                source={require('@/assets/images/backArrow.svg')}
                style={styles.backButtonIcon}
                contentFit="contain"
              />
            </Pressable>
          </View>
          <ThemedView style={styles.content}>
            <EventInfoTable
              id={event?.id || ''}
              name={event?.name || ''}
              organization={event?.organization || ''}
              address={event?.address || ''}
              description={event?.description || ''}
              value={event?.value || 30}
              startTime={event?.startTime || '2025-09-05T14:00:00Z'}
              endTime={event?.endTime || '2025-09-05T17:00:00Z'}
              spotsRemaining={event?.spotsRemaining || 5}
              timeSlots={event?.timeSlots || ['']}
            />

            <View style={styles.signUpSection}>
              <Button
                text="SIGN UP"
                onPress={handleSignUp}
                loading={false}
                disabled={(event?.spotsRemaining ?? 0) < 1}
              />

              {message ? (
                <View style={styles.messageBox}>
                  <ThemedText style={styles.errorText}>{message}</ThemedText>
                </View>
              ) : null}
            </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 6,
    paddingLeft: 12,
  },
  backButtonContainer: {
    padding: 8,
    paddingRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonIcon: {
    width: 24,
    height: 24,
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
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  errorText: {
    color: Colors.light.errorText,
  },
});
