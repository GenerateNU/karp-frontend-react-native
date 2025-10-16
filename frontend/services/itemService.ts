import api from '@/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export async function getItem(itemId: string) {
  const response = await api.get(`${API_BASE_URL}/item/${itemId}`);
  return response.data;
}

export async function getAllItems() {
  const response = await api.get(`${API_BASE_URL}/item/all`);
  return response.data;
}
