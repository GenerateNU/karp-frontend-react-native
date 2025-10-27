import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/profileService';
import { volunteerService } from '@/services/volunteerService';
import { ProfileData } from '@/types/api/profile';
import { Event } from '@/types/api/event';
import { Volunteer } from '@/types/api/volunteer';

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

      const [volunteerData, eventsData, pastEventsData] = await Promise.all([
        volunteerService.getSelf(),
        profileService.getUpcomingEvents(user.entityId),
        profileService.getPastEvents(user.entityId),
      ]);

      setVolunteer(volunteerData);
      setUpcomingEvents(eventsData);

      const levelData = calculateLevelProgress(volunteerData.experience);
      const totalHours = calculateTotalHours(pastEventsData);

      const stats = {
        totalHours,
        level: levelData.level,
        levelProgress: levelData.progress,
        experiencePoints: volunteerData.experience,
        nextLevelXP: levelData.nextLevelXP,
      };

      setProfileData({
        volunteer: volunteerData,
        upcomingEvents: eventsData,
        stats,
      });
    } catch (error) {
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
    loadProfileData();
  }, [user?.entityId]);

  return {
    profileData,
    volunteer,
    upcomingEvents,
    loading,
    refreshing,
    handleRefresh,
  };
}