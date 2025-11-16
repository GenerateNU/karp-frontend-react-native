import api from '@/api';
import { Item } from '@/types/api/item';

async function getItem(itemId: string): Promise<Item> {
  const response = await api.get(`/item/${itemId}`);
  return response.data;
}

async function getAllItems(): Promise<Item[]> {
  const response = await api.get(`/item/all`);
  console.log('Fetched all items:', response.data);
  return response.data;
}

export const itemService = {
  getItem,
  getAllItems,
};
