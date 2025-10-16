import api from '@/api';

export async function getVolunteer(volunteerId: string) {
  const response = await api.get(`/volunteer/${volunteerId}`);
  return response.data;
}

export async function getSelf() {
  const response = await api.get(`/volunteer/me`);
  return response.data;
}
