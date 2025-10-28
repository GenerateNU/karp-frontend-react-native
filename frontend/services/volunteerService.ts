import api from '@/api';

async function getVolunteer(volunteerId: string) {
  const response = await api.get(`/volunteer/${volunteerId}`);
  return response.data;
}

async function getSelf() {
  const response = await api.get(`/volunteer/me`);
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
) {
  const response = await api.put(`/volunteer/${volunteerId}`, updates);
  return response.data;
}

async function deleteVolunteer(volunteerId: string): Promise<void> {
  await api.delete(`/volunteer/${volunteerId}`);
}

export const volunteerService = {
  getVolunteer,
  getSelf,
  updateVolunteer,
  deleteVolunteer,
};