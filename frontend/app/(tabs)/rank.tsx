import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Fonts } from '@/constants/Fonts';

interface LeaderboardEntry {
  rank: number;
  name: string;
  hours: number;
  level: number;
  isCurrentUser?: boolean;
}

// Mock data - replace with actual API call
const mockLeaderboardData: LeaderboardEntry[] = [
  { rank: 1, name: 'Qihong Wu', hours: 140, level: 37 },
  { rank: 2, name: 'Sierra Welsch', hours: 139, level: 33 },
  { rank: 3, name: 'Isha Madhusudhan', hours: 137, level: 31 },
  { rank: 4, name: 'Lydia Lutake', hours: 121, level: 26 },
  { rank: 5, name: 'Victoria chin', hours: 112, level: 24 },
  {
    rank: 6,
    name: 'Your Current Rank',
    hours: 100,
    level: 21,
    isCurrentUser: true,
  },
];

export default function LeaderboardScreen() {
  const currentUser = mockLeaderboardData.find(entry => entry.isCurrentUser);

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
                <View style={styles.avatar} />
              </View>
              <View style={styles.currentRankInfo}>
                <Text style={styles.currentRankLabel}>Your Current Rank</Text>
                <Text style={styles.currentRankLevel}>
                  Lv. {currentUser.level}
                </Text>
                <Text style={styles.currentRankHours}>
                  {currentUser.hours} hrs
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
          {mockLeaderboardData.map(entry => (
            <View
              key={entry.rank}
              style={[
                styles.leaderboardEntry,
                entry.isCurrentUser && styles.currentUserEntry,
              ]}
            >
              <Text style={styles.rankNumber}>{entry.rank}</Text>
              <View style={styles.entryAvatarContainer}>
                <View style={styles.entryAvatar} />
              </View>
              <View style={styles.entryInfo}>
                <Text style={styles.entryName}>{entry.name}</Text>
                <Text style={styles.entryHours}>{entry.hours} hrs</Text>
              </View>
              <Text style={styles.entryLevel}>Lv. {entry.level}</Text>
            </View>
          ))}
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.light.background,
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
  currentRankHours: {
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
  entryAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.background,
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
  entryHours: {
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
});
