import api from '@/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getVolunteer(volunteerId: string) {
  const response = await api.get(`${API_BASE_URL}/volunteer/${volunteerId}`);
  return response.data;
}

export async function getSelf() {
  const response = await api.get(`${API_BASE_URL}/volunteer/me`);
  return response.data;
}
