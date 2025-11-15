import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { BackHeader } from '@/components/common/BackHeader';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { LevelProgress } from '@/components/profile/LevelProgress';
import { FishTank } from '@/components/profile/FishTank';
import { StatCard } from '@/components/profile/StatCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { volunteerService } from '@/services/volunteerService';
import { profileService } from '@/services/profileService';
import { Volunteer } from '@/types/api/volunteer';
import { Event } from '@/types/api/event';

// Calculate level from experience (same logic as useProfile)
function calculateLevel(experience: number): number {
  if (experience < 100) return 1;

  let level = 1;
  let totalXPNeeded = 0;

  while (totalXPNeeded <= experience) {
    const xpForNextLevel = level * 100 + (level - 1) * 50;
    totalXPNeeded += xpForNextLevel;
    if (totalXPNeeded <= experience) {
      level++;
    } else {
      break;
    }
  }

  return level;
}

function getXPForLevel(level: number): number {
  let totalXP = 0;
  for (let i = 1; i < level; i++) {
    totalXP += i * 100 + (i - 1) * 50;
  }
  return totalXP;
}

function getXPForNextLevel(currentLevel: number): number {
  return currentLevel * 100 + (currentLevel - 1) * 50;
}

function calculateLevelProgress(experience: number): {
  level: number;
  progress: number;
  currentLevelXP: number;
  nextLevelXP: number;
} {
  const level = calculateLevel(experience);
  const xpForCurrentLevel = getXPForLevel(level);
  const xpForNextLevel = getXPForNextLevel(level);
  const currentLevelXP = experience - xpForCurrentLevel;
  const progress = (currentLevelXP / xpForNextLevel) * 100;

  return {
    level,
    progress: Math.min(Math.max(progress, 0), 100),
    currentLevelXP,
    nextLevelXP: xpForNextLevel,
  };
}

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
    levelProgress: number;
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
        const levelData = calculateLevelProgress(volunteerData.experience);
        const totalHours = calculateTotalHours(pastEventsData);

        setStats({
          totalHours,
          level: levelData.level,
          levelProgress: levelData.progress,
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
          />
          <Text style={styles.name}>
            {volunteer.firstName} {volunteer.lastName}
          </Text>
          <Text style={styles.levelLabel}>Level {stats.level}</Text>
        </View>

        <FishTank volunteerId={volunteer.id} />

        <LevelProgress
          level={stats.level}
          progress={stats.levelProgress}
          motivationalText="Keep volunteering to level up!"
        />

        <View style={styles.statsContainer}>
          <StatCard
            title="Total Volunteering Hours"
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
