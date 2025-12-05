import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { BackHeader } from '@/components/common/BackHeader';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { FishTank } from '@/components/profile/FishTank';
import { StatCard } from '@/components/profile/StatCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { volunteerService } from '@/services/volunteerService';
import { profileService } from '@/services/profileService';
import { Volunteer } from '@/types/api/volunteer';
import { Event } from '@/types/api/event';

function calculateTotalHours(completedEvents: Event[]): number {
  return completedEvents.reduce((sum, event) => {
    const start = new Date(event.startDateTime);
    const end = new Date(event.endDateTime);
    const durationMs = end.getTime() - start.getTime();
    const hours = durationMs / (1000 * 60 * 60);
    return sum + hours;
  }, 0);
}

export default function UserProfileScreen() {
  const { volunteerId } = useLocalSearchParams<{ volunteerId: string }>();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    totalHours: number;
    level: number;
  } | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!volunteerId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch volunteer data
        const volunteerData = await volunteerService.getVolunteer(volunteerId);
        if (!volunteerData) {
          setLoading(false);
          return;
        }

        setVolunteer(volunteerData);

        // Fetch past events to calculate hours
        const pastEventsData = await profileService.getPastEvents(volunteerId);

        // Calculate stats
        const totalHours = calculateTotalHours(pastEventsData);

        setStats({
          totalHours,
          level: volunteerData.currentLevel,
        });
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [volunteerId]);

  if (loading) {
    return <LoadingScreen text="Loading profile..." />;
  }

  if (!volunteer || !stats) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <BackHeader />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <ProfileAvatar
            firstName={volunteer.firstName}
            lastName={volunteer.lastName}
            volunteerId={volunteer.id}
          />
          <Text style={styles.name}>
            {volunteer.firstName} {volunteer.lastName}
          </Text>
          <Text style={styles.levelLabel}>Level {stats.level}</Text>
        </View>

        <FishTank volunteerId={volunteer.id} />

        <View style={styles.statsContainer}>
          <StatCard
            title="Total Hours"
            value={`${Math.round(stats.totalHours)} hours`}
          />
          <StatCard title="Level" value={`${stats.level}`} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.eggshellWhite,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.eggshellWhite,
  },
  errorText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.errorText,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  name: {
    fontFamily: Fonts.regular_400,
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.text,
    marginTop: 20,
  },
  levelLabel: {
    fontFamily: Fonts.light_300,
    fontSize: 10,
    color: Colors.light.textSecondary,
    marginTop: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
    marginTop: 20,
    marginBottom: 26,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
