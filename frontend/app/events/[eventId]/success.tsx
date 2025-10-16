import { View, StyleSheet, Share, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/common/Button';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Calendar } from '@/components/Calendar';
import * as CalendarExpo from 'expo-calendar';
import React, { useState, useEffect } from 'react';
import { eventService } from '@/services/eventService';
import { Event } from '@/types/api/event';
import { BackHeader } from '@/components/common/BackHeader';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function EventSuccessPage() {
  const { selectedDate, selectedTime, duration, eventId } =
    useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  const eventDate = selectedDate as string;
  const eventTime = selectedTime as string;

  useEffect(() => {
    // if (!isAuthenticated) {
    //   router.replace('/login');
    //   return;
    // }
    console.log('Event ID:', eventId);
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

  const addToCalendar = async () => {
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
      const eventDateObj = new Date(eventDate + ' ' + eventTime);
      const eventDetails = {
        title: event?.name || 'KARP Event',
        startDate: eventDateObj,
        endDate: new Date(
          eventDateObj.getTime() + Number(duration) * 60 * 60 * 1000
        ),
        notes: event?.description || 'Event from KARP app',
        location: event?.address || 'Event Location',
        calendarId: defaultCalendar.id,
      };

      await CalendarExpo.createEventAsync(defaultCalendar.id, eventDetails);

      Alert.alert('Success!', 'Event added to your calendar.', [
        { text: 'OK' },
      ]);
    } catch (error) {
      console.info('Error adding event to calendar:', error);
      Alert.alert('Error', 'Failed to add event to calendar.');
    }
  };

  if (loading) {
    return (
      <LoadingScreen text="Loading event sign-up confirmation details..." />
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <BackHeader />
          <ThemedView style={styles.content}>
            <View>
              <ThemedText style={styles.successMessage}>
                You&apos;re on the list!
              </ThemedText>
            </View>

            <Button
              buttonsStyle={styles.shareButton}
              textStyle={styles.shareButtonText}
              text="Share Event"
              onPress={() => {
                Share.share({
                  message: 'Share the event with your friends',
                  url: 'https://mock-url.com',
                });
              }}
            />

            <Button
              buttonsStyle={styles.addToCalendarButton}
              textStyle={styles.addToCalendarTextStyle}
              text="Add to Calendar"
              onPress={addToCalendar}
            />

            <View style={styles.calendarSection}>
              <Calendar
                onDayPress={() => {}}
                markedDates={{
                  [eventDate]: {
                    selected: true,
                    selectedColor: Colors.light.tint,
                  },
                }}
              />
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
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  successMessage: {
    fontFamily: Fonts.regular_400,
    textAlign: 'center',
    fontSize: 44,
    lineHeight: 70,
    marginTop: 40,
    marginLeft: 75,
    marginRight: 75,
    marginBottom: 25,
  },
  shareButton: {
    marginBottom: 65,
    alignSelf: 'center',
  },
  shareButtonText: {
    fontFamily: Fonts.light_300,
  },
  addToCalendarButton: {
    marginBottom: 20,
    alignSelf: 'center',
  },
  addToCalendarTextStyle: {
    fontFamily: Fonts.light_300,
  },
  calendarSection: {
    flex: 1,
    marginTop: 20,
  },
});
