import api from '@/api';
import { Organization, OrgFilters } from '@/types/api/organization';
import { LocationFilter } from '@/types/api/location';

async function getAllOrganizations(
  filters?: OrgFilters,
  locationFilter?: LocationFilter
): Promise<Organization[]> {
  const params: Record<string, unknown> = {};

  if (
    locationFilter &&
    locationFilter.latitude &&
    locationFilter.longitude &&
    locationFilter.radiusKm
  ) {
    params.lat = locationFilter.latitude;
    params.lng = locationFilter.longitude;
    params.distance_km = locationFilter.radiusKm;
    console.log('Filtering organizations by location:', {
      lat: params.lat,
      lng: params.lng,
      distance_km: params.distance_km,
    });
  }

  if (filters) {
    Object.assign(params, filters);
  }

  const { data: organizations } = await api.get('organization/all', {
    params,
  });
  console.log(
    'Fetched organizations:',
    organizations?.length || 0,
    'organizations'
  );
  return organizations;
}

async function getOrganizationById(id: string): Promise<Organization | null> {
  const endpoint = `organization/${id}`;
  const { data: organization } = await api.get(endpoint);
  return organization;
}

// async function searchEvents(
//   query: string,
//   filters?: EventFilters
// ): Promise<Event[]> {
//   const params: Record<string, unknown> = {
//     q: query,
//     statuses: EventStatus.PUBLISHED,
//   };
//   if (filters) Object.assign(params, filters);

//   const { data: events } = await api.get('event/search', { params });
//   return events;
// }

// async function getNearEvents(filters?: EventFilters): Promise<Event[]> {
//   const { data: events } = await api.get('event/near', {
//     params: filters,
//   });
//   return events;
// }

export const orgService = {
  getAllOrganizations,
  getOrganizationById,
};
