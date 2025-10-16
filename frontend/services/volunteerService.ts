import api from '@/api';

async function getVolunteer(volunteerId: string) {
  const response = await api.get(`/volunteer/${volunteerId}`);
  return response.data;
}

async function getSelf() {
  const response = await api.get(`/volunteer/me`);
  return response.data;
}

export const volunteerService = {
  getVolunteer,
  getSelf,
};
