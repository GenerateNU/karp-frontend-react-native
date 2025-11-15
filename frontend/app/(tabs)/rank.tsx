import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';
import { volunteerService } from '@/services/volunteerService';
import { useAuth } from '@/context/AuthContext';
import { Volunteer } from '@/types/api/volunteer';

interface LeaderboardEntry {
  rank: number;
  name: string;
  coins: number;
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
  const { volunteer: currentVolunteer } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const topVolunteers = await volunteerService.getTopVolunteers(10);

        // Sort by coins descending to ensure correct ranking
        const sortedVolunteers = [...topVolunteers].sort(
          (a, b) => b.coins - a.coins
        );

        const entries: LeaderboardEntry[] = sortedVolunteers.map(
          (volunteer, index) => ({
            rank: index + 1,
            name: getVolunteerName(volunteer),
            coins: volunteer.coins,
            level: calculateLevel(volunteer.experience),
            isCurrentUser: currentVolunteer?.id === volunteer.id,
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
  }, [currentVolunteer?.id]);

  const currentUser = leaderboardData.find(entry => entry.isCurrentUser);

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

        {/* Current User Rank Highlight */}
        {currentUser && (
          <View style={styles.currentRankBox}>
            <View style={styles.currentRankContent}>
              <Text style={styles.currentRankNumber}>{currentUser.rank}</Text>
              <View style={styles.avatarContainer}>
                <Avatar volunteerId={currentUser.volunteer.id} size={50} />
              </View>
              <View style={styles.currentRankInfo}>
                <Text style={styles.currentRankLabel}>Your Current Rank</Text>
                <Text style={styles.currentRankLevel}>
                  Lv. {currentUser.level}
                </Text>
                <Text style={styles.currentRankCoins}>
                  {currentUser.coins} coins
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Call to Action */}
        <Text style={styles.callToAction}>See how you rank among others!</Text>

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
              <View
                key={entry.volunteer.id}
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
                  <Text style={styles.entryCoins}>{entry.coins} coins</Text>
                </View>
                <Text style={styles.entryLevel}>Lv. {entry.level}</Text>
              </View>
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
  currentRankBox: {
    backgroundColor: '#FFB84D', // Yellow-orange color
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  currentRankContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentRankNumber: {
    fontFamily: Fonts.regular_400,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1D0F48', // Dark purple
    marginRight: 12,
  },
  avatarContainer: {
    marginRight: 12,
  },
  currentRankInfo: {
    flex: 1,
  },
  currentRankLabel: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1D0F48',
    marginBottom: 4,
  },
  currentRankLevel: {
    fontFamily: Fonts.regular_400,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1D0F48',
    marginBottom: 2,
  },
  currentRankCoins: {
    fontFamily: Fonts.light_300,
    fontSize: 12,
    color: '#1D0F48',
  },
  callToAction: {
    fontFamily: Fonts.regular_400,
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: 16,
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
    backgroundColor: '#FFB84D', // Yellow-orange highlight
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
  entryCoins: {
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
