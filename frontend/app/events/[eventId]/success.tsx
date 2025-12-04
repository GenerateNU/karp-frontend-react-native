import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Share, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Event } from '@/types/api/event';
import { eventService } from '@/services/eventService';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Ionicons } from '@expo/vector-icons';
import * as CalendarExpo from 'expo-calendar';
import { Image } from 'expo-image';

export default function EventSuccessPage() {
  const { eventId } = useLocalSearchParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, [eventId]);

  const handleShare = async () => {
    if (!event) return;
    
    try {
      await Share.share({
        message: `Check out this event: ${event.name}`,
        title: event.name,
      });
    } catch (error) {
      console.error('Error sharing event:', error);
    }
  };

  const addToCalendar = async () => {
    if (!event) return;

    try {
      const { status } = await CalendarExpo.requestCalendarPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Calendar access is required to add events.'
        );
        return;
      }

      const calendars = await CalendarExpo.getCalendarsAsync(
        CalendarExpo.EntityTypes.EVENT
      );
      const defaultCalendar =
        calendars.find(cal => cal.source.name === 'Default') || calendars[0];

      if (!defaultCalendar) {
        Alert.alert('Error', 'No calendar found to add events to.');
        return;
      }

      const startDate = new Date(event.startDateTime);
      const endDate = new Date(event.endDateTime);

      const eventDetails = {
        title: event.name,
        startDate: startDate,
        endDate: endDate,
        notes: event.description || 'Event from KARP app',
        location: event.address || 'Event Location',
        calendarId: defaultCalendar.id,
      };

      await CalendarExpo.createEventAsync(defaultCalendar.id, eventDetails);

      Alert.alert('Success!', 'Event added to your calendar.', [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.error('Error adding event to calendar:', error);
      Alert.alert('Error', 'Failed to add event to calendar.');
    }
  };

  if (loading) {
    return <LoadingScreen text="Loading confirmation..." />;
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Event not found</Text>
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
          {/* Share Event Link - Top Right */}
          <Pressable onPress={handleShare} style={styles.shareButton}>
            <Text style={styles.shareText}>Share Event:</Text>
            <Ionicons name="share-outline" size={20} color="#1D0F48" />
          </Pressable>

          {/* Anchor Icon */}
          <View style={styles.iconContainer}>
            <Image
              source={require('@/assets/images/anchor-icon.svg')}
              style={styles.anchorIcon}
              contentFit="contain"
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>You&apos;re all set!</Text>

          {/* Date and Time */}
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

          {/* Add to Calendar Button */}
          <Pressable onPress={addToCalendar}>
            <Text style={styles.calendarLink}>Add to Calendar</Text>
          </Pressable>

          {/* Reward Message */}
          <Text style={styles.rewardMessage}>
            That&apos;s {event.coins} more Koins waiting for you!{'\n'}
            Just attend your event to claim your reward.
          </Text>

          {/* Treasure Chest Icon */}
          <View style={styles.treasureContainer}>
            <Image
              source={require('@/assets/images/treasure-chest.svg')}
              style={styles.treasureIcon}
              contentFit="contain"
            />
          </View>

          {/* See This Event Button */}
          <Pressable
            style={styles.seeEventButton}
            onPress={() => router.push(`/events/${eventId}/info?source=profile`)}
          >
            <Text style={styles.seeEventButtonText}>See This Event</Text>
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
    paddingTop: 20,
    alignItems: 'center',
  },
  shareButton: {
    position: 'absolute',
    top: 20,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 10,
  },
  shareText: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#1D0F48',
    textDecorationLine: 'underline',
  },
  iconContainer: {
    marginTop: 20,
    marginBottom: 24,
  },
  anchorIcon: {
    marginTop: 31,
    width: 79,
    height: 100,
  },
  title: {
    fontFamily: 'Inter',
    fontSize: 44,
    fontWeight: '700',
    color: '#1D0F48',
    textAlign: 'center',
    marginBottom: 40,
  },
  infoSection: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
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
  calendarLink: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: '400',
    color: '#1D0F48',
    textDecorationLine: 'underline',
    marginBottom: 32,
  },
  rewardMessage: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400',
    color: '#1D0F48',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  treasureContainer: {
    marginBottom: 82.24,
  },
  treasureIcon: {
    width: 98,
    height: 79,
  },
  seeEventButton: {
    backgroundColor: '#74C0EB',
    borderRadius: 16.333,
    paddingVertical: 13,
    paddingHorizontal: 33,
    alignItems: 'center',
  },
  seeEventButtonText: {
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
