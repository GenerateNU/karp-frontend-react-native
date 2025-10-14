import { EventInfo } from '@/types/api/event';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export async function getEventById(eventId: string): Promise<EventInfo> {
  const response = await fetch(`${API_BASE_URL}/event/${eventId}`);
  if (!response.ok) throw new Error('Failed to fetch event');
  return response.json();
}
