import api from '@/api';
import { Event } from '@/types/api/event';
import { RegistrationStatus } from '@/types/api/registration';
import { VolunteerAchievement } from '@/types/api/achievement';

async function getUpcomingEvents(volunteerId: string): Promise<Event[]> {
  const response = await api.get(`/registration/events/${volunteerId}`, {
    params: { registration_status: RegistrationStatus.UPCOMING },
  });

  const events: Event[] = response.data;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return events.filter(ev => {
    const eventDate = new Date(ev.startDateTime);
    eventDate.setHours(0, 0, 0, 0);
    return eventDate >= today;
  });
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
  const response = await api.get(
    `/volunteer-achievement/volunteer/${volunteerId}`
  );
  return response.data;
}

async function getLevelProgress(): Promise<number | null> {
  const response = await api.get(`/volunteer/level-progress`);
  return response.data;
}

export const profileService = {
  getUpcomingEvents,
  getPastEvents,
  getVolunteerAchievements,
  getLevelProgress,
};
