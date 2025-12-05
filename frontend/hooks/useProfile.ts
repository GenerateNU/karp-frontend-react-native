import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { profileService } from '@/services/profileService';
import { ProfileData } from '@/types/api/profile';
import { Event } from '@/types/api/event';
import { Volunteer } from '@/types/api/volunteer';
import { useCurrentVolunteer } from '@/hooks/useCurrentVolunteer';

// TODO: abstract to backend asw
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
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      // Ensure we have latest volunteer
      const vResult = await refetchVolunteer();

      const v: Volunteer | null = vResult.data ?? qVolunteer ?? null;
      setVolunteer(v);

      if (!v) {
        setUpcomingEvents([]);
        setProfileData(null);
        return;
      }

      // Fetch upcoming and past events using the resolved volunteer id
      const [upcoming, pastEventsData, levelProgress] = await Promise.all([
        profileService.getUpcomingEvents(v.id),
        profileService.getPastEvents(v.id),
        profileService.getLevelProgress(),
      ]);

      setUpcomingEvents(upcoming);
      const totalHours = calculateTotalHours(pastEventsData);

      const stats = {
        totalHours,
        level: v.currentLevel,
        levelProgress: levelProgress ?? 0, // meh
        experiencePoints: v.experience,
      };

      setProfileData({
        volunteer: v,
        upcomingEvents: upcoming,
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
    // If volunteer query is still loading, wait
    if (volunteerLoading) return;
    // Build with current data (events will be fetched)
    loadProfileData(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
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
