import { ItemInfo } from '@/types/api/item';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export async function getItemById(itemId: string): Promise<ItemInfo> {
  const response = await fetch(`${API_BASE_URL}/item/${itemId}`);
  if (!response.ok) throw new Error('Failed to fetch item');
  return response.json();
}
