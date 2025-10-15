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
import { Event, EventStatus } from '@/types/api/event';
import { eventService } from '@/services/eventService';

export default function EventSignUpPage() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.replace('/login');
    //   return;
    // }

    const fetchEventDetails = async () => {
      try {
        const eventData = await eventService.getEventById(eventId as string);
        setEvent({
          id: eventId as string,
          name: eventData?.name || 'Default Event Name',
          address: eventData?.address || '',
          location: eventData?.location || null,
          start_date_time: eventData?.start_date_time || '',
          end_date_time: eventData?.end_date_time || '',
          organization_id: eventData?.organization_id || '',
          organization: eventData?.organization || 'Chicos',
          description:
            eventData?.description || 'This is a sample event description.',
          spots_remaining: eventData?.spots_remaining ?? 5,
          status: eventData?.status || EventStatus.PUBLISHED,
          max_volunteers: eventData?.max_volunteers ?? 0,
          coins: eventData?.coins ?? 0,
          created_at: eventData?.created_at || '',
          created_by: eventData?.created_by || '',
          timeSlots: eventData?.timeSlots || [
            '9:00 AM - 11:00 AM',
            '1:00 PM - 3:00 PM',
          ],
        });
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
    if ((event?.spots_remaining ?? 0) < 1) {
      setMessage('Sorry, this event has no spots left.');
      return;
    }
    if (event?.id) {
      router.push({
        pathname: '/events/signup/[eventId]',
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
              onPress={() => {
                router.back();
              }}
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
            <EventInfoTable {...event!} />

            <View style={styles.signUpSection}>
              <Button
                text="SIGN UP"
                onPress={handleSignUp}
                loading={false}
                disabled={(event?.spots_remaining ?? 0) < 1}
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
