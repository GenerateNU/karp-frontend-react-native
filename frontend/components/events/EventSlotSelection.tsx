import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { EventSlotButton } from './EventSlotButton';
import { Colors } from '@/constants/Colors';
import { Event } from '@/types/api/event';
import { Fonts } from '@/constants/Fonts';

interface EventSlotSelectionProps {
  event: Event;
  selectedDate: string;
  selectedTime: string;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
}

export function EventSlotSelection({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  event,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: EventSlotSelectionProps) {
  // TODO: Get available dates and times from the event when api is ready
  const availableDates = ['2025-10-18', '2025-10-19', '2025-10-20'];
  const availableTimes = [
    '09:00:00',
    '10:00:00',
    '11:00:00',
    '14:00:00',
    '15:00:00',
  ];
  const duration = 2;

  return (
    <ThemedView>
      <ThemedText style={styles.title}>Choose Your Slot:</ThemedText>
      <ThemedText style={styles.duration}>Duration: {duration} hrs</ThemedText>

      <View style={styles.dateSection}>
        <View style={styles.dateContainer}>
          <View style={styles.dateLabelColumn}>
            <ThemedText style={styles.dateLabel}>Date:</ThemedText>
          </View>
          <View style={styles.dateButtonsColumn}>
            {availableDates.map(date => (
              <EventSlotButton
                key={date}
                text={date}
                type="date"
                selected={selectedDate === date}
                onPress={() => onDateSelect(selectedDate === date ? '' : date)}
              />
            ))}
          </View>
        </View>
      </View>

      <View>
        <View style={styles.timeContainer}>
          <View style={styles.timeLabelColumn}>
            <ThemedText style={styles.timeLabel}>Time:</ThemedText>
          </View>
          <View style={styles.timeButtonsColumn}>
            {availableTimes.map(time => (
              <EventSlotButton
                key={time}
                text={time}
                type="time"
                selected={selectedTime === time}
                onPress={() => onTimeSelect(selectedTime === time ? '' : time)}
              />
            ))}
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.light_300,
    fontSize: 20,
    marginBottom: 10,
    color: Colors.light.text,
  },
  duration: {
    fontFamily: Fonts.light_300,
    fontSize: 16,
    marginBottom: 5,
    color: Colors.light.text,
  },
  dateSection: {
    marginBottom: 15,
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dateLabelColumn: {
    justifyContent: 'flex-start',
  },
  dateLabel: {
    fontFamily: Fonts.medium_500,
    fontSize: 16,
    color: Colors.light.text,
  },
  dateButtonsColumn: {
    width: '75%',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  timeLabelColumn: {
    justifyContent: 'flex-start',
  },
  timeLabel: {
    fontFamily: Fonts.medium_500,
    fontSize: 16,
    color: Colors.light.text,
  },
  timeButtonsColumn: {
    width: '75%',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
});
