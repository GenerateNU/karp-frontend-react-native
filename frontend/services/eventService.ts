import api from '@/api';
import { Event, EventFilters } from '@/types/api/event';

async function getAllEvents(filters?: EventFilters): Promise<Event[]> {
  let endpoint = 'event/all';
  if (filters) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
  }
  const { data: events } = await api.get(endpoint);
  return events;
}

async function getEventById(id: string): Promise<Event | null> {
  const endpoint = `event/${id}`;
  const { data: event } = await api.get(endpoint);
  return event;
}

async function searchEvents(
  query: string,
  filters?: EventFilters
): Promise<Event[]> {
  let endpoint = `event/search?q=${encodeURIComponent(query)}`;
  if (filters) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    if (queryParams.toString()) {
      endpoint += `&${queryParams.toString()}`;
    }
  }
  const { data: events } = await api.get(endpoint);
  return events;
}

async function getNearEvents(filters?: EventFilters): Promise<Event[]> {
  let endpoint = 'event/near';
  if (filters) {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
  }
  const { data: events } = await api.get(endpoint);
  return events;
}

export const eventService = {
  getAllEvents,
  getEventById,
  searchEvents,
  getNearEvents,
};
