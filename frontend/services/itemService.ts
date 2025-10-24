import api from '@/api';

async function getItem(itemId: string) {
  const response = await api.get(`/item/${itemId}`);
  return response.data;
}

async function getAllItems() {
  const response = await api.get(`/item/all`);
  console.log('Fetched all items:', response.data);
  return response.data;
}

export const itemService = {
  getItem,
  getAllItems,
};
