import api from '@/api';
import { Event, EventFilters } from '@/types/api/event';
import { LocationFilter } from '@/types/api/location';

async function getAllEvents(
  query?: string,
  filters?: EventFilters,
  locationFilter?: LocationFilter,
  volunteerId?: string
): Promise<Event[]> {
  const params: Record<string, unknown> = {};

  if (query && query.trim()) {
    params.q = query.trim();
  }

  if (
    locationFilter &&
    locationFilter.latitude &&
    locationFilter.longitude &&
    locationFilter.radiusKm
  ) {
    params.lat = locationFilter.latitude;
    params.lng = locationFilter.longitude;
    params.location_radius_km = locationFilter.radiusKm;
  }

  if (filters) {
    Object.assign(params, filters);
  }

  if (
    (filters?.sort_by === 'been_before' ||
      filters?.sort_by === 'recommendations') &&
    volunteerId
  ) {
    params.volunteer_id = volunteerId;
  }

  if (
    (params?.sort_by === 'been_before' ||
      params?.sort_by === 'recommendations') &&
    volunteerId
  ) {
    params.volunteer_id = volunteerId;
  }

  if (!params.sort_by) {
    params.sort_by = 'distance';
  }

  const { data: events } = await api
    .get('event/all', { params })
    .catch(error => {
      console.error('Full error:', error.response?.data || error);
      throw error;
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

export const eventService = {
  getAllEvents,
  getEventById,
  getEventsByOrganization,
};
