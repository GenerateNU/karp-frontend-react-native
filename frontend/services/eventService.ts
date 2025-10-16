import api from '@/api';
import { Event, EventFilters, EventResponse } from '@/types/api/event';
import { toEvent } from '@/utils/event';

export async function getAllEvents(filters?: EventFilters): Promise<Event[]> {
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
  try {
    const { data } = await api.get(endpoint);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.events)
          ? data.events
          : data;
    return ((list as EventResponse[]) || []).map(toEvent);
  } catch (error: unknown) {
    console.error('Failed to fetch events:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch events'
    );
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  const endpoint = `event/${id}`;
  try {
    const { data } = await api.get(endpoint);
    const item = (data?.data ?? data?.event ?? data) as EventResponse;
    return toEvent(item);
  } catch (error: unknown) {
    console.error('Failed to fetch event:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch event'
    );
  }
}

export async function searchEvents(
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
  try {
    const { data } = await api.get(endpoint);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.events)
          ? data.events
          : data;
    return ((list as EventResponse[]) || []).map(toEvent);
  } catch (error: unknown) {
    console.error('Failed to search events:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to search events'
    );
  }
}

export async function getNearEvents(filters?: EventFilters): Promise<Event[]> {
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
  try {
    const { data } = await api.get(endpoint);
    const list = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.events)
          ? data.events
          : data;
    return ((list as EventResponse[]) || []).map(toEvent);
  } catch (error: unknown) {
    console.error('Failed to fetch near events:', error);
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch near events'
    );
  }
}

export const eventService = {
  getAllEvents,
  getEventById,
  searchEvents,
  getNearEvents,
};
