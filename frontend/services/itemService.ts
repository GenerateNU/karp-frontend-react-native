import api from '@/api';
import { LocationFilter } from '@/types/api/location';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export interface ItemFilters {
  search_text?: string;
  vendor_search?: string;
  status?: string;
}

async function getItem(itemId: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/item/${itemId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch item');
  }

  return response.json();
}

async function getAllItems(
  filters?: ItemFilters,
  locationFilter?: LocationFilter
): Promise<any[]> {
  const params: Record<string, unknown> = {};

  if (filters?.search_text) {
    params.search_text = filters.search_text;
  }

  if (filters?.vendor_search) {
    params.vendor_search = filters.vendor_search;
  }

  if (filters?.status) {
    params.status = filters.status;
  }

  if (locationFilter) {
    params.lat = locationFilter.latitude;
    params.lng = locationFilter.longitude;
    params.distance_km = locationFilter.radiusKm;
    console.log('Adding location filter to request:', {
      lat: locationFilter.latitude,
      lng: locationFilter.longitude,
      radiusKm: locationFilter.radiusKm,
    });
  }

  console.log('Making API request to item/all with params:', params);
  try {
    const { data: items } = await api.get('item/all', { params });
    console.log('API response received:', items?.length || 0, 'items');
    return items;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const itemService = {
  getItem,
  getAllItems,
};
