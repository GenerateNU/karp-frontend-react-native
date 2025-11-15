import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { volunteerService } from '@/services/volunteerService';
import { useAuth } from '@/context/AuthContext';
import { Volunteer } from '@/types/api/volunteer';

interface LeaderboardEntry {
  rank: number;
  name: string;
  experience: number;
  level: number;
  isCurrentUser?: boolean;
  volunteer: Volunteer;
}

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

function getVolunteerName(volunteer: Volunteer): string {
  if (volunteer.preferredName) {
    return volunteer.preferredName;
  }
  return `${volunteer.firstName} ${volunteer.lastName}`;
}

interface AvatarProps {
  volunteerId: string;
  size: number;
}

// List of available fish SVG files
const fishImages = [
  require('@/assets/fish/2969994.svg'),
  require('@/assets/fish/2970035.svg'),
  require('@/assets/fish/2970049.svg'),
  require('@/assets/fish/2970082.svg'),
  require('@/assets/fish/3050620.svg'),
  require('@/assets/fish/5100701.svg'),
  require('@/assets/fish/6789540.svg'),
  require('@/assets/fish/6789575.svg'),
  require('@/assets/fish/6789598.svg'),
  require('@/assets/fish/fish 1.svg'),
];

// Get a consistent fish image for a volunteer based on their ID
function getFishImageForVolunteer(volunteerId: string) {
  // Convert ID to a number using a simple hash
  let hash = 0;
  for (let i = 0; i < volunteerId.length; i++) {
    hash = ((hash << 5) - hash + volunteerId.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % fishImages.length;
  return fishImages[index];
}

function Avatar({ volunteerId, size }: AvatarProps) {
  const fishImage = getFishImageForVolunteer(volunteerId);

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: Colors.light.background,
          overflow: 'hidden',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <Image
        source={fishImage}
        style={{
          width: size,
          height: size,
        }}
        resizeMode="cover"
      />
    </View>
  );
}

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch current volunteer if user is available (same approach as profile page)
        let volunteerData: Volunteer | null = null;
        if (user?.entityId) {
          try {
            volunteerData = await volunteerService.getSelf();
            setCurrentVolunteer(volunteerData);
          } catch (err) {
            console.error('Error fetching current volunteer:', err);
          }
        }

        const topVolunteers = await volunteerService.getTopVolunteers(10);

        const entries: LeaderboardEntry[] = topVolunteers.map(
          (volunteer, index) => ({
            rank: index + 1,
            name: getVolunteerName(volunteer),
            experience: volunteer.experience,
            level:
              volunteer.currentLevel ?? calculateLevel(volunteer.experience),
            isCurrentUser: volunteerData?.id === volunteer.id,
            volunteer,
          })
        );

        setLeaderboardData(entries);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user?.entityId]);

  if (loading) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <View style={[styles.content, styles.centerContent]}>
          <ActivityIndicator size="large" color={Colors.light.tint} />
          <Text style={styles.loadingText}>Loading leaderboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <View style={[styles.content, styles.centerContent]}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.headerTitle}>Leaderboard</Text>

        {(() => {
          const currentUserEntry = leaderboardData.find(
            entry => entry.isCurrentUser
          );
          return currentUserEntry ? (
            <View style={[styles.leaderboardEntry, styles.currentUserEntry]}>
              <Text style={styles.rankNumber}>{currentUserEntry.rank}</Text>
              <View style={styles.entryAvatarContainer}>
                <Avatar volunteerId={currentUserEntry.volunteer.id} size={40} />
              </View>
              <View style={styles.entryInfo}>
                <Text style={styles.entryName}>Your Current Rank</Text>
                <Text style={styles.entryExperience}>
                  {currentUserEntry.experience} XP
                </Text>
              </View>
              <Text style={styles.entryLevel}>
                Lv. {currentUserEntry.level}
              </Text>
            </View>
          ) : null;
        })()}

        <Text style={styles.headerSubtitle}>
          See how you rank among others!
        </Text>

        {/* Leaderboard List */}
        <ScrollView
          style={styles.leaderboardList}
          contentContainerStyle={styles.leaderboardContent}
          showsVerticalScrollIndicator={false}
        >
          {leaderboardData.length === 0 ? (
            <Text style={styles.emptyText}>No leaderboard data available</Text>
          ) : (
            leaderboardData.map(entry => (
              <Pressable
                key={entry.volunteer.id}
                onPress={() => {
                  if (!entry.isCurrentUser) {
                    router.push(`/profile/${entry.volunteer.id}`);
                  }
                }}
                disabled={entry.isCurrentUser}
              >
                <View
                  style={[
                    styles.leaderboardEntry,
                    entry.isCurrentUser && styles.currentUserEntry,
                  ]}
                >
                  <Text style={styles.rankNumber}>{entry.rank}</Text>
                  <View style={styles.entryAvatarContainer}>
                    <Avatar volunteerId={entry.volunteer.id} size={40} />
                  </View>
                  <View style={styles.entryInfo}>
                    <Text style={styles.entryName}>{entry.name}</Text>
                    <Text style={styles.entryExperience}>
                      {entry.experience} XP
                    </Text>
                  </View>
                  <Text style={styles.entryLevel}>Lv. {entry.level}</Text>
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.eggshellWhite,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontFamily: Fonts.regular_400,
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  headerSubtitle: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    paddingTop: 10,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardContent: {
    paddingBottom: 100, // Space for bottom nav
  },
  leaderboardEntry: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3B82F6', // Blue border
    padding: 12,
    marginBottom: 12,
  },
  currentUserEntry: {
    backgroundColor: 'rgba(251, 191, 36, 0.5)', // Amber-400 with 50% opacity (gold)
  },
  rankNumber: {
    fontFamily: Fonts.regular_400,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1D0F48',
    width: 30,
    marginRight: 12,
  },
  entryAvatarContainer: {
    marginRight: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D0F48',
    marginBottom: 4,
  },
  entryExperience: {
    fontFamily: Fonts.light_300,
    fontSize: 12,
    color: '#1D0F48',
  },
  entryLevel: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D0F48',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.text,
    marginTop: 16,
  },
  errorText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
  },
  emptyText: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    color: Colors.light.text,
    textAlign: 'center',
    marginTop: 20,
  },
});
