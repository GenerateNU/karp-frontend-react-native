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
  };

  if (
    locationFilter &&
    locationFilter.latitude &&
    locationFilter.longitude &&
    locationFilter.radiusKm
  ) {
    params.lat = locationFilter.latitude;
    params.lng = locationFilter.longitude;
    params.distance_km = locationFilter.radiusKm;
    params.sort_by = 'distance';
    console.log('Filtering events by location:', {
      lat: params.lat,
      lng: params.lng,
      distance_km: params.distance_km,
      sort_by: params.sort_by,
    });
  }

  if (filters) {
    Object.assign(params, filters);
  }

  const { data: events } = await api.get('event/search', { params });
  console.log('Fetched events:', events?.length || 0, 'events');
  return events;
}

export const eventService = {
  getAllEvents,
  getEventById,
  getEventsByOrganization,
  searchEvents,
};
