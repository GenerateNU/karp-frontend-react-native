import api from '@/api';
import { Event, EventFilters, EventStatus } from '@/types/api/event';
import { LocationFilter } from '@/types/api/location';

async function getAllEvents(filters?: EventFilters): Promise<Event[]> {
  const { data: events } = await api.get('event/all', {
    params: filters,
  });
  console.log('Actual Events:', events);
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
  filters?: EventFilters,
  locationFilter?: LocationFilter
): Promise<Event[]> {
  const params: Record<string, unknown> = {
    q: query,
    statuses: EventStatus.APPROVED,
    lat: locationFilter?.latitude,
    lng: locationFilter?.longitude,
    distance_km: locationFilter?.radiusKm,
  };
  if (filters) {
    Object.assign(params, filters);
  }

  const { data: events } = await api.get('event/search', { params });
  console.log('Actual Events:', events);
  return events;
}

export const eventService = {
  getAllEvents,
  getEventById,
  getEventsByOrganization,
  searchEvents,
};
