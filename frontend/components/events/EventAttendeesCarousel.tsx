import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useEventVolunteers } from '@/hooks/useEventVolunteers';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { useRouter } from 'expo-router';

interface EventAttendeesCarouselProps {
  eventId: string;
}

export function EventAttendeesCarousel({ eventId }: EventAttendeesCarouselProps) {
  const router = useRouter();
  const { volunteers, loading } = useEventVolunteers(eventId);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>See who is attending:</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#1D0F48" />
        </View>
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
        {volunteers.map((item) => (
          <Pressable
            key={item.registration.id}
            style={[styles.attendeeCard, { marginRight: 20 }]}
            onPress={() => {
              if (item.volunteer?.id) {
                router.push(`/profile/${item.volunteer.id}`);
              }
            }}
          >
            <View style={styles.avatarContainer}>
              <ProfileAvatar
                firstName={item.volunteer?.firstName || 'Unknown'}
                lastName={item.volunteer?.lastName || 'User'}
                size={56}
                volunteerId={item.volunteer?.id}
              />
            </View>
            <Text style={styles.attendeeName} numberOfLines={2} ellipsizeMode="tail">
              {item.volunteer 
                ? `${item.volunteer.firstName} ${item.volunteer.lastName}`
                : 'John Doe'}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    title: {
        fontFamily: 'Inter',
        fontSize: 18,
        fontWeight: '700',
        color: '#1D0F48',
        marginBottom: 16,
    },
    loadingContainer: {
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    attendeeCard: {
        width: 100,
        height: 128,
        backgroundColor: '#FFEAC7',
        borderRadius: 8,
        paddingTop: 12,
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        backgroundColor: 'transparent',
    },
    attendeeName: {
        fontFamily: 'Inter',
        fontSize: 14,
        fontWeight: '400',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 16,
        width: '100%',
        paddingHorizontal: 4,
        flexWrap: 'wrap',
        flexShrink: 1,
    },
});
