import api from '@/api';
import { Volunteer } from '@/types/api/volunteer';
import { CreateVolunteerRequest } from '@/types/signup';

async function getVolunteer(volunteerId: string): Promise<Volunteer | null> {
  const response = await api.get(`/volunteer/${volunteerId}`);
  return response.data;
}

async function getSelf(): Promise<Volunteer | null> {
  const response = await api.get(`/volunteer/me`);
  return response.data;
}

async function createVolunteer(
  volunteer: CreateVolunteerRequest
): Promise<Volunteer> {
  const response = await api.post(`/volunteer/new`, volunteer);
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
): Promise<Volunteer | null> {
  const response = await api.put(`/volunteer/${volunteerId}`, updates);
  return response.data;
}

async function deleteVolunteer(volunteerId: string): Promise<void> {
  await api.delete(`/volunteer/${volunteerId}`);
}

async function getTopVolunteers(limit: number = 10): Promise<Volunteer[]> {
  const response = await api.get(`/volunteer/top`, {
    params: { limit },
  });
  return response.data;
}

export const volunteerService = {
  getVolunteer,
  createVolunteer,
  getSelf,
  updateVolunteer,
  deleteVolunteer,
  getTopVolunteers,
};
