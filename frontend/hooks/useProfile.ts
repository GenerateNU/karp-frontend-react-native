import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/profileService';
import { ProfileData } from '@/types/api/profile';
import { Event } from '@/types/api/event';
import { Volunteer } from '@/types/api/volunteer';
import { useCurrentVolunteer } from '@/hooks/useCurrentVolunteer';

// temporary logic idk how we're calculating level lol
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
  progress: number; // 0-100
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

export function useProfile() {
  const { user } = useAuth();
  const {
    data: qVolunteer,
    isLoading: volunteerLoading,
    refetch: refetchVolunteer,
  } = useCurrentVolunteer();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const loadProfileData = async (isRefresh = false) => {
    if (!user?.entityId) {
      setLoading(false);
      return;
    }
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      // Ensure we have latest volunteer (React Query)
      const [vResult, eventsData, pastEventsData] = await Promise.all([
        refetchVolunteer(),
        profileService.getUpcomingEvents(user.entityId),
        profileService.getPastEvents(user.entityId),
      ]);

      const v = vResult.data ?? qVolunteer ?? null;
      setVolunteer(v);
      setUpcomingEvents(eventsData);

      if (!v) {
        setProfileData(null);
        return;
      }

      const levelData = calculateLevelProgress(v.experience);
      const totalHours = calculateTotalHours(pastEventsData);

      const stats = {
        totalHours,
        level: levelData.level,
        levelProgress: levelData.progress,
        experiencePoints: v.experience,
        nextLevelXP: levelData.nextLevelXP,
      };

      setProfileData({
        volunteer: v,
        upcomingEvents: eventsData,
        stats,
      });
    } catch (error) {
      console.log('Error loading profile data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    loadProfileData(true);
  };

  useEffect(() => {
    // When user or volunteer changes, rebuild profile
    if (!user?.entityId) {
      setLoading(false);
      return;
    }
    // If volunteer query is still loading, wait
    if (volunteerLoading) return;
    // Build with current data (events will be fetched)
    loadProfileData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user?.entityId,
    qVolunteer?.id,
    qVolunteer?.firstName,
    qVolunteer?.lastName,
    qVolunteer?.experience,
  ]);

  return {
    profileData,
    volunteer,
    upcomingEvents,
    loading,
    refreshing,
    handleRefresh,
  };
}
