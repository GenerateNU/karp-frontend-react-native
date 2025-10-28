import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { ProfileAvatar } from '@/components/profile/ProfileAvatar';
import { LevelProgress } from '@/components/profile/LevelProgress';
import { FishTank } from '@/components/profile/FishTank';
import { StatCard } from '@/components/profile/StatCard';
import { ProfileEventCard } from '@/components/profile/ProfileEventCard';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

export default function ProfileScreen() {
  const router = useRouter();
  const { profileData, upcomingEvents, loading, refreshing, handleRefresh } =
    useProfile();

  if (loading) {
    return <LoadingScreen text="Loading profile..." />;
  }

  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  const { volunteer, stats } = profileData;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Pressable
            onPress={() => router.push('/profile/settings')}
            style={styles.settingsButton}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={Colors.light.text}
            />
          </Pressable>
        </View>

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

        <FishTank />

        <LevelProgress
          level={stats.level}
          progress={stats.levelProgress}
          motivationalText="some motivating text idk some motivating text idk"
        />

        <View style={styles.statsContainer}>
          <StatCard
            title="Hours Spent Volunteering"
            value={`${Math.round(stats.totalHours)} hours`}
          />
          <StatCard
            title="My Documents"
            value=" "
            onPress={() => {
              alert('Documents will be here lol');
            }}
          />
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Events</Text>

          {upcomingEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No upcoming events. Sign up for events to get started!
              </Text>
            </View>
          ) : (
            <>
              {upcomingEvents.map(event => (
                <ProfileEventCard
                  key={event.id}
                  event={event}
                  onPress={event => router.push(`/events/${event.id}/info`)}
                />
              ))}
            </>
          )}

          <Pressable
            onPress={() => router.push('/profile/events/past')}
            style={styles.seePastButton}
          >
            <Text style={styles.seePastText}>See past events</Text>
          </Pressable>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerSpacer: {
    width: 40,
  },
  settingsButton: {
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
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
  eventsSection: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: Fonts.regular_400,
    fontSize: 20,
    fontWeight: '500',
    color: Colors.light.text,
    marginBottom: 12,
    width: 460,
    alignSelf: 'center'
  },
  emptyState: {
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: Fonts.light_300,
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  seePastButton: {
    marginTop: 10,
    paddingVertical: 12,
    alignItems: 'flex-end',
    width: 460,
    alignSelf: 'center'
  },
  seePastText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.text,
    textDecorationLine: 'underline',
  },
});
