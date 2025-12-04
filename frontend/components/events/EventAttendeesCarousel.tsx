import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useEventVolunteers } from '@/hooks/useEventVolunteers';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { useRouter } from 'expo-router';

interface EventAttendeesCarouselProps {
  eventId: string;
}

export function EventAttendeesCarousel({
  eventId,
}: EventAttendeesCarouselProps) {
  const router = useRouter();
  const { volunteers, loading } = useEventVolunteers(eventId);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>See who is attending:</Text>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>See who is attending:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {volunteers.map(item => (
          <Pressable
            key={item.registration.id}
            style={styles.attendeeCard}
            onPress={() => {
              if (item.volunteer?.id) {
                router.push(`/profile/${item.volunteer.id}`);
              }
            }}
          >
            <ProfileAvatar
              firstName={item.volunteer?.firstName || 'Unknown'}
              lastName={item.volunteer?.lastName || 'User'}
              size={64}
              volunteerId={item.volunteer?.id}
            />
            <Text style={styles.attendeeName} numberOfLines={2}>
              {item.volunteer
                ? `${item.volunteer.firstName} ${item.volunteer.lastName}`
                : 'Unknown'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontFamily: Fonts.regular_400,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  scrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  attendeeCard: {
    alignItems: 'center',
    width: 80,
  },
  attendeeName: {
    fontFamily: Fonts.light_300,
    fontSize: 12,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 8,
  },
  loadingText: {
    fontFamily: Fonts.light_300,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});
