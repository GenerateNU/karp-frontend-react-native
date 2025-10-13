import { apiService, Event, EventFilters } from './api';

export class EventService {
  async getAllEvents(filters?: EventFilters): Promise<Event[]> {
    const response = await apiService.getAllEvents(filters);

    if (!response.success) {
      console.error('Failed to fetch events:', response.message);
      throw new Error(response.message || 'Failed to fetch events');
    }

    return response.data || [];
  }

  async getEventById(id: string): Promise<Event | null> {
    const response = await apiService.getEventById(id);

    if (!response.success) {
      console.error('Failed to fetch event:', response.message);
      throw new Error(response.message || 'Failed to fetch event');
    }

    return response.data;
  }

  async searchEvents(query: string, filters?: EventFilters): Promise<Event[]> {
    const response = await apiService.searchEvents(query, filters);

    if (!response.success) {
      console.error('Failed to search events:', response.message);
      throw new Error(response.message || 'Failed to search events');
    }

    return response.data || [];
  }

  async getNearEvents(filters?: EventFilters): Promise<Event[]> {
    const response = await apiService.getNearEvents(filters);

    if (!response.success) {
      console.error('Failed to fetch near events:', response.message);
      throw new Error(response.message || 'Failed to fetch near events');
    }

    return response.data || [];
  }
}

export const eventService = new EventService();
