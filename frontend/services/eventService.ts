// import { EventInfo } from '@/types/api/event';

// export async function getEventById(eventId: string): Promise<EventInfo> {
//   const response = await fetch(`${API_BASE_URL}/event/${eventId}`);
//   if (!response.ok) throw new Error('Failed to fetch event');
//   return response.json();
// }
import { apiService } from './api';
import { Event, EventFilters } from '@/types/api/event';
import { toEvent } from '@/utils/event';

export async function getAllEvents(filters?: EventFilters): Promise<Event[]> {
  const response = await apiService.getAllEvents(filters);
  if (!response.success) {
    console.error('Failed to fetch events:', response.message);
    throw new Error(response.message || 'Failed to fetch events');
  }
  return (response.data || []).map(toEvent);
}

export async function getEventById(id: string): Promise<Event | null> {
  const response = await apiService.getEventById(id);
  if (!response.success) {
    console.error('Failed to fetch event:', response.message);
    throw new Error(response.message || 'Failed to fetch event');
  }
  return toEvent(response.data!);
}

export async function searchEvents(
  query: string,
  filters?: EventFilters
): Promise<Event[]> {
  const response = await apiService.searchEvents(query, filters);
  if (!response.success) {
    console.error('Failed to search events:', response.message);
    throw new Error(response.message || 'Failed to search events');
  }
  return (response.data || []).map(toEvent);
}

export async function getNearEvents(filters?: EventFilters): Promise<Event[]> {
  const response = await apiService.getNearEvents(filters);
  if (!response.success) {
    console.error('Failed to fetch near events:', response.message);
    throw new Error(response.message || 'Failed to fetch near events');
  }
  return (response.data || []).map(toEvent);
}

export const eventService = {
  getAllEvents,
  getEventById,
  searchEvents,
  getNearEvents,
};
