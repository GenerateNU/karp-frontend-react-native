import api from '@/api';
import { Event } from '@/types/api/event';
import { RegistrationStatus } from '@/types/api/registration';
import { VolunteerAchievement } from '@/types/api/volunteer-achievement';

async function getUpcomingEvents(volunteerId: string): Promise<Event[]> {
  const response = await api.get(`/registration/events/${volunteerId}`, {
    params: { registration_status: RegistrationStatus.UPCOMING },
  });
  return response.data;
}

async function getPastEvents(volunteerId: string): Promise<Event[]> {
  const response = await api.get(`/registration/events/${volunteerId}`, {
    params: { registration_status: RegistrationStatus.COMPLETED },
  });
  return response.data;
}

async function getVolunteerAchievements(
  volunteerId: string
): Promise<VolunteerAchievement[]> {
  const response = await api.get(`/volunteer-achievement/volunteer/${volunteerId}`);
  return response.data;
}

export const profileService = {
  getUpcomingEvents,
  getPastEvents,
  getVolunteerAchievements,
};