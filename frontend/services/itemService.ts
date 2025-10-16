import api from '@/api';

export async function getItem(itemId: string) {
  const response = await api.get(`/item/${itemId}`);
  return response.data;
}

export async function getAllItems() {
  const response = await api.get(`/item/all`);
  return response.data;
}
