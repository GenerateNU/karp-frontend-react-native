import api from '@/api';
import { CreateVolunteerRequest, Volunteer } from '@/types/api/volunteer';

async function getVolunteer(volunteerId: string) {
  const response = await api.get(`/volunteer/${volunteerId}`);
  return response.data;
}

async function getSelf() {
  const response = await api.get(`/volunteer/me`);
  return response.data;
}

async function createVolunteer(
  volunteer: CreateVolunteerRequest
): Promise<Volunteer> {
  const response = await api.post(`/volunteer/new`, volunteer);
  return response.data;
}

export const volunteerService = {
  getVolunteer,
  getSelf,
  createVolunteer,
};
