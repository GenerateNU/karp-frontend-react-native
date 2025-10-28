import api from '@/api';
import { Volunteer } from '@/types/api/volunteer';

async function getSelf() {
  const response = await api.get(`/volunteer/me`);
  return response.data;
}

async function getVolunteer(volunteerId: string) {
  const response = await api.get(`/volunteer/${volunteerId}`);
  return response.data;
}

async function updateVolunteer(
  volunteerId: string,
  updates: {
    firstName?: string;
    lastName?: string;
    age?: number;
    coins?: number;
    preferences?: string[];
    isActive?: boolean;
  }
): Promise<Volunteer> {
  const response = await api.put(`/volunteer/${volunteerId}`, updates);
  return response.data;
}

export const volunteerService = {
  getSelf,
  getVolunteer,
  updateVolunteer,
};