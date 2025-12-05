import api from '@/api';
import { LocationFilter } from '@/types/api/location';

export interface ItemFilters {
  search_text?: string;
  vendor_search?: string;
  status?: string;
}

async function getItem(itemId: string) {
  const endpoint = `item/${itemId}`;
  const { data: item } = await api.get(endpoint);
  return item;
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
