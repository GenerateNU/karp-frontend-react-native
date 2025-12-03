import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { profileService } from '@/services/profileService';
import { ProfileData } from '@/types/api/profile';
import { Event } from '@/types/api/event';
import { Volunteer } from '@/types/api/volunteer';
import { useCurrentVolunteer } from '@/hooks/useCurrentVolunteer';
import { useUpcomingEvents } from '@/hooks/useUpcomingEvents';

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
  const { user } = useAuth();
  const {
    data: qVolunteer,
    isLoading: volunteerLoading,
    refetch: refetchVolunteer,
  } = useCurrentVolunteer();
  const { data: qUpcomingEvents, refetch: refetchUpcomingEvents } =
    useUpcomingEvents(user?.entityId);
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
      // Ensure we have latest volunteer and upcoming events (React Query)
      const [vResult, uResult, pastEventsData] = await Promise.all([
        refetchVolunteer(),
        refetchUpcomingEvents(),
        profileService.getPastEvents(user.entityId),
      ]);

      const v = vResult.data ?? qVolunteer ?? null;
      setVolunteer(v);
      const upcoming = uResult.data ?? qUpcomingEvents ?? [];
      setUpcomingEvents(upcoming);

      if (!v) {
        setProfileData(null);
        return;
      }

      const levelProgress = await profileService.getLevelProgress();
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
    qUpcomingEvents?.length,
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
