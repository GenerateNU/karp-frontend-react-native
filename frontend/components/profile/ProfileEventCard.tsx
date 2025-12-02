import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Event as EventType } from '@/types/api/event';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';

interface ProfileEventCardProps {
  event: EventType;
  onPress: (event: EventType) => void;
  onCheckIn: (event: EventType) => void;
}

export function ProfileEventCard({
  event,
  onPress,
  onCheckIn,
}: ProfileEventCardProps) {
  return (
    <Pressable
      onPress={() => onPress(event)}
      style={styles.card}
      android_ripple={{ color: '#f0f0f0' }}
    >
      <Image
        source={{ uri: 'https://via.placeholder.com/67x80' }}
        style={styles.eventImage}
        contentFit="cover"
      />
      <View style={styles.eventInfo}>
        <Text style={styles.organizationName} numberOfLines={1}>
          Pumpkin Fields of Northeastern
        </Text>
        <Text style={styles.eventName} numberOfLines={2}>
          {event.name}
        </Text>
      </View>
      <Pressable
        style={styles.checkInButton}
        onPress={() => onCheckIn(event)}
        hitSlop={10}
      >
        <Text style={styles.checkInButtonText}>Check In</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 460,
    height: 104,
    flexDirection: 'row',
    backgroundColor: Colors.light.eggshellWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    padding: 10,
    alignSelf: 'center',
    marginVertical: 6,
    alignItems: 'center',
    gap: 10,
  },
  eventImage: {
    width: 67,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#D9D9D9',
  },
  eventInfo: {
    flex: 1,
    gap: 2,
  },
  organizationName: {
    fontFamily: Fonts.light_300,
    fontSize: 10,
    color: Colors.light.textSecondary,
  },
  eventName: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.light.text,
  },
  checkInButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  checkInButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 12,
    color: '#fff',
  },
});
