import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Event as EventType } from '@/types/api/event';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { Image } from 'expo-image';
import { orgService } from '@/services/organizationService';

interface ProfileEventCardProps {
  event: EventType;
  onPress: (event: EventType) => void;
  onCheckIn: (event: EventType) => void;
  onCheckOut: (event: EventType) => void;
}

export function ProfileEventCard({
  event,
  onPress,
  onCheckIn,
  onCheckOut,
}: ProfileEventCardProps) {
  const [organizerName, setOrganizerName] = useState<string>('');

  useEffect(() => {
    async function loadOrganizer() {
      try {
        // Prefer existing name if present on the event
        if (event.organization) {
          setOrganizerName(event.organization);
          return;
        }
        if (!event.organizationId) {
          setOrganizerName('');
          return;
        }
        const org = await orgService.getOrganizationById(event.organizationId);
        setOrganizerName(org?.name ?? '');
      } catch (e) {
        console.log(e);
        // Silently ignore; ensure empty organizer name on error
        setOrganizerName('');
      }
    }
    loadOrganizer();
  }, [event.organization, event.organizationId]);
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
          {organizerName}
        </Text>
        <Text style={styles.eventName} numberOfLines={2}>
          {event.name}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.checkInButton}
          onPress={() => onCheckIn(event)}
          hitSlop={10}
        >
          <Text style={styles.checkInButtonText}>Check In</Text>
        </Pressable>
        <Pressable
          style={styles.checkOutButton}
          onPress={() => onCheckOut(event)}
          hitSlop={10}
        >
          <Text style={styles.checkOutButtonText}>Check Out</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 104,
    flexDirection: 'row',
    backgroundColor: Colors.light.eggshellWhite,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.light.cardBorder,
    padding: 10,
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
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
  checkOutButton: {
    backgroundColor: '#ff0000aa',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  checkOutButtonText: {
    fontFamily: Fonts.regular_400,
    fontSize: 12,
    color: Colors.light.white,
  },
});
