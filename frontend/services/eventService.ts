import api from '@/api';
import { Event, EventFilters, EventStatus } from '@/types/api/event';

async function getAllEvents(filters?: EventFilters): Promise<Event[]> {
  const { data: events } = await api.get('event/all', {
    params: filters,
  });
  return events;
}

async function getEventById(id: string): Promise<Event | null> {
  const endpoint = `event/${id}`;
  const { data: event } = await api.get(endpoint);
  return event;
}

async function getEventsByOrganization(
  organizationId: string
): Promise<Event[]> {
  const endpoint = `event/organization/${organizationId}`;
  const { data: events } = await api.get(endpoint);
  return events;
}

async function searchEvents(
  query: string,
  filters?: EventFilters
): Promise<Event[]> {
  const params: Record<string, unknown> = {
    q: query,
    statuses: EventStatus.PUBLISHED,
  };
  if (filters) Object.assign(params, filters);

  const { data: events } = await api.get('event/search', { params });
  return events;
}

async function getNearEvents(filters?: EventFilters): Promise<Event[]> {
  const { data: events } = await api.get('event/near', {
    params: filters,
  });
  return events;
}

async function getEventImageUrl(eventId: string): Promise<string | null> {
  try {
    const res = await api.get(`event/${eventId}/image`);
    const data = res.data;
    return data.url; // data.url is the pre-signed GET URL
  } catch (err) {
    console.error('Failed to fetch image URL:', err);
    return null;
  }
}

export const eventService = {
  getAllEvents,
  getEventById,
  getEventsByOrganization,
  searchEvents,
  getNearEvents,
  getEventImageUrl,
};
