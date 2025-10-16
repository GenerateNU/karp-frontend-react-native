import { EventFilters, EventResponse } from '@/types/api/event';
import api from '@/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message?: string;
}

// export interface Event {
//   _id: string;
//   name: string;
//   address: string;
//   location: string | null;
//   start_date_time: string;
//   end_date_time: string;
//   organization_id: string;
//   status: string;
//   max_volunteers: number;
//   coins: number;
//   created_at: string;
//   created_by: string;
// }

// export interface EventFilters {
//   category?: string;
//   date?: string;
//   location?: string;
//   isFree?: boolean;
// }

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    try {
      const response = await api.get(url);
      const data = response.data;

      // Handle different response formats from backend
      if (Array.isArray(data)) {
        // If response is directly an array of events
        return {
          data: data as T,
          success: true,
        };
      } else if (data.data && Array.isArray(data.data)) {
        // If response has a data property containing the array
        return {
          data: data.data as T,
          success: true,
        };
      } else if (data.events && Array.isArray(data.events)) {
        // If response has an events property
        return {
          data: data.events as T,
          success: true,
        };
      } else {
        // Fallback to the original data
        return {
          data: data as T,
          success: true,
        };
      }
    } catch (error) {
      console.error('API request failed:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getAllEvents(
    filters?: EventFilters
  ): Promise<ApiResponse<EventResponse[]>> {
    let endpoint = '/event/all';

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

    return this.request<EventResponse[]>(endpoint);
  }

  async getEventById(id: string): Promise<ApiResponse<EventResponse>> {
    return this.request<EventResponse>(`/event/${id}`);
  }

  async searchEvents(
    query: string,
    filters?: EventFilters
  ): Promise<ApiResponse<EventResponse[]>> {
    let endpoint = `/event/search?q=${encodeURIComponent(query)}`;

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

    return this.request<EventResponse[]>(endpoint);
  }

  async getNearEvents(
    filters?: EventFilters
  ): Promise<ApiResponse<EventResponse[]>> {
    let endpoint = '/event/near';

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

    return this.request<EventResponse[]>(endpoint);
  }
}

export const apiService = new ApiService();
